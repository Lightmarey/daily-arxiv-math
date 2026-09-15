ALTER TABLE `ingest_guards` ADD `announcement_date` text;--> statement-breakpoint
ALTER TABLE `ingest_guards` ADD `completed_at` text;--> statement-breakpoint
CREATE TRIGGER `reject_stale_report_batch`
BEFORE INSERT ON `ingest_guards`
WHEN NEW.`announcement_date` IS NOT NULL
	AND NEW.`completed_at` IS NOT NULL
	AND EXISTS (
		SELECT 1
		FROM `category_runs`
		WHERE `category_id` = NEW.`category_id`
			AND `announcement_date` = NEW.`announcement_date`
			AND `status` = 'succeeded'
			AND julianday(`completed_at`) > julianday(NEW.`completed_at`)
	)
BEGIN
	SELECT RAISE(ABORT, 'stale_report_batch');
END;
