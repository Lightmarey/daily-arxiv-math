CREATE TABLE `category_announcements` (
	`category_id` text NOT NULL,
	`announcement_date` text NOT NULL,
	`status` text NOT NULL,
	`source` text NOT NULL,
	`new_ids_json` text NOT NULL,
	`cross_list_ids_json` text NOT NULL,
	`checked_at` text NOT NULL,
	`config_version` text NOT NULL,
	PRIMARY KEY(`category_id`, `announcement_date`)
);
--> statement-breakpoint
CREATE INDEX `idx_category_announcement_date` ON `category_announcements` (`announcement_date`);--> statement-breakpoint
CREATE TABLE `category_runs` (
	`run_id` text PRIMARY KEY NOT NULL,
	`category_id` text NOT NULL,
	`config_version` text NOT NULL,
	`scheduled_for` text NOT NULL,
	`started_at` text NOT NULL,
	`completed_at` text NOT NULL,
	`status` text NOT NULL,
	`announcement_date` text NOT NULL,
	`source_cursor` text NOT NULL,
	`expected_count` integer NOT NULL,
	`fetched_count` integer NOT NULL,
	`published_count` integer NOT NULL,
	`error_summary` text
);
--> statement-breakpoint
CREATE INDEX `idx_category_run_latest` ON `category_runs` (`category_id`,`status`,`completed_at`);--> statement-breakpoint
CREATE INDEX `idx_category_run_day` ON `category_runs` (`category_id`,`announcement_date`,`status`);--> statement-breakpoint
CREATE TABLE `category_volumes` (
	`category_id` text NOT NULL,
	`announcement_date` text NOT NULL,
	`count` integer NOT NULL,
	`source` text NOT NULL,
	`collected_at` text NOT NULL,
	`config_version` text NOT NULL,
	PRIMARY KEY(`category_id`, `announcement_date`)
);
--> statement-breakpoint
CREATE INDEX `idx_category_volume_date` ON `category_volumes` (`announcement_date`);--> statement-breakpoint
CREATE TABLE `ingest_guards` (
	`guard_id` text PRIMARY KEY NOT NULL,
	`config_version` text NOT NULL,
	`category_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tracking_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`category_id` text NOT NULL,
	`config_version` text NOT NULL,
	`announcement_date` text NOT NULL,
	`arxiv_id` text NOT NULL,
	`version` integer NOT NULL,
	`entry_kind` text NOT NULL,
	`topic_id` text NOT NULL,
	`topic_label` text NOT NULL,
	`progress_type` text NOT NULL,
	`work_summary` text NOT NULL,
	`techniques_json` text NOT NULL,
	`breakthrough` text NOT NULL,
	`limitations` text NOT NULL,
	`analysis_depth` text NOT NULL,
	`ai_status` text NOT NULL,
	`ai_evidence` text,
	`ai_evidence_source` text,
	`priority_score` integer NOT NULL,
	`priority_tier` text NOT NULL,
	`priority_reason` text NOT NULL,
	`low_priority_reason` text,
	`revision_summary` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_tracking_report_category_date_paper_version` ON `tracking_reports` (`category_id`,`announcement_date`,`arxiv_id`,`version`);--> statement-breakpoint
CREATE INDEX `idx_tracking_report_date_category_priority` ON `tracking_reports` (`announcement_date`,`category_id`,`priority_score`);--> statement-breakpoint
CREATE INDEX `idx_tracking_report_arxiv` ON `tracking_reports` (`arxiv_id`,`category_id`,`version`);--> statement-breakpoint
CREATE TABLE `tracking_config_categories` (
	`config_version` text NOT NULL,
	`category_id` text PRIMARY KEY NOT NULL,
	`fetch_enabled` integer NOT NULL,
	`display_enabled` integer NOT NULL,
	`display_position` integer
);
--> statement-breakpoint
CREATE INDEX `idx_config_category_fetch` ON `tracking_config_categories` (`config_version`,`fetch_enabled`);--> statement-breakpoint
CREATE TABLE `tracking_configs` (
	`id` text PRIMARY KEY NOT NULL,
	`config_version` text NOT NULL,
	`config_json` text NOT NULL,
	`public_json` text NOT NULL,
	`imported_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tracking_configs_config_version_unique` ON `tracking_configs` (`config_version`);--> statement-breakpoint
DROP TABLE `announcement_days`;--> statement-breakpoint
DROP TABLE `automation_runs`;--> statement-breakpoint
DROP TABLE `daily_volume`;--> statement-breakpoint
DROP TABLE `report_entries`;