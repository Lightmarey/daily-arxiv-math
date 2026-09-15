import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  STATIC_MIRROR_SCHEMA_VERSION,
  buildStaticDay,
  buildStaticVolume,
  normalizeStaticReport,
  type StaticMirrorManifestV3,
} from '../lib/static-mirror';
import { buildStaticPages } from '../scripts/build_static_pages';
import { configVersion } from '../lib/config';
import {
  batch,
  reportInput,
  storedReport,
  testConfig,
  testPublicConfig,
} from './helpers';

const sharedAp = storedReport('math.AP', '2609.00001', {
  title: '<script>alert(1)</script> {{ site.secret }}',
  abstract: '[bad](javascript:alert(1)) and $R_{ij}$',
  analysisDepth: 'full_text_sections',
  workSummary:
    '针对测试方程中的非线性项，论文先建立解的统一能量控制，再利用紧性提取收敛子列，最后由极限方程识别弱解并完成稳定性结论。',
  proofOutline: {
    status: 'reviewed',
    steps: [
      {
        claim: '先建立 $L^2$ 控制。',
        route: '使用 w[f](t) 完成能量估计。',
        evidence: '正文第 3 节。',
      },
    ],
  },
});
const sharedLg = storedReport('cs.LG', '2609.00001');
const feed = {
  date: '2026-09-04',
  lastUpdated: '2026-09-04T05:01:00Z',
  categories: ['math.AP', 'cs.LG'],
  coverage: [
    {
      categoryId: 'math.AP',
      expectedCount: 1,
      publishedCount: 1,
      complete: true,
      requiredForCompletion: true,
      status: 'complete' as const,
    },
    {
      categoryId: 'cs.LG',
      expectedCount: 1,
      publishedCount: 1,
      complete: true,
      requiredForCompletion: true,
      status: 'complete' as const,
    },
  ],
  reports: [sharedAp, sharedLg],
};
assert.deepEqual(
  normalizeStaticReport({
    ...sharedAp,
    proofOutline: undefined,
    aiStatus: 'no_disclosure_observed',
    aiEvidenceSource: null,
  } as unknown as typeof sharedAp),
  {
    ...sharedAp,
    proofOutline: { status: 'not_reviewed', steps: [] },
    aiStatus: 'not_checked',
    aiEvidence: null,
    aiEvidenceSource: null,
  },
  'legacy mirror records become explicitly unreviewed and unchecked',
);
assert.equal(
  normalizeStaticReport({
    ...sharedAp,
    workSummary: '已补读论文 PDF 第 3 页。这里是实际结果。',
  }).workSummary,
  '这里是实际结果。',
  'process-oriented reading notes are removed from public summaries',
);
assert.equal(
  normalizeStaticReport({
    ...sharedAp,
    workSummary:
      '正文全文可得并已核查 PDF 第 1–35 页。这里是结果。正文已核查至 PDF 第 35 页。',
  }).workSummary,
  '这里是结果。',
);
const day = buildStaticDay(feed, testPublicConfig);
assert.equal(day.analyses.length, 2, 'all category analyses remain available');
assert.equal(day.summaryItems.length, 2, 'summary links representative analyses');
const stoppedCategoryDay = buildStaticDay(
  {
    ...feed,
    reports: [sharedLg],
    coverage: [
      {
        categoryId: 'math.AP',
        expectedCount: null,
        publishedCount: null,
        databasePublicationCount: null,
        complete: false,
        requiredForCompletion: false,
        status: 'not_collected',
      },
      feed.coverage[1],
    ],
  },
  testPublicConfig,
);
assert.equal(
  stoppedCategoryDay.coverage.complete,
  true,
  'a displayed but stopped category does not block a newly collected category',
);
assert.throws(() =>
  buildStaticDay(
    { ...feed, coverage: feed.coverage.slice(0, 1) },
    testPublicConfig,
  ),
);
const offlineRoot = await mkdtemp(join(tmpdir(), 'stopped-category-sync-'));
const oldConfig = structuredClone(testPublicConfig);
oldConfig.displayCategories = ['math.AP'];
const oldDay = buildStaticDay(
  {
    date: feed.date,
    lastUpdated: feed.lastUpdated,
    categories: ['math.AP'],
    coverage: [feed.coverage[0]],
    reports: [sharedAp],
  },
  oldConfig,
);
await mkdir(join(offlineRoot, 'mirror/data/daily'), { recursive: true });
await writeFile(
  join(offlineRoot, 'mirror/data/daily/2026-09-04.json'),
  JSON.stringify(oldDay),
);
await writeFile(
  join(offlineRoot, 'mirror/data/manifest.json'),
  JSON.stringify({
    schemaVersion: STATIC_MIRROR_SCHEMA_VERSION,
    latestDate: oldDay.announcementDate,
    generatedAt: oldDay.lastUpdated,
    config: oldConfig,
    days: [
      {
        announcementDate: oldDay.announcementDate,
        expectedCount: oldDay.coverage.expectedCount,
        publishedCount: oldDay.coverage.publishedCount,
        aiDisclosureCount: oldDay.aiDisclosureCount,
        complete: oldDay.coverage.complete,
        lastUpdated: oldDay.lastUpdated,
      },
    ],
  }),
);
const stoppedConfig = structuredClone(testConfig);
stoppedConfig.fetchCategories = ['cs.LG'];
const stoppedVersion = configVersion(stoppedConfig);
const nextDayBatch = batch('cs.LG', '2609.00004', {
  configVersion: stoppedVersion,
  announcementDay: {
    date: '2026-09-05',
    status: 'announced',
    source: 'https://arxiv.org/catchup/cs.LG/2026-09-05',
  },
  dailyVolume: { announcementDate: '2026-09-05', count: 1 },
  sourceManifest: { newIds: ['2609.00004'], crossListIds: [] },
  reports: [
    reportInput('cs.LG', '2609.00004', {
      announcementDate: '2026-09-05',
    }),
  ],
});
const stoppedConfigPath = join(offlineRoot, 'config.json');
const nextDayBatchPath = join(offlineRoot, 'batch.json');
const nextDayVolumePath = join(offlineRoot, 'volume.json');
await writeFile(stoppedConfigPath, JSON.stringify(stoppedConfig));
await writeFile(nextDayBatchPath, JSON.stringify(nextDayBatch));
await writeFile(
  nextDayVolumePath,
  JSON.stringify({
    points: [
      {
        announcementDate: '2026-09-05',
        counts: { 'math.AP': null, 'cs.LG': 1 },
      },
    ],
  }),
);
execFileSync(
  process.execPath,
  [
    'node_modules/tsx/dist/cli.mjs',
    'scripts/sync_static_mirror.ts',
    '--output',
    join(offlineRoot, 'mirror'),
    '--batch',
    nextDayBatchPath,
    '--config',
    stoppedConfigPath,
    '--volume-file',
    nextDayVolumePath,
  ],
  { stdio: 'pipe' },
);
const stoppedSnapshot = JSON.parse(
  await readFile(
    join(offlineRoot, 'mirror/data/daily/2026-09-05.json'),
    'utf8',
  ),
);
assert.deepEqual(
  stoppedSnapshot.coverage.categories.map(
    (item: { categoryId: string; status: string }) => [
      item.categoryId,
      item.status,
    ],
  ),
  [
    ['math.AP', 'not_collected'],
    ['cs.LG', 'complete'],
  ],
);
const preservedOldDay = JSON.parse(
  await readFile(
    join(offlineRoot, 'mirror/data/daily/2026-09-04.json'),
    'utf8',
  ),
);
assert.deepEqual(
  preservedOldDay,
  oldDay,
  'adding another configured category does not rewrite or remove an AP-only day',
);
const updatedManifest = JSON.parse(
  await readFile(join(offlineRoot, 'mirror/data/manifest.json'), 'utf8'),
);
assert.deepEqual(
  updatedManifest.days.map((entry: { announcementDate: string }) =>
    entry.announcementDate,
  ),
  ['2026-09-05', '2026-09-04'],
);
const points = [
  '2026-08-31',
  '2026-09-01',
  '2026-09-02',
  '2026-09-03',
  '2026-09-04',
].map((announcementDate) => ({
  announcementDate,
  counts: { 'math.AP': 1, 'cs.LG': 2 },
}));
const volume = buildStaticVolume(points, ['math.AP', 'cs.LG']);
assert.equal(volume.weeks26[0].counts['cs.LG'], 10);
const root = await mkdtemp(join(tmpdir(), 'configurable-static-test-')),
  content = join(root, 'content'),
  out = join(root, 'out');
for (const directory of ['data/daily'])
  await mkdir(join(content, directory), { recursive: true });
const manifest: StaticMirrorManifestV3 = {
  schemaVersion: STATIC_MIRROR_SCHEMA_VERSION,
  latestDate: day.announcementDate,
  generatedAt: day.lastUpdated,
  config: testPublicConfig,
  days: [
    {
      announcementDate: day.announcementDate,
      expectedCount: 2,
      publishedCount: 2,
      aiDisclosureCount: 0,
      complete: true,
      lastUpdated: day.lastUpdated,
    },
  ],
};
const save = (path: string, value: unknown) =>
  writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
await save(join(content, 'data/manifest.json'), manifest);
await save(join(content, 'data/config.json'), testPublicConfig);
await save(join(content, 'data/volume.json'), volume);
await save(join(content, `data/daily/${day.announcementDate}.json`), day);
await buildStaticPages({ content, out, basePath: '/daily-arxiv-math' });
const html = await readFile(join(out, 'index.html'), 'utf8');
assert.doesNotMatch(html, /<script>alert\(1\)<\/script>/);
assert.doesNotMatch(html, /href=["']javascript:/);
assert.doesNotMatch(html, /href=["']t["']/);
assert.match(html, /math\.AP/);
assert.match(html, /证明逻辑\/大纲/);
assert.match(html, /<details class="proof-outline">/);
assert.match(html, /<summary>/);
assert.match(html, /<input[^>]+type="date"/);
assert.match(html, /完整收敛 2\/2/);
assert.match(html, /AI 协作 0/);
assert.match(html, /data-category="math\.AP"/);
assert.match(html, /data-summary-link/);
assert.match(html, /href="https:\/\/arxiv\.org/);
assert.match(html, /<details class="paper-section" open>/);
assert.match(html, /data-chart/);
assert.doesNotMatch(html, /今日值得读什么/);
assert.doesNotMatch(html, /日期归档/);
assert.doesNotMatch(html, /已补读正文关键部分|摘要级分析/);
assert.doesNotMatch(html, /查看 Markdown 版全文/);
assert.doesNotMatch(html, /markdown-copy/);
const clientScripts = await Promise.all(
  (await readdir(join(out, '_astro')))
    .filter((file) => file.endsWith('.js'))
    .map((file) => readFile(join(out, '_astro', file), 'utf8')),
);
assert.match(clientScripts.join('\n'), /displayCategories/);
assert.match(clientScripts.join('\n'), /chart-tooltip/);
assert.match(clientScripts.join('\n'), /pointerenter/);
await assert.rejects(readFile(join(out, 'archive/index.html'), 'utf8'));
await assert.rejects(readFile(join(out, 'papers/2609.00001/index.html'), 'utf8'));
await assert.rejects(readFile(join(out, 'data/manifest.json'), 'utf8'));
console.log('Static mirror tests passed');
