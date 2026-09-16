#!/usr/bin/env python3
"""Assemble one complete per-category ReportBatchV3."""
from __future__ import annotations
import argparse, json, os, re
from datetime import datetime, timezone
from pathlib import Path
from tracking_config import category_config, config_version, load_config

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
        delimiter = next((pair for pair in (("$$", "$$"), ("$", "$"), (r"\(", r"\)"), (r"\[", r"\]")) if text.startswith(pair[0], index)), None)
        if not delimiter:
            output.append(text[index]); index += 1; continue
        start, end = delimiter
        closing = text.find(end, index + len(start))
        if closing < 0: raise ValueError("unbalanced math delimiters")
        index = closing + len(end)
    return "".join(output)

def _validate_analysis_text(arxiv_id: str, analysis: dict) -> None:
    values = [analysis.get(key, "") for key in ("workSummary", "breakthrough", "limitations", "priorityReason", "lowPriorityReason")]
    values.extend(analysis.get("techniques", []))
    for step in analysis.get("proofOutline", {}).get("steps", []):
        values.extend(step.get(key, "") for key in ("claim", "route", "evidence"))
    text = "\n".join(str(value) for value in values if value)
    phrase = next((item for item in FORBIDDEN_ANALYSIS_PHRASES if item in text), None)
    if phrase: raise ValueError(f"Analysis {arxiv_id} contains forbidden display prose: {phrase}")
    try: outside_math = _outside_math(text)
    except ValueError as error: raise ValueError(f"Analysis {arxiv_id} has unbalanced math delimiters") from error
    if BARE_MATH_PATTERN.search(outside_math):
        raise ValueError(f"Analysis {arxiv_id} contains math outside LaTeX delimiters")

def _validate_analysis_quality(arxiv_id: str, analysis: dict) -> None:
    minimum_lengths = {
        "workSummary": 140,
        "breakthrough": 90,
        "limitations": 90,
        "priorityReason": 50,
    }
    for field, minimum in minimum_lengths.items():
        value = str(analysis.get(field, "")).strip()
        if len(value) < minimum:
            raise ValueError(f"Analysis {arxiv_id} has shallow {field}: minimum {minimum} characters")
    techniques = analysis.get("techniques", [])
    if len(techniques) < 3 or any(len(str(item).strip()) < 20 for item in techniques):
        raise ValueError(f"Analysis {arxiv_id} needs at least three paper-specific techniques")
    outline = analysis.get("proofOutline", {"status": "not_reviewed", "steps": []})
    if outline.get("status") == "reviewed":
        steps = outline.get("steps", [])
        if not 2 <= len(steps) <= 6:
            raise ValueError(f"Analysis {arxiv_id} needs 2-6 reviewed proof steps")
        for index, step in enumerate(steps):
            if len(str(step.get("claim", "")).strip()) < 24:
                raise ValueError(f"Analysis {arxiv_id} proof step {index + 1} has a shallow claim")
            if len(str(step.get("route", "")).strip()) < 80:
                raise ValueError(f"Analysis {arxiv_id} proof step {index + 1} has a shallow route")
            if len(str(step.get("evidence", "")).strip()) < 8:
                raise ValueError(f"Analysis {arxiv_id} proof step {index + 1} has a shallow evidence locator")

def build_batch(source: dict, analyses: dict, category_id: str, source_cursor: str, config: dict, now: str | None = None, run_id: str | None = None, scheduled_for: str | None = None, started_at: str | None = None) -> dict:
    version = config_version(config)
    if source.get("configVersion") != version: raise ValueError("Source configVersion is stale")
    category = category_config(config, category_id); manifest = source["manifests"].get(category_id)
    if not manifest: raise ValueError(f"Source has no manifest for {category_id}")
    category_analyses = analyses.get(category_id, analyses)
    papers = {paper["arxivId"]: paper for paper in source["papers"] if paper["arxivId"] in set(manifest["expectedIds"])}
    expected = set(manifest["expectedIds"]); missing_metadata = sorted(expected - papers.keys()); missing_analysis = sorted(expected - category_analyses.keys()); extra = sorted(set(category_analyses) - expected)
    if missing_metadata or missing_analysis or extra: raise ValueError(f"Coverage mismatch: metadata={missing_metadata or 'none'}, analysis={missing_analysis or 'none'}, extra={extra or 'none'}")
    topic_labels = {topic["id"]: topic["label"] for topic in category["topics"]}; new_ids = set(manifest["sourceManifest"]["newIds"]); reports = []
    for arxiv_id in manifest["expectedIds"]:
        paper, analysis = papers[arxiv_id], category_analyses[arxiv_id]; topic_id = analysis["topicId"]
        _validate_analysis_text(arxiv_id, analysis)
        _validate_analysis_quality(arxiv_id, analysis)
        if topic_id not in topic_labels: raise ValueError(f"Unknown topicId {topic_id} for {category_id}")
        score = int(analysis["priorityScore"]); tier = "high" if score >= 75 else "medium" if score >= 50 else "low"
        report = {"categoryId": category_id, "announcementDate": source["announcementDate"], "arxivId": arxiv_id, "version": paper["version"], "entryKind": "new" if arxiv_id in new_ids else "cross_list", "title": paper["title"], "authors": paper["authors"], "abstract": paper["abstract"], "categories": paper["categories"], "primaryCategory": paper["primaryCategory"], "arxivUrl": paper["arxivUrl"], "pdfUrl": paper["pdfUrl"], "submittedAt": paper["submittedAt"], "updatedAt": paper["updatedAt"], "topicId": topic_id, "topicLabel": topic_labels[topic_id], "progressType": analysis["progressType"], "workSummary": analysis["workSummary"], "techniques": analysis["techniques"], "breakthrough": analysis["breakthrough"], "limitations": analysis["limitations"], "analysisDepth": analysis.get("analysisDepth", "abstract"), "proofOutline": analysis.get("proofOutline", {"status": "not_reviewed", "steps": []}), "aiStatus": analysis.get("aiStatus", "not_checked"), "aiEvidence": analysis.get("aiEvidence"), "aiEvidenceSource": analysis.get("aiEvidenceSource"), "priorityScore": score, "priorityTier": tier, "priorityReason": analysis.get("priorityReason", f"按相关性、新颖性、技术复用性、潜在影响与证据清晰度综合评分为 {score}/100。"), "lowPriorityReason": analysis.get("lowPriorityReason"), "revisionSummary": analysis.get("revisionSummary")}
        if tier == "low" and not report["lowPriorityReason"]: raise ValueError(f"Low-priority report {arxiv_id} needs lowPriorityReason")
        reports.append(report)
    reports.sort(key=lambda item: item["priorityScore"], reverse=True); completed_at = now or datetime.now(timezone.utc).isoformat(); run_id = run_id or f"complete-{source['announcementDate']}-{completed_at.replace(':', '')}"; scheduled_for = scheduled_for or completed_at; started_at = started_at or scheduled_for
    return {"schemaVersion": 3, "configVersion": version, "categoryId": category_id, "run": {"runId": run_id, "scheduledFor": scheduled_for, "startedAt": started_at, "completedAt": completed_at, "sourceCursor": source_cursor, "expectedCount": manifest["expectedCount"]}, "announcementDay": {"date": source["announcementDate"], "status": "announced", "source": manifest["source"]}, "sourceManifest": manifest["sourceManifest"], "dailyVolume": manifest["dailyVolume"], "reports": reports}

def main() -> None:
    parser = argparse.ArgumentParser(); parser.add_argument("source"); parser.add_argument("analyses"); parser.add_argument("--category", required=True); parser.add_argument("--source-cursor", required=True); parser.add_argument("--config"); parser.add_argument("--out", required=True); parser.add_argument("--run-id", default=os.environ.get("ARXIV_RUN_ID")); parser.add_argument("--scheduled-for", default=os.environ.get("ARXIV_SCHEDULED_FOR")); parser.add_argument("--started-at"); args = parser.parse_args()
    if not args.run_id or not args.scheduled_for: parser.error("--run-id and --scheduled-for are required")
    payload = build_batch(json.loads(Path(args.source).read_text(encoding="utf-8")), json.loads(Path(args.analyses).read_text(encoding="utf-8")), args.category, args.source_cursor, load_config(args.config), run_id=args.run_id, scheduled_for=args.scheduled_for, started_at=args.started_at)
    Path(args.out).write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"); print(f"Built complete V3 batch for {args.category} with {len(payload['reports'])} reports")
if __name__ == "__main__": main()
