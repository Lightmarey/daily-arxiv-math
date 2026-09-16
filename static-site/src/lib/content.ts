import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { publicTrackingConfigSchema } from '../../../lib/config';
import {
  STATIC_MIRROR_SCHEMA_VERSION,
  normalizeStaticReport,
  validateStaticDay,
  type StaticDayV4,
  type StaticMirrorManifestV4,
  type StaticVolumeV4,
} from '../../../lib/static-mirror';
import { archivedPaperReportInputSchema } from '../../../lib/validation';
import { contentRoot } from './runtime';

export interface StaticContent {
  manifest: StaticMirrorManifestV4;
  volume: StaticVolumeV4;
  days: StaticDayV4[];
}

async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, 'utf8')) as T;
}

function validateContent(content: StaticContent): void {
  const { manifest, volume, days } = content;
  if (
    manifest.schemaVersion !== STATIC_MIRROR_SCHEMA_VERSION ||
    volume.schemaVersion !== STATIC_MIRROR_SCHEMA_VERSION
  ) {
    throw new Error('Unsupported static mirror schema version');
  }
  if (
    !manifest.days.length ||
    manifest.latestDate !== manifest.days[0].announcementDate
  ) {
    throw new Error(
      'Manifest latest date does not match the first archived day',
    );
  }

  for (const [index, day] of days.entries()) {
    if (!day.coverage.complete) {
      throw new Error(`Incomplete static day ${day.announcementDate}`);
    }
    validateStaticDay(day);
    const entry = manifest.days[index];
    if (
      !entry ||
      entry.announcementDate !== day.announcementDate ||
      entry.expectedCount !== day.coverage.expectedCount ||
      entry.publishedCount !== day.coverage.publishedCount ||
      entry.lastUpdated !== day.lastUpdated
    )
      throw new Error(`Manifest mismatch for ${day.announcementDate}`);
    for (const report of day.analyses) {
      if (!archivedPaperReportInputSchema.safeParse(report).success) {
        throw new Error(
          `Invalid report ${report.arxivId} on ${day.announcementDate}`,
        );
      }
    }
  }
  for (const point of volume.points) {
    if (
      Object.values(point.counts).some(
        (value) => value !== null && (!Number.isInteger(value) || value < 0),
      )
    ) {
      throw new Error(`Invalid volume point ${point.announcementDate}`);
    }
  }
}

const cachedByRoot = new Map<string, Promise<StaticContent>>();

export function loadStaticContent(root = contentRoot()): Promise<StaticContent> {
  const resolvedRoot = resolve(root);
  let cached = cachedByRoot.get(resolvedRoot);
  cached ??= (async () => {
    const manifest = await readJson<StaticMirrorManifestV4>(
      join(resolvedRoot, 'data/manifest.json'),
    );
    const config = publicTrackingConfigSchema.parse(
      await readJson<unknown>(join(resolvedRoot, 'data/config.json')),
    );
    if (JSON.stringify(config) !== JSON.stringify(manifest.config)) {
      throw new Error('Public config does not match the static manifest');
    }
    const volume = await readJson<StaticVolumeV4>(
      join(resolvedRoot, 'data/volume.json'),
    );
    const days = (
      await Promise.all(
        manifest.days.map((entry) =>
          readJson<StaticDayV4>(
            join(resolvedRoot, `data/daily/${entry.announcementDate}.json`),
          ),
        ),
      )
    ).map((day) => ({
      ...day,
      analyses: day.analyses.map(normalizeStaticReport),
    }));
    const content = { manifest, volume, days };
    validateContent(content);
    return content;
  })();
  cachedByRoot.set(resolvedRoot, cached);
  return cached;
}
