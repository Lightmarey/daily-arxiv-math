export interface RadarCandidate {
  topic: string;
  priorityScore: number;
  text: string;
}

export type RadarTier = 'core' | 'related' | null;

const topicWeights: Record<string, number> = {
  'math.AP:elliptic-parabolic': 3,
  'math.AP:variational': 1,
  'math.AP:fluid-dynamics': 1,
  'math.AP:hyperbolic-conservation': -2,
  'math.AP:dispersive': -3,
  'math.DG:geometric-analysis': 3,
  'math.DG:geometric-flows': 2,
  'math.DG:curvature-comparison': 1,
};

const corePatterns = [
  /yamabe|共形|conformal|σ[\s_-]*k|sigma[\s_-]*k/iu,
  /孤立奇点|isolated singularit|边界奇点|boundary singularit/iu,
  /fast diffusion|very fast diffusion|快速扩散|porous medium|多孔介质/iu,
  /bubbl(?:e|ing)|气泡|blow[\s-]*up|爆破|集中紧性|concentration[\s-]*compactness/iu,
  /fully nonlinear|全非线性|monge[\s-]*amp[eè]re|k[\s-]*hessian|hessian equation|hessian 方程/iu,
  /geometric pde|几何偏微分|几何\s*pde|geometric analysis|几何分析/iu,
];

const relatedPatterns = [
  /degenerate parabolic|singular parabolic|退化抛物|奇异抛物|boundary regularity|边界正则/iu,
  /liouville|pohozaev|modulation|调制|łojasiewicz|lojasiewicz/iu,
  /navier[\s-]*stokes|n[\s–—-]*s\s*方程|流体方程|free boundary|自由边界/iu,
  /curvature|曲率|ricci|mean curvature|平均曲率/iu,
  /hpc|cfd|numerical|数值|neural operator|physics[\s-]*informed|ai for science/iu,
];

export function radarScore(candidate: RadarCandidate): number {
  const text = candidate.text.toLocaleLowerCase('zh-CN');
  let score = topicWeights[candidate.topic] ?? 0;
  score += corePatterns.filter((pattern) => pattern.test(text)).length * 4;
  score += relatedPatterns.filter((pattern) => pattern.test(text)).length * 2;
  if (candidate.priorityScore >= 75) score += 1;
  return score;
}

export function radarTier(score: number): RadarTier {
  if (score >= 9) return 'core';
  if (score >= 5) return 'related';
  return null;
}
