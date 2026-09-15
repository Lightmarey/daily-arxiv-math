#!/usr/bin/env python3
"""Publish V3 payloads once, then verify their public result before retrying."""
from __future__ import annotations

import argparse
import json
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path

from local_lock import LockUnavailable, exclusive_lock


def _opener(site: str):
    hostname = urllib.parse.urlsplit(site).hostname
    return urllib.request.build_opener(urllib.request.ProxyHandler({})) if hostname in {"localhost", "127.0.0.1", "::1"} else urllib.request.build_opener()


def _feed(site: str, batch: dict, opener) -> dict:
    query = urllib.parse.urlencode({"date": batch["announcementDay"]["date"], "categories": batch["categoryId"]})
    with opener.open(urllib.request.Request(f"{site}/api/reports?{query}"), timeout=60) as response:
        return json.loads(response.read())


def batch_is_visible(feed: dict, batch: dict) -> bool:
    coverage = next((item for item in feed.get("coverage", []) if item.get("categoryId") == batch["categoryId"]), {})
    reports = {(item.get("arxivId"), item.get("version")): item for item in feed.get("reports", []) if item.get("categoryId") == batch["categoryId"] and item.get("entryKind") != "revision"}
    expected = [item for item in batch["reports"] if item.get("entryKind") != "revision"]
    return feed.get("date") == batch["announcementDay"]["date"] and coverage.get("complete") and coverage.get("expectedCount") == batch["run"]["expectedCount"] and coverage.get("publishedCount") == len(expected) and len(reports) == len(expected) and all(reports.get((item["arxivId"], item["version"])) and all(reports[(item["arxivId"], item["version"])].get(key) == value for key, value in item.items()) for item in expected)


def _newer(feed: dict, batch: dict) -> bool:
    coverage = next((item for item in feed.get("coverage", []) if item.get("categoryId") == batch["categoryId"]), {})
    completed = coverage.get("completedAt")
    return bool(completed) and datetime.fromisoformat(completed.replace("Z", "+00:00")) > datetime.fromisoformat(batch["run"]["completedAt"].replace("Z", "+00:00"))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("payload")
    parser.add_argument("--endpoint", choices=("report-v3", "volume-history"), default="report-v3")
    parser.add_argument("--site-file", default=".automation/site-url")
    parser.add_argument("--token-file", default=".automation/ingest-token")
    args = parser.parse_args()
    site_file = Path(args.site_file)
    site = site_file.read_text(encoding="utf-8").strip().rstrip("/")
    body = Path(args.payload).read_bytes()
    batch = json.loads(body)
    opener = _opener(site)
    try:
        with exclusive_lock(site_file.parent / "daily-write.lock", blocking=False):
            if args.endpoint == "report-v3":
                before = _feed(site, batch, opener)
                if batch_is_visible(before, batch):
                    print(json.dumps({"status": "already_verified", "runId": batch["run"]["runId"]}, ensure_ascii=False))
                    return
                if _newer(before, batch):
                    raise RuntimeError("A newer batch exists; refusing to replay this run")
            token = Path(args.token_file).read_text(encoding="utf-8").strip()
            path = {"report-v3": "/api/ingest/v3", "volume-history": "/api/ingest/volume-history"}[args.endpoint]
            request = urllib.request.Request(f"{site}{path}", data=body, method="POST", headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json", "User-Agent": "ConfigurableArxivBrief/3.0"})
            try:
                with opener.open(request, timeout=120) as response:
                    result = json.loads(response.read())
            except urllib.error.HTTPError as error:
                raise RuntimeError(f"Publish failed with HTTP {error.code}") from error
            except (urllib.error.URLError, TimeoutError, OSError):
                if args.endpoint != "report-v3" or not batch_is_visible(_feed(site, batch, opener), batch):
                    raise RuntimeError("Write result is uncertain; retain the exact payload before retrying") from None
                result = {"status": "verified_after_uncertain_response", "runId": batch["run"]["runId"]}
            if args.endpoint == "report-v3" and not batch_is_visible(_feed(site, batch, opener), batch):
                raise RuntimeError("Write returned but the complete V3 batch is not visible")
    except LockUnavailable:
        raise RuntimeError("An update is already running; do not start a second writer") from None
    print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    main()
