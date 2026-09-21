import unittest

from build_complete_report import (
    _validate_analysis_quality,
    _validate_analysis_text,
    _validate_priority_score,
    build_batch,
)


class BuildCompleteReportTests(unittest.TestCase):
    def test_priority_score_uses_the_four_component_rubric(self):
        analysis = {
            "analysisDepth": "full_text_sections",
            "priorityComponents": {
                "advance": 24,
                "method": 20,
                "strength": 17,
                "fieldValue": 15,
            },
            "priorityScore": 76,
        }
        self.assertEqual(_validate_priority_score("2609.00001", analysis), 76)

        invalid = [
            ({**analysis, "priorityScore": 75}, "must equal"),
            (
                {
                    "analysisDepth": "abstract",
                    "priorityComponents": {
                        "advance": 29,
                        "method": 16,
                        "strength": 16,
                        "fieldValue": 19,
                    },
                    "priorityScore": 80,
                },
                "provisional cap",
            ),
            (
                {
                    "analysisDepth": "full_text_sections",
                    "priorityComponents": {
                        "advance": 12,
                        "method": 20,
                        "strength": 18,
                        "fieldValue": 15,
                    },
                    "priorityScore": 65,
                },
                "routine advance",
            ),
        ]
        for value, message in invalid:
            with self.subTest(message=message), self.assertRaisesRegex(ValueError, message):
                _validate_priority_score("2609.00002", value)

    def test_rejects_shallow_analysis_before_publication(self):
        with self.assertRaisesRegex(ValueError, "shallow workSummary"):
            _validate_analysis_quality(
                "2609.00001",
                {
                    "workSummary": "得到一个存在性结论。",
                    "techniques": ["能量估计"],
                    "breakthrough": "有新结果。",
                    "limitations": "有假设。",
                    "priorityReason": "相关。",
                },
            )
        # Abstract-tier allows 80 chars workSummary, 40 chars breakthrough/limitations, and 2 techniques
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
        }
        _validate_analysis_quality("2609.00002", valid_abstract)

        # Abstract-tier still rejects < 80 chars workSummary
        with self.assertRaisesRegex(ValueError, "shallow workSummary"):
            _validate_analysis_quality(
                "2609.00003",
                {**valid_abstract, "workSummary": "太短的摘要。"}
            )
        # Abstract-tier still rejects < 2 techniques
        with self.assertRaisesRegex(ValueError, "needs at least 2 paper-specific techniques"):
            _validate_analysis_quality(
                "2609.00004",
                {**valid_abstract, "techniques": ["单项技术至少二十个字符长度说明"]}
            )

    def test_rejects_process_narration_in_display_fields(self):
        with self.assertRaisesRegex(ValueError, "forbidden display prose"):
            _validate_analysis_text(
                "2609.00001",
                {
                    "workSummary": "摘要给出的设定与主线是一个占位概括。",
                    "techniques": [],
                },
            )
        with self.assertRaisesRegex(ValueError, "math outside LaTeX delimiters"):
            _validate_analysis_text(
                "2609.00003",
                {
                    "workSummary": "得到 α≥1 时的 \\Delta u=0。",
                    "techniques": [],
                },
            )
        for index, formula in enumerate(
            ("$\\Delta u=0$", "$$\\Delta u=0$$", r"\(\Delta u=0\)", r"\[\Delta u=0\]")
        ):
            _validate_analysis_text(
                f"2609.1000{index}",
                {"workSummary": f"得到 {formula}。", "techniques": []},
            )
        with self.assertRaisesRegex(ValueError, "forbidden display prose"):
            _validate_analysis_text(
                "2609.00002",
                {
                    "workSummary": "得到一个估计。",
                    "techniques": [],
                    "proofOutline": {
                        "steps": [
                            {
                                "claim": "闭合估计",
                                "route": "已补读正文关键部分后整理。",
                            }
                        ]
                    },
                },
            )

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
                "workSummary": "论文研究一个非线性演化方程的初边值问题，先在给定能量空间与次临界指数条件下构造有限维逼近解，再建立与逼近层数无关的能量界。借助紧性得到全局弱解后，作者进一步证明解对初值的连续依赖，并给出控制解范数的定量稳定性估计。主结果同时列明指数、初值正则性和边界条件的适用范围，因此不仅包含存在性，也覆盖唯一性、稳定性以及逼近解向真实解的收敛。",
                "techniques": [
                    "以解和时间导数作为测试函数，建立对整个存在时间一致的能量先验界",
                    "结合弱紧性与 Aubin--Lions 型紧性，从有限维逼近解中提取强收敛子列",
                    "对两组解的差作能量估计并使用 Gronwall 不等式，控制初值扰动的传播",
                ],
                "breakthrough": "结果把已有的局部构造推进到包含存在、唯一、稳定性和逼近收敛的统一框架，并明确给出控制解范数与初值扰动传播的定量估计。相较只证明短时解或只处理光滑数据的结果，这套论证能够覆盖更宽的能量型初值，并为后续研究长时间行为提供可复用的紧性与稳定性工具。",
                "limitations": "结论仍限于能量次临界指数、指定边界条件和定理列出的正则初值空间，关键先验界也依赖这些结构。临界指数、低于能量空间的粗糙数据、不同边界条件以及可能出现的有限时奇性均不在当前定理覆盖范围内；文章也没有给出临界阈值附近的散射或爆破解析。",
                "priorityScore": 60,
                "priorityComponents": {
                    "advance": 18,
                    "method": 16,
                    "strength": 14,
                    "fieldValue": 12,
                },
                "priorityReason": "问题与非线性偏微分方程适定性直接相关，结果给出可复用的能量和紧性框架，但摘要没有显示它解决了临界情形或引入全新的核心机制。",
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
        self.assertEqual(report["priorityComponents"], analyses["2609.00001"]["priorityComponents"])
        self.assertEqual(
            report["proofOutline"], {"status": "not_reviewed", "steps": []}
        )


if __name__ == "__main__":
    unittest.main()
