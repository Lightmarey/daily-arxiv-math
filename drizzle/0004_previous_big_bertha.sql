ALTER TABLE `tracking_reports` ADD `proof_outline_json` text DEFAULT '{"status":"not_reviewed","steps":[]}' NOT NULL;--> statement-breakpoint
UPDATE `tracking_reports`
SET `ai_status` = 'not_checked',
	`ai_evidence` = NULL,
	`ai_evidence_source` = NULL
WHERE `ai_status` = 'no_disclosure_observed'
	AND COALESCE(TRIM(`ai_evidence_source`), '') = '';
