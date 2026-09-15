import { normalizeMathText } from './math-text';
import type { ProofOutline } from './types';

export interface LegacyAnalysisFields {
  progressType: string;
  workSummary: string;
  techniques: string[];
  breakthrough: string;
  limitations: string;
  proofOutline: ProofOutline;
  priorityReason: string;
  lowPriorityReason: string | null;
  revisionSummary: string | null;
}

export function normalizeLegacyAnalysisFields(value: LegacyAnalysisFields) {
  let changedFields = 0;
  const normalize = (text: string) => {
    const normalized = normalizeMathText(text);
    if (normalized !== text) changedFields += 1;
    return normalized;
  };
  return {
    value: {
      ...value,
      progressType: normalize(value.progressType),
      workSummary: normalize(value.workSummary),
      techniques: value.techniques.map(normalize),
      breakthrough: normalize(value.breakthrough),
      limitations: normalize(value.limitations),
      proofOutline: {
        ...value.proofOutline,
        steps: value.proofOutline.steps.map((step) => ({
          ...step,
          claim: normalize(step.claim),
          route: normalize(step.route),
          evidence: normalize(step.evidence),
        })),
      },
      priorityReason: normalize(value.priorityReason),
      lowPriorityReason: value.lowPriorityReason
        ? normalize(value.lowPriorityReason)
        : null,
      revisionSummary: value.revisionSummary
        ? normalize(value.revisionSummary)
        : null,
    },
    changedFields,
  };
}
