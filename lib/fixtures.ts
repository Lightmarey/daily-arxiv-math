import { configVersion, publicConfig, type TrackingConfig } from './config';
import type { DashboardData, PaperReport, VolumePoint } from './types';
import { buildDailyOverview, summarizeReport } from './dashboard';

export const previewConfig: TrackingConfig = {
  schemaVersion: 1,
  site: {
    name: '分析与偏微分方程前沿日报',
    description: '显式预览：用于本地界面检查的虚构 math.AP 数据',
  },
  categories: [
    {
      id: 'math.AP',
      label: '分析与偏微分方程',
      color: '#8b1e3f',
      readingPreferences: '预览配置',
      topics: [
        { id: 'elliptic-parabolic', label: '椭圆与抛物方程' },
        { id: 'hyperbolic-conservation', label: '双曲方程与守恒律' },
        { id: 'fluid-dynamics', label: '流体方程' },
        { id: 'dispersive', label: '色散方程' },
        { id: 'variational', label: '变分方法' },
        { id: 'other-analysis', label: '其他分析方向' },
      ],
    },
  ],
  fetchCategories: ['math.AP'],
  displayCategories: ['math.AP'],
};
const version = configVersion(previewConfig);

export const previewVolumes: VolumePoint[] = (() => {
  const points: VolumePoint[] = [];
  const cursor = new Date('2024-09-02T00:00:00Z');
  const end = new Date('2026-09-04T00:00:00Z');
  let index = 0;
  while (cursor <= end) {
    const weekday = cursor.getUTCDay();
    if (weekday >= 1 && weekday <= 5) {
      const count = Math.max(
        0,
        18 + ((index * 7) % 17) + Math.round(Math.sin(index / 11) * 3),
      );
      points.push({
        announcementDate: cursor.toISOString().slice(0, 10),
        counts: { 'math.AP': count },
      });
      index += 1;
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return points;
})();

export const previewReports: PaperReport[] = [
  {
    id: 'math.AP:2026-09-04:2609.01565:v1',
    categoryId: 'math.AP',
    configVersion: version,
    announcementDate: '2026-09-04',
    arxivId: '2609.01565',
    version: 1,
    entryKind: 'new',
    title: 'Boundary regularity for a nonlinear parabolic system',
    authors: ['A. Author', 'B. Researcher'],
    abstract:
      'We establish boundary regularity for a nonlinear parabolic system under scale-invariant assumptions.',
    categories: ['math.AP'],
    primaryCategory: 'math.AP',
    arxivUrl: 'https://arxiv.org/abs/2609.01565',
    pdfUrl: 'https://arxiv.org/pdf/2609.01565',
    submittedAt: '2026-09-03T17:31:11Z',
    updatedAt: '2026-09-03T17:31:11Z',
    topicId: 'elliptic-parabolic',
    topicLabel: '椭圆与抛物方程',
    progressType: '新定理/正则性',
    workSummary: '在尺度不变条件下建立非线性抛物系统的边界正则性。',
    techniques: ['能量估计', '紧致性方法'],
    breakthrough: '把内部正则性机制延伸到边界并保留临界尺度。',
    limitations: '预览数据；精确假设需要回查论文。',
    analysisDepth: 'abstract',
    proofOutline: { status: 'not_reviewed', steps: [] },
    aiStatus: 'not_checked',
    priorityScore: 88,
    priorityTier: 'high',
    priorityReason: '正则性机制具有较强复用价值。',
  },
];

export const previewDashboard: DashboardData = {
  latestDate: '2026-09-04',
  lastUpdated: '2026-09-04T14:00:00+08:00',
  config: publicConfig(previewConfig),
  volumes: previewVolumes,
  reports: previewReports.map(summarizeReport),
  overview: buildDailyOverview(previewReports),
  dataMode: 'preview',
  coverage: [
    {
      categoryId: 'math.AP',
      expectedCount: 1,
      publishedCount: 1,
      databasePublicationCount: 1,
      complete: true,
      requiredForCompletion: true,
      status: 'complete',
    },
  ],
};
