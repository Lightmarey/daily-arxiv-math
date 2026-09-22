#!/usr/bin/env python3
"""Generate and validate daily-overview.json for 2026-09-22."""
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
    date_str = "2026-09-22"
    run_dir = Path(f".automation/static-runs/{date_str}")
    
    overview = {
        "announcementDate": date_str,
        "resultItems": [
            {
                "analysisId": f"math.AP:{date_str}:2609.23685:v1",
                "text": "在物理三至五维空间构造能量超临界散焦非线性薛定谔方程的光滑有限时间爆破解并否定 Bourgain 猜想"
            },
            {
                "analysisId": f"math.DG:{date_str}:2609.24766:v1",
                "text": "证明三维欧氏空间中边界为圆周的非零常平均曲率光滑浸入圆盘必为嵌入欧氏标准球面冠"
            },
            {
                "analysisId": f"math.AP:{date_str}:2609.22447:v1",
                "text": "确立欧氏空间余维数 2 整配分流形的尖锐 Michael--Simon 与尖锐等周不等式及平圆盘刚性"
            },
            {
                "analysisId": f"math.AP:{date_str}:2609.22513:v1",
                "text": "完成三维 Euler 方程小通量 Hill--Norbury 轴对称定常涡环族的光滑退奇异化并揭示回旋总涡度发散柔性"
            },
            {
                "analysisId": f"math.DG:{date_str}:2609.22832:v1",
                "text": "完全分类复射影空间全纯等距浸入诱导的紧致 Kähler--Einstein 曲面并解决复二维 Loi--Zedda 猜想"
            },
            {
                "analysisId": f"math.DG:{date_str}:2609.23337:v1",
                "text": "在 Euler 示性数不超过 3 假设下证明正截面曲率四维 Einstein 流形同胚于球面或复射影平面"
            },
            {
                "analysisId": f"math.AP:{date_str}:2609.23357:v1",
                "text": "在完全流体爱因斯坦引力坍缩中证明裸奇点扰动必产生闭合陷捕面并强有力支持弱宇宙监督猜想"
            },
            {
                "analysisId": f"math.DG:{date_str}:2609.23630:v1",
                "text": "在全维数且无额外曲率假定下证明 Fano 流形上任意极值 Kähler--Ricci 孤立子必为 Kähler--Einstein 度规"
            }
        ],
        "noteworthyItems": [
            {
                "analysisId": f"math.DG:{date_str}:2609.23503:v1",
                "result": "在任意完备非紧致黎曼流形上确立 Riesz 变换的弱 $(1,1)$ 型有界性，全面攻克微分几何核心难题 Coulhon--Duong 猜想",
                "significance": "建立了不依赖热核高斯界与体积倍增条件的抽象障碍分解理论，为奇异空间分析与流形分析开辟了全新路径"
            },
            {
                "analysisId": f"math.AP:{date_str}:2609.24739:v1",
                "result": "构造出仅具备有限循环群对称性而无任何连续对称性的光滑定常磁流体平衡态，彻底推翻关于环面磁面对称性的 Grad 猜想",
                "significance": "推翻了受控热核聚变磁流体平衡态理论近六十年来的核心对称性范式，并给出了严格的形式化机器证明"
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
