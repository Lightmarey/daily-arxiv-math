import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import daily_outcome


class DailyOutcomeTests(unittest.TestCase):
    def test_success_requires_matching_verified_counts(self):
        with tempfile.TemporaryDirectory() as root:
            arguments = ["daily_outcome.py", "--root", root, "--run-id", "slot-1", "--scheduled-for", "2026-09-12T13:30:00+08:00", "--status", "success", "--announcement-date", "2026-09-12", "--expected-count", "1", "--published-count", "1", "--ingest-verified"]
            with patch.object(sys, "argv", arguments):
                daily_outcome.main()
            outcome = json.loads((Path(root) / "2026-09-12.json").read_text(encoding="utf-8"))
        self.assertEqual(outcome["status"], "success")
        self.assertTrue(outcome["ingestVerified"])

    def test_unverified_success_is_rejected(self):
        with tempfile.TemporaryDirectory() as root, patch.object(sys, "argv", ["daily_outcome.py", "--root", root, "--run-id", "slot-1", "--scheduled-for", "2026-09-12T13:30:00+08:00", "--status", "success", "--announcement-date", "2026-09-12", "--expected-count", "1", "--published-count", "1"]):
            with self.assertRaisesRegex(ValueError, "ingest verification"):
                daily_outcome.main()

    def test_complete_outcome_rejects_missing_or_mismatched_counts(self):
        with tempfile.TemporaryDirectory() as root, patch.object(sys, "argv", ["daily_outcome.py", "--root", root, "--run-id", "slot-1", "--scheduled-for", "2026-09-12T13:30:00+08:00", "--status", "no_new", "--announcement-date", "2026-09-12", "--expected-count", "2", "--published-count", "0"]):
            with self.assertRaisesRegex(ValueError, "matching expected/published"):
                daily_outcome.main()


if __name__ == "__main__":
    unittest.main()
