#!/usr/bin/env python3
"""Generate and validate daily-overview.json for 2026-09-21."""
import json
import re
import sys
from pathlib import Path

FORBIDDEN_ANALYSIS_PHRASES = (
    "摘要给出",
    "本文围绕",
    "研究《",
    "在所列设定下",
    "在给定假设下",
    "可检验的定量估计或结构性结论",
    "结构性刻画",
    "已补读正文",
    "尚未补读正文",
)

BARE_MATH_PATTERN = re.compile(
    r"[Α-Ωα-ω≤≥≪≫∞∂∇∆ΔΣΠ√∈∉→↦×²³⁴⁵⁶⁷⁸⁹⁰₀-₉=<>^_]"
    r"|\\[A-Za-z]+|\b[OCHWLSTNR]\s*(?:\d|\()|\b(?:exp|det)\s*\("
)

def _outside_math(text: str) -> str:
    output = []
    index = 0
    while index < len(text):
        delimiter = next(
            (pair for pair in (("$$", "$$"), ("$", "$"), (r"\(", r"\)"), (r"\[", r"\]"))
             if text.startswith(pair[0], index)),
            None,
        )
        if not delimiter:
            output.append(text[index])
            index += 1
            continue
        start, end = delimiter
        closing = text.find(end, index + len(start))
        if closing < 0:
            raise ValueError("unbalanced math delimiters")
        index = closing + len(end)
    return "".join(output)

def main():
    date_str = "2026-09-21"
    run_dir = Path(f".automation/static-runs/{date_str}")
    
    overview = {
        "announcementDate": date_str,
        "resultItems": [
            {
                "analysisId": f"math.AP:{date_str}:2609.20998:v1",
                "text": "将度量演化变分不等式拓展至双函数驱动的非势能博弈系统并确立重心凸性下的变分运动格式"
            },
            {
                "analysisId": f"math.DG:{date_str}:2609.21893:v1",
                "text": "证明闭三维流形上稳定 Abelian Higgs 场奇异极限界面必为有限条光滑闭浸入测地线"
            },
            {
                "analysisId": f"math.DG:{date_str}:2609.21357:v1",
                "text": "证明五维及以上有限维 Busemann $G$-空间满足无交圆盘性质并全面推进 Busemann 猜想"
            },
            {
                "analysisId": f"math.DG:{date_str}:2609.21510:v1",
                "text": "确立测度收缩性质在非扩张等距叶上的同参数最优遗传并构造反例否定 Klartag 猜想"
            },
            {
                "analysisId": f"math.AP:{date_str}:2609.21851:v1",
                "text": "攻克闭曲面 Liouville 泛函 Palais--Smale 序列在无 Struwe 单调性下的整数量子化"
            },
            {
                "analysisId": f"math.AP:{date_str}:2609.21552:v1",
                "text": "基于仿控制微局部分析建立三维环面消失五次非线性摄动向动力学 $\\Phi^4_3$ 的强收敛"
            },
            {
                "analysisId": f"math.AP:{date_str}:2609.21069:v1",
                "text": "建立二次无理环面上 Strichartz 估计的尖锐算术二分性并刻画小质量临界非线性波爆破"
            },
            {
                "analysisId": f"math.DG:{date_str}:2609.21452:v1",
                "text": "在积分体积亏损界下证明非坍缩 Ricci 极限空间奇异集的 Hausdorff 维数至多为 $n-3$"
            }
        ],
        "noteworthyItems": [
            {
                "analysisId": f"math.AP:{date_str}:2609.21680:v1",
                "result": "证明三维全空间 Allen--Cahn 方程任意有限能量稳定整解必具有一维对称性并确立四维全猜想",
                "significance": "彻底攻克几何测度论与半线性椭圆偏微分方程数十年来关于稳定相分离界面的核心猜想"
            },
            {
                "analysisId": f"math.DG:{date_str}:2609.21443:v1",
                "result": "构造出奇异集维数达到 $n-2$ 的驻定调和映射，推翻关于驻定调和映射奇异集余维数至少为 3 的猜想",
                "significance": "澄清了能量极小调和映射与一般驻定调和映射在奇点几何结构上的本质分歧并给出精确维数界"
            }
        ]
    }
    
    # Validation checks
    all_texts = []
    for item in overview["resultItems"]:
        assert len(item["text"]) <= 120, f"Result text too long: {len(item['text'])}"
        all_texts.append(item["text"])
    for item in overview["noteworthyItems"]:
        assert len(item["result"]) <= 140, f"Noteworthy result too long: {len(item['result'])}"
        assert len(item["significance"]) <= 120, f"Noteworthy significance too long: {len(item['significance'])}"
        all_texts.extend([item["result"], item["significance"]])
        
    for text in all_texts:
        for phrase in FORBIDDEN_ANALYSIS_PHRASES:
            assert phrase not in text, f"Forbidden phrase '{phrase}' in '{text}'"
        outside = _outside_math(text)
        match = BARE_MATH_PATTERN.search(outside)
        assert not match, f"Bare math '{match.group(0)}' in '{text}'"
        
    out_file = run_dir / "daily-overview.json"
    out_file.write_text(json.dumps(overview, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Generated {out_file} successfully.")

if __name__ == "__main__":
    main()
