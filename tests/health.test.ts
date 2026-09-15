import assert from 'node:assert/strict';
import { buildHealthSnapshot, unavailableHealthSnapshot } from '../lib/health';

const week = {
  weekStart: '2026-08-31',
  weekEnding: '2026-09-04',
  counts: { 'math.AP': 5 },
  complete: true,
};
const category = {
  categoryId: 'math.AP',
  latestAnnouncementDate: '2026-09-04',
  latestSuccessfulRunAt: '2026-09-04T05:01:00Z',
  sourceCursor: '2026-09-04T04:59:00Z',
  expectedCount: 0,
  publishedCount: 0,
  databasePublicationCount: 0,
  hasDailyVolume: true,
  complete: true,
  requiredForCompletion: true,
  status: 'complete' as const,
};
assert.equal(
  buildHealthSnapshot({
    checkedAt: '2026-09-04T06:00:00Z',
    categories: [category],
    latestCompleteWeek: week,
  }).status,
  'ok',
  'confirmed zero-publication day is healthy',
);
assert.equal(
  buildHealthSnapshot({
    checkedAt: '2026-09-04T06:00:00Z',
    categories: [{ ...category, hasDailyVolume: false }],
    latestCompleteWeek: week,
  }).status,
  'degraded',
);
assert.equal(
  buildHealthSnapshot({
    checkedAt: '2026-09-04T06:00:00Z',
    categories: [],
    latestCompleteWeek: null,
  }).status,
  'ok',
  'no fetch targets is an explicit healthy idle state',
);
assert.equal(
  unavailableHealthSnapshot('2026-09-04T06:00:00Z').status,
  'degraded',
);
console.log('Health snapshot tests passed');
