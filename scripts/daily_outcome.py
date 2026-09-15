#!/usr/bin/env python3
"""Persist one scheduled local-daily outcome for a later health check."""
from __future__ import annotations

import argparse
import json
import os
from datetime import datetime, timezone
from pathlib import Path


def _write(path: Path, value: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(".tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    os.replace(temporary, path)


def _read(path: Path) -> dict | None:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return None


def _scheduled(value: str) -> datetime:
    moment = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if moment.tzinfo is None:
        raise ValueError("scheduled-for must include a timezone")
    return moment


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--scheduled-for", required=True)
    parser.add_argument("--status", required=True, choices=("running", "success", "no_new", "failed", "blocked"))
    parser.add_argument("--announcement-date")
    parser.add_argument("--expected-count", type=int)
    parser.add_argument("--published-count", type=int)
    parser.add_argument("--ingest-verified", action="store_true")
    parser.add_argument("--message")
    parser.add_argument("--root", default=".automation/daily-outcomes")
    args = parser.parse_args()
    scheduled = _scheduled(args.scheduled_for)
    complete = args.status in {"success", "no_new"}
    if complete and (not args.announcement_date or args.expected_count is None or args.published_count is None or args.expected_count != args.published_count):
        raise ValueError("complete outcomes require an announcement date and matching expected/published counts")
    if args.status == "success" and not args.ingest_verified:
        raise ValueError("success requires ingest verification")
    now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    root = Path(args.root)
    history = root / "history" / f"{args.run_id}.json"
    previous = _read(history)
    if previous and previous.get("scheduledFor") != scheduled.isoformat():
        raise ValueError("run-id already belongs to a different scheduled slot")
    value = {
        "schemaVersion": 1,
        "runId": args.run_id,
        "scheduledFor": scheduled.isoformat(),
        "scheduledDate": scheduled.date().isoformat(),
        "status": args.status,
        "announcementDate": args.announcement_date,
        "expectedCount": args.expected_count,
        "publishedCount": args.published_count,
        "ingestVerified": args.ingest_verified,
        "startedAt": previous.get("startedAt", now) if previous else now,
        "completedAt": None if args.status == "running" else now,
        "message": args.message,
    }
    _write(history, value)
    _write(root / f"{value['scheduledDate']}.json", value)
    print(json.dumps({key: value[key] for key in ("runId", "status", "scheduledDate", "announcementDate")}, ensure_ascii=False))


if __name__ == "__main__":
    main()
