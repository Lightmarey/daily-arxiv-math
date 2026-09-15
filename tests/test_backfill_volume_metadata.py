import unittest
from collections import Counter
from datetime import date

from backfill_volume_metadata import aggregate_weekly, category_set, merge_volume, parse_page


class MetadataVolumeBackfillTests(unittest.TestCase):
    def test_category_set_uses_arxiv_oai_hierarchy(self):
        self.assertEqual(category_set("math.AP"), "math:math:AP")

    def test_parse_page_counts_current_category_membership_by_created_date(self):
        document = b'''<?xml version="1.0"?>
<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/">
  <ListRecords><record><header><identifier>oai:arXiv.org:1</identifier></header><metadata>
    <arXiv xmlns="http://arxiv.org/OAI/arXiv/"><created>2026-09-01</created><categories>math.AP math.DG</categories></arXiv>
  </metadata></record><resumptionToken>next-token</resumptionToken></ListRecords>
</OAI-PMH>'''
        counts, token = parse_page(document, "math.DG", date(2026, 9, 1), date(2026, 9, 5))
        self.assertEqual(counts, Counter({"2026-09-01": 1}))
        self.assertEqual(token, "next-token")

    def test_merge_preserves_exact_counts_and_fills_every_date(self):
        existing = {"points": [{"announcementDate": "2026-09-01", "counts": {"math.AP": 9, "math.DG": None}}]}
        result = merge_volume(
            existing,
            {"math.AP": Counter({"2026-09-01": 2}), "math.DG": Counter({"2026-09-01": 3})},
            ["math.AP", "math.DG"],
            date(2026, 8, 31),
            date(2026, 9, 4),
            now="2026-09-06T00:00:00+00:00",
        )
        self.assertEqual(result["points"][1]["counts"], {"math.AP": 9, "math.DG": 3})
        self.assertEqual(len(result["points"]), 5)
        self.assertEqual(result["weeks104"][0]["counts"], {"math.AP": 9, "math.DG": 3})
        self.assertTrue(result["weeks104"][0]["complete"])
        self.assertFalse(result["methodology"]["paperBodiesFetched"])

    def test_weekly_aggregation_includes_weekend_first_submissions(self):
        points = [
            {"announcementDate": f"2026-09-0{day}", "counts": {"math.AP": 0}}
            for day in range(1, 6)
        ]
        points.append({"announcementDate": "2026-09-06", "counts": {"math.AP": 4}})
        self.assertEqual(aggregate_weekly(points, ["math.AP"])[0]["counts"]["math.AP"], 4)


if __name__ == "__main__":
    unittest.main()
