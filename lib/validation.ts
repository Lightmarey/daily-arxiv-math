import { z } from 'zod';

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const isoDateTime = z.iso.datetime({ offset: true });
const arxivId = z.string().regex(/^(?:[a-z-]+\/\d{7}|\d{4}\.\d{4,5})$/);
const categoryId = z
  .string()
  .regex(
    /^(?:[a-z][a-z0-9]*-[a-z0-9-]+|[a-z][a-z0-9-]*\.[A-Za-z][A-Za-z0-9-]*)$/,
  );
const topicId = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const proofOutlineSchema = z.object({
  status: z.enum(['not_reviewed', 'reviewed', 'not_applicable']),
  steps: z
    .array(
      z.object({
        claim: z.string().min(1).max(5000),
        route: z.string().min(1).max(10000),
        evidence: z.string().min(1).max(1000),
      }),
    )
    .max(30),
});
const evidenceLocator =
  /(?:第.{0,20}(?:节|页|定理|引理)|\b(?:Theorem|Lemma|Section|PDF)\b)/iu;
const abstractOnlyLanguage = /(?:摘要报告|仅基于摘要|本判断仅基于摘要)/u;
const unresolvedAiLanguage = /(?:关键词命中|全文检索命中|需结合.{0,20}判读)/u;
const genericProofLanguage =
  /(?:沿正文主结果的证明段落收束|完成存在性、正则性、稳定性或渐近结论|正文首次出现处|正文中部|正文先建立方程.{0,30}再在主证明章节组合辅助引理|主结果依赖正文中的局部估计和结构性引理|尺度分析、能量或核估计控制误差项)/u;
const genericFullTextLanguage =
  /(?:结论依赖文中给定的正则性、几何、尺度或小数据假设|未将数值实验或参考文献替代证明)/u;

export const paperReportInputSchema = z
  .object({
    categoryId,
    announcementDate: isoDate,
    arxivId,
    version: z.number().int().positive(),
    entryKind: z.enum(['new', 'cross_list', 'revision']),
    title: z.string().min(1).max(1000),
    authors: z.array(z.string().min(1).max(300)).min(1).max(200),
    abstract: z.string().min(1).max(30000),
    categories: z.array(z.string().min(2).max(80)).min(1).max(50),
    primaryCategory: z.string().min(2).max(80),
    arxivUrl: z.url(),
    pdfUrl: z.url(),
    submittedAt: isoDateTime,
    updatedAt: isoDateTime,
    topicId,
    topicLabel: z.string().min(1).max(120),
    progressType: z.string().min(1).max(80),
    workSummary: z.string().min(1).max(5000),
    techniques: z.array(z.string().min(1).max(300)).min(1).max(20),
    breakthrough: z.string().min(1).max(5000),
    limitations: z.string().min(1).max(5000),
    analysisDepth: z.enum(['abstract', 'full_text_sections']),
    proofOutline: proofOutlineSchema,
    aiStatus: z.enum(['explicit', 'no_disclosure_observed', 'not_checked']),
    aiEvidence: z.string().trim().min(1).max(3000).nullish(),
    aiEvidenceSource: z.string().trim().min(1).max(300).nullish(),
    priorityScore: z.number().int().min(0).max(100),
    priorityTier: z.enum(['high', 'medium', 'low']),
    priorityReason: z.string().min(1).max(3000),
    lowPriorityReason: z.string().max(3000).nullish(),
    revisionSummary: z.string().max(5000).nullish(),
  })
  .superRefine((value, context) => {
    const expectedTier =
      value.priorityScore >= 75
        ? 'high'
        : value.priorityScore >= 50
          ? 'medium'
          : 'low';
    if (value.priorityTier !== expectedTier)
      context.addIssue({
        code: 'custom',
        path: ['priorityTier'],
        message: `priorityTier must be ${expectedTier}`,
      });
    if (value.priorityTier === 'low' && !value.lowPriorityReason)
      context.addIssue({
        code: 'custom',
        path: ['lowPriorityReason'],
        message: 'lowPriorityReason is required for low priority work',
      });
    if (
      value.aiStatus === 'explicit' &&
      (!value.aiEvidence || !value.aiEvidenceSource)
    )
      context.addIssue({
        code: 'custom',
        path: ['aiEvidence'],
        message: 'explicit AI collaboration requires evidence and source',
      });
    if (
      value.aiStatus === 'explicit' &&
      value.aiEvidence &&
      unresolvedAiLanguage.test(value.aiEvidence)
    )
      context.addIssue({
        code: 'custom',
        path: ['aiEvidence'],
        message: 'an AI keyword hit must be adjudicated before marking explicit',
      });
    if (value.aiStatus === 'no_disclosure_observed' && !value.aiEvidenceSource)
      context.addIssue({
        code: 'custom',
        path: ['aiEvidenceSource'],
        message: 'a checked non-disclosure result requires the checked scope',
      });
    if (
      value.aiStatus === 'not_checked' &&
      (value.aiEvidence || value.aiEvidenceSource)
    )
      context.addIssue({
        code: 'custom',
        path: ['aiStatus'],
        message: 'an unchecked report cannot include AI disclosure evidence',
      });
    if (
      value.proofOutline.status === 'reviewed' &&
      (value.analysisDepth !== 'full_text_sections' ||
        value.proofOutline.steps.length === 0)
    )
      context.addIssue({
        code: 'custom',
        path: ['proofOutline'],
        message:
          'a reviewed proof outline requires full-text analysis and steps',
      });
    if (
      value.proofOutline.status === 'not_applicable' &&
      (value.analysisDepth !== 'full_text_sections' ||
        value.proofOutline.steps.length !== 0)
    )
      context.addIssue({
        code: 'custom',
        path: ['proofOutline'],
        message:
          'a not-applicable proof outline requires full-text analysis and no steps',
      });
    if (
      value.proofOutline.status === 'not_reviewed' &&
      (value.proofOutline.steps.length !== 0 ||
        value.analysisDepth === 'full_text_sections')
    )
      context.addIssue({
        code: 'custom',
        path: ['proofOutline'],
        message:
          'an unreviewed proof outline requires abstract analysis and no steps',
      });
    if (
      value.analysisDepth === 'abstract' &&
      value.proofOutline.status !== 'not_reviewed'
    )
      context.addIssue({
        code: 'custom',
        path: ['proofOutline', 'status'],
        message: 'abstract analysis must leave the proof outline unreviewed',
      });
    if (
      value.analysisDepth === 'full_text_sections' &&
      [value.workSummary, value.breakthrough, value.limitations].some((text) =>
        abstractOnlyLanguage.test(text),
      )
    )
      context.addIssue({
        code: 'custom',
        path: ['analysisDepth'],
        message: 'full-text analysis cannot identify its conclusions as abstract-only',
      });
    if (
      value.analysisDepth === 'full_text_sections' &&
      (value.workSummary.trim().length < 40 ||
        [value.workSummary, value.breakthrough, value.limitations].some(
          (text) => genericFullTextLanguage.test(text),
        ))
    )
      context.addIssue({
        code: 'custom',
        path: ['workSummary'],
        message:
          'full-text analysis must contain paper-specific results and limitations',
      });
    if (value.proofOutline.status === 'reviewed') {
      const distinctSteps = new Set(
        value.proofOutline.steps.map(
          (step) => `${step.claim}\n${step.route}\n${step.evidence}`,
        ),
      );
      if (distinctSteps.size !== value.proofOutline.steps.length)
        context.addIssue({
          code: 'custom',
          path: ['proofOutline', 'steps'],
          message: 'proof outline steps must be distinct',
        });
      value.proofOutline.steps.forEach((step, index) => {
        const claim = step.claim.trim();
        const route = step.route.trim();
        const evidence = step.evidence.trim();
        if (route === claim || route === evidence)
          context.addIssue({
            code: 'custom',
            path: ['proofOutline', 'steps', index, 'route'],
            message:
              'proof route must explain the argument instead of repeating the claim or evidence locator',
          });
        if (!evidenceLocator.test(step.evidence))
          context.addIssue({
            code: 'custom',
            path: ['proofOutline', 'steps', index, 'evidence'],
            message:
              'proof evidence must include a section, page, theorem, lemma, or PDF locator',
          });
        if (
          genericProofLanguage.test(
            `${step.claim}\n${step.route}\n${step.evidence}`,
          )
        )
          context.addIssue({
            code: 'custom',
            path: ['proofOutline', 'steps', index],
            message: 'proof steps must describe the paper-specific argument',
          });
      });
    }
  });

const manifestSchema = z.object({
  newIds: z.array(arxivId).max(2000),
  crossListIds: z.array(arxivId).max(2000),
});

export const reportBatchV3Schema = z
  .object({
    schemaVersion: z.literal(3),
    configVersion: z.string().regex(/^[0-9a-f]{64}$/),
    categoryId,
    run: z.object({
      runId: z.string().min(8).max(160),
      scheduledFor: isoDateTime,
      startedAt: isoDateTime,
      completedAt: isoDateTime,
      sourceCursor: isoDateTime,
      expectedCount: z.number().int().nonnegative().max(2000),
    }),
    announcementDay: z.object({
      date: isoDate,
      status: z.literal('announced'),
      source: z.string().min(1).max(500),
    }),
    sourceManifest: manifestSchema,
    dailyVolume: z.object({
      announcementDate: isoDate,
      count: z.number().int().nonnegative().max(2000),
    }),
    reports: z.array(paperReportInputSchema).max(2500),
  })
  .superRefine((value, context) => {
    if (value.dailyVolume.announcementDate !== value.announcementDay.date)
      context.addIssue({
        code: 'custom',
        path: ['dailyVolume', 'announcementDate'],
        message: 'dates must match',
      });
    const manifestIds = [
      ...value.sourceManifest.newIds,
      ...value.sourceManifest.crossListIds,
    ];
    if (new Set(manifestIds).size !== manifestIds.length)
      context.addIssue({
        code: 'custom',
        path: ['sourceManifest'],
        message: 'manifest IDs must be unique',
      });
    if (manifestIds.length !== value.dailyVolume.count)
      context.addIssue({
        code: 'custom',
        path: ['dailyVolume', 'count'],
        message: 'count must equal new plus cross-list events',
      });
    if (value.run.expectedCount !== manifestIds.length)
      context.addIssue({
        code: 'custom',
        path: ['run', 'expectedCount'],
        message: 'expectedCount must equal the manifest size',
      });
    if (
      value.reports.some(
        (report) => report.announcementDate !== value.announcementDay.date,
      )
    )
      context.addIssue({
        code: 'custom',
        path: ['reports'],
        message: 'all report dates must match announcement day',
      });
    if (value.reports.some((report) => report.categoryId !== value.categoryId))
      context.addIssue({
        code: 'custom',
        path: ['reports'],
        message: 'all report categories must match batch category',
      });
    const publications = value.reports.filter(
      (report) => report.entryKind !== 'revision',
    );
    const expected = new Set(manifestIds);
    const actual = publications.map((report) => report.arxivId);
    if (
      new Set(actual).size !== actual.length ||
      actual.length !== expected.size ||
      actual.some((id) => !expected.has(id))
    )
      context.addIssue({
        code: 'custom',
        path: ['reports'],
        message: 'publication reports must exactly cover the source manifest',
      });
    const newIds = new Set(value.sourceManifest.newIds);
    for (const report of publications) {
      const expectedKind = newIds.has(report.arxivId) ? 'new' : 'cross_list';
      if (report.entryKind !== expectedKind)
        context.addIssue({
          code: 'custom',
          path: ['reports'],
          message: `${report.arxivId} must use entryKind ${expectedKind}`,
        });
    }
  });

export type ReportBatchV3 = z.infer<typeof reportBatchV3Schema>;
export type PaperReportInput = z.infer<typeof paperReportInputSchema>;

export const volumeHistoryV2Schema = z
  .object({
    schemaVersion: z.literal(2),
    configVersion: z.string().regex(/^[0-9a-f]{64}$/),
    categoryId,
    generatedAt: isoDateTime,
    source: z.string().min(1).max(500),
    points: z
      .array(
        z.object({
          announcementDate: isoDate,
          count: z.number().int().nonnegative().max(2000),
        }),
      )
      .min(1)
      .max(600),
  })
  .superRefine((value, context) => {
    const dates = value.points.map((point) => point.announcementDate);
    if (new Set(dates).size !== dates.length)
      context.addIssue({
        code: 'custom',
        path: ['points'],
        message: 'announcement dates must be unique within a category',
      });
  });

export type VolumeHistoryV2 = z.infer<typeof volumeHistoryV2Schema>;
