import unittest
from datetime import date
from arxiv_listing import ListingEvents
from backfill_volume import point_from_events

class BackfillVolumeTests(unittest.TestCase):
    def test_exact_event_count_keeps_confirmed_zero(self):
        self.assertEqual(point_from_events(date(2026, 9, 4), ListingEvents((), (), (), True)), {"announcementDate": "2026-09-04", "count": 0})
    def test_new_and_cross_list_count_without_metadata_inference(self):
        point = point_from_events(date(2026, 9, 4), ListingEvents(("2609.00001",), ("2501.00001",), (), True))
        self.assertEqual(point["count"], 2)
if __name__ == "__main__": unittest.main()
