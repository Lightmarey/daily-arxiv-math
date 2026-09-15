import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  STATIC_MIRROR_SCHEMA_VERSION,
  arxivSlug,
  buildStaticDay,
  buildStaticVolume,
  mergeStaticPaper,
  normalizeStaticReport,
  renderArchiveMarkdown,
  renderDailyMarkdown,
  renderPaperMarkdown,
  type StaticMirrorManifestV2,
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
  abstract: '[bad](javascript:alert(1)) and $R_{ij}$ plus $G={F0$',
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
assert.equal(arxivSlug('math/0301001'), 'math--0301001');
assert.throws(() => arxivSlug('../secret'));
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
const day = buildStaticDay(feed, testPublicConfig);
assert.equal(
  day.reports.length,
  1,
  'day cards deduplicate a cross-category paper',
);
assert.equal(day.analyses.length, 2, 'all category analyses remain available');
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
const markdown = renderDailyMarkdown(day, testPublicConfig.site.name);
assert.doesNotMatch(markdown, /<script>/);
assert.doesNotMatch(markdown, /\{\{ site\.secret \}\}/);
assert.match(markdown, /\$R_\{ij\}\$/);
assert.match(markdown, /尚未补读正文/);
assert.match(markdown, /尚未核查 AI 声明/);
let paper = mergeStaticPaper(
  undefined,
  sharedAp,
  testPublicConfig.displayCategories,
);
paper = mergeStaticPaper(paper, sharedLg, testPublicConfig.displayCategories);
assert.equal(paper.history.length, 2, 'paper history key includes category');
assert.match(renderPaperMarkdown(paper), /分类分析：math\.AP/);
assert.match(renderPaperMarkdown(paper), /分类分析：cs\.LG/);
const checkedPaper = mergeStaticPaper(
  undefined,
  storedReport('math.AP', '2609.00006', {
    aiStatus: 'no_disclosure_observed',
    aiEvidenceSource: '致谢与声明，第 18 页',
  }),
  testPublicConfig.displayCategories,
);
assert.match(
  renderPaperMarkdown(checkedPaper),
  /检查范围：致谢与声明，第 18 页/,
);

const offlineRoot = await mkdtemp(join(tmpdir(), 'stopped-category-sync-'));
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
    '--site',
    'https://offline.invalid',
    '--output',
    join(offlineRoot, 'mirror'),
    '--batch',
    nextDayBatchPath,
    '--config',
    stoppedConfigPath,
    '--volume-file',
    nextDayVolumePath,
    '--offline',
    'true',
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
for (const directory of ['data/daily', 'data/papers', 'daily', 'papers'])
  await mkdir(join(content, directory), { recursive: true });
const manifest: StaticMirrorManifestV2 = {
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
await writeFile(join(content, `daily/${day.announcementDate}.md`), markdown);
await writeFile(join(content, 'archive.md'), renderArchiveMarkdown(manifest));
await save(join(content, `data/papers/${paper.slug}.json`), paper);
await writeFile(
  join(content, `papers/${paper.slug}.md`),
  renderPaperMarkdown(paper),
);
await buildStaticPages({ content, out, basePath: '/daily-arxiv-math' });
const html = await readFile(join(out, 'index.html'), 'utf8');
assert.doesNotMatch(html, /<script>alert\(1\)<\/script>/);
assert.doesNotMatch(html, /href=["']javascript:/);
assert.doesNotMatch(html, /katex-error/);
assert.match(html, /<code>G=\{F0<\/code>/);
assert.match(html, /math\.AP/);
assert.match(html, /证明逻辑\/大纲/);
assert.match(html, /尚未核查 AI 声明/);
assert.match(html, /摘要级分析/);
assert.match(html, /data-chart/);
assert.match(
  await readFile(join(out, 'assets/site.js'), 'utf8'),
  /displayCategories/,
);
console.log('Static mirror tests passed');
