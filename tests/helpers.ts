import {
  configVersion,
  publicConfig,
  type TrackingConfig,
} from '../lib/config';
import type { PaperReport } from '../lib/types';
import type { PaperReportInput, ReportBatchV3 } from '../lib/validation';

export const testConfig: TrackingConfig = {
  schemaVersion: 1,
  site: {
    name: 'Test brief',
    description: 'Test description',
    links: { source: 'https://example.com' },
  },
  categories: [
    {
      id: 'math.AP',
      label: 'Analysis',
      color: '#8b1e3f',
      readingPreferences: 'Analysis preference',
      topics: [
        { id: 'other', label: 'Other analysis' },
        { id: 'fluid', label: 'Fluid equations' },
      ],
    },
    {
      id: 'cs.LG',
      label: 'Learning',
      color: '#16796f',
      readingPreferences: 'Learning preference',
      topics: [{ id: 'other', label: 'Other learning' }],
    },
  ],
  fetchCategories: ['math.AP', 'cs.LG'],
  displayCategories: ['math.AP', 'cs.LG'],
};
export const testPublicConfig = publicConfig(testConfig);

export function reportInput(
  categoryId = 'math.AP',
  arxivId = '2609.00001',
  overrides: Partial<PaperReportInput> = {},
): PaperReportInput {
  const topic =
    categoryId === 'math.AP'
      ? { id: 'other', label: 'Other analysis' }
      : { id: 'other', label: 'Other learning' };
  return {
    categoryId,
    announcementDate: '2026-09-04',
    arxivId,
    version: 1,
    entryKind: 'new',
    title: `Paper ${arxivId}`,
    authors: ['A. Author'],
    abstract: 'Abstract.',
    categories: [categoryId],
    primaryCategory: categoryId,
    arxivUrl: `https://arxiv.org/abs/${arxivId}`,
    pdfUrl: `https://arxiv.org/pdf/${arxivId}`,
    submittedAt: '2026-09-03T17:00:00Z',
    updatedAt: '2026-09-03T17:00:00Z',
    topicId: topic.id,
    topicLabel: topic.label,
    progressType: 'New theorem',
    workSummary: 'Summary.',
    techniques: ['Energy estimate'],
    breakthrough: 'Breakthrough.',
    limitations: 'Limitation.',
    analysisDepth: 'abstract',
    proofOutline: { status: 'not_reviewed', steps: [] },
    aiStatus: 'not_checked',
    priorityScore: 80,
    priorityTier: 'high',
    priorityReason: 'Relevant.',
    ...overrides,
  };
}
export function storedReport(
  categoryId = 'math.AP',
  arxivId = '2609.00001',
  overrides: Partial<PaperReport> = {},
): PaperReport {
  const input = reportInput(categoryId, arxivId, overrides);
  return {
    ...input,
    id: `${categoryId}:${input.announcementDate}:${arxivId}:v${input.version}`,
    configVersion: configVersion(testConfig),
    ...overrides,
  };
}
export function batch(
  categoryId = 'math.AP',
  arxivId = '2609.00001',
  overrides: Partial<ReportBatchV3> = {},
): ReportBatchV3 {
  const report = reportInput(categoryId, arxivId);
  const version = configVersion(testConfig);
  return {
    schemaVersion: 3,
    configVersion: version,
    categoryId,
    run: {
      runId: 'shared-run-id',
      scheduledFor: '2026-09-04T05:00:00Z',
      startedAt: '2026-09-04T05:00:01Z',
      completedAt: '2026-09-04T05:01:00Z',
      sourceCursor: '2026-09-04T04:59:00Z',
      expectedCount: 1,
    },
    announcementDay: {
      date: '2026-09-04',
      status: 'announced',
      source: `https://arxiv.org/catchup/${categoryId}/2026-09-04`,
    },
    sourceManifest: { newIds: [arxivId], crossListIds: [] },
    dailyVolume: { announcementDate: '2026-09-04', count: 1 },
    reports: [report],
    ...overrides,
  } as ReportBatchV3;
}
