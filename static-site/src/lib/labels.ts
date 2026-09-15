import type { AiStatus, PriorityTier } from '../../../lib/types';

export function priorityLabel(tier: PriorityTier): string {
  if (tier === 'high') return '高优先级';
  if (tier === 'medium') return '中优先级';
  return '低阅读优先级';
}

export function aiLabel(status: AiStatus): string {
  if (status === 'explicit') return '明确披露';
  if (status === 'no_disclosure_observed') return '未见披露';
  return '未核查';
}
