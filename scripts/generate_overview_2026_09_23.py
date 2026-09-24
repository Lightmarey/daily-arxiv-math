#!/usr/bin/env python3
"""Generate and validate daily-overview.json for 2026-09-23."""
import json
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

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
    "未做审计",
    "仅复述声称",
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
    date_str = "2026-09-23"
    run_dir = Path(f".automation/static-runs/{date_str}")

    overview = {
        "announcementDate": date_str,
        "resultItems": [
            {
                "analysisId": f"math.AP:{date_str}:2609.25401:v1",
                "text": "解决高阶多调和方程半个世纪以来的 Agmon 猜想并确立任意凸区域上多调和 Green 函数的一致两面正性估计"
            },
            {
                "analysisId": f"math.AP:{date_str}:2609.26323:v1",
                "text": "在五维及更高维空间证明横向有界的定常 Navier--Stokes 光滑解必恒为零并克服高维 Liouville 刚性维数障碍"
            },
            {
                "analysisId": f"math.DG:{date_str}:2609.26089:v1",
                "text": "确立常全纯截面曲率下平衡 Bismut 挠率平行复流形必为平坦度规或标准偶数维李群并分类非 Kähler 复空间形式"
            },
            {
                "analysisId": f"math.DG:{date_str}:2609.25553:v1",
                "text": "证明超临界 Leung--Yau--Zaslow 变形复 Monge--Ampère 方程稳定性边界除子刚性并完全刻画奇异解正则性"
            },
            {
                "analysisId": f"math.AP:{date_str}:2609.25702:v1",
                "text": "确立带吸力效应稳态 Prandtl 边界层方程在有限能量外流扰动下的全局非线性渐近稳定性与下游代数衰减"
            },
            {
                "analysisId": f"math.DG:{date_str}:2609.26721:v1",
                "text": "证明复射影平面 $\\mathbb{C}P^2$ 中 Willmore 曲面的最优能量下界并构造高亏格临界反例揭示全实子流形退化机制"
            },
            {
                "analysisId": f"math.AP:{date_str}:2609.26609:v1",
                "text": "在曲率具非正上界的完备黎曼曲面上证明第二正 Neumann 特征值尖锐倒数不等式并确立双测地球盘等周极值刚性"
            },
            {
                "analysisId": f"math.DG:{date_str}:2609.25250:v1",
                "text": "利用六阶极值度规奇点非线性几何粘合技术在紧致三维复流形上构造出全新非 Kähler 的 Bismut-Hermitian-Einstein 度规"
            }
        ],
        "noteworthyItems": [
            {
                "analysisId": f"math.AP:{date_str}:2609.26732:v1",
                "result": "攻克变分几何与图像分割领域三十余年核心未决问题 Mumford--Shah 猜想，确立二维极小化子自由奇异集仅由有限条相互正交或具 $120^\\circ$ 三叉结构的曲线构成",
                "significance": "彻底排除了自由边界内部孤立端点与无限分支分形奇异点，建立了变分弱解边界高阶正则性的闭合几何分析理论"
            },
            {
                "analysisId": f"math.DG:{date_str}:2609.26716:v1",
                "result": "完全解决 Demailly--Peternell--Schneider 1994 年关于带半正反典范丛曲面的公开猜想，给出紧致 Kähler 曲面的完整分类定理",
                "significance": "通过对拟正线束沿全纯曲线相交数的精细退化分析，在复代数几何与紧致流形分类中建立了深刻的几何刚性判据"
            }
        ]
    }

    # Validation checks
    all_texts = []
    for item in overview["resultItems"]:
        if len(item["text"]) > 120:
            print(f"Error: result item text too long ({len(item['text'])} > 120): {item['text']}")
            sys.exit(1)
        all_texts.append(item["text"])
        
    for item in overview["noteworthyItems"]:
        if len(item["result"]) > 140:
            print(f"Error: noteworthy result too long ({len(item['result'])} > 140): {item['result']}")
            sys.exit(1)
        if len(item["significance"]) > 120:
            print(f"Error: noteworthy significance too long ({len(item['significance'])} > 120): {item['significance']}")
            sys.exit(1)
        all_texts.append(item["result"])
        all_texts.append(item["significance"])
        
    for text in all_texts:
        for phrase in FORBIDDEN_ANALYSIS_PHRASES:
            if phrase in text:
                print(f"Error: contains forbidden phrase: '{phrase}' in '{text}'")
                sys.exit(1)
        try:
            outside = _outside_math(text)
            match = BARE_MATH_PATTERN.search(outside)
            if match:
                print(f"Error: bare math outside LaTeX: '{match.group(0)}' in '{text}'")
                sys.exit(1)
        except ValueError as e:
            print(f"Error in math delimiters: {e} in '{text}'")
            sys.exit(1)

    # Validate analysisIds exist in category batches
    ap_batch = json.loads((run_dir / "category-ap.json").read_text(encoding="utf-8"))
    dg_batch = json.loads((run_dir / "category-dg.json").read_text(encoding="utf-8"))
    
    valid_ids = set()
    for r in ap_batch["reports"]:
        valid_ids.add(f"math.AP:{date_str}:{r['arxivId']}:v{r['version']}")
    for r in dg_batch["reports"]:
        valid_ids.add(f"math.DG:{date_str}:{r['arxivId']}:v{r['version']}")
        
    for item in overview["resultItems"] + overview["noteworthyItems"]:
        aid = item["analysisId"]
        if aid not in valid_ids:
            print(f"Error: analysisId {aid} not found in category reports!")
            sys.exit(1)

    out_file = run_dir / "daily-overview.json"
    out_file.write_text(json.dumps(overview, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"SUCCESS: Generated {out_file} with {len(overview['resultItems'])} results and {len(overview['noteworthyItems'])} noteworthy items.")

if __name__ == "__main__":
    main()
