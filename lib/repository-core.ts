import {
  configVersion,
  parseTrackingConfig,
  publicConfig,
  publicTrackingConfigSchema,
  type PublicTrackingConfig,
  type TrackingConfig,
} from './config';
import { buildHealthSnapshot } from './health';
import { aggregateWeeklyVolumes } from './volume';
import type {
  CategoryCoverage,
  CategoryHealth,
  HealthSnapshot,
  PaperAnalyses,
  PaperReport,
  ReportFeed,
  VolumePoint,
} from './types';
import type { ReportBatchV3, VolumeHistoryV2 } from './validation';

export class ConfigConflictError extends Error {
  readonly status = 409;
  constructor(
    message = 'Batch configVersion is stale or the category is not enabled for fetching',
  ) {
    super(message);
    this.name = 'ConfigConflictError';
  }
}

export class BatchValidationError extends Error {
  readonly status = 400;
  constructor(message: string) {
    super(message);
    this.name = 'BatchValidationError';
  }
}

export class StaleBatchError extends ConfigConflictError {
  constructor() {
    super('A newer successful batch already exists for this category and day');
    this.name = 'StaleBatchError';
  }
}

type ConfigRow = {
  config_json: string;
  config_version: string;
};
type PublicConfigRow = {
  public_json: string;
  config_version: string;
};
type ReportRow = {
  id: string;
  category_id: string;
  config_version: string;
  announcement_date: string;
  arxiv_id: string;
  version: number;
  entry_kind: PaperReport['entryKind'];
  title: string;
  authors_json: string;
  abstract: string;
  categories_json: string;
  primary_category: string;
  arxiv_url: string;
  pdf_url: string;
  submitted_at: string;
  updated_at: string;
  topic_id: string;
  topic_label: string;
  progress_type: string;
  work_summary: string;
  techniques_json: string;
  breakthrough: string;
  limitations: string;
  analysis_depth: PaperReport['analysisDepth'];
  proof_outline_json: string;
  ai_status: PaperReport['aiStatus'];
  ai_evidence: string | null;
  ai_evidence_source: string | null;
  priority_score: number;
  priority_tier: PaperReport['priorityTier'];
  priority_reason: string;
  low_priority_reason: string | null;
  revision_summary: string | null;
};

function parseStringList(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}
function rowToReport(row: ReportRow): PaperReport {
  return {
    id: row.id,
    categoryId: row.category_id,
    configVersion: row.config_version,
    announcementDate: row.announcement_date,
    arxivId: row.arxiv_id,
    version: Number(row.version),
    entryKind: row.entry_kind,
    title: row.title,
    authors: parseStringList(row.authors_json),
    abstract: row.abstract,
    categories: parseStringList(row.categories_json),
    primaryCategory: row.primary_category,
    arxivUrl: row.arxiv_url,
    pdfUrl: row.pdf_url,
    submittedAt: row.submitted_at,
    updatedAt: row.updated_at,
    topicId: row.topic_id,
    topicLabel: row.topic_label,
    progressType: row.progress_type,
    workSummary: row.work_summary,
    techniques: parseStringList(row.techniques_json),
    breakthrough: row.breakthrough,
    limitations: row.limitations,
    analysisDepth: row.analysis_depth,
    proofOutline: JSON.parse(
      row.proof_outline_json,
    ) as PaperReport['proofOutline'],
    aiStatus: row.ai_status,
    aiEvidence: row.ai_evidence,
    aiEvidenceSource: row.ai_evidence_source,
    priorityScore: Number(row.priority_score),
    priorityTier: row.priority_tier,
    priorityReason: row.priority_reason,
    lowPriorityReason: row.low_priority_reason,
    revisionSummary: row.revision_summary,
  };
}

function placeholders(values: unknown[]): string {
  return values.map(() => '?').join(', ');
}
const reportSelect = `SELECT r.*, p.title, p.authors_json, p.abstract, p.categories_json, p.primary_category, p.arxiv_url, p.pdf_url, p.submitted_at, p.updated_at FROM tracking_reports r JOIN papers p ON p.arxiv_id = r.arxiv_id`;

export class TrackingRepository {
  constructor(private readonly db: D1Database) {}

  async getConfig(): Promise<TrackingConfig> {
    const row = await this.db
      .prepare(
        "SELECT config_json, config_version FROM tracking_configs WHERE id = 'active'",
      )
      .first<ConfigRow>();
    if (!row) throw new Error('Tracking configuration has not been imported');
    const config = parseTrackingConfig(JSON.parse(row.config_json));
    if (configVersion(config) !== row.config_version)
      throw new Error('Stored tracking configuration hash is invalid');
    return config;
  }

  async getPublicConfig(): Promise<PublicTrackingConfig> {
    const row = await this.db
      .prepare(
        "SELECT public_json, config_version FROM tracking_configs WHERE id = 'active'",
      )
      .first<PublicConfigRow>();
    if (!row) throw new Error('Tracking configuration has not been imported');
    const config = publicTrackingConfigSchema.parse(JSON.parse(row.public_json));
    if (config.configVersion !== row.config_version)
      throw new Error('Stored public configuration hash is invalid');
    return config;
  }

  async importConfig(
    config: TrackingConfig,
    importedAt = new Date().toISOString(),
  ) {
    const parsed = parseTrackingConfig(config);
    const version = configVersion(parsed);
    const publicValue = publicConfig(parsed);
    const statements: D1PreparedStatement[] = [
      this.db.prepare('DELETE FROM tracking_config_categories'),
    ];
    statements.push(
      this.db
        .prepare(
          "INSERT INTO tracking_configs (id, config_version, config_json, public_json, imported_at) VALUES ('active', ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET config_version=excluded.config_version, config_json=excluded.config_json, public_json=excluded.public_json, imported_at=excluded.imported_at",
        )
        .bind(
          version,
          JSON.stringify(parsed),
          JSON.stringify(publicValue),
          importedAt,
        ),
    );
    parsed.categories.forEach((category) =>
      statements.push(
        this.db
          .prepare(
            'INSERT INTO tracking_config_categories (config_version, category_id, fetch_enabled, display_enabled, display_position) VALUES (?, ?, ?, ?, ?)',
          )
          .bind(
            version,
            category.id,
            parsed.fetchCategories.includes(category.id) ? 1 : 0,
            parsed.displayCategories.includes(category.id) ? 1 : 0,
            parsed.displayCategories.indexOf(category.id) >= 0
              ? parsed.displayCategories.indexOf(category.id)
              : null,
          ),
      ),
    );
    await this.db.batch(statements);
    return {
      configVersion: version,
      importedAt,
      fetchCategories: parsed.fetchCategories,
      displayCategories: parsed.displayCategories,
    };
  }

  async listVolumes(
    range: '6m' | '2y' = '2y',
    categories?: string[],
  ): Promise<VolumePoint[]> {
    const selected = categories ?? (await this.getConfig()).displayCategories;
    if (!selected.length) return [];
    const days = range === '6m' ? '-6 months' : '-24 months';
    const binds = [...selected, ...selected, days];
    const result = await this.db
      .prepare(
        `SELECT category_id, announcement_date, count FROM category_volumes WHERE category_id IN (${placeholders(selected)}) AND announcement_date >= date((SELECT MAX(announcement_date) FROM category_volumes WHERE category_id IN (${placeholders(selected)})), ?) ORDER BY announcement_date, category_id`,
      )
      .bind(...binds)
      .all<{ category_id: string; announcement_date: string; count: number }>();
    const points = new Map<string, VolumePoint>();
    for (const row of result.results) {
      const point = points.get(row.announcement_date) ?? {
        announcementDate: row.announcement_date,
        counts: Object.fromEntries(selected.map((id) => [id, null])),
      };
      point.counts[row.category_id] = Number(row.count);
      points.set(row.announcement_date, point);
    }
    return [...points.values()];
  }

  async listReports(
    date?: string,
    categories?: string[],
    config?: TrackingConfig,
  ): Promise<PaperReport[]> {
    const activeConfig = config ?? (await this.getConfig());
    const selected = categories ?? activeConfig.displayCategories;
    if (!selected.length) return [];
    const selectedDate =
      date ??
      (
        await this.db
          .prepare(
            `SELECT MAX(announcement_date) AS date FROM category_runs WHERE status = 'succeeded' AND category_id IN (${placeholders(selected)})`,
          )
          .bind(...selected)
          .first<{ date: string | null }>()
      )?.date;
    if (!selectedDate) return [];
    const result = await this.db
      .prepare(
        `${reportSelect} WHERE r.announcement_date = ? AND r.category_id IN (${placeholders(selected)}) ORDER BY r.priority_score DESC, p.updated_at DESC`,
      )
      .bind(selectedDate, ...selected)
      .all<ReportRow>();
    const categoryById = new Map(
      activeConfig.categories.map((item) => [item.id, item]),
    );
    return result.results.map(rowToReport).map((report) => ({
      ...report,
      topicLabel:
        categoryById
          .get(report.categoryId)
          ?.topics.find((topic) => topic.id === report.topicId)?.label ??
        report.topicLabel,
    }));
  }

  async loadReportFeed(
    date?: string,
    categories?: string[],
  ): Promise<ReportFeed> {
    const config = await this.getConfig();
    const selected = categories ?? config.displayCategories;
    const selectedDate =
      date ??
      (
        await this.db
          .prepare(
            `SELECT MAX(announcement_date) AS date FROM category_runs WHERE status = 'succeeded' AND category_id IN (${placeholders(selected)})`,
          )
          .bind(...selected)
          .first<{ date: string | null }>()
      )?.date ??
      new Date().toISOString().slice(0, 10);
    const [reports, runs, counts] = await Promise.all([
      this.listReports(selectedDate, selected, config),
      selected.length
        ? this.db
            .prepare(
              `SELECT category_id, completed_at, expected_count, published_count FROM category_runs WHERE status = 'succeeded' AND announcement_date = ? AND category_id IN (${placeholders(selected)}) ORDER BY completed_at DESC`,
            )
            .bind(selectedDate, ...selected)
            .all<{
              category_id: string;
              completed_at: string;
              expected_count: number;
              published_count: number;
            }>()
        : Promise.resolve({ results: [] }),
      selected.length
        ? this.db
            .prepare(
              `SELECT category_id, COUNT(*) AS count FROM tracking_reports WHERE announcement_date = ? AND entry_kind IN ('new','cross_list') AND category_id IN (${placeholders(selected)}) GROUP BY category_id`,
            )
            .bind(selectedDate, ...selected)
            .all<{ category_id: string; count: number }>()
        : Promise.resolve({ results: [] }),
    ]);
    const latestRun = new Map<string, (typeof runs.results)[number]>();
    runs.results.forEach((row) => {
      if (!latestRun.has(row.category_id)) latestRun.set(row.category_id, row);
    });
    const dbCounts = new Map(
      counts.results.map((row) => [row.category_id, Number(row.count)]),
    );
    const requiredCategories = new Set(config.fetchCategories);
    const coverage: CategoryCoverage[] = selected.map((categoryId) => {
      const run = latestRun.get(categoryId);
      const storedCount = dbCounts.get(categoryId) ?? 0;
      const requiredForCompletion = requiredCategories.has(categoryId);
      if (!run) {
        return {
          categoryId,
          expectedCount: null,
          publishedCount: null,
          databasePublicationCount: storedCount || null,
          complete: false,
          requiredForCompletion,
          status: storedCount
            ? ('incomplete' as const)
            : ('not_collected' as const),
          completedAt: null,
        };
      }
      const expectedCount = Number(run.expected_count);
      const publishedCount = Number(run.published_count);
      const complete =
        expectedCount === publishedCount && expectedCount === storedCount;
      return {
        categoryId,
        expectedCount,
        publishedCount,
        databasePublicationCount: storedCount,
        complete,
        requiredForCompletion,
        status: complete ? ('complete' as const) : ('incomplete' as const),
        completedAt: run.completed_at,
      };
    });
    const lastUpdated =
      [...latestRun.values()]
        .map((row) => row.completed_at)
        .sort()
        .at(-1) ?? '';
    return {
      date: selectedDate,
      lastUpdated,
      categories: selected,
      coverage,
      reports,
    };
  }

  async getPaper(
    arxivId: string,
    categories?: string[],
  ): Promise<PaperAnalyses | null> {
    const config = await this.getConfig();
    const selected = categories ?? config.displayCategories;
    const all = await this.db
      .prepare(
        `${reportSelect} WHERE r.arxiv_id = ? ORDER BY r.announcement_date DESC, r.version DESC`,
      )
      .bind(arxivId)
      .all<ReportRow>();
    if (!all.results.length) return null;
    const rank = new Map(selected.map((id, index) => [id, index]));
    const categoryById = new Map(
      config.categories.map((category) => [category.id, category]),
    );
    const analyses = all.results
      .map(rowToReport)
      .map((report) => ({
        ...report,
        topicLabel:
          categoryById
            .get(report.categoryId)
            ?.topics.find((topic) => topic.id === report.topicId)?.label ??
          report.topicLabel,
      }))
      .sort(
        (a, b) =>
          (rank.get(a.categoryId) ?? 999) - (rank.get(b.categoryId) ?? 999) ||
          b.announcementDate.localeCompare(a.announcementDate) ||
          b.version - a.version,
      );
    return {
      arxivId,
      primary:
        analyses.find((item) => rank.has(item.categoryId)) ?? analyses[0],
      analyses,
    };
  }

  async getIngestState() {
    const config = await this.getConfig();
    const states = await Promise.all(
      config.fetchCategories.map(async (categoryId) => {
        const row = await this.db
          .prepare(
            "SELECT MAX(source_cursor) AS source_cursor, MAX(announcement_date) AS announcement_date, MAX(completed_at) AS completed_at FROM category_runs WHERE category_id = ? AND status = 'succeeded'",
          )
          .bind(categoryId)
          .first<{
            source_cursor: string | null;
            announcement_date: string | null;
            completed_at: string | null;
          }>();
        return {
          categoryId,
          sourceCursor: row?.source_cursor ?? null,
          latestAnnouncementDate: row?.announcement_date ?? null,
          latestSuccessfulRunAt: row?.completed_at ?? null,
        };
      }),
    );
    return { configVersion: configVersion(config), categories: states };
  }

  async getHealthSnapshot(): Promise<HealthSnapshot> {
    const config = await this.getConfig();
    if (!config.fetchCategories.length)
      return buildHealthSnapshot({
        checkedAt: new Date().toISOString(),
        categories: [],
        latestCompleteWeek: null,
      });
    const states = await Promise.all(
      config.fetchCategories.map(
        async (categoryId): Promise<CategoryHealth> => {
          const latest = await this.db
            .prepare(
              "SELECT announcement_date, completed_at, source_cursor, expected_count, published_count FROM category_runs WHERE category_id = ? AND status = 'succeeded' ORDER BY announcement_date DESC, completed_at DESC LIMIT 1",
            )
            .bind(categoryId)
            .first<{
              announcement_date: string;
              completed_at: string;
              source_cursor: string;
              expected_count: number;
              published_count: number;
            }>();
          const count = latest
            ? await this.db
                .prepare(
                  "SELECT COUNT(*) AS count FROM tracking_reports WHERE category_id = ? AND announcement_date = ? AND entry_kind IN ('new','cross_list')",
                )
                .bind(categoryId, latest.announcement_date)
                .first<{ count: number }>()
            : null;
          const volume = latest
            ? await this.db
                .prepare(
                  'SELECT count FROM category_volumes WHERE category_id = ? AND announcement_date = ?',
                )
                .bind(categoryId, latest.announcement_date)
                .first<{ count: number }>()
            : null;
          const expected = Number(latest?.expected_count ?? 0),
            published = Number(latest?.published_count ?? 0),
            databasePublicationCount = Number(count?.count ?? 0);
          return {
            categoryId,
            latestAnnouncementDate: latest?.announcement_date ?? null,
            latestSuccessfulRunAt: latest?.completed_at ?? null,
            sourceCursor: latest?.source_cursor ?? null,
            expectedCount: expected,
            publishedCount: published,
            databasePublicationCount,
            hasDailyVolume: Boolean(volume),
            requiredForCompletion: true,
            status:
              Boolean(latest) &&
              expected === published &&
              expected === databasePublicationCount
                ? 'complete'
                : 'incomplete',
            complete:
              Boolean(latest) &&
              expected === published &&
              expected === databasePublicationCount,
          };
        },
      ),
    );
    const weekly =
      aggregateWeeklyVolumes(
        await this.listVolumes('2y', config.fetchCategories),
        config.fetchCategories,
      )
        .filter((item) => item.complete)
        .at(-1) ?? null;
    return buildHealthSnapshot({
      checkedAt: new Date().toISOString(),
      categories: states,
      latestCompleteWeek: weekly,
    });
  }

  private async assertCurrentBatchConfig(
    version: string,
    categoryId: string,
  ): Promise<TrackingConfig> {
    const active = await this.db
      .prepare(
        "SELECT c.config_json, c.config_version FROM tracking_configs c JOIN tracking_config_categories cc ON cc.config_version=c.config_version WHERE c.id='active' AND c.config_version=? AND cc.category_id=? AND cc.fetch_enabled=1",
      )
      .bind(version, categoryId)
      .first<{ config_json: string; config_version: string }>();
    if (!active) throw new ConfigConflictError();
    const config = parseTrackingConfig(JSON.parse(active.config_json));
    if (configVersion(config) !== active.config_version)
      throw new Error('Stored tracking configuration hash is invalid');
    return config;
  }

  async ingestBatch(batch: ReportBatchV3) {
    const config = await this.assertCurrentBatchConfig(
      batch.configVersion,
      batch.categoryId,
    );
    const category = config.categories.find(
      (item) => item.id === batch.categoryId,
    );
    if (!category) throw new ConfigConflictError();
    for (const report of batch.reports) {
      const topic = category.topics.find((item) => item.id === report.topicId);
      if (!topic || topic.label !== report.topicLabel)
        throw new BatchValidationError(
          `Unknown or stale topic ${report.topicId} for ${batch.categoryId}`,
        );
    }
    const runTimes = {
      scheduledFor: new Date(batch.run.scheduledFor).toISOString(),
      startedAt: new Date(batch.run.startedAt).toISOString(),
      completedAt: new Date(batch.run.completedAt).toISOString(),
      sourceCursor: new Date(batch.run.sourceCursor).toISOString(),
    };
    const now = runTimes.completedAt;
    const storageRunId = `${batch.categoryId}:${batch.run.runId}`;
    const statements: D1PreparedStatement[] = [
      this.db
        .prepare(
          'INSERT INTO ingest_guards (guard_id, config_version, category_id, announcement_date, completed_at) VALUES (?, ?, ?, ?, ?)',
        )
        .bind(
          storageRunId,
          batch.configVersion,
          batch.categoryId,
          batch.announcementDay.date,
          runTimes.completedAt,
        ),
    ];
    statements.push(
      this.db
        .prepare(
          "DELETE FROM tracking_reports WHERE category_id = ? AND announcement_date = ? AND entry_kind IN ('new','cross_list')",
        )
        .bind(batch.categoryId, batch.announcementDay.date),
    );
    for (const report of batch.reports) {
      statements.push(
        this.db
          .prepare(
            'INSERT INTO papers (arxiv_id, latest_version, title, authors_json, abstract, categories_json, primary_category, arxiv_url, pdf_url, submitted_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(arxiv_id) DO UPDATE SET latest_version=excluded.latest_version, title=excluded.title, authors_json=excluded.authors_json, abstract=excluded.abstract, categories_json=excluded.categories_json, primary_category=excluded.primary_category, arxiv_url=excluded.arxiv_url, pdf_url=excluded.pdf_url, submitted_at=excluded.submitted_at, updated_at=excluded.updated_at WHERE excluded.latest_version >= papers.latest_version',
          )
          .bind(
            report.arxivId,
            report.version,
            report.title,
            JSON.stringify(report.authors),
            report.abstract,
            JSON.stringify(report.categories),
            report.primaryCategory,
            report.arxivUrl,
            report.pdfUrl,
            report.submittedAt,
            report.updatedAt,
          ),
      );
      const id = `${batch.categoryId}:${report.announcementDate}:${report.arxivId}:v${report.version}`;
      statements.push(
        this.db
          .prepare(
            `INSERT INTO tracking_reports (id, category_id, config_version, announcement_date, arxiv_id, version, entry_kind, topic_id, topic_label, progress_type, work_summary, techniques_json, breakthrough, limitations, analysis_depth, proof_outline_json, ai_status, ai_evidence, ai_evidence_source, priority_score, priority_tier, priority_reason, low_priority_reason, revision_summary, created_at) VALUES (${placeholders(Array(25).fill(null))}) ON CONFLICT(category_id, announcement_date, arxiv_id, version) DO UPDATE SET config_version=excluded.config_version, entry_kind=excluded.entry_kind, topic_id=excluded.topic_id, topic_label=excluded.topic_label, progress_type=excluded.progress_type, work_summary=excluded.work_summary, techniques_json=excluded.techniques_json, breakthrough=excluded.breakthrough, limitations=excluded.limitations, analysis_depth=excluded.analysis_depth, proof_outline_json=excluded.proof_outline_json, ai_status=excluded.ai_status, ai_evidence=excluded.ai_evidence, ai_evidence_source=excluded.ai_evidence_source, priority_score=excluded.priority_score, priority_tier=excluded.priority_tier, priority_reason=excluded.priority_reason, low_priority_reason=excluded.low_priority_reason, revision_summary=excluded.revision_summary`,
          )
          .bind(
            id,
            batch.categoryId,
            batch.configVersion,
            report.announcementDate,
            report.arxivId,
            report.version,
            report.entryKind,
            report.topicId,
            report.topicLabel,
            report.progressType,
            report.workSummary,
            JSON.stringify(report.techniques),
            report.breakthrough,
            report.limitations,
            report.analysisDepth,
            JSON.stringify(report.proofOutline),
            report.aiStatus,
            report.aiEvidence ?? null,
            report.aiEvidenceSource ?? null,
            report.priorityScore,
            report.priorityTier,
            report.priorityReason,
            report.lowPriorityReason ?? null,
            report.revisionSummary ?? null,
            now,
          ),
      );
    }
    statements.push(
      this.db
        .prepare(
          "INSERT INTO category_announcements (category_id, announcement_date, status, source, new_ids_json, cross_list_ids_json, checked_at, config_version) VALUES (?, ?, 'announced', ?, ?, ?, ?, ?) ON CONFLICT(category_id, announcement_date) DO UPDATE SET status='announced', source=excluded.source, new_ids_json=excluded.new_ids_json, cross_list_ids_json=excluded.cross_list_ids_json, checked_at=excluded.checked_at, config_version=excluded.config_version",
        )
        .bind(
          batch.categoryId,
          batch.announcementDay.date,
          batch.announcementDay.source,
          JSON.stringify(batch.sourceManifest.newIds),
          JSON.stringify(batch.sourceManifest.crossListIds),
          now,
          batch.configVersion,
        ),
    );
    statements.push(
      this.db
        .prepare(
          'INSERT INTO category_volumes (category_id, announcement_date, count, source, collected_at, config_version) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(category_id, announcement_date) DO UPDATE SET count=excluded.count, source=excluded.source, collected_at=excluded.collected_at, config_version=excluded.config_version',
        )
        .bind(
          batch.categoryId,
          batch.dailyVolume.announcementDate,
          batch.dailyVolume.count,
          batch.announcementDay.source,
          now,
          batch.configVersion,
        ),
    );
    const publications = batch.reports.filter(
      (report) => report.entryKind !== 'revision',
    ).length;
    statements.push(
      this.db
        .prepare(
          "INSERT INTO category_runs (run_id, category_id, config_version, scheduled_for, started_at, completed_at, status, announcement_date, source_cursor, expected_count, fetched_count, published_count) VALUES (?, ?, ?, ?, ?, ?, 'succeeded', ?, ?, ?, ?, ?) ON CONFLICT(run_id) DO UPDATE SET config_version=excluded.config_version, completed_at=excluded.completed_at, status='succeeded', announcement_date=excluded.announcement_date, source_cursor=CASE WHEN excluded.source_cursor > category_runs.source_cursor THEN excluded.source_cursor ELSE category_runs.source_cursor END, expected_count=excluded.expected_count, fetched_count=excluded.fetched_count, published_count=excluded.published_count",
        )
        .bind(
          storageRunId,
          batch.categoryId,
          batch.configVersion,
          runTimes.scheduledFor,
          runTimes.startedAt,
          runTimes.completedAt,
          batch.announcementDay.date,
          runTimes.sourceCursor,
          batch.run.expectedCount,
          batch.reports.length,
          publications,
        ),
    );
    statements.push(
      this.db
        .prepare('DELETE FROM ingest_guards WHERE guard_id = ?')
        .bind(storageRunId),
    );
    try {
      await this.db.batch(statements);
    } catch (error) {
      if (String(error).includes('stale_or_disabled_config'))
        throw new ConfigConflictError();
      if (String(error).includes('stale_report_batch'))
        throw new StaleBatchError();
      throw error;
    }
    return {
      runId: batch.run.runId,
      categoryId: batch.categoryId,
      published: publications,
      expected: batch.run.expectedCount,
      complete: true,
      announcementDate: batch.announcementDay.date,
      configVersion: batch.configVersion,
    };
  }

  async ingestVolumeHistory(history: VolumeHistoryV2) {
    await this.assertCurrentBatchConfig(
      history.configVersion,
      history.categoryId,
    );
    const guardId = `volume:${history.categoryId}:${history.generatedAt}`;
    const statements: D1PreparedStatement[] = [
      this.db
        .prepare(
          'INSERT INTO ingest_guards (guard_id, config_version, category_id) VALUES (?, ?, ?)',
        )
        .bind(guardId, history.configVersion, history.categoryId),
    ];
    history.points.forEach((point) => {
      statements.push(
        this.db
          .prepare(
            "INSERT INTO category_announcements (category_id, announcement_date, status, source, new_ids_json, cross_list_ids_json, checked_at, config_version) VALUES (?, ?, 'announced', ?, '[]', '[]', ?, ?) ON CONFLICT(category_id, announcement_date) DO UPDATE SET status='announced', source=excluded.source, checked_at=excluded.checked_at, config_version=excluded.config_version",
          )
          .bind(
            history.categoryId,
            point.announcementDate,
            history.source,
            history.generatedAt,
            history.configVersion,
          ),
      );
      statements.push(
        this.db
          .prepare(
            'INSERT INTO category_volumes (category_id, announcement_date, count, source, collected_at, config_version) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(category_id, announcement_date) DO UPDATE SET count=excluded.count, source=excluded.source, collected_at=excluded.collected_at, config_version=excluded.config_version',
          )
          .bind(
            history.categoryId,
            point.announcementDate,
            point.count,
            history.source,
            history.generatedAt,
            history.configVersion,
          ),
      );
    });
    statements.push(
      this.db
        .prepare('DELETE FROM ingest_guards WHERE guard_id = ?')
        .bind(guardId),
    );
    try {
      await this.db.batch(statements);
    } catch (error) {
      if (String(error).includes('stale_or_disabled_config'))
        throw new ConfigConflictError();
      throw error;
    }
    return {
      imported: history.points.length,
      categoryId: history.categoryId,
      configVersion: history.configVersion,
    };
  }
}
