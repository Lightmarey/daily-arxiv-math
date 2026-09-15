#!/usr/bin/env python3
"""Verify configured production read contracts and optional official counts."""
from __future__ import annotations
import argparse, json, urllib.error, urllib.parse, urllib.request
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from arxiv_listing import _download, listing_date, parse_listing

USER_AGENT = "ConfigurableArxivBriefHealth/3.0"
@dataclass(frozen=True)
class ExpectedAnnouncement: date: str; counts: dict[str, int]
def _request(url: str, *, method: str = "GET", body: bytes | None = None): return urllib.request.urlopen(urllib.request.Request(url, data=body, method=method, headers={"User-Agent": USER_AGENT, "Content-Type": "application/json"}), timeout=90)
def _json(url: str) -> tuple[int, dict]:
    try:
        with _request(url) as response: return response.status, json.loads(response.read())
    except urllib.error.HTTPError as error:
        try: payload = json.loads(error.read())
        except (json.JSONDecodeError, UnicodeDecodeError): payload = {}
        return error.code, payload
def official_announcement(categories: list[str]) -> ExpectedAnnouncement:
    values = {}
    for category in categories:
        document = _download(f"https://arxiv.org/list/{category}/new"); day = listing_date(document)
        if not day: raise RuntimeError(f"Could not determine current {category} announcement date")
        values[category] = (day, parse_listing(document).publication_count)
    dates = {item[0] for item in values.values()}
    if len(dates) != 1: raise RuntimeError("Configured categories disagree on current announcement date")
    return ExpectedAnnouncement(dates.pop(), {key: item[1] for key, item in values.items()})
def fetch_categories_from_health(health: dict) -> list[str]: return [item["categoryId"] for item in health.get("categories", []) if item.get("categoryId")]
def checked_outcome(path: str, scheduled_for: str) -> dict:
    outcome = json.loads(Path(path).read_text(encoding="utf-8"))
    expected_time = datetime.fromisoformat(scheduled_for.replace("Z", "+00:00"))
    actual_time = datetime.fromisoformat(outcome.get("scheduledFor", "").replace("Z", "+00:00"))
    if expected_time != actual_time: raise RuntimeError("Daily outcome belongs to a different scheduled run")
    if outcome.get("status") not in {"success", "no_new"}: raise RuntimeError(f"Daily run is {outcome.get('status', 'missing')}")
    if outcome.get("status") in {"success", "no_new"} and (not outcome.get("announcementDate") or outcome.get("expectedCount") is None or outcome.get("expectedCount") != outcome.get("publishedCount")): raise RuntimeError("Daily outcome lacks a complete verified announcement")
    if outcome.get("status") == "success" and not outcome.get("ingestVerified"): raise RuntimeError("Daily success lacks ingest verification")
    return outcome
def verify_payloads(config: dict, health: dict, reports: dict, volume: dict, expected: ExpectedAnnouncement | None = None, health_volume: dict | None = None) -> list[str]:
    errors = []; fetch_categories = fetch_categories_from_health(health); display_categories = config.get("displayCategories", [])
    if health_volume is None and fetch_categories == display_categories: health_volume = volume
    if health.get("status") != "ok": errors.append("health endpoint is degraded")
    health_by_category = {item.get("categoryId"): item for item in health.get("categories", [])}
    for category in fetch_categories:
        item = health_by_category.get(category)
        if not item or not item.get("complete") or len({int(item.get(key, -index)) for index, key in enumerate(("expectedCount", "publishedCount", "databasePublicationCount"), 1)}) != 1: errors.append(f"coverage mismatch for {category}")
    feed_coverage = {item.get("categoryId"): item for item in reports.get("coverage", [])}
    for category in display_categories:
        item = feed_coverage.get(category)
        if not item: errors.append(f"report feed missing coverage for {category}")
        elif item.get("status") == "not_collected" and not item.get("requiredForCompletion"): continue
        elif item.get("status") != "complete" or not item.get("complete"): errors.append(f"report feed incomplete for {category}")
    weeks = [week for week in volume.get("weeks", []) if week.get("complete")]
    health_weeks = [week for week in (health_volume or {}).get("weeks", []) if week.get("complete")]
    if health.get("latestCompleteWeek") and (not health_weeks or health_weeks[-1] != health["latestCompleteWeek"]): errors.append("health and fetch-volume latest complete weeks do not agree")
    if weeks:
        latest = weeks[-1]; daily = [point for point in volume.get("points", []) if latest["weekStart"] <= point.get("announcementDate", "") <= latest["weekEnding"]]
        for category in display_categories:
            values = [point.get("counts", {}).get(category) for point in daily]
            if any(value is None for value in values) or sum(values) != latest.get("counts", {}).get(category): errors.append(f"weekly {category} total does not equal confirmed daily sum")
    if expected:
        point = next((item for item in (health_volume or volume).get("points", []) if item.get("announcementDate") == expected.date), None)
        if not point: errors.append("official announcement day is missing from volume data")
        elif any(point.get("counts", {}).get(key) != value for key, value in expected.counts.items()): errors.append("daily category totals do not match official listings")
    return errors
def main() -> None:
    parser = argparse.ArgumentParser(); parser.add_argument("--site", required=True); parser.add_argument("--check-arxiv", action="store_true"); parser.add_argument("--daily-outcome"); parser.add_argument("--scheduled-for"); args = parser.parse_args(); site = args.site.rstrip("/")
    if bool(args.daily_outcome) != bool(args.scheduled_for): raise RuntimeError("daily-outcome and scheduled-for must be supplied together")
    outcome = checked_outcome(args.daily_outcome, args.scheduled_for) if args.daily_outcome else None
    with _request(f"{site}/") as homepage:
        if homepage.status != 200: raise RuntimeError(f"Homepage returned {homepage.status}")
    config_status, config = _json(f"{site}/api/config"); health_status, health = _json(f"{site}/api/health"); categories = config.get("displayCategories", []); fetch_categories = fetch_categories_from_health(health); query = urllib.parse.quote(",".join(categories)); reports_status, reports = _json(f"{site}/api/reports?categories={query}"); volume_status, volume = _json(f"{site}/api/volume?range=6m&categories={query}")
    if fetch_categories == categories: health_volume_status, health_volume = volume_status, volume
    elif fetch_categories:
        fetch_query = urllib.parse.quote(",".join(fetch_categories)); health_volume_status, health_volume = _json(f"{site}/api/volume?range=6m&categories={fetch_query}")
    else: health_volume_status, health_volume = 200, {"points": [], "weeks": []}
    if (config_status, health_status, reports_status, volume_status, health_volume_status) != (200, 200, 200, 200, 200): raise RuntimeError(f"Core endpoint status mismatch: config={config_status} health={health_status} reports={reports_status} volume={volume_status} fetch_volume={health_volume_status}")
    unauthorized, _ = _json(f"{site}/api/ingest/state")
    if unauthorized != 401: raise RuntimeError("Protected ingest state accepted anonymous request")
    expected = official_announcement(fetch_categories) if args.check_arxiv and fetch_categories else None; errors = verify_payloads(config, health, reports, volume, expected, health_volume)
    if errors: raise RuntimeError("; ".join(errors))
    print(json.dumps({"status": "ok", "categories": categories, "date": reports.get("date"), "dailyRunStatus": outcome["status"] if outcome else "not_checked"}, ensure_ascii=False))
if __name__ == "__main__": main()
