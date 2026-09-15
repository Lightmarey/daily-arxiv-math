#!/usr/bin/env python3
"""Build exact volume history from official category catchup pages only."""
from __future__ import annotations
import argparse, json
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from arxiv_listing import fetch_listing
from tracking_config import category_config, config_version, load_config

def point_from_events(day: date, events) -> dict: return {"announcementDate": day.isoformat(), "count": events.publication_count}
def exact_points(category_id: str, start: date, end: date) -> list[dict]:
    points = []; day = start
    while day <= end:
        if day.weekday() >= 5:
            day += timedelta(days=1)
            continue
        try: events, _source = fetch_listing(category_id, day.isoformat())
        except RuntimeError as error: print(f"Missing {category_id} {day}: {error}")
        else: points.append(point_from_events(day, events)); print(f"Exact {category_id} {day}: {points[-1]['count']}")
        day += timedelta(days=1)
    return points
def build_history(category_id: str, start: date, end: date, config: dict, now: str | None = None) -> dict:
    category_config(config, category_id)
    if category_id not in config["fetchCategories"]: raise ValueError(f"{category_id} is not enabled for fetching")
    return {"schemaVersion": 2, "configVersion": config_version(config), "categoryId": category_id, "generatedAt": now or datetime.now(timezone.utc).isoformat(), "source": f"arXiv official {category_id} catchup pages: New submissions + Cross-lists; Replacements excluded", "points": exact_points(category_id, start, end)}
def main() -> None:
    parser = argparse.ArgumentParser(); parser.add_argument("--out", required=True); parser.add_argument("--category", required=True); parser.add_argument("--config"); parser.add_argument("--start", required=True); parser.add_argument("--end", required=True); args = parser.parse_args()
    payload = build_history(args.category, date.fromisoformat(args.start), date.fromisoformat(args.end), load_config(args.config))
    if not payload["points"]: raise RuntimeError("No authoritative announcement days were found; missing days were not fabricated as zero")
    Path(args.out).write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"); print(f"Built {len(payload['points'])} exact {args.category} points")
if __name__ == "__main__": main()
