#!/usr/bin/env python3
"""Read official arXiv new/catchup pages into per-category event manifests."""
from __future__ import annotations
import argparse, html, json, re
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from arxiv_http import download
from tracking_config import config_version, load_config

SECTION_RE = re.compile(r"<h3[^>]*>(?P<title>.*?)</h3>(?P<body>.*?)(?=<h3[^>]*>|$)", re.I | re.S)
ID_RE = re.compile(r'href\s*=\s*["\']/abs/([^"\'?#]+)', re.I)
TAG_RE = re.compile(r"<[^>]+>")

@dataclass(frozen=True)
class ListingEvents:
    new_ids: tuple[str, ...]; cross_list_ids: tuple[str, ...]; replacement_ids: tuple[str, ...]; has_publication_sections: bool = False
    @property
    def publication_count(self) -> int: return len(self.new_ids) + len(self.cross_list_ids)

def _unique(values: list[str]) -> tuple[str, ...]: return tuple(dict.fromkeys(values))
def _base_id(value: str) -> str: return re.sub(r"v\d+$", "", value.strip())

def parse_listing(document: str) -> ListingEvents:
    groups: dict[str, list[str]] = {"new": [], "cross": [], "replacement": []}; found = False
    for match in SECTION_RE.finditer(document):
        title = " ".join(html.unescape(TAG_RE.sub(" ", match.group("title"))).split()).lower()
        if title.startswith("new submissions"): key = "new"; found = True
        elif title.startswith(("cross submissions", "cross-lists")): key = "cross"; found = True
        elif title.startswith(("replacements", "replacement submissions")): key = "replacement"
        else: continue
        groups[key].extend(_base_id(value) for value in ID_RE.findall(match.group("body")))
    return ListingEvents(_unique(groups["new"]), _unique(groups["cross"]), _unique(groups["replacement"]), found)

def listing_date(document: str) -> str | None:
    match = re.search(r"Showing new listings for\s+(?:<[^>]+>)*([^<\n]+)", document, re.I)
    if not match: return None
    try: return datetime.strptime(html.unescape(match.group(1)).strip(), "%A, %d %B %Y").date().isoformat()
    except ValueError: return None

def _download(url: str) -> str: return download(url).decode("utf-8", errors="replace")

def fetch_listing(category: str, announcement_date: str) -> tuple[ListingEvents, str]:
    catchup_url = f"https://arxiv.org/catchup/{category}/{announcement_date}"
    document = _download(catchup_url); events = parse_listing(document)
    if events.has_publication_sections: return events, catchup_url
    new_url = f"https://arxiv.org/list/{category}/new"; document = _download(new_url); events = parse_listing(document)
    if listing_date(document) == announcement_date and events.has_publication_sections: return events, new_url
    raise RuntimeError(f"No authoritative New/Cross-list sections found for {category} on {announcement_date}")

def build_manifest(announcement_date: str, categories: list[str] | None = None, config_path: str | None = None) -> dict:
    config = load_config(config_path); selected = categories if categories is not None else config["fetchCategories"]
    unknown = set(selected) - set(config["fetchCategories"])
    if unknown: raise ValueError(f"Categories are not enabled for fetching: {sorted(unknown)}")
    manifests = {}; failures = {}
    for category in selected:
        try: events, source = fetch_listing(category, announcement_date)
        except RuntimeError as error:
            failures[category] = str(error)
        else:
            ids = list(events.new_ids + events.cross_list_ids)
            manifests[category] = {"source": source, "sourceManifest": {"newIds": list(events.new_ids), "crossListIds": list(events.cross_list_ids)}, "dailyVolume": {"announcementDate": announcement_date, "count": len(ids)}, "expectedIds": ids, "expectedCount": len(ids)}
    return {"schemaVersion": 1, "configVersion": config_version(config), "announcementDate": announcement_date, "manifests": manifests, "failures": failures}

def main() -> None:
    parser = argparse.ArgumentParser(); parser.add_argument("--date", required=True, dest="announcement_date"); parser.add_argument("--out", required=True); parser.add_argument("--config"); parser.add_argument("--category", action="append")
    args = parser.parse_args(); payload = build_manifest(args.announcement_date, args.category, args.config)
    Path(args.out).write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Built {len(payload['manifests'])} category manifests for {args.announcement_date}: " + ", ".join(f"{key}={value['expectedCount']}" for key, value in payload["manifests"].items()))
    if payload["failures"]: print("Failed categories (not converted to zero): " + ", ".join(payload["failures"]))
if __name__ == "__main__": main()
