import copy
import json
import unittest
from pathlib import Path

from tracking_config import validate_config


def apply_fixture(base: dict, fixture: dict) -> dict:
    value = copy.deepcopy(base)
    for change in fixture["changes"]:
        parent = value
        for part in change["path"][:-1]:
            parent = parent[part]
        parent[change["path"][-1]] = change["value"]
    return value


class TrackingConfigTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.base = json.loads(Path("config.example.json").read_text(encoding="utf-8"))
        cls.fixtures = json.loads(Path("tests/config-fixtures.json").read_text(encoding="utf-8"))

    def test_shared_cross_language_fixtures(self):
        for fixture in self.fixtures:
            with self.subTest(fixture["name"]):
                if fixture["valid"]:
                    validate_config(apply_fixture(self.base, fixture))
                else:
                    with self.assertRaises(ValueError):
                        validate_config(apply_fixture(self.base, fixture))

    def test_all_collection_limits_match_typescript(self):
        categories = copy.deepcopy(self.base)
        categories["categories"] = [
            {**copy.deepcopy(self.base["categories"][0]), "id": f"math.A{index}"}
            for index in range(51)
        ]
        topics = copy.deepcopy(self.base)
        topics["categories"][0]["topics"] = [
            {"id": f"topic-{index}", "label": "Topic"} for index in range(51)
        ]
        fetch = copy.deepcopy(self.base)
        fetch["fetchCategories"] = ["math.AP"] * 51
        for value in (categories, topics, fetch):
            with self.assertRaises(ValueError):
                validate_config(value)

    def test_all_string_limits_match_typescript(self):
        cases = []
        for path, length in (
            (("site", "description"), 501),
            (("categories", 0, "label"), 121),
            (("categories", 0, "readingPreferences"), 5001),
            (("categories", 0, "topics", 0, "id"), 81),
            (("categories", 0, "topics", 0, "label"), 121),
        ):
            value = copy.deepcopy(self.base)
            parent = value
            for part in path[:-1]:
                parent = parent[part]
            parent[path[-1]] = "a" * length
            cases.append(value)
        for value in cases:
            with self.assertRaises(ValueError):
                validate_config(value)


if __name__ == "__main__":
    unittest.main()
