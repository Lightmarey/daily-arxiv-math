#!/usr/bin/env python3
"""Fetch reusable arXiv metadata for configured categories or exact manifests."""
from __future__ import annotations
import argparse, html, json, re, urllib.parse, xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from pathlib import Path
from arxiv_http import download
from tracking_config import config_version, load_config

API = "https://export.arxiv.org/api/query"; ATOM = {"a": "http://www.w3.org/2005/Atom", "x": "http://arxiv.org/schemas/atom", "opensearch": "http://a9.com/-/spec/opensearch/1.1/"}
def request(url: str) -> bytes: return download(url, timeout=60)
def clean(value: str | None) -> str: return " ".join((value or "").split())
def parse_entries(root: ET.Element) -> list[dict]:
    output = []
    for entry in root.findall("a:entry", ATOM):
        raw_id = clean(entry.findtext("a:id", namespaces=ATOM)).rsplit("/", 1)[-1]; base, version_text = raw_id.rsplit("v", 1)
        primary = entry.find("x:primary_category", ATOM)
        output.append({"arxivId": base, "version": int(version_text), "title": clean(entry.findtext("a:title", namespaces=ATOM)), "authors": [clean(node.findtext("a:name", namespaces=ATOM)) for node in entry.findall("a:author", ATOM)], "abstract": clean(entry.findtext("a:summary", namespaces=ATOM)), "categories": [node.attrib["term"] for node in entry.findall("a:category", ATOM)], "primaryCategory": primary.attrib["term"] if primary is not None else "", "submittedAt": clean(entry.findtext("a:published", namespaces=ATOM)), "updatedAt": clean(entry.findtext("a:updated", namespaces=ATOM)), "arxivUrl": f"https://arxiv.org/abs/{base}", "pdfUrl": f"https://arxiv.org/pdf/{base}", "comment": clean(entry.findtext("x:comment", namespaces=ATOM))})
    return output
def fetch(since: datetime, until: datetime, categories: list[str], page_size: int = 200) -> list[dict]:
    if not categories: return []
    search = f"({' OR '.join(f'cat:{category}' for category in categories)}) AND submittedDate:[{since:%Y%m%d%H%M} TO {until:%Y%m%d%H%M}]"
    output = {}; start = 0
    while True:
        root = ET.fromstring(request(f"{API}?{urllib.parse.urlencode({'search_query': search, 'start': start, 'max_results': page_size, 'sortBy': 'submittedDate', 'sortOrder': 'ascending'})}")); entries = parse_entries(root)
        for item in entries: output[(item["arxivId"], item["version"])] = item
        total = int(root.findtext("opensearch:totalResults", default="0", namespaces=ATOM)); start += len(entries)
        if not entries or start >= total: break
    return list(output.values())
def fetch_ids(arxiv_ids: list[str], page_size: int = 100) -> list[dict]:
    output = {}
    for offset in range(0, len(arxiv_ids), page_size):
        batch = arxiv_ids[offset:offset + page_size]
        try:
            root = ET.fromstring(request(f"{API}?{urllib.parse.urlencode({'id_list': ','.join(batch), 'max_results': len(batch)})}"))
            items = parse_entries(root)
        except RuntimeError:
            items = [parse_abs_page(item, request(f"https://arxiv.org/abs/{item}")) for item in batch]
        for item in items: output[item["arxivId"]] = item
    missing = sorted(set(arxiv_ids) - output.keys())
    if missing: raise RuntimeError(f"arXiv API omitted {len(missing)} manifest IDs: {missing}")
    return [output[item] for item in arxiv_ids]

def parse_abs_page(arxiv_id: str, document: bytes) -> dict:
    source = document.decode("utf-8", errors="replace")
    def metas(name: str) -> list[str]:
        return [html.unescape(value) for value in re.findall(rf'<meta\s+name=["\']{re.escape(name)}["\']\s+content=["\'](.*?)["\']\s*/?>', source, re.I | re.S)]
    def clean_html(value: str) -> str: return clean(re.sub(r"<[^>]+>", " ", html.unescape(value)))
    title, abstract = metas("citation_title"), metas("citation_abstract")
    authors = [clean(" ".join(reversed(value.split(", ", 1)))) if ", " in value else clean(value) for value in metas("citation_author")]
    subject_match = re.search(r'<td[^>]*class=["\'][^"\']*subjects[^"\']*["\'][^>]*>(.*?)</td>', source, re.I | re.S)
    subject_text = clean_html(subject_match.group(1)) if subject_match else ""
    categories = re.findall(r"\(([a-z-]+\.[A-Z]{2}|[a-z-]+)\)", subject_text)
    primary_match = re.search(r'<span[^>]*class=["\']primary-subject["\'][^>]*>(.*?)</span>', source, re.I | re.S)
    primary_text = clean_html(primary_match.group(1)) if primary_match else ""
    primary = (re.findall(r"\(([a-z-]+\.[A-Z]{2}|[a-z-]+)\)", primary_text) or categories or [""])[0]
    history = []
    for version, timestamp in re.findall(r"\[v(\d+)\]</strong>\s*([^<(]+?)\s*\(", source, re.I | re.S):
        parsed = datetime.strptime(clean_html(timestamp), "%a, %d %b %Y %H:%M:%S %Z").replace(tzinfo=timezone.utc)
        history.append((int(version), parsed.isoformat().replace("+00:00", "Z")))
    if not title or not abstract or not authors or not history: raise RuntimeError(f"Incomplete arXiv abstract metadata for {arxiv_id}")
    history.sort()
    comments = re.search(r'<td[^>]*class=["\'][^"\']*comments[^"\']*["\'][^>]*>(.*?)</td>', source, re.I | re.S)
    return {"arxivId": arxiv_id, "version": history[-1][0], "title": clean(title[0]), "authors": authors, "abstract": clean(abstract[0]), "categories": categories, "primaryCategory": primary, "submittedAt": history[0][1], "updatedAt": history[-1][1], "arxivUrl": f"https://arxiv.org/abs/{arxiv_id}", "pdfUrl": f"https://arxiv.org/pdf/{arxiv_id}", "comment": clean_html(comments.group(1)) if comments else ""}
def main() -> None:
    parser = argparse.ArgumentParser(); parser.add_argument("--since"); parser.add_argument("--until"); parser.add_argument("--manifest"); parser.add_argument("--config"); parser.add_argument("--out", required=True); args = parser.parse_args()
    config = load_config(args.config); now = datetime.now(timezone.utc)
    if args.manifest:
        manifest = json.loads(Path(args.manifest).read_text(encoding="utf-8"))
        if manifest["configVersion"] != config_version(config): raise ValueError("Manifest configVersion is stale")
        ids = list(dict.fromkeys(item for value in manifest["manifests"].values() for item in value["expectedIds"]))
        payload = {**manifest, "fetchedAt": now.isoformat(), "papers": fetch_ids(ids)}
    else:
        since = datetime.fromisoformat(args.since.replace("Z", "+00:00")) if args.since else now - timedelta(hours=72); until = datetime.fromisoformat(args.until.replace("Z", "+00:00")) if args.until else now
        payload = {"schemaVersion": 1, "configVersion": config_version(config), "fetchedAt": now.isoformat(), "window": {"since": since.isoformat(), "until": until.isoformat()}, "papers": fetch(since, until, config["fetchCategories"])}
    Path(args.out).write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"); print(f"Fetched {len(payload['papers'])} unique arXiv records into {args.out}")
if __name__ == "__main__": main()
