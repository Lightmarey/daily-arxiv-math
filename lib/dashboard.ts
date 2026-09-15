import type { PublicTrackingConfig } from './config';
import type {
  AiStatus,
  DailyOverview,
  PaperReport,
  PaperSummary,
  ReportFeed,
} from './types';

export interface ReportFilters {
  aiStatus: AiStatus | 'all';
  topic: string;
  priority: PaperSummary['priorityTier'] | 'all';
  query: string;
}
export interface TopicChoice {
  key: string;
  categoryId: string;
  id: string;
  label: string;
}
export interface TopicReportGroup {
  topicKey: string;
  topicId: string;
  topicLabel: string;
  categoryId: string;
  papers: PaperSummary[];
}

export function currentTopicLabel(
  report: Pick<PaperSummary, 'categoryId' | 'topicId' | 'topicLabel'>,
  config: PublicTrackingConfig,
): string {
  return (
    config.categories
      .find((item) => item.id === report.categoryId)
      ?.topics.find((item) => item.id === report.topicId)?.label ??
    report.topicLabel
  );
}

export function reportsForDisplay<T extends PaperSummary>(
  reports: T[],
  categoryOrder: string[],
  config: PublicTrackingConfig,
): T[] {
  const rank = new Map(categoryOrder.map((id, index) => [id, index]));
  const selected = new Map<string, T>();
  for (const report of reports) {
    if (!rank.has(report.categoryId)) continue;
    const key = `${report.announcementDate}:${report.arxivId}`;
    const current = selected.get(key);
    if (
      !current ||
      rank.get(report.categoryId)! < rank.get(current.categoryId)! ||
      (report.categoryId === current.categoryId &&
        report.version > current.version)
    )
      selected.set(key, report);
  }
  return [...selected.values()].map((report) =>
    Object.assign({}, report, {
      topicLabel: currentTopicLabel(report, config),
    }),
  );
}

function countLabels(labels: string[]): Array<[string, number]> {
  const counts = new Map<string, number>();
  labels.forEach((label) => {
    const normalized = label.trim();
    if (normalized) counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
  });
  return [...counts.entries()].sort(
    ([labelA, countA], [labelB, countB]) =>
      countB - countA || labelA.localeCompare(labelB, 'zh-CN'),
  );
}

export function buildDailyOverview(reports: PaperReport[]): DailyOverview {
  if (!reports.length)
    return {
      paperCount: 0,
      mainProgress: [],
      breakthroughPoints: [],
      cautions: [],
    };
  const sortedReports = [...reports].sort(
    (a, b) => b.priorityScore - a.priorityScore,
  );
  const topicCounts = countLabels(
    reports.map((paper) => paper.topicLabel),
  ).slice(0, 3);
  const techniqueCounts = countLabels(
    sortedReports.flatMap((paper) => paper.techniques),
  ).slice(0, 4);
  const progressCounts = countLabels(
    sortedReports.map((paper) => paper.progressType),
  ).slice(0, 2);
  const mainProgress = [
    `本期共收录 ${reports.length} 篇，研究重心集中在${topicCounts.map(([label, count]) => `${label}（${count} 篇）`).join('、')}。`,
    techniqueCounts.length
      ? `技术路径以${techniqueCounts.map(([label, count]) => `${label}${count > 1 ? `（${count} 篇）` : ''}`).join('、')}为主${progressCounts.length ? `；进展形态主要是${progressCounts.map(([label, count]) => `${label}（${count} 篇）`).join('、')}` : ''}。`
      : `进展形态主要是${progressCounts.map(([label, count]) => `${label}（${count} 篇）`).join('、')}。`,
  ];
  const high = sortedReports.filter(
    (paper) => paper.priorityTier === 'high' && paper.breakthrough.trim(),
  );
  const seen = new Set<string>();
  const breakthroughPoints = (
    high.length
      ? high
      : sortedReports.filter((paper) => paper.breakthrough.trim())
  )
    .filter((paper) => {
      const value = paper.breakthrough.trim().toLocaleLowerCase('zh-CN');
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    })
    .slice(0, 3)
    .map((paper) => ({
      arxivId: paper.arxivId,
      title: paper.title,
      summary: paper.breakthrough,
    }));
  const cautions: string[] = [];
  const abstractOnly = reports.filter(
    (paper) => paper.analysisDepth === 'abstract',
  ).length;
  if (abstractOnly)
    cautions.push(
      `其中 ${abstractOnly} 篇仅完成摘要级分析；技术细节、定理假设和适用范围需回查正文。`,
    );
  const limitations = new Set<string>();
  sortedReports.forEach((paper) => {
    if (cautions.length >= 3 || !paper.limitations.trim()) return;
    const value = paper.limitations.trim().toLocaleLowerCase('zh-CN');
    if (!limitations.has(value)) {
      limitations.add(value);
      cautions.push(`《${paper.title}》：${paper.limitations}`);
    }
  });
  return {
    paperCount: reports.length,
    mainProgress,
    breakthroughPoints,
    cautions,
  };
}

export function summarizeReport(report: PaperReport): PaperSummary {
  return {
    id: report.id,
    categoryId: report.categoryId,
    announcementDate: report.announcementDate,
    arxivId: report.arxivId,
    version: report.version,
    title: report.title,
    authors: report.authors,
    categories: report.categories,
    arxivUrl: report.arxivUrl,
    pdfUrl: report.pdfUrl,
    topicId: report.topicId,
    topicLabel: report.topicLabel,
    progressType: report.progressType,
    workSummary: report.workSummary,
    analysisDepth: report.analysisDepth,
    aiStatus: report.aiStatus,
    priorityScore: report.priorityScore,
    priorityTier: report.priorityTier,
    priorityReason: report.priorityReason,
  };
}

export function summarizeReportFeed(feed: ReportFeed) {
  return {
    ...feed,
    reports: feed.reports.map(summarizeReport),
    overview: buildDailyOverview(feed.reports),
  };
}

export function reportTopicKey(
  report: Pick<PaperSummary, 'categoryId' | 'topicId'>,
): string {
  return `${report.categoryId}:${report.topicId}`;
}

export function topicOrder(
  config: PublicTrackingConfig,
  categories: string[],
  reports: PaperSummary[] = [],
): TopicChoice[] {
  const seen = new Set<string>();
  const configured = categories.flatMap((categoryId) =>
    (
      config.categories.find((item) => item.id === categoryId)?.topics ?? []
    ).map((topic) => ({
      key: `${categoryId}:${topic.id}`,
      categoryId,
      ...topic,
    })),
  );
  const removed = reports.map((report) => ({
    key: reportTopicKey(report),
    categoryId: report.categoryId,
    id: report.topicId,
    label: report.topicLabel,
  }));
  return [...configured, ...removed].filter((topic) => {
    if (seen.has(topic.key)) return false;
    seen.add(topic.key);
    return true;
  });
}

export function groupVisibleReports(
  reports: PaperSummary[],
  filters: ReportFilters,
  topics?: TopicChoice[],
): TopicReportGroup[] {
  const normalizedQuery = filters.query.trim().toLocaleLowerCase('zh-CN');
  const visible = reports.filter(
    (paper) =>
      (filters.aiStatus === 'all' || paper.aiStatus === filters.aiStatus) &&
      (filters.topic === 'all' || reportTopicKey(paper) === filters.topic) &&
      (filters.priority === 'all' || paper.priorityTier === filters.priority) &&
      (!normalizedQuery ||
        `${paper.title} ${paper.authors.join(' ')} ${paper.workSummary}`
          .toLocaleLowerCase('zh-CN')
          .includes(normalizedQuery)),
  );
  const configured =
    topics ??
    topicOrder(
      {
        schemaVersion: 1,
        configVersion: '',
        site: { name: '', description: '' },
        displayCategories: [],
        categories: [],
      },
      [],
      reports,
    );
  return configured
    .map((topic) => ({
      topicKey: topic.key,
      topicId: topic.id,
      topicLabel: topic.label,
      categoryId: topic.categoryId,
      papers: visible
        .filter((paper) => reportTopicKey(paper) === topic.key)
        .sort((a, b) => b.priorityScore - a.priorityScore),
    }))
    .filter((group) => group.papers.length > 0);
}
