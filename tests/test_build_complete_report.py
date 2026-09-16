import unittest

from build_complete_report import (
    _validate_analysis_quality,
    _validate_analysis_text,
    build_batch,
)


class BuildCompleteReportTests(unittest.TestCase):
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
                "workSummary": "论文研究一个非线性演化方程的初边值问题，在给定能量空间与次临界指数条件下建立弱解存在性，并给出解对初值的连续依赖、先验控制以及适用参数范围；这些结论共同描述了模型的基本适定性。",
                "techniques": [
                    "能量测试用于建立时间一致的先验界",
                    "紧性方法用于从逼近解中提取收敛子列",
                    "稳定性估计用于控制两组解之间的差异",
                ],
                "breakthrough": "结果把已有的局部构造推进到完整的弱解存在性与稳定性框架，并明确给出控制解范数的定量估计，从而能够处理一类此前缺少统一适定性结论的初值数据。",
                "limitations": "结论仍限于能量次临界指数、指定边界条件和摘要列出的正则初值空间；临界指数、粗糙数据及可能出现的有限时奇性不在当前定理覆盖范围内。",
                "priorityScore": 60,
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
        self.assertEqual(
            report["proofOutline"], {"status": "not_reviewed", "steps": []}
        )


if __name__ == "__main__":
    unittest.main()
