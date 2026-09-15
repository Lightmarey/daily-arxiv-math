CREATE TRIGGER `validate_ingest_config`
BEFORE INSERT ON `ingest_guards`
WHEN NOT EXISTS (
	SELECT 1
	FROM `tracking_configs` AS c
	JOIN `tracking_config_categories` AS cc ON cc.`config_version` = c.`config_version`
	WHERE c.`id` = 'active'
		AND c.`config_version` = NEW.`config_version`
		AND cc.`category_id` = NEW.`category_id`
		AND cc.`fetch_enabled` = 1
)
BEGIN
	SELECT RAISE(ABORT, 'stale_or_disabled_config');
END;
