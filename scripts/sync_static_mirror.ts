import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import {
  STATIC_MIRROR_SCHEMA_VERSION,
  buildStaticDay,
  buildStaticVolume,
  parseStaticOverviewSidecar,
  validateCanonicalOverviewMath,
  validateStaticDay,
  type StaticDayV4,
  type StaticMirrorManifestV4,
  type StaticVolumeV4,
} from '../lib/static-mirror';
import { parseTrackingConfig, publicConfig } from '../lib/config';
import type { PaperReport, ReportFeed, VolumePoint } from '../lib/types';
import { reportBatchV3Schema, type ReportBatchV3 } from '../lib/validation';

interface Args {
  output: string;
  requiredDate?: string;
  batches: string[];
  overviewFile: string;
  volumeFile?: string;
  configFile: string;
}

function parseArgs(argv: string[]): Args {
  const values = new Map<string, string>();
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith('--') || !value) throw new Error(`Invalid argument ${key}`);
    values.set(key.slice(2), value);
  }
  const output = values.get('output');
  const configFile = values.get('config');
  const overviewFile = values.get('overview');
  if (!output || !configFile || !overviewFile)
    throw new Error(
      'Usage: sync_static_mirror.ts --output <dir> --config <config.json> --batch <a.json,b.json> --overview <overview.json> [--volume-file volume.json] [--required-date YYYY-MM-DD]',
    );
  return {
    output: resolve(output),
    configFile: resolve(configFile),
    overviewFile: resolve(overviewFile),
    requiredDate: values.get('required-date'),
    batches: values.get('batch')?.split(',').filter(Boolean) ?? [],
    volumeFile: values.get('volume-file'),
  };
}

async function readJson<T>(path: string): Promise<T | undefined> {
  try {
    return JSON.parse(await readFile(path, 'utf8')) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
    throw error;
  }
}

async function writeJson(path: string, value: unknown): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function batchReports(batch: ReportBatchV3): PaperReport[] {
  return batch.reports.map((report) => ({
    ...report,
    id: `${batch.categoryId}:${report.announcementDate}:${report.arxivId}:v${report.version}`,
    configVersion: batch.configVersion,
  }));
}

function feedFromBatches(
  batches: ReportBatchV3[],
  categories: string[],
  requiredCategories: Set<string>,
  existing?: StaticDayV4,
): ReportFeed {
  const date = batches[0]?.announcementDay.date;
  if (!date) throw new Error('At least one batch is required');
  const batchMap = new Map(batches.map((batch) => [batch.categoryId, batch]));
  if (batchMap.size !== batches.length) throw new Error('Duplicate category batch');
  const existingCoverage = new Map(
    existing?.coverage.categories.map((item) => [item.categoryId, item]) ?? [],
  );
  const coverage = categories.map((categoryId) => {
    const batch = batchMap.get(categoryId);
    if (batch)
      return {
        categoryId,
        expectedCount: batch.run.expectedCount,
        publishedCount: batch.reports.filter((item) => item.entryKind !== 'revision').length,
        complete: true,
        requiredForCompletion: requiredCategories.has(categoryId),
        status: 'complete' as const,
        completedAt: batch.run.completedAt,
      };
    const old = existingCoverage.get(categoryId);
    if (old)
      return {
        ...old,
        requiredForCompletion: requiredCategories.has(categoryId),
      };
    if (requiredCategories.has(categoryId))
      throw new Error(`Offline static sync is missing ${categoryId} for ${date}`);
    return {
      categoryId,
      expectedCount: null,
      publishedCount: null,
      complete: false,
      requiredForCompletion: false,
      status: 'not_collected' as const,
      completedAt: null,
    };
  });
  return {
    date,
    lastUpdated: [...batches.map((item) => item.run.completedAt), existing?.lastUpdated ?? '']
      .sort()
      .at(-1)!,
    categories,
    coverage,
    reports: [
      ...(existing?.analyses ?? []).filter((item) => !batchMap.has(item.categoryId)),
      ...batches.flatMap(batchReports),
    ],
  };
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const configSource = JSON.parse(await readFile(args.configFile, 'utf8')) as unknown;
  const localConfig = parseTrackingConfig(configSource);
  const config = publicConfig(localConfig);
  const categories = config.displayCategories;
  const requiredCategories = new Set(
    localConfig.fetchCategories.filter((category) => categories.includes(category)),
  );
  const batches = await Promise.all(
    args.batches.map(async (path) =>
      reportBatchV3Schema.parse(JSON.parse(await readFile(resolve(path), 'utf8'))),
    ),
  );
  if (!batches.length) throw new Error('At least one --batch is required');
  const dates = new Set(batches.map((batch) => batch.announcementDay.date));
  if (dates.size !== 1) throw new Error('All batches must use one announcement date');
  const date = batches[0].announcementDay.date;
  if (args.requiredDate && args.requiredDate !== date)
    throw new Error('Batch announcement date does not match --required-date');
  if (batches.some((batch) => batch.configVersion !== config.configVersion))
    throw new Error('Static batch configVersion does not match public config');
  const overview = parseStaticOverviewSidecar(
    JSON.parse(await readFile(args.overviewFile, 'utf8')) as unknown,
  );
  validateCanonicalOverviewMath(overview);
  if (overview.announcementDate !== date)
    throw new Error('Overview announcement date does not match batch date');

  const existingManifest = await readJson<StaticMirrorManifestV4>(
    join(args.output, 'data/manifest.json'),
  );
  if (existingManifest && existingManifest.schemaVersion !== STATIC_MIRROR_SCHEMA_VERSION)
    throw new Error('Migrate static content to schema v4 before syncing');
  const selected = new Map<string, StaticDayV4>();
  for (const entry of existingManifest?.days ?? []) {
    const old = await readJson<StaticDayV4>(
      join(args.output, `data/daily/${entry.announcementDate}.json`),
    );
    if (!old) throw new Error(`Missing archived day ${entry.announcementDate}`);
    validateStaticDay(old);
    selected.set(old.announcementDate, old);
  }

  const day = buildStaticDay(
    feedFromBatches(batches, categories, requiredCategories, selected.get(date)),
    config,
    {
      resultItems: overview.resultItems,
      noteworthyItems: overview.noteworthyItems,
    },
  );
  validateStaticDay(day);
  selected.set(date, day);
  const days = [...selected.values()].sort((a, b) =>
    b.announcementDate.localeCompare(a.announcementDate),
  );

  const existingVolume = await readJson<StaticVolumeV4>(
    join(args.output, 'data/volume.json'),
  );
  const points: VolumePoint[] = args.volumeFile
    ? ((JSON.parse(await readFile(resolve(args.volumeFile), 'utf8')) as { points: VolumePoint[] }).points)
    : (existingVolume?.points.map((point) => ({
        announcementDate: point.announcementDate,
        counts: { ...point.counts },
      })) ?? []);
  let point = points.find((item) => item.announcementDate === date);
  if (!point) {
    point = {
      announcementDate: date,
      counts: Object.fromEntries(categories.map((category) => [category, null])),
    };
    points.push(point);
  }
  for (const batch of batches) point.counts[batch.categoryId] = batch.dailyVolume.count;
  const volume = buildStaticVolume(points, categories);
  const generatedAt = days.map((item) => item.lastUpdated).sort().at(-1)!;
  const manifest: StaticMirrorManifestV4 = {
    schemaVersion: STATIC_MIRROR_SCHEMA_VERSION,
    latestDate: days[0].announcementDate,
    generatedAt,
    config,
    days: days.map((item) => ({
      announcementDate: item.announcementDate,
      expectedCount: item.coverage.expectedCount,
      publishedCount: item.coverage.publishedCount,
      aiDisclosureCount: item.aiDisclosureCount,
      complete: item.coverage.complete,
      lastUpdated: item.lastUpdated,
    })),
  };
  await writeJson(join(args.output, 'data/config.json'), config);
  await writeJson(join(args.output, 'data/volume.json'), volume);
  await writeJson(join(args.output, `data/daily/${date}.json`), day);
  await writeJson(join(args.output, 'data/manifest.json'), manifest);
  process.stdout.write(
    `${JSON.stringify({ latestDate: manifest.latestDate, days: days.length, generatedAt, categories })}\n`,
  );
}

await main();
