import assert from 'node:assert/strict';
import { aggregateWeeklyVolumes } from '../lib/volume';

const full = [
  '2026-08-31',
  '2026-09-01',
  '2026-09-02',
  '2026-09-03',
  '2026-09-04',
].map((announcementDate, index) => ({
  announcementDate,
  counts: { 'math.AP': index + 1, 'cs.LG': index === 2 ? null : 2 },
}));
const week = aggregateWeeklyVolumes(full, ['math.AP', 'cs.LG'])[0];
assert.deepEqual(week.counts, { 'math.AP': 15, 'cs.LG': null });
assert.equal(week.complete, false, 'missing category data is not zero');
const singleMissingDay = full
  .filter((point) => point.announcementDate !== '2026-09-02')
  .map((point) => ({ ...point, counts: { 'math.AP': 1 } }));
assert.equal(
  aggregateWeeklyVolumes(singleMissingDay, ['math.AP'])[0].complete,
  false,
  'a missing whole announcement day makes a single-category week incomplete',
);
const complete = full.map((point) => ({ ...point, counts: { 'math.AP': 1 } }));
assert.deepEqual(aggregateWeeklyVolumes(complete, ['math.AP'])[0], {
  weekStart: '2026-08-31',
  weekEnding: '2026-09-04',
  counts: { 'math.AP': 5 },
  complete: true,
});
console.log('Weekly volume aggregation tests passed');
