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

export const STATIC_MIRROR_SCHEMA_VERSION = 3 as const;

export interface StaticSummaryItem {
  analysisId: string;
  text: string;
}

export interface StaticDayV3 {
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
  summaryItems: StaticSummaryItem[];
  analyses: PaperReport[];
}
export interface StaticVolumeV3 {
  schemaVersion: typeof STATIC_MIRROR_SCHEMA_VERSION;
  points: VolumePoint[];
  weeks26: WeeklyVolumePoint[];
  weeks104: WeeklyVolumePoint[];
}

export interface StaticMirrorDayEntryV3 {
  announcementDate: string;
  expectedCount: number;
  publishedCount: number;
  aiDisclosureCount: number;
  complete: boolean;
  lastUpdated: string;
}

export interface StaticMirrorManifestV3 {
  schemaVersion: typeof STATIC_MIRROR_SCHEMA_VERSION;
  latestDate: string;
  generatedAt: string;
  config: PublicTrackingConfig;
  days: StaticMirrorDayEntryV3[];
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

function buildSummaryItems(reports: PaperReport[]): StaticSummaryItem[] {
  const selected: PaperReport[] = [];
  const topics = new Set<string>();
  for (const report of reports) {
    const key = `${report.categoryId}:${report.topicId}`;
    if (topics.has(key)) continue;
    topics.add(key);
    selected.push(report);
    if (selected.length === 5) break;
  }
  for (const report of reports) {
    if (selected.length === 5) break;
    if (!selected.includes(report)) selected.push(report);
  }
  return selected.map((report) => ({
    analysisId: report.id,
    text: report.workSummary,
  }));
}

export function buildStaticDay(
  feed: ReportFeed,
  config: PublicTrackingConfig,
): StaticDayV3 {
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
    summaryItems: buildSummaryItems(sortedAnalyses),
    analyses: sortedAnalyses,
  };
}

export function validateStaticDay(day: StaticDayV3): void {
  if (day.schemaVersion !== STATIC_MIRROR_SCHEMA_VERSION)
    throw new Error(`Unsupported static day ${day.announcementDate}`);
  if (day.categories.length !== day.coverage.categories.length)
    throw new Error(`Missing category coverage on ${day.announcementDate}`);
  const knownIds = new Set(day.analyses.map((report) => report.id));
  for (const item of day.summaryItems) {
    if (!knownIds.has(item.analysisId) || !item.text.trim())
      throw new Error(`Invalid summary item on ${day.announcementDate}`);
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
): StaticVolumeV3 {
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
