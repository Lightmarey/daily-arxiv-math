import unittest

from arxiv_listing import parse_listing


LISTING_HTML = """
<h3>New submissions (showing 2 of 2 entries)</h3>
<dl>
  <dt><a href = "/abs/2609.00001" title="Abstract">arXiv:2609.00001</a></dt>
  <dt><a href="/abs/2609.00002v1" title="Abstract">arXiv:2609.00002</a></dt>
</dl>
<h3>Cross submissions (showing 1 of 1 entries)</h3>
<dl><dt><a href="/abs/2401.12345v3" title="Abstract">arXiv:2401.12345</a></dt></dl>
<h3>Replacement submissions (showing 1 of 1 entries)</h3>
<dl><dt><a href="/abs/2608.99999v2" title="Abstract">arXiv:2608.99999</a></dt></dl>
"""


class ListingParserTests(unittest.TestCase):
    def test_empty_publication_sections_are_a_confirmed_zero_day(self):
        result = parse_listing("<h3>New submissions (showing 0 of 0 entries)</h3><dl></dl><h3>Cross-lists</h3><dl></dl>")
        self.assertTrue(result.has_publication_sections)
        self.assertEqual(result.publication_count, 0)
    def test_new_and_cross_list_events_are_separate_from_replacements(self):
        result = parse_listing(LISTING_HTML)
        self.assertEqual(result.new_ids, ("2609.00001", "2609.00002"))
        self.assertEqual(result.cross_list_ids, ("2401.12345",))
        self.assertEqual(result.replacement_ids, ("2608.99999",))
        self.assertEqual(result.publication_count, 3)

if __name__ == "__main__":
    unittest.main()
