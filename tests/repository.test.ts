import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Miniflare } from 'miniflare';
import {
  BatchValidationError,
  ConfigConflictError,
  StaleBatchError,
  TrackingRepository,
} from '../lib/repository-core';
import { configVersion } from '../lib/config';
import { batch, reportInput, testConfig } from './helpers';

const mf = new Miniflare({
  modules: true,
  script: 'export default { fetch() { return new Response("ok") } }',
  d1Databases: ['DB'],
});
try {
  const db = await mf.getD1Database('DB');
  const journal = JSON.parse(
    await readFile('drizzle/meta/_journal.json', 'utf8'),
  ) as { entries: Array<{ tag: string }> };
  for (const entry of journal.entries) {
    if (entry.tag.startsWith('0004_')) {
      await db
        .prepare(
          "INSERT INTO papers (arxiv_id, latest_version, title, authors_json, abstract, categories_json, primary_category, arxiv_url, pdf_url, submitted_at, updated_at) VALUES ('2001.00001', 1, 'Legacy paper', '[\"A. Author\"]', 'Abstract', '[\"math.AP\"]', 'math.AP', 'https://arxiv.org/abs/2001.00001', 'https://arxiv.org/pdf/2001.00001', '2020-01-01T00:00:00Z', '2020-01-01T00:00:00Z')",
        )
        .run();
      await db
        .prepare(
          "INSERT INTO tracking_reports (id, category_id, config_version, announcement_date, arxiv_id, version, entry_kind, topic_id, topic_label, progress_type, work_summary, techniques_json, breakthrough, limitations, analysis_depth, ai_status, ai_evidence, ai_evidence_source, priority_score, priority_tier, priority_reason, low_priority_reason, revision_summary, created_at) VALUES ('legacy', 'math.AP', 'legacy', '2020-01-01', '2001.00001', 1, 'new', 'other', 'Other', 'Result', 'Summary', '[]', 'Result', 'Abstract only', 'abstract', 'no_disclosure_observed', NULL, NULL, 50, 'medium', 'Reason', NULL, NULL, '2020-01-01T00:00:00Z')",
        )
        .run();
    }
    const sql = await readFile(`drizzle/${entry.tag}.sql`, 'utf8');
    for (const statement of sql
      .split('--> statement-breakpoint')
      .map((item) => item.trim())
      .filter(Boolean))
      await db.prepare(statement).run();
  }
  const migratedLegacy = await db
    .prepare(
      "SELECT proof_outline_json, ai_status, ai_evidence, ai_evidence_source FROM tracking_reports WHERE id = 'legacy'",
    )
    .first<{
      proof_outline_json: string;
      ai_status: string;
      ai_evidence: string | null;
      ai_evidence_source: string | null;
    }>();
  assert.deepEqual(migratedLegacy, {
    proof_outline_json: '{"status":"not_reviewed","steps":[]}',
    ai_status: 'not_checked',
    ai_evidence: null,
    ai_evidence_source: null,
  });
  const repository = new TrackingRepository(db);
  await repository.importConfig(testConfig, '2026-09-04T04:00:00Z');
  const publicConfig = await repository.getPublicConfig();
  assert.equal(publicConfig.configVersion, configVersion(testConfig));
  assert.deepEqual(publicConfig.displayCategories, ['math.AP', 'cs.LG']);
  const ap = batch('math.AP', '2609.00001');
  const lg = batch('cs.LG', '2609.00001');
  lg.sourceManifest = { newIds: [], crossListIds: ['2609.00001'] };
  lg.reports = [
    reportInput('cs.LG', '2609.00001', { entryKind: 'cross_list' }),
  ];
  await repository.ingestBatch(ap);
  await repository.ingestBatch(lg);
  const feed = await repository.loadReportFeed('2026-09-04', [
    'math.AP',
    'cs.LG',
  ]);
  assert.equal(feed.reports.length, 2);
  assert.deepEqual(feed.reports[0].proofOutline, {
    status: 'not_reviewed',
    steps: [],
  });
  assert.equal(feed.reports[0].aiStatus, 'not_checked');
  assert.equal(
    feed.coverage.every((item) => item.complete),
    true,
  );
  const fullText = batch('math.AP', '2609.00001', {
    run: {
      ...ap.run,
      runId: 'newer-full-text',
      completedAt: '2026-09-04T05:10:00Z',
    },
    reports: [
      reportInput('math.AP', '2609.00001', {
        analysisDepth: 'full_text_sections',
        proofOutline: {
          status: 'reviewed',
          steps: [
            {
              claim: '先建立先验估计。',
              route: '测试方程并应用能量方法。',
              evidence: '第 3 节，定理 3.1，第 8 页',
            },
          ],
        },
      }),
    ],
  });
  await repository.ingestBatch(fullText);
  const staleAbstract = batch('math.AP', '2609.00001', {
    run: {
      ...ap.run,
      runId: 'older-abstract',
      completedAt: '2026-09-04T05:05:00Z',
    },
  });
  await assert.rejects(
    repository.ingestBatch(staleAbstract),
    StaleBatchError,
    'an older batch cannot replace a newer full-text analysis',
  );
  const afterStale = await repository.loadReportFeed('2026-09-04', ['math.AP']);
  assert.equal(afterStale.reports[0].analysisDepth, 'full_text_sections');
  assert.equal(afterStale.reports[0].proofOutline.status, 'reviewed');
  assert.equal(afterStale.coverage[0].complete, true);
  assert.equal(afterStale.coverage[0].publishedCount, 1);
  const rejectedRun = await db
    .prepare(
      "SELECT COUNT(*) AS count FROM category_runs WHERE run_id = 'math.AP:older-abstract'",
    )
    .first<{ count: number }>();
  assert.equal(
    Number(rejectedRun?.count),
    0,
    'the rejected run is not persisted',
  );
  const state = await repository.getIngestState();
  assert.deepEqual(
    state.categories.map((item) => item.categoryId),
    ['math.AP', 'cs.LG'],
    'same external run ID does not merge category states',
  );
  const renamed = structuredClone(testConfig);
  renamed.categories[0].topics[0].label = 'Renamed analysis topic';
  await repository.importConfig(renamed, '2026-09-04T06:00:00Z');
  assert.equal(
    (await repository.listReports('2026-09-04', ['math.AP']))[0].topicLabel,
    'Renamed analysis topic',
    'current labels render historical stable topic IDs',
  );
  assert.equal(
    (await repository.getPaper('2609.00001'))?.primary.topicLabel,
    'Renamed analysis topic',
    'paper details render current labels for historical stable topic IDs',
  );
  const renamedVersion = configVersion(renamed);
  const badTopic = batch('math.AP', '2609.00002', {
    configVersion: renamedVersion,
    run: { ...ap.run, runId: 'bad-topic-run' },
    sourceManifest: { newIds: ['2609.00002'], crossListIds: [] },
    reports: [
      reportInput('math.AP', '2609.00002', {
        topicId: 'unknown-topic',
        topicLabel: 'Unknown topic',
      }),
    ],
  });
  await assert.rejects(
    repository.ingestBatch(badTopic),
    BatchValidationError,
    'unknown topics are rejected as client input before persistence',
  );
  await assert.rejects(
    repository.ingestBatch(ap),
    ConfigConflictError,
    'stale config batches are rejected',
  );
  const currentAp = {
    ...ap,
    configVersion: configVersion(renamed),
    run: {
      ...ap.run,
      runId: 'rollback-run',
    },
    announcementDay: {
      ...ap.announcementDay,
      source: null as unknown as string,
    },
    reports: [],
    sourceManifest: { newIds: [], crossListIds: [] },
    dailyVolume: { announcementDate: '2026-09-04', count: 0 },
  };
  await assert.rejects(repository.ingestBatch(currentAp));
  assert.equal(
    (await repository.listReports('2026-09-04', ['math.AP'])).length,
    1,
    'late batch failure rolls back its category delete',
  );
  const zero = {
    ...currentAp,
    run: {
      ...ap.run,
      runId: 'zero-run',
      sourceCursor: '2026-09-05T00:00:00Z',
      expectedCount: 0,
    },
    announcementDay: {
      ...currentAp.announcementDay,
      date: '2026-09-03',
      source: 'https://arxiv.org/catchup/math.AP/2026-09-03',
    },
    dailyVolume: { announcementDate: '2026-09-03', count: 0 },
  };
  await repository.ingestBatch(zero);
  const zeroFeed = await repository.loadReportFeed('2026-09-03', ['math.AP']);
  assert.equal(zeroFeed.coverage[0].complete, true);
  assert.equal(zeroFeed.coverage[0].expectedCount, 0);
  const history = {
    schemaVersion: 2 as const,
    configVersion: configVersion(renamed),
    categoryId: 'math.AP',
    generatedAt: '2026-09-05T01:00:00Z',
    source: 'official catchup',
    points: [{ announcementDate: '2026-09-03', count: 2 }],
  };
  await repository.ingestVolumeHistory(history);
  const volumes = await repository.listVolumes('2y', ['math.AP', 'cs.LG']);
  assert.equal(
    volumes.find((item) => item.announcementDate === '2026-09-03')?.counts[
      'cs.LG'
    ],
    null,
    'uncollected category history remains missing',
  );

  const stoppedAp = structuredClone(renamed);
  stoppedAp.fetchCategories = ['cs.LG'];
  const raceBatch = batch('math.AP', '2609.00003', {
    configVersion: renamedVersion,
    run: { ...ap.run, runId: 'config-race-run' },
    sourceManifest: { newIds: ['2609.00003'], crossListIds: [] },
    reports: [
      reportInput('math.AP', '2609.00003', {
        topicLabel: 'Renamed analysis topic',
      }),
    ],
  });
  let changedDuringBatch = false;
  const raceDb = new Proxy(db, {
    get(target, property) {
      if (property === 'batch')
        return async (statements: D1PreparedStatement[]) => {
          if (!changedDuringBatch) {
            changedDuringBatch = true;
            await repository.importConfig(stoppedAp, '2026-09-05T04:00:00Z');
          }
          return target.batch(statements);
        };
      const value = Reflect.get(target, property);
      return typeof value === 'function' ? value.bind(target) : value;
    },
  });
  await assert.rejects(
    new TrackingRepository(raceDb).ingestBatch(raceBatch),
    ConfigConflictError,
    'a config update between preflight and the transaction is a 409 conflict',
  );

  const stoppedVersion = configVersion(stoppedAp);
  const lgNext = batch('cs.LG', '2609.00004', {
    configVersion: stoppedVersion,
    run: {
      ...lg.run,
      runId: 'lg-next-day',
      completedAt: '2026-09-05T05:01:00Z',
      sourceCursor: '2026-09-05T04:59:00Z',
    },
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
  await repository.ingestBatch(lgNext);
  const stoppedFeed = await repository.loadReportFeed(undefined, [
    'math.AP',
    'cs.LG',
  ]);
  assert.equal(stoppedFeed.date, '2026-09-05');
  assert.deepEqual(
    stoppedFeed.coverage.map((item) => [
      item.categoryId,
      item.status,
      item.requiredForCompletion,
    ]),
    [
      ['math.AP', 'not_collected', false],
      ['cs.LG', 'complete', true],
    ],
  );
  assert.equal(
    (await repository.listVolumes('2y', ['math.AP', 'cs.LG'])).find(
      (item) => item.announcementDate === '2026-09-05',
    )?.counts['math.AP'],
    null,
    'a stopped displayed category stays missing rather than becoming zero',
  );
  assert.equal(
    (await repository.loadReportFeed('2026-09-04', ['math.AP'])).reports.length,
    1,
    'a stopped category remains available on historical dates',
  );

  const offsetRun = batch('cs.LG', '2609.00005', {
    configVersion: stoppedVersion,
    run: {
      ...lg.run,
      runId: 'offset-cursor-run',
      scheduledFor: '2026-09-06T13:00:00+08:00',
      startedAt: '2026-09-06T13:01:00+08:00',
      completedAt: '2026-09-06T13:02:00+08:00',
      sourceCursor: '2026-09-06T12:00:00+08:00',
      expectedCount: 0,
    },
    announcementDay: {
      date: '2026-09-06',
      status: 'announced',
      source: 'https://arxiv.org/catchup/cs.LG/2026-09-06',
    },
    sourceManifest: { newIds: [], crossListIds: [] },
    dailyVolume: { announcementDate: '2026-09-06', count: 0 },
    reports: [],
  });
  await repository.ingestBatch(offsetRun);
  await repository.ingestBatch({
    ...offsetRun,
    run: {
      ...offsetRun.run,
      sourceCursor: '2026-09-06T05:00:00Z',
    },
  });
  await repository.ingestBatch({
    ...offsetRun,
    run: {
      ...offsetRun.run,
      runId: 'second-offset-cursor-run',
      completedAt: '2026-09-06T13:03:00+08:00',
      sourceCursor: '2026-09-06T09:30:00+05:00',
    },
  });
  const offsetState = await repository.getIngestState();
  assert.equal(
    offsetState.categories.find((item) => item.categoryId === 'cs.LG')
      ?.sourceCursor,
    '2026-09-06T05:00:00.000Z',
    'cursor ordering compares canonical UTC instants across retries and runs',
  );
  const storedTimes = await db
    .prepare(
      "SELECT scheduled_for, started_at, completed_at, source_cursor FROM category_runs WHERE run_id = 'cs.LG:offset-cursor-run'",
    )
    .first<{
      scheduled_for: string;
      started_at: string;
      completed_at: string;
      source_cursor: string;
    }>();
  assert.deepEqual(storedTimes, {
    scheduled_for: '2026-09-06T05:00:00.000Z',
    started_at: '2026-09-06T05:01:00.000Z',
    completed_at: '2026-09-06T05:02:00.000Z',
    source_cursor: '2026-09-06T05:00:00.000Z',
  });
} finally {
  await mf.dispose();
}
console.log('D1 repository integration tests passed');
