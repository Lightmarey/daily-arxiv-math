import assert from 'node:assert/strict';
import {
  buildDailyOverview,
  groupVisibleReports,
  reportsForDisplay,
  summarizeReportFeed,
  topicOrder,
} from '../lib/dashboard';
import { storedReport, testPublicConfig } from './helpers';

const ap = storedReport('math.AP', '2609.00001', {
  version: 1,
  priorityScore: 80,
});
const lg = storedReport('cs.LG', '2609.00001', {
  version: 2,
  priorityScore: 90,
});
const chosen = reportsForDisplay(
  [lg, ap],
  ['math.AP', 'cs.LG'],
  testPublicConfig,
);
assert.equal(chosen.length, 1);
assert.equal(
  chosen[0].categoryId,
  'math.AP',
  'display order selects the analysis even across different paper versions',
);
const topics = topicOrder(testPublicConfig, ['math.AP', 'cs.LG'], [ap, lg]);
assert.deepEqual(
  topics.filter((item) => item.id === 'other').map((item) => item.key),
  ['math.AP:other', 'cs.LG:other'],
  'same topic IDs in different categories remain distinct',
);
const removed = storedReport('math.AP', '2609.00002', {
  topicId: 'removed-topic',
  topicLabel: 'Removed topic',
});
const withFallback = topicOrder(testPublicConfig, ['math.AP'], [removed]);
assert.equal(
  withFallback.some((item) => item.key === 'math.AP:removed-topic'),
  true,
);
const groups = groupVisibleReports(
  [removed],
  {
    aiStatus: 'not_checked',
    topic: 'all',
    priority: 'all',
    query: '',
  },
  withFallback,
);
assert.equal(groups[0].topicLabel, 'Removed topic');
const allGroups = groupVisibleReports(
  [removed, storedReport('math.AP', '2609.00003', { aiStatus: 'explicit' })],
  {
    aiStatus: 'all',
    topic: 'all',
    priority: 'all',
    query: '',
  },
  withFallback,
);
assert.equal(
  allGroups.reduce((count, group) => count + group.papers.length, 0),
  2,
  'the all status includes every AI disclosure state',
);
assert.equal(buildDailyOverview([ap, removed]).paperCount, 2);
const summaryFeed = summarizeReportFeed({
  date: '2026-09-04',
  lastUpdated: '2026-09-04T12:00:00Z',
  categories: ['math.AP'],
  coverage: [],
  reports: [ap],
});
assert.equal(summaryFeed.overview.paperCount, 1);
assert.equal(summaryFeed.reports[0].arxivUrl, ap.arxivUrl);
assert.equal(
  'abstract' in summaryFeed.reports[0],
  false,
  'the dashboard payload omits the full abstract',
);
assert.equal(
  'proofOutline' in summaryFeed.reports[0],
  false,
  'the dashboard payload omits proof details',
);
console.log('Dashboard grouping tests passed');
