#!/usr/bin/env python3
"""Lightweight pre-triage script for daily arXiv papers.

Calculates the 25% deep reading quota SEPARATELY for each mathematical direction
(math.AP and math.DG), without global aggregation.
Assigns each paper either:
  - "full_text_sections" (if paper ranks in the top 25% of ANY of its categories)
  - "abstract" (all other papers)
"""
from __future__ import annotations

import argparse
import json
import math
import re
from pathlib import Path
from typing import Any

BREAKTHROUGH_PATTERNS = [
    re.compile(r"\b(conjecture|open problem|long-standing|unresolved|hypothesis)\b", re.IGNORECASE),
    re.compile(r"\b(resolv(es?|ed|ing)|settl(es?|ed|ing)|classif(y|ies|ied|ication))\b", re.IGNORECASE),
    re.compile(r"\b(optimal|sharp|rigidity|uniqueness|blow-?up|singularity)\b", re.IGNORECASE),
    re.compile(r"\b(global existence|well-?posedness|asymptotic stability|scattering)\b", re.IGNORECASE),
    re.compile(r"\b(Ricci flow|mean curvature flow|minimal surface|Einstein manifold|Kähler|Yamabe)\b", re.IGNORECASE),
    re.compile(r"\b(Navier-Stokes|Euler equation|dispersive|wave equation|Schrödinger|Boltzmann)\b", re.IGNORECASE),
]

ROUTINE_PATTERNS = [
    re.compile(r"\b(numerical simulation|finite element|computational experiments?)\b", re.IGNORECASE),
    re.compile(r"\b(brief survey|introductory lecture|pedagogical review|notes on)\b", re.IGNORECASE),
    re.compile(r"\b(application to engineering|machine learning approach|neural network)\b", re.IGNORECASE),
]


def heuristic_triage_score(paper: dict[str, Any], target_category: str) -> float:
    """Compute a lightweight heuristic triage score based on title, abstract, and category affinity."""
    title = paper.get("title", "")
    abstract = paper.get("abstract", "")
    primary = paper.get("primaryCategory", "")
    categories = paper.get("categories", [])
    text = f"{title}\n{abstract}"

    score = 50.0

    # Primary category affinity
    if primary == target_category:
        score += 15.0
    elif target_category in categories:
        score += 8.0

    # Match breakthrough terminology
    for pattern in BREAKTHROUGH_PATTERNS:
        matches = pattern.findall(text)
        if matches:
            score += min(len(matches) * 3.0, 9.0)

    # Title weight for major keywords
    title_lower = title.lower()
    if any(k in title_lower for k in ["conjecture", "rigidity", "classification", "uniqueness", "sharp", "flow"]):
        score += 6.0

    # Penalize routine engineering or numerical papers in pure math categories
    for pattern in ROUTINE_PATTERNS:
        if pattern.search(text):
            score -= 12.0

    # Abstract length signal (extremely short abstracts often indicate minor announcements or notes)
    if len(abstract.strip()) < 300:
        score -= 5.0
    elif len(abstract.strip()) > 1000:
        score += 2.0

    return score


def calculate_directional_quotas(
    category_paper_map: dict[str, list[dict[str, Any]]],
    quota_ratio: float = 0.25,
    custom_scores: dict[str, float] | None = None,
) -> dict[str, Any]:
    """Calculate separate 25% quotas for each category and assign analysis depths.

    A paper qualifying in the top 25% of ANY of its associated categories receives
    `full_text_sections` analysis depth; otherwise `abstract`.
    """
    category_summaries: dict[str, dict[str, Any]] = {}
    qualifying_by_category: dict[str, set[str]] = {}
    paper_scores_by_cat: dict[str, dict[str, float]] = {}

    for cat_id, papers in category_paper_map.items():
        total_count = len(papers)
        # Separate quota calculation per category: floor(quota_ratio * N)
        quota = math.floor(quota_ratio * total_count) if total_count > 0 else 0

        # Score papers for this category
        scored: list[tuple[str, float]] = []
        scores_map: dict[str, float] = {}
        for p in papers:
            pid = p["arxivId"]
            if custom_scores and pid in custom_scores:
                s = custom_scores[pid]
            else:
                s = heuristic_triage_score(p, cat_id)
            scored.append((pid, s))
            scores_map[pid] = s

        # Sort descending by score; break ties deterministically by arxivId ascending
        scored.sort(key=lambda item: (-item[1], item[0]))
        paper_scores_by_cat[cat_id] = scores_map

        top_ids = {pid for pid, _ in scored[:quota]}
        qualifying_by_category[cat_id] = top_ids

        category_summaries[cat_id] = {
            "totalPapers": total_count,
            "quotaRatio": quota_ratio,
            "quotaCount": quota,
            "highPriorityCount": len(top_ids),
            "topPaperIds": [pid for pid, _ in scored[:quota]],
            "cutoffScore": scored[quota - 1][1] if quota > 0 and quota <= len(scored) else None,
        }

    # Gather all unique papers across categories
    all_papers: dict[str, dict[str, Any]] = {}
    for papers in category_paper_map.values():
        for p in papers:
            all_papers[p["arxivId"]] = p

    assignments: dict[str, dict[str, Any]] = {}
    for arxiv_id, paper in all_papers.items():
        qualifying_cats = [
            cat_id for cat_id, top_set in qualifying_by_category.items() if arxiv_id in top_set
        ]
        depth = "full_text_sections" if qualifying_cats else "abstract"

        # Best score among applicable categories
        cat_scores = {
            cat_id: paper_scores_by_cat[cat_id][arxiv_id]
            for cat_id in paper_scores_by_cat
            if arxiv_id in paper_scores_by_cat[cat_id]
        }

        assignments[arxiv_id] = {
            "arxivId": arxiv_id,
            "title": paper.get("title", ""),
            "analysisDepth": depth,
            "qualifyingCategories": qualifying_cats,
            "categoryScores": cat_scores,
            "bestTriageScore": max(cat_scores.values()) if cat_scores else 0.0,
        }

    total_full_text = sum(1 for a in assignments.values() if a["analysisDepth"] == "full_text_sections")
    total_abstract = sum(1 for a in assignments.values() if a["analysisDepth"] == "abstract")

    return {
        "quotaRule": "25% independent per category (floor(0.25 * N))",
        "categorySummaries": category_summaries,
        "totalUniquePapers": len(all_papers),
        "totalFullTextCount": total_full_text,
        "totalAbstractCount": total_abstract,
        "fullTextPercentage": round(total_full_text / len(all_papers) * 100, 2) if all_papers else 0.0,
        "assignments": assignments,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Triage daily papers into 25% deep reading and 75% abstract tiers.")
    parser.add_argument("--source", required=True, help="Path to fetched-metadata.json")
    parser.add_argument("--manifest", required=True, help="Path to listing-manifest.json")
    parser.add_argument("--out", required=True, help="Path to write triage output JSON")
    parser.add_argument("--quota-ratio", type=float, default=0.25, help="Quota ratio per category (default: 0.25)")
    parser.add_argument("--scores", help="Optional pre-existing scores JSON to use instead of heuristics")
    args = parser.parse_args()

    source_data = json.loads(Path(args.source).read_text(encoding="utf-8"))
    manifest_data = json.loads(Path(args.manifest).read_text(encoding="utf-8"))

    custom_scores = None
    if args.scores and Path(args.scores).exists():
        custom_scores = json.loads(Path(args.scores).read_text(encoding="utf-8"))

    # Map papers by category
    papers_by_id = {p["arxivId"]: p for p in source_data.get("papers", [])}
    category_paper_map: dict[str, list[dict[str, Any]]] = {}

    for cat_id, cat_manifest in manifest_data.get("manifests", {}).items():
        expected_ids = cat_manifest.get("expectedIds", [])
        category_paper_map[cat_id] = [
            papers_by_id[pid] for pid in expected_ids if pid in papers_by_id
        ]

    result = calculate_directional_quotas(
        category_paper_map,
        quota_ratio=args.quota_ratio,
        custom_scores=custom_scores,
    )

    Path(args.out).parent.mkdir(parents=True, exist_ok=True)
    Path(args.out).write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Pre-triage completed successfully. Written to {args.out}")
    for cat_id, s in result["categorySummaries"].items():
        print(f"  Category {cat_id}: total={s['totalPapers']}, 25% quota={s['quotaCount']}")
    print(f"  Total unique papers: {result['totalUniquePapers']}, Deep reading: {result['totalFullTextCount']}, Abstract: {result['totalAbstractCount']}")


if __name__ == "__main__":
    main()
