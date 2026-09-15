import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import {
  STATIC_MIRROR_SCHEMA_VERSION,
  arxivSlug,
  buildStaticDay,
  buildStaticVolume,
  mergeStaticPaper,
  renderArchiveMarkdown,
  renderDailyMarkdown,
  renderPaperMarkdown,
  type StaticMirrorManifestV2,
  type StaticPaperV2,
} from '../lib/static-mirror';
import {
  parseTrackingConfig,
  publicConfig,
  publicTrackingConfigSchema,
  type PublicTrackingConfig,
} from '../lib/config';
import type { PaperReport, ReportFeed, VolumePoint } from '../lib/types';
import { reportBatchV3Schema, type ReportBatchV3 } from '../lib/validation';

interface Args {
  site: string;
  output: string;
  days: number;
  requiredDate?: string;
  batches: string[];
  volumeFile?: string;
  configFile?: string;
  offline: boolean;
}
function parseArgs(argv: string[]): Args {
  const values = new Map<string, string>();
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index],
      value = argv[index + 1];
    if (!key?.startsWith('--') || !value)
      throw new Error(`Invalid argument ${key}`);
    values.set(key.slice(2), value);
  }
  const site = values.get('site'),
    output = values.get('output');
  if (!site || !output)
    throw new Error(
      'Usage: sync_static_mirror.ts --site <url> --output <dir> [--batch a.json,b.json] [--config config.local.json] [--offline true]',
    );
  return {
    site: site.replace(/\/$/, ''),
    output: resolve(output),
    days: Number.parseInt(values.get('days') ?? '10', 10),
    requiredDate: values.get('required-date'),
    batches: values.get('batch')?.split(',').filter(Boolean) ?? [],
    volumeFile: values.get('volume-file'),
    configFile: values.get('config'),
    offline: values.get('offline') === 'true',
  };
}
async function fetchJson<T>(url: string): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          accept: 'application/json',
          ...(process.env.OAI_SITES_AUTHORIZATION
            ? {
                'OAI-Sites-Authorization': `Bearer ${process.env.OAI_SITES_AUTHORIZATION}`,
              }
            : {}),
        },
      });
      if (!response.ok)
        throw new Error(`${response.status} ${response.statusText}`);
      return (await response.json()) as T;
    } catch (error) {
      lastError = error;
      if (attempt < 3)
        await new Promise((done) => setTimeout(done, attempt * 800));
    }
  }
  throw new Error(`Unable to read ${url}: ${String(lastError)}`);
}
async function readJson<T>(path: string): Promise<T | undefined> {
  try {
    return JSON.parse(await readFile(path, 'utf8')) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
    throw error;
  }
}
async function writeText(path: string, value: string) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, value, 'utf8');
}
async function writeJson(path: string, value: unknown) {
  await writeText(path, `${JSON.stringify(value, null, 2)}\n`);
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
  requiredCategories: Set<string> | undefined,
  existing?: ReturnType<typeof buildStaticDay>,
): ReportFeed {
  const date = batches[0]?.announcementDay.date ?? existing?.announcementDate;
  if (!date) throw new Error('No batch date');
  const batchMap = new Map(batches.map((batch) => [batch.categoryId, batch]));
  const existingCoverage = new Map(
    existing?.coverage.categories.map((item) => [item.categoryId, item]) ?? [],
  );
  const coverage = categories.map((categoryId) => {
    const batch = batchMap.get(categoryId);
    if (batch)
      return {
        categoryId,
        expectedCount: batch.run.expectedCount,
        publishedCount: batch.reports.filter(
          (item) => item.entryKind !== 'revision',
        ).length,
        complete: true,
        requiredForCompletion: requiredCategories?.has(categoryId) ?? true,
        status: 'complete' as const,
        completedAt: batch.run.completedAt,
      };
    const old = existingCoverage.get(categoryId);
    if (old)
      return {
        ...old,
        requiredForCompletion:
          requiredCategories?.has(categoryId) ?? old.requiredForCompletion,
      };
    if (!requiredCategories || requiredCategories.has(categoryId))
      throw new Error(
        `Offline static sync is missing ${categoryId} for ${date}`,
      );
    return {
      categoryId,
      expectedCount: null,
      publishedCount: null,
      databasePublicationCount: null,
      complete: false,
      requiredForCompletion: false,
      status: 'not_collected' as const,
      completedAt: null,
    };
  });
  const reports = [
    ...(existing?.analyses ?? []).filter(
      (item) => !batchMap.has(item.categoryId),
    ),
    ...batches.flatMap(batchReports),
  ];
  return {
    date,
    lastUpdated: [
      ...batches.map((item) => item.run.completedAt),
      existing?.lastUpdated ?? '',
    ]
      .sort()
      .at(-1)!,
    categories,
    coverage,
    reports,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!Number.isInteger(args.days) || args.days < 1 || args.days > 366)
    throw new Error('--days must be between 1 and 366');
  const batches = await Promise.all(
    args.batches.map(async (path) =>
      reportBatchV3Schema.parse(
        JSON.parse(await readFile(resolve(path), 'utf8')),
      ),
    ),
  );
  const dates = new Set(batches.map((batch) => batch.announcementDay.date));
  if (dates.size > 1)
    throw new Error('All offline batches must use one announcement date');
  if (args.requiredDate && dates.size && !dates.has(args.requiredDate))
    throw new Error('Batch announcement date does not match --required-date');
  const existingManifest = await readJson<StaticMirrorManifestV2>(
    join(args.output, 'data/manifest.json'),
  );
  let config: PublicTrackingConfig;
  let requiredCategories: Set<string> | undefined;
  if (args.configFile || args.offline) {
    const path = resolve(
      args.configFile ??
        ((await readJson('config.local.json'))
          ? 'config.local.json'
          : 'config.example.json'),
    );
    const localConfig = parseTrackingConfig(
      JSON.parse(await readFile(path, 'utf8')),
    );
    config = publicConfig(localConfig);
    requiredCategories = new Set(
      localConfig.fetchCategories.filter((category) =>
        localConfig.displayCategories.includes(category),
      ),
    );
  } else {
    try {
      config = publicTrackingConfigSchema.parse(
        await fetchJson<unknown>(`${args.site}/api/config`),
      );
    } catch (error) {
      if (!existingManifest || !batches.length) throw error;
      config = publicTrackingConfigSchema.parse(existingManifest.config);
    }
  }
  if (batches.some((batch) => batch.configVersion !== config.configVersion))
    throw new Error('Static batch configVersion does not match public config');
  const categories = config.displayCategories;
  const existingVolume = await readJson<ReturnType<typeof buildStaticVolume>>(
    join(args.output, 'data/volume.json'),
  );
  let points: VolumePoint[];
  let remoteAvailable = !args.offline;
  if (args.volumeFile)
    points = (
      JSON.parse(await readFile(resolve(args.volumeFile), 'utf8')) as {
        points: VolumePoint[];
      }
    ).points;
  else {
    try {
      if (args.offline) throw new Error('offline');
      points = (
        await fetchJson<{ points: VolumePoint[] }>(
          `${args.site}/api/volume?range=2y&categories=${encodeURIComponent(categories.join(','))}`,
        )
      ).points;
    } catch (error) {
      if (!existingVolume || !batches.length) throw error;
      remoteAvailable = false;
      const target = batches[0].announcementDay.date;
      points = existingVolume.points.map((point) => ({
        announcementDate: point.announcementDate,
        counts: { ...point.counts },
      }));
      let point = points.find((item) => item.announcementDate === target);
      if (!point) {
        point = {
          announcementDate: target,
          counts: Object.fromEntries(categories.map((id) => [id, null])),
        };
        points.push(point);
      }
      batches.forEach((batch) => {
        point!.counts[batch.categoryId] = batch.dailyVolume.count;
      });
    }
  }
  const volume = buildStaticVolume(points, categories);
  const candidateDates = [...volume.points]
    .map((point) => point.announcementDate)
    .reverse();
  if (args.requiredDate && !candidateDates.includes(args.requiredDate))
    candidateDates.unshift(args.requiredDate);
  const selected = new Map<string, ReturnType<typeof buildStaticDay>>();
  for (const item of existingManifest?.days ?? []) {
    const old = await readJson<ReturnType<typeof buildStaticDay>>(
      join(args.output, `data/daily/${item.announcementDate}.json`),
    );
    if (!old?.analyses) continue;
    const oldCoverage = new Map(
      old.coverage.categories.map((coverage) => [coverage.categoryId, coverage]),
    );
    try {
      selected.set(
        item.announcementDate,
        buildStaticDay(
          {
            date: old.announcementDate,
            lastUpdated: old.lastUpdated,
            categories,
            coverage: categories.map(
              (categoryId) =>
                oldCoverage.get(categoryId) ?? {
                  categoryId,
                  expectedCount: null,
                  publishedCount: null,
                  databasePublicationCount: null,
                  complete: false,
                  requiredForCompletion: false,
                  status: 'not_collected' as const,
                },
            ),
            reports: old.analyses,
          },
          config,
        ),
      );
    } catch {
      /* no longer complete for current display categories */
    }
  }
  if (batches.length) {
    const date = batches[0].announcementDay.date;
    let remoteFeed: ReportFeed | undefined;
    if (remoteAvailable) {
      try {
        remoteFeed = await fetchJson<ReportFeed>(
          `${args.site}/api/reports?date=${encodeURIComponent(date)}&categories=${encodeURIComponent(categories.join(','))}`,
        );
      } catch {
        /* fall back to complete offline batch aggregation */
      }
    }
    selected.set(
      date,
      buildStaticDay(
        remoteFeed ??
          feedFromBatches(
            batches,
            categories,
            requiredCategories,
            selected.get(date),
          ),
        config,
      ),
    );
  }
  let complete = 0,
    inspected = 0;
  for (const date of new Set(candidateDates)) {
    if (complete >= args.days && date !== args.requiredDate) break;
    if (selected.has(date)) {
      complete += 1;
      continue;
    }
    if (!remoteAvailable || inspected >= Math.max(args.days * 4, 40)) continue;
    inspected += 1;
    try {
      const feed = await fetchJson<ReportFeed>(
        `${args.site}/api/reports?date=${encodeURIComponent(date)}&categories=${encodeURIComponent(categories.join(','))}`,
      );
      selected.set(date, buildStaticDay(feed, config));
      complete += 1;
    } catch (error) {
      if (date === args.requiredDate) throw error;
    }
  }
  if (!complete || (args.requiredDate && !selected.has(args.requiredDate)))
    throw new Error(
      'No complete required report day was available for the static mirror',
    );
  const days = [...selected.values()]
    .sort((a, b) => b.announcementDate.localeCompare(a.announcementDate))
    .slice(0, args.days);
  const generatedAt = days
    .map((day) => day.lastUpdated)
    .sort()
    .at(-1)!;
  const manifest: StaticMirrorManifestV2 = {
    schemaVersion: STATIC_MIRROR_SCHEMA_VERSION,
    latestDate: days[0].announcementDate,
    generatedAt,
    config,
    days: days.map((day) => ({
      announcementDate: day.announcementDate,
      expectedCount: day.coverage.expectedCount,
      publishedCount: day.coverage.publishedCount,
      aiDisclosureCount: day.aiDisclosureCount,
      complete: day.coverage.complete,
      lastUpdated: day.lastUpdated,
    })),
  };
  await writeJson(join(args.output, 'data/config.json'), config);
  await writeJson(join(args.output, 'data/volume.json'), volume);
  for (const day of days) {
    await writeJson(
      join(args.output, `data/daily/${day.announcementDate}.json`),
      day,
    );
    await writeText(
      join(args.output, `daily/${day.announcementDate}.md`),
      renderDailyMarkdown(day, config.site.name),
    );
    for (const report of day.analyses) {
      const slug = arxivSlug(report.arxivId),
        paperPath = join(args.output, `data/papers/${slug}.json`);
      const paper = mergeStaticPaper(
        await readJson<StaticPaperV2>(paperPath),
        report,
        config.displayCategories,
      );
      await writeJson(paperPath, paper);
      await writeText(
        join(args.output, `papers/${slug}.md`),
        renderPaperMarkdown(paper),
      );
    }
  }
  await writeJson(join(args.output, 'data/manifest.json'), manifest);
  await writeText(
    join(args.output, 'archive.md'),
    renderArchiveMarkdown(manifest),
  );
  await writeText(
    join(args.output, 'index.md'),
    renderDailyMarkdown(days[0], config.site.name),
  );
  await writeText(
    join(args.output, 'README.md'),
    `# ${config.site.name}内容镜像\n\n最新完整公告日：${manifest.latestDate}。\n\n- [最新日报](index.md)\n- [日期归档](archive.md)\n`,
  );
  process.stdout.write(
    `${JSON.stringify({ latestDate: manifest.latestDate, days: days.length, generatedAt, categories })}\n`,
  );
}
await main();
