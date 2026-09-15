#!/usr/bin/env python3
"""Fill static trend gaps from arXiv's category-level OAI metadata batches."""
from __future__ import annotations

import argparse
import http.client
import json
import time
import urllib.parse
import xml.etree.ElementTree as ET
from collections import Counter
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

from arxiv_http import USER_AGENT, _defer, _reserve_request, _retry_after
from tracking_config import category_config, load_config

OAI = "https://oaipmh.arxiv.org/oai"
NS = {
    "oai": "http://www.openarchives.org/OAI/2.0/",
    "arxiv": "http://arxiv.org/OAI/arXiv/",
}


def category_set(category_id: str) -> str:
    archive, subject = category_id.split(".", 1)
    return f"{archive}:{archive}:{subject}"


def download_oai(url: str, timeout: int = 120) -> bytes:
    last_error: Exception | None = None
    for attempt in range(3):
        _reserve_request()
        connection: http.client.HTTPSConnection | None = None
        try:
            parsed = urllib.parse.urlsplit(url)
            connection = http.client.HTTPSConnection(parsed.hostname, parsed.port, timeout=timeout)
            connection.request(
                "GET",
                urllib.parse.urlunsplit(("", "", parsed.path, parsed.query, "")),
                headers={
                    "User-Agent": USER_AGENT,
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate, br, zstd",
                    "Connection": "keep-alive",
                },
            )
            response = connection.getresponse()
            document = response.read()
            if response.status == 429:
                _defer(_retry_after(response.headers))
            elif response.status < 500:
                if response.status >= 400:
                    raise RuntimeError(f"arXiv OAI request failed with HTTP {response.status}")
                return document
            last_error = RuntimeError(f"HTTP {response.status}")
        except (OSError, TimeoutError) as error:
            last_error = error
        finally:
            if connection is not None:
                connection.close()
        if attempt < 2:
            time.sleep(1)
    raise RuntimeError(f"arXiv OAI request failed after three attempts: {last_error}")


def parse_page(document: bytes, category_id: str, start: date, end: date) -> tuple[Counter[str], str | None]:
    root = ET.fromstring(document)
    error = root.find("oai:error", NS)
    if error is not None:
        raise RuntimeError(f"arXiv OAI error {error.attrib.get('code', 'unknown')}: {(error.text or '').strip()}")
    counts: Counter[str] = Counter()
    for record in root.findall(".//oai:record", NS):
        metadata = record.find("oai:metadata/arxiv:arXiv", NS)
        if metadata is None:
            continue
        categories = (metadata.findtext("arxiv:categories", namespaces=NS) or "").split()
        created_text = metadata.findtext("arxiv:created", namespaces=NS)
        if category_id not in categories or not created_text:
            continue
        created = date.fromisoformat(created_text)
        if start <= created <= end:
            counts[created_text] += 1
    token = root.findtext(".//oai:resumptionToken", namespaces=NS)
    return counts, token.strip() if token and token.strip() else None


def fetch_category_counts(category_id: str, start: date, end: date) -> Counter[str]:
    params = {
        "verb": "ListRecords",
        "metadataPrefix": "arXiv",
        "from": start.isoformat(),
        "until": end.isoformat(),
        "set": category_set(category_id),
    }
    counts: Counter[str] = Counter()
    page = 0
    while True:
        page += 1
        document = download_oai(f"{OAI}?{urllib.parse.urlencode(params)}")
        page_counts, token = parse_page(document, category_id, start, end)
        counts.update(page_counts)
        print(f"{category_id}: metadata batch {page}, {sum(page_counts.values())} matching records")
        if not token:
            return counts
        params = {"verb": "ListRecords", "resumptionToken": token}


def iso_week_bounds(value: str) -> tuple[str, str]:
    day = date.fromisoformat(value)
    monday = day - timedelta(days=day.isoweekday() - 1)
    return monday.isoformat(), (monday + timedelta(days=4)).isoformat()


def aggregate_weekly(points: list[dict], categories: list[str]) -> list[dict]:
    if not points:
        return []
    latest = max(point["announcementDate"] for point in points)
    weeks: dict[str, dict] = {}
    dates_by_week: dict[str, set[str]] = {}
    for point in sorted(points, key=lambda item: item["announcementDate"]):
        week_start, week_ending = iso_week_bounds(point["announcementDate"])
        if week_ending > latest:
            continue
        week = weeks.setdefault(week_ending, {
            "weekStart": week_start,
            "weekEnding": week_ending,
            "counts": {category: 0 for category in categories},
            "complete": True,
        })
        dates_by_week.setdefault(week_ending, set()).add(point["announcementDate"])
        for category in categories:
            value = point["counts"].get(category)
            if value is None:
                week["counts"][category] = None
                week["complete"] = False
            elif week["counts"][category] is not None:
                week["counts"][category] += value
    for week in weeks.values():
        expected = date.fromisoformat(week["weekStart"])
        dates = dates_by_week[week["weekEnding"]]
        if any((expected + timedelta(days=offset)).isoformat() not in dates for offset in range(5)):
            week["complete"] = False
    return [weeks[key] for key in sorted(weeks)]


def merge_volume(existing: dict, category_counts: dict[str, Counter[str]], categories: list[str], start: date, end: date, now: str | None = None) -> dict:
    exact = {
        point["announcementDate"]: point.get("counts", {})
        for point in existing.get("points", [])
    }
    points = []
    day = start
    while day <= end:
        day_text = day.isoformat()
        counts = {}
        for category in categories:
            preserved = exact.get(day_text, {}).get(category)
            counts[category] = preserved if type(preserved) is int else category_counts[category][day_text]
        points.append({"announcementDate": day_text, "counts": counts})
        day += timedelta(days=1)
    weeks = aggregate_weekly(points, categories)
    return {
        "schemaVersion": 2,
        "methodology": {
            "generatedAt": now or datetime.now(timezone.utc).isoformat(),
            "startDate": start.isoformat(),
            "endDate": end.isoformat(),
            "source": "arXiv OAI category metadata",
            "metric": "current category membership grouped by first submission date; existing exact announcement counts preserved",
            "paperBodiesFetched": False,
        },
        "points": points,
        "weeks26": weeks[-26:],
        "weeks104": weeks[-104:],
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--volume", required=True)
    parser.add_argument("--config")
    parser.add_argument("--start", required=True)
    parser.add_argument("--end", required=True)
    args = parser.parse_args()
    start, end = date.fromisoformat(args.start), date.fromisoformat(args.end)
    if start > end:
        raise ValueError("--start must not be after --end")
    config = load_config(args.config)
    categories = config["displayCategories"]
    for category in categories:
        category_config(config, category)
    path = Path(args.volume)
    existing = json.loads(path.read_text(encoding="utf-8"))
    counts = {category: fetch_category_counts(category, start, end) for category in categories}
    volume = merge_volume(existing, counts, categories, start, end)
    path.write_text(json.dumps(volume, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(volume['points'])} days and {len(volume['weeks104'])} weeks to {path}")


if __name__ == "__main__":
    main()
