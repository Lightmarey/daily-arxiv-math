import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import {
  configVersion,
  parseTrackingConfig,
  publicConfig,
  trackingConfigSchema,
} from '../lib/config';
import { testConfig } from './helpers';

interface ConfigFixture {
  name: string;
  valid: boolean;
  changes: Array<{ path: Array<string | number>; value: unknown }>;
}

function applyFixture(fixture: ConfigFixture): unknown {
  const value = structuredClone(testConfig) as unknown as Record<
    string | number,
    unknown
  >;
  for (const change of fixture.changes) {
    let parent = value;
    for (const part of change.path.slice(0, -1))
      parent = parent[part] as Record<string | number, unknown>;
    parent[change.path.at(-1)!] = change.value;
  }
  return value;
}

const example = parseTrackingConfig(
  JSON.parse(await readFile('config.example.json', 'utf8')),
);
assert.deepEqual(example.fetchCategories, ['math.AP', 'math.DG']);
assert.deepEqual(example.displayCategories, ['math.AP', 'math.DG']);
assert.equal(
  example.categories
    .find((category) => category.id === 'math.DG')
    ?.topics.some((topic) => topic.id === 'geometric-flows'),
  true,
);
assert.doesNotThrow(() =>
  parseTrackingConfig({
    ...testConfig,
    categories: [{ ...testConfig.categories[0], id: 'hep-th' }],
    fetchCategories: ['hep-th'],
    displayCategories: ['hep-th'],
  }),
);
assert.throws(() =>
  parseTrackingConfig({
    ...testConfig,
    categories: [{ ...testConfig.categories[0], id: 'math' }],
    fetchCategories: ['math'],
    displayCategories: ['math'],
  }),
);
const fixtures = JSON.parse(
  await readFile('tests/config-fixtures.json', 'utf8'),
) as ConfigFixture[];
for (const fixture of fixtures) {
  assert.equal(
    trackingConfigSchema.safeParse(applyFixture(fixture)).success,
    fixture.valid,
    fixture.name,
  );
}
assert.throws(() =>
  parseTrackingConfig({
    ...testConfig,
    categories: Array.from({ length: 51 }, (_, index) => ({
      ...testConfig.categories[0],
      id: `math.A${index}`,
    })),
  }),
);
assert.throws(() =>
  parseTrackingConfig({
    ...testConfig,
    site: { ...testConfig.site, links: { bad: 'ftp://example.test' } },
  }),
);
assert.throws(() => parseTrackingConfig({ ...testConfig, unknown: true }));
const publicValue = publicConfig(testConfig) as unknown as Record<
  string,
  unknown
>;
assert.equal('fetchCategories' in publicValue, false);
assert.equal(JSON.stringify(publicValue).includes('readingPreferences'), false);
const python = spawnSync(
  'python',
  [
    '-c',
    'import json,sys; from tracking_config import config_version; print(config_version(json.loads(sys.stdin.read())))',
  ],
  {
    input: JSON.stringify(testConfig),
    encoding: 'utf8',
    env: { ...process.env, PYTHONPATH: 'scripts' },
  },
);
assert.equal(python.status, 0, python.stderr);
assert.equal(
  python.stdout.trim(),
  configVersion(testConfig),
  'TypeScript and Python must hash the same canonical config',
);
console.log('Configuration tests passed');
