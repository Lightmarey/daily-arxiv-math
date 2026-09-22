#!/usr/bin/env python3
"""Calibrate scores across all 61 papers based on strict anchor points in automations/daily-ingest.md."""
import json
import sys
from pathlib import Path

def main():
    run_dir = Path(".automation/static-runs/2026-09-21")
    analyses_file = run_dir / "analyses-all.json"
    data = json.loads(analyses_file.read_text(encoding="utf-8"))
    
    # Let's inspect papers and identify those that should be low-priority (< 50)
    # or medium-priority (50-74) or high-priority (75-89) or very high (>= 90)
    
    # Specific low-priority calibrations (routine applications, narrow parameter variations, etc.)
    # 2609.21205: Dengue fever model with impulsive intervention in a periodic environment
    # 2609.21235: Nonlocal dengue model with moving boundaries
    # 2503.14119: Decentralized Continuification Control (already low)
    # 2609.21166: Diffusive Nicholson equation with harvesting (standard traveling waves)
    # 2609.21769: Hydroelastic waves stabilization (routine feedback)
    # 2604.11353: Leader-follower density control (applied multi-agent model)
    # 2609.21261: Double-diffusive convection linear stability (standard Fourier normal modes)
    
    low_priority_map = {
        "2609.21205": {
            "components": {"advance": 11, "method": 12, "strength": 12, "fieldValue": 11},
            "score": 46,
            "reason": "数学推进11分：属于经典周期时滞反应扩散传染病模型的参数扩展；方法12分：采用标准主特征值与比较原理；完备度12分：给出基本再生数阈值动态；领域价值11分：偏重应用生物数学数值模拟。",
            "lowReason": "工作主要针对特定登革热时滞反应扩散方程进行周期参数推广与脉冲干预数值讨论，数学理论多为已知主特征值与单调动力系统判据的常规适配，缺乏深层偏微分方程分析新机制。"
        },
        "2609.21235": {
            "components": {"advance": 11, "method": 12, "strength": 12, "fieldValue": 12},
            "score": 47,
            "reason": "数学推进11分：非局部自由边界模型常规扩展；方法12分：沿用已知自由边界截断与比较方法；完备度12分：得到标准的扩散—消亡二分准则；领域价值12分：面向干湿季传染病控制。",
            "lowReason": "论文将已有的非局部扩散自由边界演化框架直接应用于干湿季登革热模型，所获扩散与消亡二分性定理属于标准比较原理与极限行为结论，偏微分方程技术突破相对有限。"
        },
        "2609.21166": {
            "components": {"advance": 11, "method": 12, "strength": 13, "fieldValue": 12},
            "score": 48,
            "reason": "数学推进11分：时滞Nicholson方程常系数行波解推广；方法12分：运用Schauder不动点与上下解方法；完备度13分：确立非临界波速行波解；领域价值12分：面向种群收获时滞动力学。",
            "lowReason": "针对一维带时滞与收获效应的单种群扩散 Nicholson 方程，其行波解存在性构造主要基于经典上下解与对角嵌入不动点技巧，属于已知数学链条的细分模型推广。"
        },
        "2609.21261": {
            "components": {"advance": 11, "method": 12, "strength": 12, "fieldValue": 12},
            "score": 47,
            "reason": "数学推进11分：双扩散对流线性谱稳定性计算；方法12分：常规正规模展开与切比雪夫配置法；完备度12分：得到临界瑞利数显式关系；领域价值12分：地热及多孔介质流体应用。",
            "lowReason": "论文主要针对多孔介质双扩散对流系统开展线性稳定性谱分析与数值验证，数学论证主要依赖标准正则模展开与边值分离变量，缺少非线性或深度偏微分方程分析进展。"
        },
        "2604.11353": {
            "components": {"advance": 11, "method": 12, "strength": 13, "fieldValue": 12},
            "score": 48,
            "reason": "数学推进11分：多智能体宏观偏微分方程反馈控制；方法12分：标准李雅普诺夫函数方法；完备度13分：局部指数收敛与显式吸引盆；领域价值12分：控制工程应用。",
            "lowReason": "侧重于多智能体系统群体对流扩散偏微分方程模型的领航控制与工程收敛性分析，数学理论主要依赖已有的抛物极大正则性与常规李雅普诺夫泛函，分析理论推进较为温和。"
        },
        "2609.21769": {
            "components": {"advance": 12, "method": 12, "strength": 12, "fieldValue": 13},
            "score": 49,
            "reason": "数学推进12分：深水水弹性波局部阻尼指数稳定化；方法12分：乘子法与能量耗散闭合；完备度12分：获得线性波能量衰减；领域价值13分：水动力学与海洋结构交互。",
            "lowReason": "文章将经典波方程边界乘子控制方法迁移至二维周期深水弹性动力学模型，主要论证依托已有的局部阻尼耗散框架，未涉及非线性或更广泛流体奇异性障碍的突破。"
        },
        "2609.21456": {
            "components": {"advance": 12, "method": 13, "strength": 12, "fieldValue": 12},
            "score": 49,
            "reason": "数学推进12分：聚集扩散方程对数斥力核渐近转化；方法13分：熵方法与能量泛函；完备度12分：自相似轮廓收敛；领域价值12分：粒子系统宏观极限。",
            "lowReason": "该文针对一维聚集扩散方程在对数排斥相互作用下的自相似解展开分析，属于现有粒子势能泛函分析与相似性变换的渐进扩展，结论较为专门。"
        }
    }
    
    # Also adjust some mildly inflated 75-80 scores down to strong medium (68-73)
    # For example, standard well-posedness or perturbation papers:
    mild_adjustments = {
        "2609.21399": {"advance": 21, "method": 18, "strength": 15, "fieldValue": 15, "score": 69},
        "2609.21491": {"advance": 20, "method": 18, "strength": 15, "fieldValue": 15, "score": 68},
        "2609.21068": {"advance": 21, "method": 18, "strength": 15, "fieldValue": 15, "score": 69},
        "2609.21988": {"advance": 22, "method": 18, "strength": 15, "fieldValue": 15, "score": 70},
        "2609.21933": {"advance": 22, "method": 18, "strength": 15, "fieldValue": 15, "score": 70},
        "2609.21250": {"advance": 22, "method": 18, "strength": 15, "fieldValue": 16, "score": 71},
        "2609.21794": {"advance": 22, "method": 18, "strength": 16, "fieldValue": 15, "score": 71},
        "2609.21914": {"advance": 22, "method": 18, "strength": 15, "fieldValue": 16, "score": 71},
        "2609.21949": {"advance": 22, "method": 18, "strength": 16, "fieldValue": 16, "score": 72},
        "2609.21458": {"advance": 22, "method": 18, "strength": 16, "fieldValue": 16, "score": 72},
        "2609.22011": {"advance": 22, "method": 18, "strength": 16, "fieldValue": 16, "score": 72},
        "2609.21312": {"advance": 22, "method": 18, "strength": 16, "fieldValue": 16, "score": 72},
        "2609.21256": {"advance": 21, "method": 18, "strength": 15, "fieldValue": 15, "score": 69},
        "2609.21266": {"advance": 21, "method": 17, "strength": 15, "fieldValue": 15, "score": 68},
        "2609.20992": {"advance": 22, "method": 18, "strength": 16, "fieldValue": 16, "score": 72},
        "2609.21528": {"advance": 22, "method": 18, "strength": 16, "fieldValue": 16, "score": 72},
        "2609.21773": {"advance": 21, "method": 18, "strength": 16, "fieldValue": 16, "score": 71},
        "2609.21877": {"advance": 22, "method": 18, "strength": 16, "fieldValue": 16, "score": 72},
    }
    
    for aid, conf in low_priority_map.items():
        if aid in data:
            data[aid]["priorityComponents"] = conf["components"]
            data[aid]["priorityScore"] = conf["score"]
            data[aid]["priorityTier"] = "low"
            data[aid]["priorityReason"] = conf["reason"]
            data[aid]["lowPriorityReason"] = conf["lowReason"]
            
    for aid, conf in mild_adjustments.items():
        if aid in data and data[aid]["priorityScore"] >= 75:
            data[aid]["priorityComponents"]["advance"] = conf["advance"]
            data[aid]["priorityComponents"]["method"] = conf["method"]
            data[aid]["priorityComponents"]["strength"] = conf["strength"]
            data[aid]["priorityComponents"]["fieldValue"] = conf["fieldValue"]
            data[aid]["priorityScore"] = conf["score"]
            data[aid]["priorityTier"] = "medium"
            data[aid]["priorityReason"] = f"数学推进{conf['advance']}分；方法{conf['method']}分；完备度{conf['strength']}分；领域价值{conf['fieldValue']}分。在既有框架下获得实质性进展与完整定理闭合，评定为中等优先级。"
            
    # Also sync changes into individual batch-XX.json files
    parts_dir = run_dir / "analysis-parts"
    for p in sorted(parts_dir.glob("batch-*.json")):
        bdata = json.loads(p.read_text(encoding="utf-8"))
        changed = False
        for aid in bdata:
            if aid in data:
                bdata[aid] = data[aid]
                changed = True
        if changed:
            p.write_text(json.dumps(bdata, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            
    analyses_file.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Calibration applied successfully.")

if __name__ == "__main__":
    main()
