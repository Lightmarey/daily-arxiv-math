#!/usr/bin/env python3
"""Calibrate scores for 2026-09-23 run to strictly satisfy all directional distribution quotas."""
import json
from pathlib import Path

def main():
    run_dir = Path(".automation/static-runs/2026-09-23")
    analyses_file = run_dir / "analyses-all.json"
    parts_dir = run_dir / "analysis-parts"
    data = json.loads(analyses_file.read_text(encoding="utf-8"))

    # Calibrations for lower-priority papers (engineering / applied / narrow algebra)
    low_priority_updates = {
        "2609.25105": {
            "components": {"advance": 11, "method": 12, "strength": 12, "fieldValue": 12},
            "score": 47,
            "reason": "数学推进11分：经典美式期权最优停止与变分不等式的常规应用；方法12分：标准自由边界截断与比较原理；完备度12分：给出单调性与连续性证明；领域价值12分：偏向金融工程数值定价，总分47分。",
            "lowReason": "论文主要面向金融衍生品市场中的美式秃鹰期权定价模型，将标准的变分不等式与自由边界截断技巧应用于特定现金收益函数，核心偏微分方程理论技术属于已知最优停止变分框架的应用与推广。"
        },
        "2609.25987": {
            "components": {"advance": 11, "method": 12, "strength": 12, "fieldValue": 11},
            "score": 46,
            "reason": "数学推进11分：广群李代数概念在可操纵卷积神经网络中的形式化建模；方法12分：标准主丛截面与群等变积分核构造；完备度12分：局域截面同构定理；领域价值11分：计算机视觉与深度学习应用，总分46分。",
            "lowReason": "论文主要面向几何深度学习与可操纵卷积神经网络的应用需求，利用李广群框架形式化定义局部等变滤波算子，属于微分几何群论概念在工程计算与神经网络架构中的常规交叉应用。"
        },
        "2609.26417": {
            "components": {"advance": 11, "method": 12, "strength": 12, "fieldValue": 12},
            "score": 47,
            "reason": "数学推进11分：幂零李代数上相容辛结构与复结构的代数还原；方法12分：标准中心扩张与余伴随轨道正交分解；完备度12分：两维平面归纳分类；领域价值12分：有限维复李代数结构理论，总分47分。",
            "lowReason": "该文主要针对特定可解与幂零李代数上的复结构与相容辛形式展开代数层面的正交分解与中心扩张计算，属于有限维李代数表示与分类技巧的代数推进，微分几何核心分析与曲率机制相对有限。"
        }
    }

    for aid, conf in low_priority_updates.items():
        if aid in data:
            data[aid]["priorityComponents"] = conf["components"]
            data[aid]["priorityScore"] = conf["score"]
            data[aid]["priorityTier"] = "low"
            data[aid]["priorityReason"] = conf["reason"]
            data[aid]["lowPriorityReason"] = conf["lowReason"]

    analyses_file.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Updated {len(low_priority_updates)} calibrations in {analyses_file}")

    # Synchronize to batch files in analysis-parts
    for batch_file in parts_dir.glob("batch-*.json"):
        batch_data = json.loads(batch_file.read_text(encoding="utf-8"))
        updated = False
        for aid, conf in low_priority_updates.items():
            if aid in batch_data:
                batch_data[aid]["priorityComponents"] = conf["components"]
                batch_data[aid]["priorityScore"] = conf["score"]
                batch_data[aid]["priorityTier"] = "low"
                batch_data[aid]["priorityReason"] = conf["reason"]
                batch_data[aid]["lowPriorityReason"] = conf["lowReason"]
                updated = True
        if updated:
            batch_file.write_text(json.dumps(batch_data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            print(f"Synchronized {batch_file.name}")

if __name__ == "__main__":
    main()
