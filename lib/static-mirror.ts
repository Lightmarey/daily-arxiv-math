import {
  buildDailyOverview,
  currentTopicLabel,
  reportsForDisplay,
} from './dashboard';
import { aggregateWeeklyVolumes } from './volume';
import { normalizeMathText } from './math-text';
import {
  type AiStatus,
  type PaperReport,
  type PriorityTier,
  type VolumePoint,
  type WeeklyVolumePoint,
  type ReportFeed,
  type CategoryCoverage,
} from './types';
import type { PublicTrackingConfig } from './config';

export const STATIC_MIRROR_SCHEMA_VERSION = 2 as const;

export interface StaticDayV2 {
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
  overview: ReturnType<typeof buildDailyOverview>;
  reports: PaperReport[];
  analyses: PaperReport[];
}

export interface StaticPaperSnapshotV2 {
  announcementDate: string;
  report: PaperReport;
}

export interface StaticPaperV2 {
  schemaVersion: typeof STATIC_MIRROR_SCHEMA_VERSION;
  arxivId: string;
  slug: string;
  latest: PaperReport;
  history: StaticPaperSnapshotV2[];
}

export interface StaticVolumeV2 {
  schemaVersion: typeof STATIC_MIRROR_SCHEMA_VERSION;
  points: VolumePoint[];
  weeks26: WeeklyVolumePoint[];
  weeks104: WeeklyVolumePoint[];
}

export interface StaticMirrorDayEntryV2 {
  announcementDate: string;
  expectedCount: number;
  publishedCount: number;
  aiDisclosureCount: number;
  complete: boolean;
  lastUpdated: string;
}

export interface StaticMirrorManifestV2 {
  schemaVersion: typeof STATIC_MIRROR_SCHEMA_VERSION;
  latestDate: string;
  generatedAt: string;
  config: PublicTrackingConfig;
  days: StaticMirrorDayEntryV2[];
}

const priorityRank: Record<PriorityTier, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export function normalizeStaticReport(report: PaperReport): PaperReport {
  const aiStatus =
    report.aiStatus === 'no_disclosure_observed' && !report.aiEvidenceSource
      ? 'not_checked'
      : report.aiStatus;
  return {
    ...report,
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

export function arxivSlug(arxivId: string): string {
  const normalized = arxivId.trim();
  if (!/^(?:[a-z-]+\/\d{7}|\d{4}\.\d{4,5})$/.test(normalized)) {
    throw new Error(`Unsafe arXiv identifier: ${arxivId}`);
  }
  return normalized.replaceAll('/', '--');
}

export function sortReports(reports: PaperReport[]): PaperReport[] {
  return [...reports].sort(
    (a, b) =>
      priorityRank[a.priorityTier] - priorityRank[b.priorityTier] ||
      b.priorityScore - a.priorityScore ||
      a.arxivId.localeCompare(b.arxivId),
  );
}

export function buildStaticDay(
  feed: ReportFeed,
  config: PublicTrackingConfig,
): StaticDayV2 {
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
  const reports = sortReports(
    reportsForDisplay(analyses, feed.categories, config),
  );
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
    aiDisclosureCount: reports.filter((paper) => paper.aiStatus === 'explicit')
      .length,
    overview: buildDailyOverview(reports),
    reports,
    analyses: sortReports(analyses),
  };
}

export function buildStaticVolume(
  points: VolumePoint[],
  categories: string[],
): StaticVolumeV2 {
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

export function mergeStaticPaper(
  existing: StaticPaperV2 | undefined,
  report: PaperReport,
  categoryOrder: string[] = [],
): StaticPaperV2 {
  const slug = arxivSlug(report.arxivId);
  const history = [
    ...(existing?.history ?? [])
      .map((item) => ({
        ...item,
        report: normalizeStaticReport(item.report),
      }))
      .filter(
        (item) =>
          !(
            item.announcementDate === report.announcementDate &&
            item.report.categoryId === report.categoryId &&
            item.report.version === report.version
          ),
      ),
    {
      announcementDate: report.announcementDate,
      report: normalizeStaticReport(report),
    },
  ].sort(
    (a, b) =>
      a.announcementDate.localeCompare(b.announcementDate) ||
      a.report.version - b.report.version,
  );
  const rank = new Map(categoryOrder.map((id, index) => [id, index]));
  const latest = [...history].sort(
    (a, b) =>
      (rank.get(a.report.categoryId) ?? categoryOrder.length) -
        (rank.get(b.report.categoryId) ?? categoryOrder.length) ||
      b.report.version - a.report.version ||
      b.announcementDate.localeCompare(a.announcementDate),
  )[0].report;
  return {
    schemaVersion: STATIC_MIRROR_SCHEMA_VERSION,
    arxivId: report.arxivId,
    slug,
    latest,
    history,
  };
}

function escapeMarkdownText(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replace(
      /[\\`*_{}[\]()#+!|$-]/g,
      (character) => `&#${character.codePointAt(0)};`,
    );
}

function escapeMarkdown(value: string): string {
  return normalizeMathText(value)
    .split(
      /(\$\$[\s\S]*?\$\$|\$[^$\n]*?\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\\begin\{(?:equation\*?|align\*?|gather\*?|multline\*?)\}[\s\S]*?\\end\{(?:equation\*?|align\*?|gather\*?|multline\*?)\})/g,
    )
    .map((part, index) => (index % 2 === 1 ? part : escapeMarkdownText(part)))
    .join('');
}

function safeExternalUrl(value: string): string {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.hostname !== 'arxiv.org') {
    throw new Error(`Unsafe external URL for ${value}`);
  }
  return url.toString();
}

function paperMarkdown(report: PaperReport): string {
  const lines = [
    `#### ${escapeMarkdown(report.title)}`,
    '',
    `- **作者：** ${report.authors.map(escapeMarkdown).join('、')}`,
    `- **arXiv：** [${escapeMarkdown(report.arxivId)}](${safeExternalUrl(report.arxivUrl)}) · [PDF](${safeExternalUrl(report.pdfUrl)})`,
    `- **分类：** ${report.categories.map(escapeMarkdown).join('、')}`,
    `- **进展类型：** ${escapeMarkdown(report.progressType)}`,
    `- **阅读优先级：** ${report.priorityScore}/100 · ${priorityLabel(report.priorityTier)}`,
    `- **分析深度：** ${report.analysisDepth === 'abstract' ? '摘要级分析' : '已补读正文关键部分'}`,
    '',
    '**完成的工作**',
    '',
    escapeMarkdown(report.workSummary),
    '',
    '**使用技术**',
    '',
    ...report.techniques.map((item) => `- ${escapeMarkdown(item)}`),
    '',
    '**可能的突破**',
    '',
    escapeMarkdown(report.breakthrough),
    '',
    '**限制与不确定性**',
    '',
    escapeMarkdown(report.limitations),
    '',
    '**证明逻辑/大纲**',
    '',
    ...(report.proofOutline.status === 'reviewed'
      ? report.proofOutline.steps.flatMap((step, index) => [
        `${index + 1}. **主张：** ${escapeMarkdown(step.claim)}`,
        `   - **路线：** ${escapeMarkdown(step.route)}`,
        ])
      : [
          report.proofOutline.status === 'not_reviewed'
            ? '尚未补读正文。'
            : '正文不采用定理证明结构。',
        ]),
    '',
    '**排序理由**',
    '',
    escapeMarkdown(report.priorityReason),
  ];
  if (report.lowPriorityReason) {
    lines.push('', escapeMarkdown(report.lowPriorityReason));
  }
  if (report.aiStatus === 'explicit') {
    lines.push(
      '',
      '**AI 协作披露**',
      '',
      escapeMarkdown(report.aiEvidence ?? ''),
      '',
      `来源：${escapeMarkdown(report.aiEvidenceSource ?? '已检查来源')}`,
    );
  } else if (report.aiStatus === 'no_disclosure_observed') {
    lines.push(
      '',
      '**AI 声明核查**',
      '',
      '已核查未见 AI 披露。',
      '',
      `检查范围：${escapeMarkdown(report.aiEvidenceSource ?? '')}`,
    );
  }
  lines.push('', '**原始英文摘要**', '', escapeMarkdown(report.abstract), '');
  return lines.join('\n');
}

function priorityLabel(tier: PriorityTier): string {
  if (tier === 'high') return '高优先级';
  if (tier === 'medium') return '中优先级';
  return '低阅读优先级';
}

function aiLabel(status: AiStatus): string {
  if (status === 'explicit') return '明确披露 AI 使用';
  if (status === 'no_disclosure_observed') return '已核查未见 AI 披露';
  return '尚未核查 AI 声明';
}

export function renderDailyMarkdown(
  day: StaticDayV2,
  siteName = 'arXiv 研究前沿日报',
): string {
  const lines = [
    `# ${escapeMarkdown(siteName)} · ${day.announcementDate}`,
    '',
    `完整收录：${day.coverage.publishedCount} / ${day.coverage.expectedCount}。AI 协作明确披露 ${day.aiDisclosureCount} 篇。`,
    '',
    '> 自动生成的阅读指南，关键结论请回查原论文。',
    '',
    '## 当日总览',
    '',
    '### 主要方向与技术进展',
    '',
    ...day.overview.mainProgress.map((item) => `- ${escapeMarkdown(item)}`),
    '',
    '### 可能的突破点',
    '',
    ...day.overview.breakthroughPoints.map(
      (item) =>
        `- **${escapeMarkdown(item.title)}：** ${escapeMarkdown(item.summary)}`,
    ),
    '',
    '### 需谨慎处',
    '',
    ...day.overview.cautions.map((item) => `- ${escapeMarkdown(item)}`),
    '',
    '## 全部论文',
    '',
  ];
  const statuses: AiStatus[] = [
    'not_checked',
    'no_disclosure_observed',
    'explicit',
  ];
  for (const status of statuses) {
    const statusReports = day.reports.filter(
      (paper) => paper.aiStatus === status,
    );
    if (!statusReports.length) continue;
    lines.push(`## ${aiLabel(status)}`, '');
    const topics = new Map(
      statusReports.map((paper) => [
        `${paper.categoryId}:${paper.topicId}`,
        paper.topicLabel,
      ]),
    );
    for (const [topicKey, topicLabel] of topics) {
      const topicReports = statusReports.filter(
        (paper) => `${paper.categoryId}:${paper.topicId}` === topicKey,
      );
      if (!topicReports.length) continue;
      lines.push(`### ${escapeMarkdown(topicLabel)}`, '');
      for (const report of sortReports(topicReports)) {
        lines.push(paperMarkdown(report), '---', '');
      }
    }
  }
  return `${lines.join('\n').trim()}\n`;
}

export function renderPaperMarkdown(paper: StaticPaperV2): string {
  const analyses = paper.history
    .map(
      (item) =>
        `## 分类分析：${escapeMarkdown(item.report.categoryId)} · ${escapeMarkdown(item.report.topicLabel)} · ${item.announcementDate} · v${item.report.version}

${paperMarkdown(item.report).replace(/^#### .*\n\n/, '')}`,
    )
    .join('\n\n---\n\n');
  return `# ${escapeMarkdown(paper.latest.title)}

镜像按分类、公告日和版本分别保留分析。

${analyses}
`;
}

export function renderArchiveMarkdown(
  manifest: StaticMirrorManifestV2,
): string {
  return `# ${escapeMarkdown(manifest.config.site.name)}归档

${manifest.days
  .map(
    (day) =>
      `- [${day.announcementDate}](daily/${day.announcementDate}.md) · ${day.publishedCount}/${day.expectedCount} 篇`,
  )
  .join('\n')}
`;
}
