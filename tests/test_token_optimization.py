import unittest

from triage_papers import calculate_directional_quotas, heuristic_triage_score
from extract_paper_sections import scan_ai_disclosure, extract_sections_from_html, prepare_paper_package
from sanitize_analyses import sanitize_single_analysis, calibrate_category_quotas, calibrate_paper_score_down
from build_complete_report import _validate_analysis_quality, _validate_priority_score


class TokenOptimizationTests(unittest.TestCase):
    def test_directional_quotas_calculated_separately_per_category(self):
        # 20 papers in math.AP (25% quota = 5)
        # 12 papers in math.DG (25% quota = 3)
        # One cross-listed paper in both
        ap_papers = [
            {
                "arxivId": f"2609.100{i:02d}",
                "title": f"AP Paper {i}",
                "abstract": "We study non-linear elliptic partial differential equations.",
                "primaryCategory": "math.AP",
                "categories": ["math.AP"],
            }
            for i in range(20)
        ]
        dg_papers = [
            {
                "arxivId": f"2609.200{i:02d}",
                "title": f"DG Paper {i}",
                "abstract": "We investigate Ricci flow and minimal surfaces in Riemannian manifolds.",
                "primaryCategory": "math.DG",
                "categories": ["math.DG"],
            }
            for i in range(12)
        ]
        # Cross-listed paper
        cross_paper = {
            "arxivId": "2609.99999",
            "title": "Resolving a long-standing conjecture on Yamabe flow",
            "abstract": "We resolve an open problem on the compactness of Yamabe metrics using sharp Sobolev estimates.",
            "primaryCategory": "math.DG",
            "categories": ["math.DG", "math.AP"],
        }
        ap_papers.append(cross_paper)
        dg_papers.append(cross_paper)

        # 21 in AP (quota = floor(0.25 * 21) = 5)
        # 13 in DG (quota = floor(0.25 * 13) = 3)
        cat_map = {"math.AP": ap_papers, "math.DG": dg_papers}
        result = calculate_directional_quotas(cat_map, quota_ratio=0.25)

        ap_summary = result["categorySummaries"]["math.AP"]
        dg_summary = result["categorySummaries"]["math.DG"]

        self.assertEqual(ap_summary["totalPapers"], 21)
        self.assertEqual(ap_summary["quotaCount"], 5)
        self.assertEqual(len(ap_summary["topPaperIds"]), 5)

        self.assertEqual(dg_summary["totalPapers"], 13)
        self.assertEqual(dg_summary["quotaCount"], 3)
        self.assertEqual(len(dg_summary["topPaperIds"]), 3)

        # Cross paper has high score due to conjecture keywords
        self.assertIn("2609.99999", dg_summary["topPaperIds"])
        self.assertEqual(
            result["assignments"]["2609.99999"]["analysisDepth"],
            "full_text_sections",
        )

        # Total unique papers is 33 (20 + 12 + 1)
        self.assertEqual(result["totalUniquePapers"], 33)

        # High priority papers count is at most 5 + 3 = 8
        self.assertLessEqual(result["totalFullTextCount"], 8)
        self.assertGreaterEqual(result["totalAbstractCount"], 25)

    def test_ai_disclosure_scanner_detects_explicit_and_negative(self):
        explicit_text = "Acknowledgments: We thank the reviewers. The authors utilized ChatGPT (OpenAI) to assist with phrasing in Section 3."
        status, evidence, source = scan_ai_disclosure(explicit_text)
        self.assertEqual(status, "explicit")
        self.assertIn("ChatGPT", evidence)
        self.assertIn("明确披露使用AI工具", source)

        clean_text = "Acknowledgments: The first author was supported by NSF grant DMS-1234567. We thank Professor Smith for discussions."
        status, evidence, source = scan_ai_disclosure(clean_text)
        self.assertEqual(status, "no_disclosure_observed")
        self.assertIsNone(evidence)
        self.assertIn("未见AI使用披露", source)

    def test_extract_sections_from_html(self):
        mock_html = """
        <!DOCTYPE html>
        <html>
        <body>
        <section id="S1" class="ltx_section">
          <h2 class="ltx_title ltx_title_section">1 Introduction</h2>
          <p>This paper studies the Cauchy problem for geometric evolution equations.</p>
        </section>
        <section id="S2" class="ltx_section">
          <div class="ltx_theorem" id="Thm1">
            <span class="ltx_tag">Theorem 1.1. </span>
            <p class="ltx_p">Let $M$ be a compact Riemannian manifold. Then the flow has a unique smooth solution.</p>
          </div>
          <div class="ltx_proof">
            <span class="ltx_tag">Proof. </span>
            <p>We first construct localized energy estimates using the maximum principle.</p>
          </div>
        </section>
        <section id="ack" class="ltx_section">
          <h2 class="ltx_title ltx_title_section">Acknowledgments</h2>
          <p>Supported by grant 1000. No AI was used.</p>
        </section>
        </body>
        </html>
        """
        extracted = extract_sections_from_html(mock_html)
        self.assertTrue(extracted["hasFullTextHtml"])
        self.assertIn("Cauchy problem", extracted["introduction"])
        self.assertTrue(len(extracted["theorems"]) >= 1)
        self.assertIn("Riemannian manifold", extracted["theorems"][0])
        self.assertEqual(extracted["aiStatus"], "no_disclosure_observed")

    def test_abstract_tier_package_requires_no_html(self):
        paper = {
            "arxivId": "2609.88888",
            "title": "A note on fractional Sobolev spaces",
            "abstract": "We prove an embedding inequality for critical Sobolev spaces.",
            "primaryCategory": "math.AP",
            "categories": ["math.AP"],
        }
        pkg = prepare_paper_package(paper, analysis_depth="abstract")
        self.assertEqual(pkg["analysisDepth"], "abstract")
        self.assertEqual(pkg["proofOutline"], {"status": "not_reviewed", "steps": []})
        self.assertEqual(pkg["aiStatus"], "no_disclosure_observed")
        self.assertIn("未见AI使用披露", pkg["aiEvidenceSource"])
        self.assertNotIn("theorems", pkg)  # Zero full-text extraction

    def test_sanitize_and_quota_calibration(self):
        analyses = {
            "p1": {
                "analysisDepth": "full_text_sections",
                "priorityComponents": {"advance": 30, "method": 20, "strength": 18, "fieldValue": 18},
                "priorityScore": 86,
                "proofOutline": {
                    "status": "reviewed",
                    "steps": [
                        {"claim": "第一步建立局部光滑解存在性", "route": "通过经典抛物正则性结合压缩映射原理建立短时光滑解，并在时间区间内保持先验一致有界估计。", "evidence": "见定理证明"},
                        {"claim": "第二步扩展解至全时间区间", "route": "利用能量恒等式与 Sobolev 临界嵌入不等式排除有限时奇性发生，闭合大时间连续性延拓论证。", "evidence": "见第3节"},
                    ],
                },
                "aiStatus": "not_checked",
            },
            "p2": {
                "analysisDepth": "full_text_sections",
                "priorityComponents": {"advance": 25, "method": 20, "strength": 18, "fieldValue": 17},
                "priorityScore": 80,
                "proofOutline": {"status": "reviewed", "steps": []},
                "aiStatus": "explicit",
                "aiEvidence": "Used GPT-4",
                "aiEvidenceSource": "Acknowledgments",
            },
            "p3": {
                "analysisDepth": "abstract",
                "priorityComponents": {"advance": 25, "method": 18, "strength": 18, "fieldValue": 18},
                "priorityScore": 79,  # violates abstract cap
                "proofOutline": {"status": "not_applicable", "steps": []},  # violates abstract schema
            },
        }

        # 1. Sanitize individual items
        for pid, item in analyses.items():
            sanitize_single_analysis(pid, item)

        # p1: aiStatus repaired to no_disclosure_observed, proof step evidence has locator
        self.assertEqual(analyses["p1"]["aiStatus"], "no_disclosure_observed")
        self.assertIn("Section", analyses["p1"]["proofOutline"]["steps"][0]["evidence"])

        # p2: proofOutline had empty steps, so downgraded to not_applicable
        self.assertEqual(analyses["p2"]["proofOutline"]["status"], "not_applicable")

        # p3: abstract tier proofOutline forced to not_reviewed, score capped at <= 74
        self.assertEqual(analyses["p3"]["proofOutline"]["status"], "not_reviewed")
        self.assertLessEqual(analyses["p3"]["priorityScore"], 74)
        self.assertLessEqual(analyses["p3"]["priorityComponents"]["method"], 16)
        self.assertLessEqual(analyses["p3"]["priorityComponents"]["strength"], 16)

        # 2. Test directional quota calibration
        # Suppose manifest has math.AP with 4 papers, 25% quota = 1 paper
        manifest = {
            "manifests": {
                "math.AP": {
                    "expectedIds": ["p1", "p2", "p3", "p4"],
                }
            }
        }
        analyses["p4"] = {
            "analysisDepth": "abstract",
            "priorityComponents": {"advance": 12, "method": 10, "strength": 10, "fieldValue": 10},
            "priorityScore": 42,
        }
        sanitize_single_analysis("p4", analyses["p4"])

        # Both p1 (86) and p2 (80) have score >= 75, but quota is floor(0.25 * 4) = 1
        calibrate_category_quotas(analyses, manifest, quota_ratio=0.25)

        high_count = sum(1 for pid in ["p1", "p2", "p3", "p4"] if analyses[pid]["priorityScore"] >= 75)
        self.assertEqual(high_count, 1)  # Only p1 remains high
        self.assertEqual(analyses["p1"]["priorityScore"], 86)
        self.assertLessEqual(analyses["p2"]["priorityScore"], 74)
        self.assertEqual(analyses["p2"]["priorityTier"], "medium")

    def test_schema_rules_for_abstract_and_full_text(self):
        valid_abstract = {
            "analysisDepth": "abstract",
            "workSummary": "针对空间非均匀系数下的变指数双重非线性抛物型方程，通过 Rothe 时间半离散化、单调算子方法与弱比较原理建立全局弱解存在性与唯一性，并给出详细的大时间渐近收敛性分析。",
            "techniques": [
                "利用 Rothe 时间半离散化格式与椭圆正则性构造逼近解序列",
                "借助 Minty 单调算子方法与抛物弱比较原理闭合强收敛极限"
            ],
            "breakthrough": "在空间非均匀系数和变指数双重非线性条件下建立了自洽的弱解存在与唯一性理论，并推广了经典结论。",
            "limitations": "结论仅针对齐次 Neumann 边界条件和特定双重非线性结构，未覆盖具有外力项的一般非牛顿流体系统。",
            "priorityReason": "数学推进16分；方法16分；完备度15分；领域价值14分，为变指数抛物问题提供自洽理论。",
            "proofOutline": {"status": "not_reviewed", "steps": []},
        }
        # Should pass
        _validate_analysis_quality("2609.90001", valid_abstract)

        # Abstract tier with status="not_applicable" must fail
        with self.assertRaisesRegex(ValueError, "abstract-tier proofOutline must have status='not_reviewed'"):
            _validate_analysis_quality("2609.90002", {
                **valid_abstract,
                "proofOutline": {"status": "not_applicable", "steps": []}
            })

        # Abstract tier with status="reviewed" must fail
        with self.assertRaisesRegex(ValueError, "abstract-tier proofOutline must have status='not_reviewed'"):
            _validate_analysis_quality("2609.90003", {
                **valid_abstract,
                "proofOutline": {"status": "reviewed", "steps": []}
            })

        # Full text tier with status="not_reviewed" must fail
        valid_full = {
            **valid_abstract,
            "analysisDepth": "full_text_sections",
            "workSummary": "针对空间非均匀系数下的变指数双重非线性抛物型方程，通过 Rothe 时间半离散化、单调算子方法与弱比较原理建立全局弱解存在性与唯一性，并给出详细的大时间渐近收敛性分析。通过引入精确的权函数估计克服非线性散度结构的退化性，从而在无全局能量耗散假定下获得了最优强解正则性与局部高阶 Hölder 连续性估计。",
            "breakthrough": "在空间非均匀系数和变指数双重非线性条件下建立了自洽的弱解存在与唯一性理论，彻底克服了退化区域测度消失与先验估计非局域控制的重大技术瓶颈，并实质性推广了经典单调算子框架的适用范围，奠定了该方向坚实的分析基础。",
            "limitations": "结论仅针对齐次 Neumann 边界条件和特定双重非线性结构，未覆盖具有外力项的一般非牛顿流体系统，且当变指数下确界逼近临界值时先验界可能发散，需要进一步发展更精细的加权截断技术。",
            "priorityReason": "数学推进16分；方法16分；完备度15分；领域价值14分，为变指数双重非线性抛物问题提供了自洽严谨的理论支撑与关键分析工具。",
            "techniques": valid_abstract["techniques"] + ["第三项补充技术说明用于满足精读组三项特有技术规范要求"],
            "proofOutline": {
                "status": "not_reviewed",
                "steps": [],
            }
        }
        with self.assertRaisesRegex(ValueError, "full_text_sections cannot have status='not_reviewed'"):
            _validate_analysis_quality("2609.90004", valid_full)


if __name__ == "__main__":
    unittest.main()
