import type {
  CategoryHealth,
  HealthSnapshot,
  WeeklyVolumePoint,
} from './types';

export interface HealthSnapshotInput {
  checkedAt: string;
  categories: CategoryHealth[];
  latestCompleteWeek: WeeklyVolumePoint | null;
}
export function buildHealthSnapshot(
  input: HealthSnapshotInput,
): HealthSnapshot {
  if (!input.categories.length)
    return {
      status: 'ok',
      checkedAt: input.checkedAt,
      categories: [],
      latestCompleteWeek: null,
      checks: { database: true, coverage: true, weeklyVolume: true },
    };
  const database = input.categories.every((item) =>
    Boolean(
      item.latestAnnouncementDate &&
      item.latestSuccessfulRunAt &&
      item.hasDailyVolume,
    ),
  );
  const coverage =
    database &&
    input.categories.every(
      (item) =>
        item.complete &&
        item.expectedCount === item.publishedCount &&
        item.expectedCount === item.databasePublicationCount,
    );
  const weeklyVolume = Boolean(input.latestCompleteWeek?.complete);
  const checks = { database, coverage, weeklyVolume };
  return {
    status: Object.values(checks).every(Boolean) ? 'ok' : 'degraded',
    checkedAt: input.checkedAt,
    categories: input.categories,
    latestCompleteWeek: input.latestCompleteWeek,
    checks,
  };
}
export function unavailableHealthSnapshot(checkedAt: string): HealthSnapshot {
  return {
    status: 'degraded',
    checkedAt,
    categories: [],
    latestCompleteWeek: null,
    checks: { database: false, coverage: false, weeklyVolume: false },
  };
}
