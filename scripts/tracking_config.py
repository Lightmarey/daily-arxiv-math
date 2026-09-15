"""Validated local tracking configuration shared by automation commands."""
from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path
from urllib.parse import urlsplit

CATEGORY_RE = re.compile(r"^(?:[a-z][a-z0-9]*-[a-z0-9-]+|[a-z][a-z0-9-]*\.[A-Za-z][A-Za-z0-9-]*)$")
ID_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")

def _keys(value: dict, allowed: set[str], label: str) -> None:
    extra = set(value) - allowed
    if extra: raise ValueError(f"Unknown {label} keys: {sorted(extra)}")

def _bounded_string(value: object, minimum: int, maximum: int) -> bool:
    return isinstance(value, str) and minimum <= len(value) <= maximum

def _http_url(value: object) -> bool:
    if not isinstance(value, str): return False
    try:
        parsed = urlsplit(value)
        hostname = parsed.hostname
        parsed.port
    except ValueError: return False
    return parsed.scheme in {"http", "https"} and bool(hostname) and not any(character.isspace() for character in value)

def validate_config(value: object) -> dict:
    if not isinstance(value, dict): raise ValueError("Config must be an object")
    _keys(value, {"schemaVersion", "site", "categories", "fetchCategories", "displayCategories"}, "config")
    if type(value.get("schemaVersion")) is not int or value["schemaVersion"] != 1: raise ValueError("schemaVersion must be 1")
    site = value.get("site")
    if not isinstance(site, dict): raise ValueError("site must be an object")
    _keys(site, {"name", "description", "links"}, "site")
    if not _bounded_string(site.get("name"), 1, 120) or not _bounded_string(site.get("description"), 1, 500): raise ValueError("site name or description length is invalid")
    links = site.get("links", {})
    if not isinstance(links, dict) or any(not isinstance(key, str) or len(key) > 80 or not ID_RE.fullmatch(key) or not _http_url(url) for key, url in links.items()): raise ValueError("site links must use stable IDs and HTTP(S) URLs")
    categories = value.get("categories")
    if not isinstance(categories, list) or not 1 <= len(categories) <= 50: raise ValueError("categories must contain between 1 and 50 items")
    category_ids: list[str] = []
    for category in categories:
        if not isinstance(category, dict): raise ValueError("category must be an object")
        _keys(category, {"id", "label", "color", "topics", "readingPreferences"}, "category")
        category_id = category.get("id")
        if not _bounded_string(category_id, 3, 80) or not CATEGORY_RE.fullmatch(category_id): raise ValueError(f"Invalid arXiv category ID: {category_id}")
        if not _bounded_string(category.get("label"), 1, 120): raise ValueError("category label length is invalid")
        if "color" in category and (not isinstance(category["color"], str) or not re.fullmatch(r"#[0-9a-fA-F]{6}", category["color"])): raise ValueError("category color must be #RRGGBB")
        if not _bounded_string(category.get("readingPreferences"), 1, 5000): raise ValueError("readingPreferences length is invalid")
        topics = category.get("topics")
        if not isinstance(topics, list) or not 1 <= len(topics) <= 50: raise ValueError("category topics must contain between 1 and 50 items")
        topic_ids = []
        for topic in topics:
            if not isinstance(topic, dict): raise ValueError("topic must be an object")
            _keys(topic, {"id", "label"}, "topic")
            if not _bounded_string(topic.get("id"), 1, 80) or not ID_RE.fullmatch(topic["id"]): raise ValueError("topic id must be stable kebab-case")
            if not _bounded_string(topic.get("label"), 1, 120): raise ValueError("topic label length is invalid")
            topic_ids.append(topic["id"])
        if len(topic_ids) != len(set(topic_ids)): raise ValueError(f"Duplicate topic ID in {category_id}")
        category_ids.append(category_id)
    if len(category_ids) != len(set(category_ids)): raise ValueError("Category IDs must be unique")
    for field, allow_empty in (("fetchCategories", True), ("displayCategories", False)):
        selected = value.get(field)
        if not isinstance(selected, list) or len(selected) > 50 or (not allow_empty and not selected) or any(not isinstance(item, str) or not CATEGORY_RE.fullmatch(item) for item in selected): raise ValueError(f"{field} is invalid")
        if len(selected) != len(set(selected)): raise ValueError(f"{field} must not contain duplicates")
        unknown = set(selected) - set(category_ids)
        if unknown: raise ValueError(f"Unknown categories in {field}: {sorted(unknown)}")
    return value

def load_config(path: str | None = None) -> dict:
    selected = Path(path or "config.local.json")
    if not selected.exists() and path is None: selected = Path("config.example.json")
    if not selected.exists(): raise FileNotFoundError(f"Configuration file not found: {selected}")
    return validate_config(json.loads(selected.read_text(encoding="utf-8")))

def canonical_json(config: dict) -> str:
    return json.dumps(config, ensure_ascii=False, sort_keys=True, separators=(",", ":"))

def config_version(config: dict) -> str:
    return hashlib.sha256(canonical_json(config).encode("utf-8")).hexdigest()

def category_config(config: dict, category_id: str) -> dict:
    try: return next(category for category in config["categories"] if category["id"] == category_id)
    except StopIteration as error: raise ValueError(f"Unknown configured category {category_id}") from error
