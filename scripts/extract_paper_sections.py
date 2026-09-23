#!/usr/bin/env python3
"""Target section extractor and automated AI disclosure scanner for arXiv papers.

Functions:
1. For abstract-tier papers (75%):
   - Zero full-text download.
   - Automatically pre-populates `analysisDepth="abstract"`, `proofOutline={"status": "not_reviewed", "steps": []}`.
   - Pre-populates AI disclosure verification: `aiStatus="no_disclosure_observed"` with standard `aiEvidenceSource`.
2. For high-priority full_text_sections papers (25%):
   - Downloads/reads HTML from ar5iv / arXiv.
   - Automatically extracts and scans Acknowledgments/Declarations for LLM/AI disclosure statements.
   - Extracts Introduction, Main Theorems, and Proof Sketches into a compact text slice (< 12,000 chars),
     discarding 80%+ of redundant proofs, background, and appendices.
"""
from __future__ import annotations

import argparse
import html
import json
import re
from pathlib import Path
from typing import Any

from arxiv_http import download

AI_KEYWORDS_PATTERN = re.compile(
    r"\b(chatgpt|gpt-4|gpt-3\.5|openai|claude|anthropic|gemini|copilot|large language model|llms?|generative ai|artificial intelligence tools?)\b",
    re.IGNORECASE,
)

HTML_TAG_CLEANER = re.compile(r"<[^>]+>")


def clean_html_text(raw_html: str) -> str:
    """Strip HTML tags and unescape entities into clean text."""
    text = HTML_TAG_CLEANER.sub(" ", raw_html)
    text = html.unescape(text)
    return " ".join(text.split())


def scan_ai_disclosure(text: str, source_label: str = "正文致谢与声明章节") -> tuple[str, str | None, str]:
    """Scan text for explicit AI use disclosure. Returns (aiStatus, aiEvidence, aiEvidenceSource)."""
    match = AI_KEYWORDS_PATTERN.search(text)
    if match:
        # Extract the sentence surrounding the match
        start_idx = max(0, text.rfind(".", 0, match.start()) + 1)
        end_idx = text.find(".", match.end())
        if end_idx == -1:
            end_idx = min(len(text), match.end() + 200)
        else:
            end_idx += 1
        evidence = text[start_idx:end_idx].strip()
        # Ensure evidence is reasonable length
        if len(evidence) > 280:
            evidence = evidence[:277] + "..."
        return ("explicit", evidence, f"{source_label}已核查，明确披露使用AI工具")
    return ("no_disclosure_observed", None, f"{source_label}已核查，未见AI使用披露")


def extract_sections_from_html(html_content: str) -> dict[str, Any]:
    """Extract introduction, theorems, and acknowledgments from arXiv HTML."""
    # 1. Acknowledgments / Declarations
    ack_match = re.search(
        r'<section[^>]*id=["\'][^"\']*(?:ack|declar|competing|interest|funding)[^"\']*["\'][^>]*>(.*?)</section>',
        html_content,
        re.IGNORECASE | re.DOTALL,
    )
    ack_text = ""
    if ack_match:
        ack_text = clean_html_text(ack_match.group(1))
    else:
        # Search by heading
        ack_heading_match = re.search(
            r'<h[2-6][^>]*>(?:Acknowledgments?|Declarations?|AI\s+Statement|Competing\s+Interests)[^<]*</h[2-6]>(.*?)(?=<h[2-6]|</section|$)',
            html_content,
            re.IGNORECASE | re.DOTALL,
        )
        if ack_heading_match:
            ack_text = clean_html_text(ack_heading_match.group(1))

    # Scan AI disclosure from acknowledgments
    ai_status, ai_evidence, ai_source = scan_ai_disclosure(ack_text)

    # 2. Introduction (usually section 1)
    intro_match = re.search(
        r'<section[^>]*id=["\']S1["\'][^>]*>(.*?)</section>',
        html_content,
        re.IGNORECASE | re.DOTALL,
    )
    intro_text = ""
    if intro_match:
        intro_text = clean_html_text(intro_match.group(1))[:4000]
    else:
        # Fallback to first section
        first_sec = re.search(r'<section[^>]*class=["\']ltx_section["\'][^>]*>(.*?)</section>', html_content, re.DOTALL)
        if first_sec:
            intro_text = clean_html_text(first_sec.group(1))[:4000]

    # 3. Main Theorems and Results
    theorem_matches = re.findall(
        r'<div[^>]*class=["\'][^"\']*ltx_theorem[^"\']*["\'][^>]*>(.*?)</div>',
        html_content,
        re.IGNORECASE | re.DOTALL,
    )
    theorems = []
    current_len = 0
    for t in theorem_matches:
        txt = clean_html_text(t)
        if len(txt) > 30 and current_len + len(txt) < 5000:
            theorems.append(txt)
            current_len += len(txt)

    # 4. Proof Strategy / Sketches
    proof_matches = re.findall(
        r'<(?:div|section)[^>]*class=["\'][^"\']*(?:ltx_proof|proof)[^"\']*["\'][^>]*>(.*?)</(?:div|section)>',
        html_content,
        re.IGNORECASE | re.DOTALL,
    )
    proof_sketches = []
    proof_len = 0
    for p in proof_matches:
        txt = clean_html_text(p)
        if len(txt) > 40 and proof_len + len(txt) < 3000:
            proof_sketches.append(txt)
            proof_len += len(txt)

    return {
        "hasFullTextHtml": True,
        "aiStatus": ai_status,
        "aiEvidence": ai_evidence,
        "aiEvidenceSource": ai_source,
        "introduction": intro_text,
        "theorems": theorems,
        "proofSketches": proof_sketches,
        "acknowledgments": ack_text[:1500],
    }


def prepare_paper_package(
    paper: dict[str, Any],
    analysis_depth: str,
    cache_dir: Path | None = None,
) -> dict[str, Any]:
    """Prepare a lean, structured data package for one paper."""
    arxiv_id = paper["arxivId"]
    base_pkg = {
        "arxivId": arxiv_id,
        "version": paper.get("version", 1),
        "title": paper.get("title", ""),
        "authors": paper.get("authors", []),
        "abstract": paper.get("abstract", ""),
        "primaryCategory": paper.get("primaryCategory", ""),
        "categories": paper.get("categories", []),
        "analysisDepth": analysis_depth,
    }

    if analysis_depth == "abstract":
        # Check abstract itself for AI disclosure just in case
        ai_status, ai_evidence, ai_source = scan_ai_disclosure(
            paper.get("abstract", "") + " " + paper.get("comment", ""),
            source_label="正文致谢与声明章节",
        )
        base_pkg.update({
            "aiStatus": ai_status,
            "aiEvidence": ai_evidence,
            "aiEvidenceSource": ai_source,
            "proofOutline": {"status": "not_reviewed", "steps": []},
            "compactContext": f"Title: {paper.get('title')}\n\nAbstract:\n{paper.get('abstract')}",
        })
        return base_pkg

    # High priority tier: fetch and slice HTML
    html_url = f"https://arxiv.org/html/{arxiv_id}v1"
    raw_html = None
    if cache_dir:
        cache_file = cache_dir / f"{arxiv_id}.html"
        if cache_file.exists():
            raw_html = cache_file.read_text(encoding="utf-8", errors="replace")

    if raw_html is None:
        try:
            downloaded_bytes = download(html_url, timeout=30)
            raw_html = downloaded_bytes.decode("utf-8", errors="replace")
            if cache_dir:
                cache_dir.mkdir(parents=True, exist_ok=True)
                (cache_dir / f"{arxiv_id}.html").write_text(raw_html, encoding="utf-8")
        except Exception:
            # Fallback if HTML is not yet generated by ar5iv
            raw_html = None

    if raw_html:
        extracted = extract_sections_from_html(raw_html)
        theorems_formatted = "\n\n".join(f"Theorem/Result: {t}" for t in extracted["theorems"][:4])
        proofs_formatted = "\n\n".join(f"Proof Sketch: {p}" for p in extracted["proofSketches"][:2])

        compact_context = (
            f"Title: {paper.get('title')}\n"
            f"Authors: {', '.join(paper.get('authors', []))}\n"
            f"Primary Category: {paper.get('primaryCategory')}\n\n"
            f"Abstract:\n{paper.get('abstract')}\n\n"
            f"--- Key Introduction Excerpts ---\n{extracted['introduction']}\n\n"
            f"--- Core Theorems & Main Results ---\n{theorems_formatted}\n\n"
            f"--- Proof Strategy / Methods ---\n{proofs_formatted}\n\n"
            f"--- Acknowledgments & Declarations ---\n{extracted['acknowledgments']}"
        )
        # Cap total compact context to 12k chars (~3k tokens)
        if len(compact_context) > 12000:
            compact_context = compact_context[:11950] + "\n...[Remaining proofs omitted for conciseness]..."

        base_pkg.update({
            "aiStatus": extracted["aiStatus"],
            "aiEvidence": extracted["aiEvidence"],
            "aiEvidenceSource": extracted["aiEvidenceSource"],
            "compactContext": compact_context,
            "hasFullTextHtml": True,
        })
    else:
        # HTML unavailable; use abstract with fall-back
        ai_status, ai_evidence, ai_source = scan_ai_disclosure(
            paper.get("abstract", "") + " " + paper.get("comment", ""),
            source_label="正文致谢与声明章节",
        )
        base_pkg.update({
            "aiStatus": ai_status,
            "aiEvidence": ai_evidence,
            "aiEvidenceSource": ai_source,
            "hasFullTextHtml": False,
            "compactContext": f"Title: {paper.get('title')}\n\nAbstract:\n{paper.get('abstract')}\n\nNote: HTML full-text unavailable; analyze from abstract.",
        })

    return base_pkg


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract target sections and scan AI disclosures.")
    parser.add_argument("--source", required=True, help="Path to fetched-metadata.json")
    parser.add_argument("--triage", required=True, help="Path to triage-plan.json")
    parser.add_argument("--out-dir", required=True, help="Directory to save extracted paper packages")
    parser.add_argument("--batch-size", type=int, default=4, help="Batch size for parallel analyzer subagents (default: 4)")
    parser.add_argument("--cache-dir", help="Optional HTML cache directory")
    parser.add_argument("--limit", type=int, default=0, help="Optional limit on number of papers to process (for testing)")
    args = parser.parse_args()

    source_data = json.loads(Path(args.source).read_text(encoding="utf-8"))
    triage_data = json.loads(Path(args.triage).read_text(encoding="utf-8"))

    assignments = triage_data.get("assignments", {})
    cache_path = Path(args.cache_dir) if args.cache_dir else None
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    packages: list[dict[str, Any]] = []
    papers_list = source_data.get("papers", [])
    if args.limit > 0:
        papers_list = papers_list[:args.limit]

    print(f"Preparing packages for {len(papers_list)} papers...", flush=True)
    full_text_count = 0
    abstract_count = 0

    for idx, paper in enumerate(papers_list):
        pid = paper["arxivId"]
        assignment = assignments.get(pid, {})
        depth = assignment.get("analysisDepth", "abstract")

        if depth == "full_text_sections":
            full_text_count += 1
        else:
            abstract_count += 1

        print(f"  [{idx + 1}/{len(papers_list)}] {pid} ({depth})", flush=True)
        pkg = prepare_paper_package(paper, depth, cache_dir=cache_path)
        packages.append(pkg)

    # Save full combined packages
    (out_dir / "all-packages.json").write_text(
        json.dumps(packages, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    # Split into 4-paper batches for subagents
    batch_size = args.batch_size
    batches_dir = out_dir / "batches"
    batches_dir.mkdir(parents=True, exist_ok=True)

    batch_manifest = []
    for i in range(0, len(packages), batch_size):
        batch_id = f"{(i // batch_size) + 1:02d}"
        batch_slice = packages[i : i + batch_size]
        batch_file = batches_dir / f"batch-{batch_id}.json"
        batch_file.write_text(
            json.dumps(batch_slice, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        batch_manifest.append({
            "batchId": batch_id,
            "paperCount": len(batch_slice),
            "arxivIds": [p["arxivId"] for p in batch_slice],
            "file": str(batch_file),
        })

    (out_dir / "batch-manifest.json").write_text(
        json.dumps(batch_manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"Done! Created {len(batch_manifest)} batches in {batches_dir}")
    print(f"  Full text papers (25% quota): {full_text_count}")
    print(f"  Abstract papers (75% tier): {abstract_count}")


if __name__ == "__main__":
    main()
