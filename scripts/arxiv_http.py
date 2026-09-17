"""Polite, restart-safe shared HTTP helper for official arXiv endpoints."""
from __future__ import annotations

import http.client
import json
import os
import shutil
import subprocess
import time
import urllib.error
import urllib.parse
from email.utils import parsedate_to_datetime
from pathlib import Path

from local_lock import exclusive_lock

USER_AGENT = "ConfigurableArxivBrief/3.0 (research briefing; contact via deployed site)"
MIN_REQUEST_INTERVAL_SECONDS = 4.0
DEFAULT_RETRY_AFTER_SECONDS = 60.0
MAX_WAIT_SECONDS = 20 * 60
MAX_ATTEMPTS = 5
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
    for attempt in range(5):
        try:
            os.replace(temporary, path)
            return
        except PermissionError:
            if attempt == 4:
                raise
            time.sleep(0.05)


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
        return DEFAULT_RETRY_AFTER_SECONDS
    try:
        return max(0.0, float(value))
    except ValueError:
        try:
            return max(0.0, parsedate_to_datetime(value).timestamp() - time.time())
        except (TypeError, ValueError):
            return MIN_REQUEST_INTERVAL_SECONDS


def _curl_request(url: str, timeout: int) -> tuple[int, dict[str, str], bytes] | None:
    executable = shutil.which("curl")
    if not executable:
        return None
    result = subprocess.run(
        [
            executable,
            "--silent",
            "--show-error",
            "--location",
            "--max-time",
            str(timeout),
            "--user-agent",
            USER_AGENT,
            "--header",
            "Accept: */*",
            "--write-out",
            "\n__ARXIV_HTTP_STATUS__:%{http_code}\n__ARXIV_RETRY_AFTER__:%header{retry-after}",
            url,
        ],
        capture_output=True,
        check=False,
    )
    if result.returncode != 0:
        return None
    status_marker = b"\n__ARXIV_HTTP_STATUS__:"
    retry_marker = b"\n__ARXIV_RETRY_AFTER__:"
    body, separator, trailer = result.stdout.rpartition(status_marker)
    if not separator:
        return None
    status_text, separator, retry_after = trailer.partition(retry_marker)
    if not separator:
        return None
    try:
        status = int(status_text.strip())
    except ValueError:
        return None
    headers = {}
    if retry_after.strip():
        headers["Retry-After"] = retry_after.decode("ascii", errors="ignore").strip()
    return status, headers, body


def _request(url: str, timeout: int) -> bytes:
    parsed = urllib.parse.urlsplit(url)
    if parsed.scheme != "https" or not parsed.hostname:
        raise RuntimeError(f"Unsupported arXiv URL: {url}")
    connection = http.client.HTTPSConnection(parsed.hostname, parsed.port, timeout=timeout)
    path = parsed.path or "/"
    if parsed.query:
        path += f"?{parsed.query}"
    try:
        connection.request(
            "GET", path, headers={"User-Agent": USER_AGENT, "Accept": "*/*"}
        )
        response = connection.getresponse()
        body = response.read()
        if response.status == 406:
            _reserve_request()
            fallback = _curl_request(url, timeout)
            if fallback is not None:
                status, headers, body = fallback
                if status >= 400:
                    raise urllib.error.HTTPError(
                        url, status, f"curl returned HTTP {status}", headers, None
                    )
                return body
        if response.status >= 400:
            raise urllib.error.HTTPError(
                url, response.status, response.reason, response.headers, None
            )
        return body
    finally:
        connection.close()


def download(url: str, timeout: int = 90) -> bytes:
    last_error: Exception | None = None
    for attempt in range(MAX_ATTEMPTS):
        _reserve_request()
        try:
            return _request(url, timeout)
        except urllib.error.HTTPError as error:
            if error.code in {406, 429}:
                delay = _retry_after(error.headers)
                if error.code == 429 and not (error.headers and error.headers.get("Retry-After")):
                    delay *= 2**attempt
                _defer(delay)
            elif not 500 <= error.code < 600:
                raise RuntimeError(f"arXiv request failed with HTTP {error.code}") from error
            last_error = error
        except (
            http.client.HTTPException,
            urllib.error.URLError,
            TimeoutError,
            OSError,
        ) as error:
            last_error = error
    raise RuntimeError(f"arXiv request failed after {MAX_ATTEMPTS} attempts: {last_error}")
