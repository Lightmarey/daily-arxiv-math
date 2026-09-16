import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  STATIC_MIRROR_SCHEMA_VERSION,
  buildStaticDay,
  buildStaticVolume,
  canonicalDailyReports,
  dailyTopicCounts,
  normalizeStaticReport,
  parseStaticOverviewSidecar,
  validateStaticDay,
  type StaticDailyOverview,
  type StaticMirrorManifestV4,
} from '../lib/static-mirror';
import { buildStaticPages } from '../scripts/build_static_pages';
import { migrateStaticMirrorV4 } from '../scripts/migrate_static_mirror_v4';
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
const sharedLg = storedReport('cs.LG', '2609.00001', {
  primaryCategory: 'math.AP',
});
const sharedApSecond = storedReport('math.AP', '2609.00002', {
  workSummary: '第三篇论文的完整结果简述。',
});
const sharedLgSecond = storedReport('cs.LG', '2609.00003', {
  workSummary: '第四篇论文先得到存在性。随后证明唯一性。最后给出稳定性。',
});
const feed = {
  date: '2026-09-04',
  lastUpdated: '2026-09-04T05:01:00Z',
  categories: ['math.AP', 'cs.LG'],
  coverage: [
    {
      categoryId: 'math.AP',
      expectedCount: 2,
      publishedCount: 2,
      complete: true,
      requiredForCompletion: true,
      status: 'complete' as const,
    },
    {
      categoryId: 'cs.LG',
      expectedCount: 2,
      publishedCount: 2,
      complete: true,
      requiredForCompletion: true,
      status: 'complete' as const,
    },
  ],
  reports: [sharedAp, sharedLg, sharedApSecond, sharedLgSecond],
};
const overview: StaticDailyOverview = {
  resultItems: [
    { analysisId: sharedApSecond.id, text: '构造第二个模型的整体解' },
  ],
  noteworthyItems: [
    {
      analysisId: sharedLgSecond.id,
      result: '给出此前未知的临界估计',
      significance: '该估计可能关闭一个公开问题',
    },
    {
      analysisId: sharedAp.id,
      result: '建立测试方程的稳定性结论',
      significance: '正文证明给出了完整的闭合论证',
    },
  ],
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
const day = buildStaticDay(feed, testPublicConfig, overview);
assert.equal(day.analyses.length, 4, 'all category analyses remain available');
assert.equal(
  canonicalDailyReports(day.analyses).length,
  3,
  'cross-lists count once',
);
assert.deepEqual(
  dailyTopicCounts(day.analyses, testPublicConfig),
  [
    {
      categoryId: 'math.AP',
      topics: [{ id: 'other', label: 'Other analysis', count: 2 }],
    },
    {
      categoryId: 'cs.LG',
      topics: [{ id: 'other', label: 'Other learning', count: 1 }],
    },
  ],
  'topic counts use canonical reports and configured category order',
);
const revision = storedReport('math.AP', '2609.99999', {
  entryKind: 'revision',
  topicId: 'fluid',
  topicLabel: 'Fluid equations',
});
assert.equal(
  canonicalDailyReports([...day.analyses, revision]).length,
  3,
  'revisions do not increase the daily paper total',
);
assert.deepEqual(
  dailyTopicCounts([...day.analyses, revision], testPublicConfig),
  dailyTopicCounts(day.analyses, testPublicConfig),
  'revisions do not affect daily topic counts',
);
assert.ok(!('summaryItems' in day), 'schema v4 removes summaryItems');
assert.throws(
  () =>
    validateStaticDay({
      ...day,
      dailyOverview: {
        resultItems: [{ analysisId: sharedAp.id, text: '第一项结果' }],
        noteworthyItems: [
          {
            analysisId: sharedLg.id,
            result: '重复论文结果',
            significance: '重复论文意义',
          },
        ],
      },
    }),
  /Duplicate overview paper/,
  'overview references one arXiv paper at most once across both sections',
);
assert.throws(
  () =>
    parseStaticOverviewSidecar({
      announcementDate: feed.date,
      resultItems: Array.from({ length: 13 }, (_, index) => ({
        analysisId: `analysis-${index}`,
        text: '结果',
      })),
      noteworthyItems: [],
    }),
  /Invalid daily overview sidecar/,
);
assert.throws(
  () =>
    parseStaticOverviewSidecar({
      announcementDate: feed.date,
      resultItems: [{ analysisId: sharedAp.id, text: '过'.repeat(121) }],
      noteworthyItems: [],
    }),
  /Invalid daily overview result item/,
);
assert.throws(
  () =>
    parseStaticOverviewSidecar({
      announcementDate: feed.date,
      resultItems: [{ analysisId: sharedAp.id, text: '结果' }],
      noteworthyItems: [
        {
          analysisId: sharedLgSecond.id,
          result: '长'.repeat(141),
          significance: '意义',
        },
      ],
    }),
  /Invalid daily overview noteworthy item/,
);
assert.throws(
  () =>
    parseStaticOverviewSidecar({
      announcementDate: feed.date,
      resultItems: [{ analysisId: sharedAp.id, text: '结果' }],
      noteworthyItems: [
        {
          analysisId: sharedLgSecond.id,
          result: '值得关注的结果',
          significance: '长'.repeat(121),
        },
      ],
    }),
  /Invalid daily overview noteworthy item/,
);
const stoppedCategoryDay = buildStaticDay(
  {
    ...feed,
    reports: [sharedLg, sharedLgSecond],
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
  {
    resultItems: [
      { analysisId: sharedLg.id, text: '得到第一项结果' },
      { analysisId: sharedLgSecond.id, text: '得到第二项结果' },
    ],
    noteworthyItems: [],
  },
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
    overview,
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
    reports: [sharedAp, sharedApSecond],
  },
  oldConfig,
  {
    resultItems: overview.resultItems.slice(0, 2),
    noteworthyItems: [],
  },
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
const nextDayOverviewPath = join(offlineRoot, 'overview.json');
const wrongDayOverviewPath = join(offlineRoot, 'wrong-overview.json');
await writeFile(stoppedConfigPath, JSON.stringify(stoppedConfig));
await writeFile(nextDayBatchPath, JSON.stringify(nextDayBatch));
await writeFile(
  nextDayOverviewPath,
  JSON.stringify({
    announcementDate: '2026-09-05',
    resultItems: [
      {
        analysisId: 'cs.LG:2026-09-05:2609.00004:v1',
        text: '证明新模型的稳定性',
      },
    ],
    noteworthyItems: [],
  }),
);
await writeFile(
  wrongDayOverviewPath,
  JSON.stringify({
    announcementDate: '2026-09-06',
    resultItems: [
      {
        analysisId: 'cs.LG:2026-09-05:2609.00004:v1',
        text: '证明新模型的稳定性',
      },
    ],
    noteworthyItems: [],
  }),
);
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
assert.throws(() =>
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
  ),
);
assert.throws(() =>
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
      '--overview',
      wrongDayOverviewPath,
      '--volume-file',
      nextDayVolumePath,
    ],
    { stdio: 'pipe' },
  ),
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
    '--overview',
    nextDayOverviewPath,
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
const priorDate = '2026-09-03';
const priorAnalyses = day.analyses.map((report) => ({
  ...report,
  id: report.id.replace(day.announcementDate, priorDate),
  announcementDate: priorDate,
}));
const priorDay = {
  ...day,
  announcementDate: priorDate,
  lastUpdated: `${priorDate}T05:01:00Z`,
  dailyOverview: {
    resultItems: [
      { analysisId: priorAnalyses[0].id, text: '得到前一日的核心估计' },
    ],
    noteworthyItems: [],
  },
  analyses: priorAnalyses,
};
validateStaticDay(priorDay);
const manifest: StaticMirrorManifestV4 = {
  schemaVersion: STATIC_MIRROR_SCHEMA_VERSION,
  latestDate: day.announcementDate,
  generatedAt: day.lastUpdated,
  config: testPublicConfig,
  days: [
    {
      announcementDate: day.announcementDate,
      expectedCount: 4,
      publishedCount: 4,
      aiDisclosureCount: 0,
      complete: true,
      lastUpdated: day.lastUpdated,
    },
    {
      announcementDate: priorDay.announcementDate,
      expectedCount: priorDay.coverage.expectedCount,
      publishedCount: priorDay.coverage.publishedCount,
      aiDisclosureCount: priorDay.aiDisclosureCount,
      complete: true,
      lastUpdated: priorDay.lastUpdated,
    },
  ],
};
const save = (path: string, value: unknown) =>
  writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
await save(join(content, 'data/manifest.json'), manifest);
await save(join(content, 'data/config.json'), testPublicConfig);
await save(join(content, 'data/volume.json'), volume);
await save(join(content, `data/daily/${day.announcementDate}.json`), day);
await save(
  join(content, `data/daily/${priorDay.announcementDate}.json`),
  priorDay,
);
await buildStaticPages({ content, out, basePath: '/daily-arxiv-math' });
const html = await readFile(join(out, 'index.html'), 'utf8');
const priorHtml = await readFile(
  join(out, `daily/${priorDay.announcementDate}/index.html`),
  'utf8',
);
assert.doesNotMatch(html, /<script>alert\(1\)<\/script>/);
assert.doesNotMatch(html, /href=["']javascript:/);
assert.doesNotMatch(html, /href=["']t["']/);
assert.match(html, /math\.AP/);
assert.match(html, /证明逻辑\/大纲/);
assert.match(html, /<details class="proof-outline">/);
assert.match(html, /<summary>/);
assert.match(html, /<input[^>]+type="date"/);
assert.match(html, /<header class="site-header">/);
assert.match(html, /<i aria-hidden="true">𓅆<\/i><span>Arxiv日报<\/span>/);
assert.match(html, /完整收敛 4\/4/);
assert.match(html, /AI 协作 0/);
assert.match(html, /今日共收录 3 篇论文/);
assert.match(html, /math\.AP 涉及Other analysis（2 篇）/);
assert.match(html, /cs\.LG 涉及Other learning（1 篇）/);
assert.match(html, /<option value="math\.AP">math\.AP<\/option>/);
assert.doesNotMatch(html, /<option value="math\.AP">Analysis<\/option>/);
assert.match(html, /data-category="math\.AP"/);
assert.equal((html.match(/data-overview-result-link/g) ?? []).length, 1);
assert.equal((html.match(/data-overview-noteworthy-link/g) ?? []).length, 2);
assert.match(
  html,
  /href="#analysis-math-AP-2026-09-04-2609-00002-v1" data-overview-result-link/,
);
assert.match(
  html,
  /href="#analysis-cs-LG-2026-09-04-2609-00003-v1" data-overview-noteworthy-link/,
);
assert.match(
  html,
  /href="#analysis-math-AP-2026-09-04-2609-00001-v1" data-overview-noteworthy-link/,
);
assert.match(html, /今天的结果包括/);
assert.match(html, /值得一看的是/);
assert.match(html, /论文声称/);
assert.match(html, /若成立/);
assert.equal((html.match(/论文声称/g) ?? []).length, 1);
assert.equal((html.match(/若成立/g) ?? []).length, 1);
assert.doesNotMatch(html, /主要结果|全部结果简述/);
assert.equal(
  (
    html
      .match(/<div class="overview-summary">[\s\S]*?<\/div>/)?.[0]
      .match(/<p/g) ?? []
  ).length,
  3,
  'a noteworthy day renders three overview paragraphs',
);
assert.equal(
  (
    priorHtml
      .match(/<div class="overview-summary">[\s\S]*?<\/div>/)?.[0]
      .match(/<p/g) ?? []
  ).length,
  2,
  'a regular day renders two overview paragraphs',
);
assert.doesNotMatch(priorHtml, /值得一看的是/);
assert.match(html, /data-toc-category/);
assert.match(html, /data-toc-topic/);
assert.match(html, /data-toc-paper/);
assert.match(html, /href="#analysis-math-AP-2026-09-04-2609-00001-v1"/);
assert.match(html, /href="#analysis-math-AP-2026-09-04-2609-00002-v1"/);
assert.match(html, /href="#analysis-cs-LG-2026-09-04-2609-00001-v1"/);
assert.match(html, /href="#analysis-cs-LG-2026-09-04-2609-00003-v1"/);
assert.match(html, /href="https:\/\/arxiv\.org/);
assert.match(html, /<details class="paper-section" open>/);
assert.match(html, /data-chart/);
assert.match(html, /data-theme-toggle/);
assert.match(html, /aria-label="切换颜色模式"/);
assert.match(html, /data-theme-icon>☾<\/span>/);
assert.match(html, /localStorage\.getItem\('theme'\)/);
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
assert.match(clientScripts.join('\n'), /localStorage\.setItem\([`'"]theme/);
assert.match(clientScripts.join('\n'), /data-scroll-hidden/);
assert.match(clientScripts.join('\n'), /cloneNode/);
assert.match(clientScripts.join('\n'), /data-toc-paper/);
await assert.rejects(readFile(join(out, 'archive/index.html'), 'utf8'));
await assert.rejects(readFile(join(out, 'papers/2609.00001/index.html'), 'utf8'));
await assert.rejects(readFile(join(out, 'data/manifest.json'), 'utf8'));

const migrationRoot = await mkdtemp(join(tmpdir(), 'static-v4-migration-'));
const legacyContent = join(migrationRoot, 'legacy');
const overviewRoot = join(migrationRoot, 'overviews');
const migratedContent = join(migrationRoot, 'migrated');
await mkdir(join(legacyContent, 'data/daily'), { recursive: true });
await mkdir(join(overviewRoot, 'a'), { recursive: true });
await mkdir(join(overviewRoot, 'b'), { recursive: true });
const migrationDays = Array.from({ length: 52 }, (_, index) => {
  const instant = new Date('2026-07-01T00:00:00Z');
  instant.setUTCDate(instant.getUTCDate() + index);
  const date = instant.toISOString().slice(0, 10);
  const analyses = day.analyses.map((report) => ({
    ...report,
    id: report.id.replace(day.announcementDate, date),
    announcementDate: date,
  }));
  const { dailyOverview: _dailyOverview, ...legacy } = day;
  const snapshot = {
    ...legacy,
    schemaVersion: 3,
    announcementDate: date,
    lastUpdated: `${date}T05:01:00Z`,
    summaryItems: [{ analysisId: analyses[0].id, text: '旧摘要' }],
    analyses,
  };
  const sidecar = {
    announcementDate: date,
    resultItems: [
      { analysisId: analyses[0].id, text: '建立统一能量估计' },
      { analysisId: analyses[2].id, text: '构造整体弱解' },
    ],
    noteworthyItems: [
      {
        analysisId: analyses[3].id,
        result: '证明临界模型的端点估计',
        significance: '该估计可能解决一个公开问题',
      },
    ],
  };
  return { date, snapshot, sidecar };
}).sort((left, right) => right.date.localeCompare(left.date));
await Promise.all(
  migrationDays.map(({ date, snapshot }) =>
    save(join(legacyContent, `data/daily/${date}.json`), snapshot),
  ),
);
await save(join(legacyContent, 'data/config.json'), testPublicConfig);
await save(join(legacyContent, 'data/volume.json'), {
  ...volume,
  schemaVersion: 3,
});
const legacyManifest = {
  ...manifest,
  schemaVersion: 3,
  latestDate: migrationDays[0].date,
  days: migrationDays.map(({ date, snapshot }) => ({
    announcementDate: date,
    expectedCount: snapshot.coverage.expectedCount,
    publishedCount: snapshot.coverage.publishedCount,
    aiDisclosureCount: snapshot.aiDisclosureCount,
    complete: snapshot.coverage.complete,
    lastUpdated: snapshot.lastUpdated,
  })),
};
const legacyManifestPath = join(legacyContent, 'data/manifest.json');
await save(legacyManifestPath, legacyManifest);
await Promise.all(
  migrationDays
    .slice(0, -1)
    .map(({ date, sidecar }, index) =>
      save(join(overviewRoot, index % 2 ? 'a' : 'b', `${date}.json`), sidecar),
    ),
);
await save(legacyManifestPath, {
  ...legacyManifest,
  days: [
    legacyManifest.days[0],
    legacyManifest.days[0],
    ...legacyManifest.days.slice(2),
  ],
});
await assert.rejects(
  migrateStaticMirrorV4({
    content: legacyContent,
    overviews: overviewRoot,
    output: join(migrationRoot, 'duplicate-dates'),
  }),
  /duplicate dates/,
);
await save(legacyManifestPath, {
  ...legacyManifest,
  days: [
    legacyManifest.days[0],
    legacyManifest.days[2],
    legacyManifest.days[1],
    ...legacyManifest.days.slice(3),
  ],
});
await assert.rejects(
  migrateStaticMirrorV4({
    content: legacyContent,
    overviews: overviewRoot,
    output: join(migrationRoot, 'unordered-dates'),
  }),
  /strictly descending/,
);
await save(legacyManifestPath, legacyManifest);
await assert.rejects(
  migrateStaticMirrorV4({
    content: legacyContent,
    overviews: overviewRoot,
    output: migratedContent,
  }),
  /Missing overview sidecar/,
);
await assert.rejects(
  readFile(join(migratedContent, 'data/manifest.json'), 'utf8'),
);
const missingOverview = migrationDays.at(-1)!;
await save(
  join(overviewRoot, 'a', `${missingOverview.date}.json`),
  missingOverview.sidecar,
);
const invalidDayPath = join(
  legacyContent,
  `data/daily/${migrationDays[0].date}.json`,
);
const invalidDay = structuredClone(migrationDays[0].snapshot);
invalidDay.analyses[0].title = '';
await save(invalidDayPath, invalidDay);
await assert.rejects(
  migrateStaticMirrorV4({
    content: legacyContent,
    overviews: overviewRoot,
    output: join(migrationRoot, 'invalid-analysis'),
  }),
  /Invalid report/,
);
await save(invalidDayPath, migrationDays[0].snapshot);
assert.deepEqual(
  await migrateStaticMirrorV4({
    content: legacyContent,
    overviews: overviewRoot,
    output: migratedContent,
  }),
  { days: 52, latestDate: migrationDays[0].date },
);
const migratedFiles = await readdir(join(migratedContent, 'data/daily'));
assert.equal(migratedFiles.length, 52, 'all archived days migrate together');
const migratedDay = JSON.parse(
  await readFile(
    join(migratedContent, `data/daily/${migrationDays[0].date}.json`),
    'utf8',
  ),
);
assert.equal(migratedDay.schemaVersion, 4);
assert.ok(!('summaryItems' in migratedDay));
assert.equal(migratedDay.dailyOverview.resultItems.length, 2);
console.log('Static mirror tests passed');
