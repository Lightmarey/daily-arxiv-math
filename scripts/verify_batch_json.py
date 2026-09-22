#!/usr/bin/env python3
"""Batch JSON validator for daily arXiv analysis parts."""
from __future__ import annotations
import json
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

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

PRIORITY_COMPONENT_LIMITS = {
    "advance": 35,
    "method": 25,
    "strength": 20,
    "fieldValue": 20,
}

VALID_TOPICS = {
    "math.AP": {
        "elliptic-parabolic",
        "hyperbolic-conservation",
        "fluid-dynamics",
        "dispersive",
        "variational",
        "other-analysis",
    },
    "math.DG": {
        "curvature-comparison",
        "geometric-analysis",
        "geometric-flows",
        "riemannian-special",
        "subriemannian-finsler",
        "other-dg",
    },
}

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

def validate_item(arxiv_id: str, data: dict, expected_target_cats: list[str] | None = None) -> list[str]:
    errors = []
    
    # 1. Check topicIds
    topic_ids = data.get("topicIds")
    if not isinstance(topic_ids, dict):
        errors.append("topicIds must be a dict")
    else:
        if expected_target_cats:
            for cat in expected_target_cats:
                if cat not in topic_ids:
                    errors.append(f"Missing category {cat} in topicIds")
                elif topic_ids[cat] not in VALID_TOPICS.get(cat, set()):
                    errors.append(f"Invalid topicId {topic_ids[cat]} for category {cat}")

    # 2. Check lengths based on analysisDepth
    is_abstract_tier = data.get("analysisDepth", "full_text_sections") == "abstract"
    if is_abstract_tier:
        min_lens = {
            "workSummary": 80,
            "breakthrough": 40,
            "limitations": 40,
            "priorityReason": 40,
        }
        techniques_min = 2
    else:
        min_lens = {
            "workSummary": 140,
            "breakthrough": 90,
            "limitations": 90,
            "priorityReason": 50,
        }
        techniques_min = 3
    for field, min_len in min_lens.items():
        val = str(data.get(field, "")).strip()
        if len(val) < min_len:
            errors.append(f"{field} too short ({len(val)} < {min_len})")

    # 3. Check techniques
    techniques = data.get("techniques", [])
    if not isinstance(techniques, list) or len(techniques) < techniques_min:
        errors.append(f"techniques must have at least {techniques_min} items")
    else:
        for idx, t in enumerate(techniques):
            if len(str(t).strip()) < 20:
                errors.append(f"technique #{idx+1} too short ({len(str(t).strip())} < 20)")

    # 4. Check proofOutline
    outline = data.get("proofOutline", {})
    status = outline.get("status")
    if status not in ("reviewed", "not_applicable", "not_reviewed"):
        errors.append(f"Invalid proofOutline.status: {status}")
    elif status == "reviewed":
        steps = outline.get("steps", [])
        if not 2 <= len(steps) <= 6:
            errors.append(f"proofOutline.steps must have 2-6 items, got {len(steps)}")
        for idx, s in enumerate(steps):
            claim = str(s.get("claim", "")).strip()
            route = str(s.get("route", "")).strip()
            evidence = str(s.get("evidence", "")).strip()
            if len(claim) < 24:
                errors.append(f"step #{idx+1} claim too short ({len(claim)} < 24)")
            if len(route) < 80:
                errors.append(f"step #{idx+1} route too short ({len(route)} < 80)")
            if len(evidence) < 8:
                errors.append(f"step #{idx+1} evidence too short ({len(evidence)} < 8)")

    # 5. Check priorityComponents
    comps = data.get("priorityComponents")
    if not isinstance(comps, dict) or set(comps) != set(PRIORITY_COMPONENT_LIMITS):
        errors.append(f"priorityComponents must contain {list(PRIORITY_COMPONENT_LIMITS.keys())}")
    else:
        for k, limit in PRIORITY_COMPONENT_LIMITS.items():
            v = comps[k]
            if not isinstance(v, int) or isinstance(v, bool) or not 0 <= v <= limit:
                errors.append(f"priority component {k}={v} out of bounds [0, {limit}]")
        score = sum(comps.values())
        if data.get("priorityScore") != score:
            errors.append(f"priorityScore ({data.get('priorityScore')}) != sum of components ({score})")
        if comps.get("advance", 0) <= 12 and score > 64:
            errors.append(f"advance <= 12 cannot score > 64, got {score}")
        if score >= 90:
            if comps.get("advance", 0) < 30 or comps.get("method", 0) < 18 or comps.get("strength", 0) < 16:
                errors.append("score >= 90 requires advance>=30, method>=18, strength>=16")
        expected_tier = "high" if score >= 75 else "medium" if score >= 50 else "low"
        if data.get("priorityTier") != expected_tier:
            errors.append(f"priorityTier ({data.get('priorityTier')}) != expected {expected_tier}")
        if expected_tier == "low" and not data.get("lowPriorityReason"):
            errors.append("low priority item requires non-empty lowPriorityReason")

    # 6. Text quality & bare math
    all_texts = [
        data.get("workSummary", ""),
        data.get("breakthrough", ""),
        data.get("limitations", ""),
        data.get("priorityReason", ""),
        data.get("lowPriorityReason", "") or "",
    ]
    all_texts.extend(techniques)
    for s in outline.get("steps", []):
        all_texts.extend([s.get("claim", ""), s.get("route", ""), s.get("evidence", "")])
    combined_text = "\n".join(str(t) for t in all_texts if t)
    
    for phrase in FORBIDDEN_ANALYSIS_PHRASES:
        if phrase in combined_text:
            errors.append(f"Contains forbidden phrase: '{phrase}'")
            
    try:
        outside = _outside_math(combined_text)
        match = BARE_MATH_PATTERN.search(outside)
        if match:
            # show context
            start = max(0, match.start() - 20)
            end = min(len(outside), match.end() + 20)
            context = outside[start:end].replace("\n", " ")
            errors.append(f"Bare math outside LaTeX: '{match.group(0)}' in '...{context}...'")
    except ValueError as e:
        errors.append(f"Math delimiter error: {e}")

    return errors

def main():
    if len(sys.argv) < 2:
        print("Usage: verify_batch_json.py <file.json> [input_manifest.json]")
        sys.exit(1)
        
    path = Path(sys.argv[1])
    data = json.loads(path.read_text(encoding="utf-8"))
    
    input_manifest = None
    if len(sys.argv) >= 3:
        input_manifest = {
            item["arxivId"]: item["targetCategories"]
            for item in json.loads(Path(sys.argv[2]).read_text(encoding="utf-8"))
        }

    total_errors = 0
    for aid, item in data.items():
        expected_cats = input_manifest.get(aid) if input_manifest else None
        errs = validate_item(aid, item, expected_cats)
        if errs:
            total_errors += len(errs)
            print(f"[{aid}] {len(errs)} errors:")
            for e in errs:
                print(f"  - {e}")
                
    if total_errors == 0:
        print(f"SUCCESS: {path.name} ({len(data)} items) passed all checks.")
        sys.exit(0)
    else:
        print(f"FAILURE: {path.name} had {total_errors} errors across {len(data)} items.")
        sys.exit(1)

if __name__ == "__main__":
    main()
