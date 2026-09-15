import unittest

from publish_payload import batch_is_visible


class PublishPayloadTests(unittest.TestCase):
    def test_complete_matching_v3_batch_is_visible(self):
        batch = {
            "categoryId": "math.AP",
            "announcementDay": {"date": "2026-09-12"},
            "run": {"expectedCount": 1, "completedAt": "2026-09-12T05:00:00Z"},
            "reports": [{"arxivId": "2609.00001", "version": 1, "entryKind": "new"}],
        }
        feed = {
            "date": "2026-09-12",
            "coverage": [{"categoryId": "math.AP", "complete": True, "expectedCount": 1, "publishedCount": 1}],
            "reports": [{"categoryId": "math.AP", "arxivId": "2609.00001", "version": 1, "entryKind": "new"}],
        }
        self.assertTrue(batch_is_visible(feed, batch))

    def test_different_report_is_not_treated_as_a_completed_retry(self):
        batch = {
            "categoryId": "math.AP",
            "announcementDay": {"date": "2026-09-12"},
            "run": {"expectedCount": 1},
            "reports": [{"arxivId": "2609.00001", "version": 1, "entryKind": "new"}],
        }
        feed = {"date": "2026-09-12", "coverage": [{"categoryId": "math.AP", "complete": True, "expectedCount": 1, "publishedCount": 1}], "reports": [{"categoryId": "math.AP", "arxivId": "2609.00002", "version": 1, "entryKind": "new"}]}
        self.assertFalse(batch_is_visible(feed, batch))

    def test_same_ids_with_different_report_content_are_not_verified(self):
        batch = {"categoryId": "math.AP", "announcementDay": {"date": "2026-09-12"}, "run": {"expectedCount": 1}, "reports": [{"arxivId": "2609.00001", "version": 1, "entryKind": "new", "workSummary": "new analysis"}]}
        feed = {"date": "2026-09-12", "coverage": [{"categoryId": "math.AP", "complete": True, "expectedCount": 1, "publishedCount": 1}], "reports": [{"categoryId": "math.AP", "arxivId": "2609.00001", "version": 1, "entryKind": "new", "workSummary": "old analysis"}]}
        self.assertFalse(batch_is_visible(feed, batch))


if __name__ == "__main__":
    unittest.main()
