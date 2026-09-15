import assert from 'node:assert/strict';
import {
  paperReportInputSchema,
  reportBatchV3Schema,
  volumeHistoryV2Schema,
} from '../lib/validation';
import { batch } from './helpers';

const valid = batch();
assert.equal(reportBatchV3Schema.safeParse(valid).success, true);
const baseReport = valid.reports[0];
assert.equal(
  paperReportInputSchema.safeParse({
    ...baseReport,
    aiStatus: 'explicit',
  }).success,
  false,
  'an explicit disclosure requires evidence and a source',
);
assert.equal(
  paperReportInputSchema.safeParse({
    ...baseReport,
    aiStatus: 'explicit',
    aiEvidence: '全文检索命中 AI 相关关键词，需结合上下文判读。',
    aiEvidenceSource: 'PDF page 18',
  }).success,
  false,
  'an unadjudicated keyword hit is not an explicit disclosure',
);
assert.equal(
  paperReportInputSchema.safeParse({
    ...baseReport,
    aiStatus: 'explicit',
    aiEvidence: 'The authors used ChatGPT for copy editing.',
    aiEvidenceSource: 'Acknowledgements, page 18',
  }).success,
  true,
);
assert.equal(
  paperReportInputSchema.safeParse({
    ...baseReport,
    aiStatus: 'no_disclosure_observed',
  }).success,
  false,
  'a checked non-disclosure requires the checked scope',
);
assert.equal(
  paperReportInputSchema.safeParse({
    ...baseReport,
    aiStatus: 'no_disclosure_observed',
    aiEvidenceSource: 'Acknowledgements and declarations, pages 17-18',
  }).success,
  true,
);
assert.equal(
  paperReportInputSchema.safeParse({
    ...baseReport,
    aiEvidenceSource: 'not really checked',
  }).success,
  false,
  'unchecked records cannot carry pseudo-evidence',
);
assert.equal(
  paperReportInputSchema.safeParse({
    ...baseReport,
    analysisDepth: 'full_text_sections',
    workSummary:
      '论文从能量恒等式建立一致先验界，并结合紧性论证得到主方程弱解的存在性、稳定性及其适用范围。',
    proofOutline: {
      status: 'reviewed',
      steps: [
        {
          claim: '先建立先验估计。',
          route: '测试方程并应用 Grönwall 不等式。',
          evidence: '第 3 节，定理 3.1，页 8',
        },
      ],
    },
  }).success,
  true,
);
assert.equal(
  paperReportInputSchema.safeParse({
    ...baseReport,
    proofOutline: {
      status: 'reviewed',
      steps: [{ claim: '主张', route: '路线', evidence: '摘要' }],
    },
  }).success,
  false,
  'abstract-only analysis cannot claim a reviewed proof outline',
);
assert.equal(
  paperReportInputSchema.safeParse({
    ...baseReport,
    analysisDepth: 'full_text_sections',
    proofOutline: { status: 'not_reviewed', steps: [] },
  }).success,
  false,
  'full-text analysis must resolve the proof outline status',
);
assert.equal(
  paperReportInputSchema.safeParse({
    ...baseReport,
    analysisDepth: 'full_text_sections',
    proofOutline: {
      status: 'reviewed',
      steps: [
        {
          claim: '主张',
          route: '先验估计和紧致性。',
          evidence: '正文中可以看出。',
        },
      ],
    },
  }).success,
  false,
  'reviewed proof steps require a checkable locator',
);
assert.equal(
  paperReportInputSchema.safeParse({
    ...baseReport,
    analysisDepth: 'full_text_sections',
    workSummary:
      '论文完整检查正文中的模型构造、数值流程和实验部分；正文没有提出需要梳理的定理证明结构。',
    proofOutline: { status: 'not_applicable', steps: [] },
  }).success,
  true,
  'a full-text review can record that no theorem-proof structure applies',
);
assert.equal(
  paperReportInputSchema.safeParse({
    ...baseReport,
    analysisDepth: 'full_text_sections',
    breakthrough: '摘要报告：建立了主要定理。',
    proofOutline: { status: 'not_applicable', steps: [] },
  }).success,
  false,
  'full-text analysis cannot retain an abstract-only conclusion marker',
);
assert.equal(
  paperReportInputSchema.safeParse({
    ...baseReport,
    analysisDepth: 'full_text_sections',
    proofOutline: {
      status: 'reviewed',
      steps: [
        {
          claim: '正文以 Theorem 1.1 陈述主要结论。',
          route: '沿正文主结果的证明段落收束到该结论。',
          evidence: 'PDF 第 1 页，Theorem 1.1（正文首次出现处）。',
        },
      ],
    },
  }).success,
  false,
  'generic proof templates are rejected',
);
const repeatedStep = {
  claim: '定理 1.1 给出主结论。',
  route: '用能量估计和紧性完成证明。',
  evidence: 'PDF 第 8 页，Theorem 1.1。',
};
assert.equal(
  paperReportInputSchema.safeParse({
    ...baseReport,
    analysisDepth: 'full_text_sections',
    proofOutline: {
      status: 'reviewed',
      steps: [repeatedStep, repeatedStep],
    },
  }).success,
  false,
  'repeated proof steps are rejected',
);
assert.equal(
  paperReportInputSchema.safeParse({
    ...baseReport,
    analysisDepth: 'full_text_sections',
    proofOutline: {
      status: 'reviewed',
      steps: [
        {
          claim: '定理 2.1 给出紧性结论。',
          route: 'PDF 第 12 页，Theorem 2.1。',
          evidence: 'PDF 第 12 页，Theorem 2.1。',
        },
      ],
    },
  }).success,
  false,
  'proof routes cannot repeat an evidence locator',
);
assert.equal(
  paperReportInputSchema.safeParse({
    ...baseReport,
    analysisDepth: 'full_text_sections',
    workSummary: '建立一个存在性结果。',
    limitations:
      '结论依赖文中给定的正则性、几何、尺度或小数据假设。',
    proofOutline: {
      status: 'reviewed',
      steps: [
        {
          claim: '定理 2.1 给出存在性。',
          route: '先建立一致能量界，再用紧性提取收敛子列。',
          evidence: 'PDF 第 12 页，Theorem 2.1。',
        },
      ],
    },
  }).success,
  false,
  'short or generic full-text reports are rejected',
);
assert.equal(
  reportBatchV3Schema.safeParse({
    ...valid,
    reports: [],
    run: { ...valid.run, expectedCount: 0 },
    sourceManifest: { newIds: [], crossListIds: [] },
    dailyVolume: { ...valid.dailyVolume, count: 0 },
  }).success,
  true,
  'confirmed zero days are valid',
);
const cross = batch('math.AP', '2609.00002');
cross.sourceManifest = { newIds: [], crossListIds: ['2609.00002'] };
cross.reports[0].entryKind = 'cross_list';
assert.equal(reportBatchV3Schema.safeParse(cross).success, true);
assert.equal(
  reportBatchV3Schema.safeParse({
    ...cross,
    reports: [{ ...cross.reports[0], entryKind: 'new' }],
  }).success,
  false,
  'official manifest determines event kind',
);
assert.equal(
  volumeHistoryV2Schema.safeParse({
    schemaVersion: 2,
    configVersion: valid.configVersion,
    categoryId: 'math.AP',
    generatedAt: '2026-09-04T05:00:00Z',
    source: 'official catchup',
    points: [{ announcementDate: '2026-09-04', count: 0 }],
  }).success,
  true,
);
console.log('Validation tests passed');
