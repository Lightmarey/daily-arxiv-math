import unittest

from arxiv_fetch import parse_abs_page


class ArxivFetchTests(unittest.TestCase):
    def test_parse_abs_page_fallback(self):
        page = b'''<meta name="citation_title" content="A $p$-result" />
<meta name="citation_author" content="Doe, Jane" />
<meta name="citation_abstract" content="We prove $x&lt;y$." />
<td class="tablecell comments mathjax">12 pages</td>
<td class="tablecell subjects"><span class="primary-subject">Analysis of PDEs (math.AP)</span>; Numerical Analysis (math.NA)</td>
<div class="submission-history"><strong>[v1]</strong> Fri, 11 Sep 2026 01:02:03 UTC (1 KB)<br/></div>'''
        item = parse_abs_page("2609.00001", page)
        self.assertEqual(item["authors"], ["Jane Doe"])
        self.assertEqual(item["categories"], ["math.AP", "math.NA"])
        self.assertEqual(item["primaryCategory"], "math.AP")
        self.assertEqual(item["version"], 1)
        self.assertEqual(item["abstract"], "We prove $x<y$.")


if __name__ == "__main__": unittest.main()
