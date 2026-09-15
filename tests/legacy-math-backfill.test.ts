import assert from 'node:assert/strict';
import { normalizeLegacyAnalysisFields } from '../lib/legacy-math-backfill';

const result = normalizeLegacyAnalysisFields({
  progressType: '正则性',
  workSummary: '构造满足 D²ρ−θI∈Γ2 的 C³ 定义函数。',
  techniques: ['使用 σ2 的凹性'],
  breakthrough: '得到 Ld≤−θ tr a。',
  limitations: '无。',
  proofOutline: {
    status: 'reviewed',
    steps: [
      {
        claim: 'C³ 边界成立。',
        route: '比较 Φ±A0ρ。',
        evidence: '第 2 节，第 4 页。',
      },
    ],
  },
  priorityReason: '公式 D²ρ 有界。',
  lowPriorityReason: null,
  revisionSummary: null,
});

assert.equal(result.changedFields, 6);
assert.equal(
  result.value.workSummary,
  '构造满足 $D^{2}\\rho -\\theta I\\in \\Gamma _{2}$ 的 $C^{3}$ 定义函数。',
);
assert.deepEqual(result.value.techniques, ['使用 $\\sigma _{2}$ 的凹性']);
assert.equal(result.value.breakthrough, '得到 $Ld\\le -\\theta tr a$。');
assert.equal(result.value.proofOutline.steps[0].route, '比较 $\\Phi \\pm A0\\rho $。');
assert.equal(result.value.priorityReason, '公式 $D^{2}\\rho $ 有界。');

console.log('Legacy math backfill tests passed');
