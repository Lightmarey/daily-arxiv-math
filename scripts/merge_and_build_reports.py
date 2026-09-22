#!/usr/bin/env python3
"""Merge batch analysis parts and build complete ReportBatchV3 for 2026-09-21."""
from __future__ import annotations
import json
import os
import subprocess
import sys
from pathlib import Path

def main():
    date_str = sys.argv[1] if len(sys.argv) > 1 else "2026-09-21"
    run_dir = Path(f".automation/static-runs/{date_str}")
    parts_dir = run_dir / "analysis-parts"
    
    listing = json.loads((run_dir / "listing.json").read_text(encoding="utf-8"))
    metadata = json.loads((run_dir / "metadata.json").read_text(encoding="utf-8"))
    
    ap_expected = set(listing["manifests"]["math.AP"]["expectedIds"])
    dg_expected = set(listing["manifests"]["math.DG"]["expectedIds"])
    all_expected = ap_expected | dg_expected
    
    print(f"Expected IDs: math.AP={len(ap_expected)}, math.DG={len(dg_expected)}, Union={len(all_expected)}")
    
    all_analyses = {}
    for p in sorted(parts_dir.glob("batch-*.json")):
        try:
            batch_data = json.loads(p.read_text(encoding="utf-8"))
            for aid, item in batch_data.items():
                if aid in all_analyses:
                    print(f"Warning: Duplicate analysis for {aid} in {p.name}")
                all_analyses[aid] = item
        except Exception as e:
            print(f"Error reading {p.name}: {e}")
            
    print(f"Loaded {len(all_analyses)} unique analyses from parts.")
    
    missing = all_expected - all_analyses.keys()
    if missing:
        print(f"Missing analyses for {len(missing)} IDs: {sorted(missing)}")
        return 1
        
    (run_dir / "analyses-all.json").write_text(
        json.dumps(all_analyses, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8"
    )
    
    # Construct analyses-by-category.json
    by_category = {
        "math.AP": {},
        "math.DG": {}
    }
    
    for aid in ap_expected:
        item = dict(all_analyses[aid])
        item["topicId"] = item["topicIds"]["math.AP"]
        by_category["math.AP"][aid] = item
        
    for aid in dg_expected:
        item = dict(all_analyses[aid])
        item["topicId"] = item["topicIds"]["math.DG"]
        by_category["math.DG"][aid] = item
        
    (run_dir / "analyses-by-category.json").write_text(
        json.dumps(by_category, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8"
    )
    print(f"Generated analyses-all.json and analyses-by-category.json (AP={len(by_category['math.AP'])}, DG={len(by_category['math.DG'])})")
    
    # Score distribution check
    scores = [item["priorityScore"] for item in all_analyses.values()]
    high_scores = [s for s in scores if s >= 75]
    low_scores = [s for s in scores if s < 50]
    very_high = [s for s in scores if s >= 90]
    import statistics
    median_score = statistics.median(scores)
    print(f"Score Distribution ({len(scores)} papers):")
    print(f"  >= 75 (High): {len(high_scores)} ({len(high_scores)/len(scores)*100:.1f}%) [rule: <= 35%]")
    print(f"  < 50 (Low): {len(low_scores)} ({len(low_scores)/len(scores)*100:.1f}%) [rule: >= 10%]")
    print(f"  >= 90 (Very High): {len(very_high)} ({len(very_high)/len(scores)*100:.1f}%) [rule: <= 5%]")
    print(f"  Median: {median_score} [rule: <= 72]")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
