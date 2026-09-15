import unittest

from build_complete_report import build_batch


class BuildCompleteReportTests(unittest.TestCase):
    def test_missing_full_text_analysis_stays_explicitly_unreviewed(self):
        config = {
            "schemaVersion": 1,
            "site": {"name": "Test", "description": "Test"},
            "categories": [
                {
                    "id": "math.AP",
                    "label": "Analysis",
                    "readingPreferences": "PDE",
                    "topics": [{"id": "other", "label": "Other"}],
                }
            ],
            "fetchCategories": ["math.AP"],
            "displayCategories": ["math.AP"],
        }
        from tracking_config import config_version

        source = {
            "configVersion": config_version(config),
            "announcementDate": "2026-09-04",
            "manifests": {
                "math.AP": {
                    "expectedIds": ["2609.00001"],
                    "expectedCount": 1,
                    "source": "https://arxiv.org/catchup/math.AP/2026-09-04",
                    "sourceManifest": {
                        "newIds": ["2609.00001"],
                        "crossListIds": [],
                    },
                    "dailyVolume": {
                        "announcementDate": "2026-09-04",
                        "count": 1,
                    },
                }
            },
            "papers": [
                {
                    "arxivId": "2609.00001",
                    "version": 1,
                    "title": "Paper",
                    "authors": ["A. Author"],
                    "abstract": "Abstract",
                    "categories": ["math.AP"],
                    "primaryCategory": "math.AP",
                    "arxivUrl": "https://arxiv.org/abs/2609.00001",
                    "pdfUrl": "https://arxiv.org/pdf/2609.00001",
                    "submittedAt": "2026-09-03T17:00:00Z",
                    "updatedAt": "2026-09-03T17:00:00Z",
                }
            ],
        }
        analyses = {
            "2609.00001": {
                "topicId": "other",
                "progressType": "新结果",
                "workSummary": "摘要分析",
                "techniques": [],
                "breakthrough": "摘要分析",
                "limitations": "尚未补读正文",
                "priorityScore": 60,
            }
        }
        batch = build_batch(
            source,
            analyses,
            "math.AP",
            "2026-09-04T05:00:00Z",
            config,
            "2026-09-04T05:01:00Z",
            run_id="slot-1",
            scheduled_for="2026-09-04T13:30:00+08:00",
            started_at="2026-09-04T13:31:00+08:00",
        )
        report = batch["reports"][0]
        self.assertEqual(batch["run"]["runId"], "slot-1")
        self.assertEqual(batch["run"]["scheduledFor"], "2026-09-04T13:30:00+08:00")
        self.assertEqual(report["aiStatus"], "not_checked")
        self.assertEqual(
            report["proofOutline"], {"status": "not_reviewed", "steps": []}
        )


if __name__ == "__main__":
    unittest.main()
