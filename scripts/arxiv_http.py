"""Polite, restart-safe shared HTTP helper for official arXiv endpoints."""
from __future__ import annotations

import json
import os
import time
import urllib.error
import urllib.request
from email.utils import parsedate_to_datetime
from pathlib import Path

from local_lock import exclusive_lock

USER_AGENT = "ConfigurableArxivBrief/3.0 (research briefing; contact via deployed site)"
MIN_REQUEST_INTERVAL_SECONDS = 4.0
MAX_WAIT_SECONDS = 20 * 60
ROOT = Path(__file__).resolve().parents[1]


class Deferred(RuntimeError):
    """The current run exhausted its shared arXiv wait budget."""


def _cache_dir() -> Path:
    return Path(os.environ.get("ARXIV_CACHE_DIR", ROOT / ".automation" / "arxiv-cache"))


def _read_state(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def _write_state(path: Path, state: dict) -> None:
    temporary = path.with_suffix(".tmp")
    temporary.write_text(json.dumps(state, sort_keys=True), encoding="utf-8")
    os.replace(temporary, path)


def _run_id() -> str:
    return os.environ.get("ARXIV_RUN_ID", "manual")


def _reserve_request() -> None:
    directory = _cache_dir()
    state_path, lock_path = directory / "request-state.json", directory / "request-state.lock"
    while True:
        with exclusive_lock(lock_path):
            state = _read_state(state_path)
            now = time.time()
            ready_at = max(float(state.get("nextRequestAt", 0)), float(state.get("deferUntil", 0)))
            wait = max(0.0, ready_at - now)
            waited = dict(state.get("waitedSeconds", {}))
            run_id = _run_id()
            if wait and float(waited.get(run_id, 0)) + wait > MAX_WAIT_SECONDS:
                raise Deferred("Shared arXiv cooldown exceeds this run's 20-minute budget")
            if wait:
                waited[run_id] = float(waited.get(run_id, 0)) + wait
                state["waitedSeconds"] = waited
                _write_state(state_path, state)
            else:
                state["nextRequestAt"] = now + MIN_REQUEST_INTERVAL_SECONDS
                _write_state(state_path, state)
                return
        time.sleep(wait)


def _defer(seconds: float) -> None:
    directory = _cache_dir()
    state_path, lock_path = directory / "request-state.json", directory / "request-state.lock"
    with exclusive_lock(lock_path):
        state = _read_state(state_path)
        state["deferUntil"] = max(float(state.get("deferUntil", 0)), time.time() + seconds)
        _write_state(state_path, state)


def _retry_after(headers) -> float:
    value = headers.get("Retry-After") if headers else None
    if not value:
        return MIN_REQUEST_INTERVAL_SECONDS
    try:
        return max(0.0, float(value))
    except ValueError:
        try:
            return max(0.0, parsedate_to_datetime(value).timestamp() - time.time())
        except (TypeError, ValueError):
            return MIN_REQUEST_INTERVAL_SECONDS


def download(url: str, timeout: int = 90) -> bytes:
    last_error: Exception | None = None
    for _attempt in range(3):
        _reserve_request()
        try:
            request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(request, timeout=timeout) as response:
                return response.read()
        except urllib.error.HTTPError as error:
            if error.code == 429:
                _defer(_retry_after(error.headers))
            elif not 500 <= error.code < 600:
                raise RuntimeError(f"arXiv request failed with HTTP {error.code}") from error
            last_error = error
        except (urllib.error.URLError, TimeoutError, OSError) as error:
            last_error = error
    raise RuntimeError(f"arXiv request failed after three attempts: {last_error}")
