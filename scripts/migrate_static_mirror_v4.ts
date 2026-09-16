import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  STATIC_MIRROR_SCHEMA_VERSION,
  parseStaticOverviewSidecar,
  validateStaticDay,
  type StaticDayV4,
  type StaticMirrorManifestV4,
  type StaticVolumeV4,
} from '../lib/static-mirror';
import { publicTrackingConfigSchema } from '../lib/config';

interface LegacyStaticDayV3 extends Omit<
  StaticDayV4,
  'schemaVersion' | 'dailyOverview'
> {
  schemaVersion: 3;
  summaryItems: { analysisId: string; text: string }[];
}

interface LegacyManifestV3 extends Omit<
  StaticMirrorManifestV4,
  'schemaVersion'
> {
  schemaVersion: 3;
}

interface LegacyVolumeV3 extends Omit<StaticVolumeV4, 'schemaVersion'> {
  schemaVersion: 3;
}

interface MigrationArgs {
  content: string;
  overviews: string;
  output: string;
}

function parseArgs(argv: string[]): MigrationArgs {
  const values = new Map<string, string>();
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith('--') || !value)
      throw new Error(`Invalid argument ${key}`);
    values.set(key.slice(2), value);
  }
  const content = values.get('content');
  const overviews = values.get('overviews');
  const output = values.get('output');
  if (!content || !overviews || !output)
    throw new Error(
      'Usage: migrate_static_mirror_v4.ts --content <v3-content> --overviews <sidecar-dir> --output <new-v4-content>',
    );
  return {
    content: resolve(content),
    overviews: resolve(overviews),
    output: resolve(output),
  };
}

async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, 'utf8')) as T;
}

async function writeJson(path: string, value: unknown): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function assertMissing(path: string): Promise<void> {
  try {
    await access(path);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return;
    throw error;
  }
  throw new Error(`Migration output already exists: ${path}`);
}

async function overviewFiles(root: string): Promise<Map<string, string>> {
  const files = new Map<string, string>();
  const visit = async (directory: string): Promise<void> => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await visit(path);
      else if (entry.isFile() && entry.name.endsWith('.json')) {
        const date = basename(entry.name, '.json');
        if (files.has(date))
          throw new Error(`Duplicate overview sidecar for ${date}`);
        files.set(date, path);
      }
    }
  };
  await visit(root);
  return files;
}

function migrateDay(
  legacy: LegacyStaticDayV3,
  overviewValue: unknown,
): StaticDayV4 {
  if (
    legacy.schemaVersion !== 3 ||
    !Array.isArray(legacy.summaryItems) ||
    !Array.isArray(legacy.analyses)
  )
    throw new Error(`Invalid schema v3 day ${legacy.announcementDate}`);
  const overview = parseStaticOverviewSidecar(overviewValue);
  if (overview.announcementDate !== legacy.announcementDate)
    throw new Error(`Overview date mismatch for ${legacy.announcementDate}`);
  const {
    summaryItems: _summaryItems,
    schemaVersion: _schemaVersion,
    ...day
  } = legacy;
  const migrated: StaticDayV4 = {
    ...day,
    schemaVersion: STATIC_MIRROR_SCHEMA_VERSION,
    dailyOverview: {
      resultItems: overview.resultItems,
      noteworthyItems: overview.noteworthyItems,
    },
    analyses: day.analyses,
  };
  validateStaticDay(migrated);
  return migrated;
}

export async function migrateStaticMirrorV4(args: MigrationArgs): Promise<{
  days: number;
  latestDate: string;
}> {
  const content = resolve(args.content);
  const overviews = resolve(args.overviews);
  const output = resolve(args.output);
  if (content === output)
    throw new Error('Migration output must differ from v3 content');
  await assertMissing(output);

  const manifest = await readJson<LegacyManifestV3>(
    join(content, 'data/manifest.json'),
  );
  const volume = await readJson<LegacyVolumeV3>(
    join(content, 'data/volume.json'),
  );
  const config = publicTrackingConfigSchema.parse(
    await readJson<unknown>(join(content, 'data/config.json')),
  );
  if (manifest.schemaVersion !== 3 || volume.schemaVersion !== 3)
    throw new Error('Migration requires a schema v3 content snapshot');
  if (JSON.stringify(config) !== JSON.stringify(manifest.config))
    throw new Error('Public config does not match the schema v3 manifest');
  if (
    !manifest.days.length ||
    manifest.latestDate !== manifest.days[0].announcementDate
  )
    throw new Error('Invalid schema v3 manifest ordering');
  for (const point of volume.points) {
    if (
      Object.values(point.counts).some(
        (value) => value !== null && (!Number.isInteger(value) || value < 0),
      )
    )
      throw new Error(`Invalid volume point ${point.announcementDate}`);
  }
  const expectedDates = new Set(
    manifest.days.map((entry) => entry.announcementDate),
  );
  const sidecars = await overviewFiles(overviews);
  const sidecarDates = new Set(sidecars.keys());
  for (const date of expectedDates) {
    if (!sidecarDates.has(date))
      throw new Error(`Missing overview sidecar for ${date}`);
  }
  for (const date of sidecarDates) {
    if (!expectedDates.has(date))
      throw new Error(`Unexpected overview sidecar for ${date}`);
  }

  const days = await Promise.all(
    manifest.days.map(async (entry) => {
      const legacy = await readJson<LegacyStaticDayV3>(
        join(content, `data/daily/${entry.announcementDate}.json`),
      );
      if (
        legacy.announcementDate !== entry.announcementDate ||
        legacy.lastUpdated !== entry.lastUpdated ||
        legacy.coverage.expectedCount !== entry.expectedCount ||
        legacy.coverage.publishedCount !== entry.publishedCount ||
        legacy.aiDisclosureCount !== entry.aiDisclosureCount ||
        legacy.coverage.complete !== entry.complete
      )
        throw new Error(`Manifest mismatch for ${entry.announcementDate}`);
      return migrateDay(
        legacy,
        await readJson<unknown>(sidecars.get(entry.announcementDate)!),
      );
    }),
  );
  const migratedManifest: StaticMirrorManifestV4 = {
    ...manifest,
    schemaVersion: STATIC_MIRROR_SCHEMA_VERSION,
  };
  const migratedVolume: StaticVolumeV4 = {
    ...volume,
    schemaVersion: STATIC_MIRROR_SCHEMA_VERSION,
  };

  await mkdir(dirname(output), { recursive: true });
  const staging = await mkdtemp(join(dirname(output), '.static-mirror-v4-'));
  try {
    await writeJson(join(staging, 'data/config.json'), config);
    await writeJson(join(staging, 'data/manifest.json'), migratedManifest);
    await writeJson(join(staging, 'data/volume.json'), migratedVolume);
    await Promise.all(
      days.map((day) =>
        writeJson(
          join(staging, `data/daily/${day.announcementDate}.json`),
          day,
        ),
      ),
    );
    await rename(staging, output);
  } catch (error) {
    await rm(staging, { recursive: true, force: true });
    throw error;
  }
  return { days: days.length, latestDate: migratedManifest.latestDate };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const result = await migrateStaticMirrorV4(parseArgs(process.argv.slice(2)));
  process.stdout.write(`${JSON.stringify(result)}\n`);
}
