import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

export const papers = sqliteTable('papers', {
  arxivId: text('arxiv_id').primaryKey(),
  latestVersion: integer('latest_version').notNull(),
  title: text('title').notNull(),
  authorsJson: text('authors_json').notNull(),
  abstract: text('abstract').notNull(),
  categoriesJson: text('categories_json').notNull(),
  primaryCategory: text('primary_category').notNull(),
  arxivUrl: text('arxiv_url').notNull(),
  pdfUrl: text('pdf_url').notNull(),
  submittedAt: text('submitted_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const trackingConfigs = sqliteTable('tracking_configs', {
  id: text('id').primaryKey(),
  configVersion: text('config_version').notNull().unique(),
  configJson: text('config_json').notNull(),
  publicJson: text('public_json').notNull(),
  importedAt: text('imported_at').notNull(),
});

export const trackingConfigCategories = sqliteTable(
  'tracking_config_categories',
  {
    configVersion: text('config_version').notNull(),
    categoryId: text('category_id').primaryKey(),
    fetchEnabled: integer('fetch_enabled', { mode: 'boolean' }).notNull(),
    displayEnabled: integer('display_enabled', { mode: 'boolean' }).notNull(),
    displayPosition: integer('display_position'),
  },
  (table) => [
    index('idx_config_category_fetch').on(
      table.configVersion,
      table.fetchEnabled,
    ),
  ],
);

export const reportEntries = sqliteTable(
  'tracking_reports',
  {
    id: text('id').primaryKey(),
    categoryId: text('category_id').notNull(),
    configVersion: text('config_version').notNull(),
    announcementDate: text('announcement_date').notNull(),
    arxivId: text('arxiv_id').notNull(),
    version: integer('version').notNull(),
    entryKind: text('entry_kind', {
      enum: ['new', 'cross_list', 'revision'],
    }).notNull(),
    topicId: text('topic_id').notNull(),
    topicLabel: text('topic_label').notNull(),
    progressType: text('progress_type').notNull(),
    workSummary: text('work_summary').notNull(),
    techniquesJson: text('techniques_json').notNull(),
    breakthrough: text('breakthrough').notNull(),
    limitations: text('limitations').notNull(),
    analysisDepth: text('analysis_depth', {
      enum: ['abstract', 'full_text_sections'],
    }).notNull(),
    proofOutlineJson: text('proof_outline_json').notNull(),
    aiStatus: text('ai_status', {
      enum: ['explicit', 'no_disclosure_observed', 'not_checked'],
    }).notNull(),
    aiEvidence: text('ai_evidence'),
    aiEvidenceSource: text('ai_evidence_source'),
    priorityScore: integer('priority_score').notNull(),
    priorityTier: text('priority_tier', {
      enum: ['high', 'medium', 'low'],
    }).notNull(),
    priorityReason: text('priority_reason').notNull(),
    lowPriorityReason: text('low_priority_reason'),
    revisionSummary: text('revision_summary'),
    createdAt: text('created_at').notNull(),
  },
  (table) => [
    uniqueIndex('uq_tracking_report_category_date_paper_version').on(
      table.categoryId,
      table.announcementDate,
      table.arxivId,
      table.version,
    ),
    index('idx_tracking_report_date_category_priority').on(
      table.announcementDate,
      table.categoryId,
      table.priorityScore,
    ),
    index('idx_tracking_report_arxiv').on(
      table.arxivId,
      table.categoryId,
      table.version,
    ),
  ],
);

export const categoryVolumes = sqliteTable(
  'category_volumes',
  {
    categoryId: text('category_id').notNull(),
    announcementDate: text('announcement_date').notNull(),
    count: integer('count').notNull(),
    source: text('source').notNull(),
    collectedAt: text('collected_at').notNull(),
    configVersion: text('config_version').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.categoryId, table.announcementDate] }),
    index('idx_category_volume_date').on(table.announcementDate),
  ],
);

export const categoryAnnouncements = sqliteTable(
  'category_announcements',
  {
    categoryId: text('category_id').notNull(),
    announcementDate: text('announcement_date').notNull(),
    status: text('status', { enum: ['announced'] }).notNull(),
    source: text('source').notNull(),
    newIdsJson: text('new_ids_json').notNull(),
    crossListIdsJson: text('cross_list_ids_json').notNull(),
    checkedAt: text('checked_at').notNull(),
    configVersion: text('config_version').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.categoryId, table.announcementDate] }),
    index('idx_category_announcement_date').on(table.announcementDate),
  ],
);

export const categoryRuns = sqliteTable(
  'category_runs',
  {
    runId: text('run_id').primaryKey(),
    categoryId: text('category_id').notNull(),
    configVersion: text('config_version').notNull(),
    scheduledFor: text('scheduled_for').notNull(),
    startedAt: text('started_at').notNull(),
    completedAt: text('completed_at').notNull(),
    status: text('status', { enum: ['succeeded', 'failed'] }).notNull(),
    announcementDate: text('announcement_date').notNull(),
    sourceCursor: text('source_cursor').notNull(),
    expectedCount: integer('expected_count').notNull(),
    fetchedCount: integer('fetched_count').notNull(),
    publishedCount: integer('published_count').notNull(),
    errorSummary: text('error_summary'),
  },
  (table) => [
    index('idx_category_run_latest').on(
      table.categoryId,
      table.status,
      table.completedAt,
    ),
    index('idx_category_run_day').on(
      table.categoryId,
      table.announcementDate,
      table.status,
    ),
  ],
);

export const ingestGuards = sqliteTable('ingest_guards', {
  guardId: text('guard_id').primaryKey(),
  configVersion: text('config_version').notNull(),
  categoryId: text('category_id').notNull(),
  announcementDate: text('announcement_date'),
  completedAt: text('completed_at'),
});
