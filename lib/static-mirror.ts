import { aggregateWeeklyVolumes } from './volume';
import {
  type PaperReport,
  type PriorityTier,
  type VolumePoint,
  type WeeklyVolumePoint,
  type ReportFeed,
  type CategoryCoverage,
} from './types';
import type { PublicTrackingConfig } from './config';

export const STATIC_MIRROR_SCHEMA_VERSION = 4 as const;

export interface StaticOverviewResultItem {
  analysisId: string;
  text: string;
}

export interface StaticOverviewNoteworthyItem {
  analysisId: string;
  result: string;
  significance: string;
}

export interface StaticDailyOverview {
  resultItems: StaticOverviewResultItem[];
  noteworthyItems: StaticOverviewNoteworthyItem[];
}

export interface StaticOverviewSidecar extends StaticDailyOverview {
  announcementDate: string;
}

export interface StaticDayV4 {
  schemaVersion: typeof STATIC_MIRROR_SCHEMA_VERSION;
  announcementDate: string;
  lastUpdated: string;
  categories: string[];
  coverage: {
    categories: CategoryCoverage[];
    expectedCount: number;
    publishedCount: number;
    complete: boolean;
  };
  aiDisclosureCount: number;
  dailyOverview: StaticDailyOverview;
  analyses: PaperReport[];
}
export interface StaticVolumeV4 {
  schemaVersion: typeof STATIC_MIRROR_SCHEMA_VERSION;
  points: VolumePoint[];
  weeks26: WeeklyVolumePoint[];
  weeks104: WeeklyVolumePoint[];
}

export interface StaticMirrorDayEntryV4 {
  announcementDate: string;
  expectedCount: number;
  publishedCount: number;
  aiDisclosureCount: number;
  complete: boolean;
  lastUpdated: string;
}

export interface StaticMirrorManifestV4 {
  schemaVersion: typeof STATIC_MIRROR_SCHEMA_VERSION;
  latestDate: string;
  generatedAt: string;
  config: PublicTrackingConfig;
  days: StaticMirrorDayEntryV4[];
}

const priorityRank: Record<PriorityTier, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export interface StaticTopicChoice {
  key: string;
  categoryId: string;
  id: string;
  label: string;
}

export function currentTopicLabel(
  report: PaperReport,
  config: PublicTrackingConfig,
): string {
  return (
    config.categories
      .find((category) => category.id === report.categoryId)
      ?.topics.find((topic) => topic.id === report.topicId)?.label ??
    report.topicLabel
  );
}

export function staticTopicOrder(
  config: PublicTrackingConfig,
  categories: string[],
  reports: PaperReport[] = [],
): StaticTopicChoice[] {
  const seen = new Set<string>();
  return [
    ...categories.flatMap((categoryId) =>
      (config.categories.find((item) => item.id === categoryId)?.topics ?? []).map(
        (topic) => ({
          key: `${categoryId}:${topic.id}`,
          categoryId,
          ...topic,
        }),
      ),
    ),
    ...reports.map((report) => ({
      key: `${report.categoryId}:${report.topicId}`,
      categoryId: report.categoryId,
      id: report.topicId,
      label: report.topicLabel,
    })),
  ].filter((topic) => {
    if (seen.has(topic.key)) return false;
    seen.add(topic.key);
    return true;
  });
}

export function normalizeStaticReport(report: PaperReport): PaperReport {
  const aiStatus =
    report.aiStatus === 'no_disclosure_observed' && !report.aiEvidenceSource
      ? 'not_checked'
      : report.aiStatus;
  const workSummary = report.workSummary
    .replace(
      /^(?:(?:正文)?全文可得并)?(?:已核查|已阅读|已补读)(?:论文)?(?:\s*(?:PDF|HTML))?(?:\s*第[^。；]{1,40}(?:页|部分))?[。；]\s*/,
      '',
    )
    .replace(/\s*正文已核查至\s*PDF\s*第[^。]{1,24}页[。.]?\s*$/, '');
  return {
    ...report,
    workSummary,
    proofOutline: report.proofOutline ?? {
      status: 'not_reviewed',
      steps: [],
    },
    aiStatus,
    aiEvidence: aiStatus === 'not_checked' ? null : report.aiEvidence,
    aiEvidenceSource:
      aiStatus === 'not_checked' ? null : report.aiEvidenceSource,
  };
}

export function sortReports(reports: PaperReport[]): PaperReport[] {
  return [...reports].sort(
    (a, b) =>
      priorityRank[a.priorityTier] - priorityRank[b.priorityTier] ||
      b.priorityScore - a.priorityScore ||
      a.arxivId.localeCompare(b.arxivId),
  );
}

export function canonicalDailyReports(reports: PaperReport[]): PaperReport[] {
  const groups = new Map<string, PaperReport[]>();
  for (const report of sortReports(reports)) {
    const group = groups.get(report.arxivId) ?? [];
    group.push(report);
    groups.set(report.arxivId, group);
  }
  return [...groups.values()].map(
    (group) =>
      group.find((report) => report.categoryId === report.primaryCategory) ??
      group[0],
  );
}

export interface StaticTopicCount {
  categoryId: string;
  topics: { id: string; label: string; count: number }[];
}

export function dailyTopicCounts(
  reports: PaperReport[],
  config: PublicTrackingConfig,
): StaticTopicCount[] {
  const canonical = canonicalDailyReports(reports);
  return config.displayCategories.flatMap((categoryId) => {
    const category = config.categories.find((item) => item.id === categoryId);
    const topicOrder = new Map(
      category?.topics.map((topic, index) => [topic.id, index]) ?? [],
    );
    const topics = new Map<
      string,
      { id: string; label: string; count: number }
    >();
    for (const report of canonical.filter(
      (item) => item.categoryId === categoryId,
    )) {
      const old = topics.get(report.topicId);
      topics.set(report.topicId, {
        id: report.topicId,
        label: currentTopicLabel(report, config),
        count: (old?.count ?? 0) + 1,
      });
    }
    const ordered = [...topics.values()].sort(
      (left, right) =>
        right.count - left.count ||
        (topicOrder.get(left.id) ?? Number.MAX_SAFE_INTEGER) -
          (topicOrder.get(right.id) ?? Number.MAX_SAFE_INTEGER) ||
        left.id.localeCompare(right.id),
    );
    return ordered.length ? [{ categoryId, topics: ordered }] : [];
  });
}

export function buildStaticDay(
  feed: ReportFeed,
  config: PublicTrackingConfig,
  dailyOverview: StaticDailyOverview,
): StaticDayV4 {
  for (const coverage of feed.coverage) {
    const publicationCount = feed.reports.filter(
      (paper) =>
        paper.categoryId === coverage.categoryId &&
        paper.entryKind !== 'revision',
    ).length;
    if (coverage.status === 'not_collected') {
      if (coverage.requiredForCompletion || publicationCount !== 0)
        throw new Error(
          `Missing required report category ${coverage.categoryId} on ${feed.date}`,
        );
      continue;
    }
    if (
      coverage.status !== 'complete' ||
      !coverage.complete ||
      coverage.expectedCount === null ||
      coverage.expectedCount !== coverage.publishedCount ||
      publicationCount !== coverage.publishedCount
    )
      throw new Error(
        `Incomplete report category ${coverage.categoryId} on ${feed.date}`,
      );
  }
  if (feed.coverage.length !== feed.categories.length)
    throw new Error(`Missing category coverage on ${feed.date}`);
  const analyses = feed.reports.map((report) => {
    const normalized = normalizeStaticReport(report);
    return {
      ...normalized,
      topicLabel: currentTopicLabel(normalized, config),
    };
  });
  const sortedAnalyses = sortReports(analyses);
  const expectedCount = feed.coverage.reduce(
    (sum, item) => sum + (item.expectedCount ?? 0),
    0,
  );
  const publishedCount = feed.coverage.reduce(
    (sum, item) => sum + (item.publishedCount ?? 0),
    0,
  );
  return {
    schemaVersion: STATIC_MIRROR_SCHEMA_VERSION,
    announcementDate: feed.date,
    lastUpdated: feed.lastUpdated,
    categories: feed.categories,
    coverage: {
      categories: feed.coverage,
      expectedCount,
      publishedCount,
      complete: feed.coverage.every(
        (item) =>
          item.status !== 'incomplete' &&
          (!item.requiredForCompletion || item.status === 'complete'),
      ),
    },
    aiDisclosureCount: new Set(
      sortedAnalyses
        .filter((paper) => paper.aiStatus === 'explicit')
        .map((paper) => paper.arxivId),
    ).size,
    dailyOverview,
    analyses: sortedAnalyses,
  };
}

const OVERVIEW_RESULT_MAX_LENGTH = 120;
const OVERVIEW_NOTEWORTHY_RESULT_MAX_LENGTH = 140;
const OVERVIEW_SIGNIFICANCE_MAX_LENGTH = 120;

function validOverviewText(value: unknown, maxLength: number): value is string {
  return (
    typeof value === 'string' &&
    value.trim().length > 0 &&
    value.length <= maxLength
  );
}

export function parseStaticOverviewSidecar(
  value: unknown,
): StaticOverviewSidecar {
  if (!value || typeof value !== 'object')
    throw new Error('Invalid daily overview sidecar');
  const sidecar = value as Partial<StaticOverviewSidecar>;
  if (
    typeof sidecar.announcementDate !== 'string' ||
    !Array.isArray(sidecar.resultItems) ||
    sidecar.resultItems.length < 1 ||
    sidecar.resultItems.length > 12 ||
    !Array.isArray(sidecar.noteworthyItems) ||
    sidecar.noteworthyItems.length > 3
  )
    throw new Error('Invalid daily overview sidecar');
  for (const item of sidecar.resultItems) {
    if (
      !item ||
      typeof item.analysisId !== 'string' ||
      !validOverviewText(item.text, OVERVIEW_RESULT_MAX_LENGTH)
    )
      throw new Error('Invalid daily overview result item');
  }
  for (const item of sidecar.noteworthyItems) {
    if (
      !item ||
      typeof item.analysisId !== 'string' ||
      !validOverviewText(item.result, OVERVIEW_NOTEWORTHY_RESULT_MAX_LENGTH) ||
      !validOverviewText(item.significance, OVERVIEW_SIGNIFICANCE_MAX_LENGTH)
    )
      throw new Error('Invalid daily overview noteworthy item');
  }
  return sidecar as StaticOverviewSidecar;
}

export function validateStaticDay(day: StaticDayV4): void {
  if (day.schemaVersion !== STATIC_MIRROR_SCHEMA_VERSION)
    throw new Error(`Unsupported static day ${day.announcementDate}`);
  if (day.categories.length !== day.coverage.categories.length)
    throw new Error(`Missing category coverage on ${day.announcementDate}`);
  const reportsById = new Map(
    day.analyses.map((report) => [report.id, report]),
  );
  const overview = parseStaticOverviewSidecar({
    announcementDate: day.announcementDate,
    ...day.dailyOverview,
  });
  const overviewArxivIds = new Set<string>();
  const validateReference = (analysisId: string) => {
    const report = reportsById.get(analysisId);
    if (!report || report.announcementDate !== day.announcementDate)
      throw new Error(`Invalid overview reference on ${day.announcementDate}`);
    if (overviewArxivIds.has(report.arxivId))
      throw new Error(`Duplicate overview paper on ${day.announcementDate}`);
    overviewArxivIds.add(report.arxivId);
  };
  for (const item of overview.resultItems) {
    validateReference(item.analysisId);
  }
  for (const item of overview.noteworthyItems) {
    validateReference(item.analysisId);
  }
  for (const coverage of day.coverage.categories) {
    const count = day.analyses.filter(
      (report) =>
        report.categoryId === coverage.categoryId &&
        report.entryKind !== 'revision',
    ).length;
    if (coverage.status === 'not_collected') {
      if (coverage.requiredForCompletion || count !== 0)
        throw new Error(
          `Missing required coverage for ${coverage.categoryId} on ${day.announcementDate}`,
        );
      continue;
    }
    if (
      coverage.status !== 'complete' ||
      !coverage.complete ||
      coverage.expectedCount === null ||
      coverage.publishedCount !== coverage.expectedCount ||
      count !== coverage.expectedCount
    )
      throw new Error(
        `Coverage mismatch for ${coverage.categoryId} on ${day.announcementDate}`,
      );
  }
}

export function buildStaticVolume(
  points: VolumePoint[],
  categories: string[],
): StaticVolumeV4 {
  const allOrdered = [...points].sort((a, b) =>
    a.announcementDate.localeCompare(b.announcementDate),
  );
  const latest = allOrdered.at(-1)?.announcementDate;
  const cutoff = latest ? new Date(`${latest}T00:00:00Z`) : null;
  cutoff?.setUTCMonth(cutoff.getUTCMonth() - 24);
  const cutoffDate = cutoff?.toISOString().slice(0, 10);
  const ordered = cutoffDate
    ? allOrdered.filter((point) => point.announcementDate >= cutoffDate)
    : allOrdered;
  const weeks = aggregateWeeklyVolumes(ordered, categories);
  return {
    schemaVersion: STATIC_MIRROR_SCHEMA_VERSION,
    points: ordered,
    weeks26: weeks.slice(-26),
    weeks104: weeks.slice(-104),
  };
}
