import unittest
import os
import tempfile
from unittest.mock import patch
import urllib.error

import arxiv_http


class RejectedResponse:
    status = 406
    reason = "Not Acceptable"
    headers = {}

    def read(self): return b"blocked"


class RejectedConnection:
    def request(self, *_args, **_kwargs): pass
    def getresponse(self): return RejectedResponse()
    def close(self): pass


class ArxivHttpTests(unittest.TestCase):
    def setUp(self):
        self.now = 100.0
        self.sleeps = []
        self.cache = tempfile.TemporaryDirectory()
        self.environment = patch.dict(os.environ, {"ARXIV_CACHE_DIR": self.cache.name, "ARXIV_RUN_ID": "test"})
        self.environment.start()

    def tearDown(self):
        self.environment.stop()
        self.cache.cleanup()

    def clock(self): return self.now

    def sleep(self, delay):
        self.sleeps.append(delay)
        self.now += delay

    def test_separate_downloads_are_spaced(self):
        with patch.object(arxiv_http.time, "time", side_effect=self.clock), patch.object(arxiv_http.time, "sleep", side_effect=self.sleep), patch.object(arxiv_http, "_request", return_value=b"ok"):
            arxiv_http.download("https://arxiv.org/one")
            arxiv_http.download("https://arxiv.org/two")
        self.assertEqual(self.sleeps, [4.0])

    def test_retry_after_is_shared_before_retry(self):
        limited = urllib.error.HTTPError("https://arxiv.org/retry", 429, "limited", {"Retry-After": "9"}, None)
        with patch.object(arxiv_http.time, "time", side_effect=self.clock), patch.object(arxiv_http.time, "sleep", side_effect=self.sleep), patch.object(arxiv_http, "_request", side_effect=[limited, b"ok"]):
            self.assertEqual(arxiv_http.download("https://arxiv.org/retry"), b"ok")
        self.assertEqual(self.sleeps, [9.0])

    def test_rate_limit_without_retry_after_uses_default_cooldown(self):
        limited = urllib.error.HTTPError("https://arxiv.org/retry", 429, "limited", {}, None)
        with patch.object(arxiv_http.time, "time", side_effect=self.clock), patch.object(arxiv_http.time, "sleep", side_effect=self.sleep), patch.object(arxiv_http, "_request", side_effect=[limited, b"ok"]):
            self.assertEqual(arxiv_http.download("https://arxiv.org/retry"), b"ok")
        self.assertEqual(self.sleeps, [60.0])

    def test_repeated_rate_limits_back_off_exponentially(self):
        limited = urllib.error.HTTPError("https://arxiv.org/retry", 429, "limited", {}, None)
        with patch.object(arxiv_http.time, "time", side_effect=self.clock), patch.object(arxiv_http.time, "sleep", side_effect=self.sleep), patch.object(arxiv_http, "_request", side_effect=[limited, limited, b"ok"]):
            self.assertEqual(arxiv_http.download("https://arxiv.org/retry"), b"ok")
        self.assertEqual(self.sleeps, [60.0, 120.0])

    def test_transient_406_uses_the_same_cooldown(self):
        limited = urllib.error.HTTPError("https://arxiv.org/retry", 406, "limited", {}, None)
        with patch.object(arxiv_http.time, "time", side_effect=self.clock), patch.object(arxiv_http.time, "sleep", side_effect=self.sleep), patch.object(arxiv_http, "_request", side_effect=[limited, b"ok"]):
            self.assertEqual(arxiv_http.download("https://arxiv.org/retry"), b"ok")
        self.assertEqual(self.sleeps, [60.0])

    def test_406_uses_curl_transport_fallback(self):
        with patch.object(arxiv_http.http.client, "HTTPSConnection", return_value=RejectedConnection()), patch.object(arxiv_http, "_reserve_request") as reserve, patch.object(arxiv_http, "_curl_request", return_value=(200, {}, b"ok")) as fallback:
            self.assertEqual(arxiv_http._request("https://arxiv.org/one", 30), b"ok")
        reserve.assert_called_once_with()
        fallback.assert_called_once_with("https://arxiv.org/one", 30)

    def test_curl_rate_limit_preserves_retry_after(self):
        with patch.object(arxiv_http.http.client, "HTTPSConnection", return_value=RejectedConnection()), patch.object(arxiv_http, "_reserve_request"), patch.object(arxiv_http, "_curl_request", return_value=(429, {"Retry-After": "17"}, b"")):
            with self.assertRaises(urllib.error.HTTPError) as raised:
                arxiv_http._request("https://arxiv.org/one", 30)
        self.assertEqual(raised.exception.code, 429)
        self.assertEqual(raised.exception.headers["Retry-After"], "17")

    def test_wait_budget_is_isolated_by_run_id(self):
        state = {
            "deferUntil": self.now + arxiv_http.MAX_WAIT_SECONDS,
            "waitedSeconds": {"old-run": arxiv_http.MAX_WAIT_SECONDS},
        }
        arxiv_http._write_state(arxiv_http.Path(self.cache.name) / "request-state.json", state)
        with patch.object(arxiv_http.time, "time", side_effect=self.clock), patch.object(arxiv_http.time, "sleep", side_effect=self.sleep):
            with patch.dict(os.environ, {"ARXIV_RUN_ID": "old-run"}):
                with self.assertRaises(arxiv_http.Deferred):
                    arxiv_http._reserve_request()
            with patch.dict(os.environ, {"ARXIV_RUN_ID": "new-run"}):
                arxiv_http._reserve_request()
        self.assertEqual(self.sleeps, [arxiv_http.MAX_WAIT_SECONDS])

    def test_state_replace_retries_a_transient_windows_lock(self):
        path = arxiv_http.Path(self.cache.name) / "state.json"
        with patch.object(arxiv_http.os, "replace", side_effect=[PermissionError(), None]) as replace, patch.object(arxiv_http.time, "sleep") as sleep:
            arxiv_http._write_state(path, {"nextRequestAt": 1})
        self.assertEqual(replace.call_count, 2)
        sleep.assert_called_once_with(0.05)


if __name__ == "__main__": unittest.main()
