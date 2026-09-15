import unittest
import os
import tempfile
from unittest.mock import patch
import urllib.error

import arxiv_http


class Response:
    def __enter__(self): return self
    def __exit__(self, *_args): return False
    def read(self): return b"ok"


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
        with patch.object(arxiv_http.time, "time", side_effect=self.clock), patch.object(arxiv_http.time, "sleep", side_effect=self.sleep), patch.object(arxiv_http.urllib.request, "urlopen", return_value=Response()):
            arxiv_http.download("https://arxiv.org/one")
            arxiv_http.download("https://arxiv.org/two")
        self.assertEqual(self.sleeps, [4.0])

    def test_retry_after_is_shared_before_retry(self):
        limited = urllib.error.HTTPError("https://arxiv.org/retry", 429, "limited", {"Retry-After": "9"}, None)
        with patch.object(arxiv_http.time, "time", side_effect=self.clock), patch.object(arxiv_http.time, "sleep", side_effect=self.sleep), patch.object(arxiv_http.urllib.request, "urlopen", side_effect=[limited, Response()]):
            self.assertEqual(arxiv_http.download("https://arxiv.org/retry"), b"ok")
        self.assertEqual(self.sleeps, [9.0])


if __name__ == "__main__": unittest.main()
