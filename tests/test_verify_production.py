import json
import os
import tempfile
import unittest
from unittest.mock import patch
import verify_production
from verify_production import ExpectedAnnouncement, checked_outcome, verify_payloads

class VerifyProductionTests(unittest.TestCase):
    def setUp(self):
        self.config = {"displayCategories": ["math.AP"]}
        self.week = {"weekStart": "2026-08-31", "weekEnding": "2026-09-04", "counts": {"math.AP": 5}, "complete": True}
        self.health = {"status": "ok", "categories": [{"categoryId": "math.AP", "expectedCount": 1, "publishedCount": 1, "databasePublicationCount": 1, "complete": True}], "latestCompleteWeek": self.week}
        self.reports = {"date": "2026-09-04", "coverage": [{"categoryId": "math.AP", "complete": True, "requiredForCompletion": True, "status": "complete"}], "reports": [{"categoryId": "math.AP", "arxivId": "2609.00001", "entryKind": "new"}]}
        self.volume = {"weeks": [self.week], "points": [{"announcementDate": day, "counts": {"math.AP": 1}} for day in ("2026-08-31", "2026-09-01", "2026-09-02", "2026-09-03", "2026-09-04")]}
    def test_healthy_payloads(self): self.assertEqual(verify_payloads(self.config, self.health, self.reports, self.volume, ExpectedAnnouncement("2026-09-04", {"math.AP": 1}), self.volume), [])
    def test_count_mismatch_fails(self):
        self.health["categories"][0]["publishedCount"] = 0
        self.assertIn("coverage mismatch for math.AP", verify_payloads(self.config, self.health, self.reports, self.volume))
    def test_weekly_missing_fails(self):
        self.volume["points"][2]["counts"]["math.AP"] = None
        self.assertIn("weekly math.AP total does not equal confirmed daily sum", verify_payloads(self.config, self.health, self.reports, self.volume))
    def test_stopped_display_category_does_not_block_current_fetch(self):
        config = {"displayCategories": ["math.AP", "cs.LG"]}
        week = {**self.week, "counts": {"cs.LG": 5}}
        health = {"status": "ok", "categories": [{**self.health["categories"][0], "categoryId": "cs.LG"}], "latestCompleteWeek": week}
        reports = {"coverage": [{"categoryId": "math.AP", "complete": False, "requiredForCompletion": False, "status": "not_collected"}, {"categoryId": "cs.LG", "complete": True, "requiredForCompletion": True, "status": "complete"}]}
        display_volume = {"weeks": [], "points": [{"announcementDate": "2026-09-04", "counts": {"math.AP": None, "cs.LG": 1}}]}
        fetch_volume = {"weeks": [week], "points": [{"announcementDate": day, "counts": {"cs.LG": 1}} for day in ("2026-08-31", "2026-09-01", "2026-09-02", "2026-09-03", "2026-09-04")]}
        self.assertEqual(verify_payloads(config, health, reports, display_volume, health_volume=fetch_volume), [])
    def test_check_arxiv_cli_uses_health_fetch_categories(self):
        class Homepage:
            status = 200
            def __enter__(self): return self
            def __exit__(self, *_args): return False
        def json_response(url):
            if url.endswith("/api/config"): return 200, self.config
            if url.endswith("/api/health"): return 200, self.health
            if "/api/reports" in url: return 200, self.reports
            if "/api/volume" in url: return 200, self.volume
            return 401, {}
        with patch.object(verify_production, "_request", return_value=Homepage()), patch.object(verify_production, "_json", side_effect=json_response), patch.object(verify_production, "official_announcement", return_value=ExpectedAnnouncement("2026-09-04", {"math.AP": 1})) as official, patch("sys.argv", ["verify_production.py", "--site", "https://example.test", "--check-arxiv"]):
            verify_production.main()
        official.assert_called_once_with(["math.AP"])

    def test_health_rejects_a_failed_or_wrong_slot_outcome(self):
        with tempfile.NamedTemporaryFile(mode="w", suffix=".json", encoding="utf-8", delete=False) as handle:
            json.dump({"scheduledFor": "2026-09-04T13:30:00+08:00", "status": "failed"}, handle)
        try:
            with self.assertRaisesRegex(RuntimeError, "Daily run is failed"):
                checked_outcome(handle.name, "2026-09-04T13:30:00+08:00")
        finally:
            os.unlink(handle.name)
if __name__ == "__main__": unittest.main()
