import type { VolumePoint, WeeklyVolumePoint } from './types';

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
function weekBounds(value: string): { weekStart: string; weekEnding: string } {
  const date = new Date(`${value}T00:00:00Z`);
  const isoWeekday = date.getUTCDay() || 7;
  const monday = new Date(date);
  monday.setUTCDate(date.getUTCDate() - (isoWeekday - 1));
  const friday = new Date(monday);
  friday.setUTCDate(monday.getUTCDate() + 4);
  return { weekStart: isoDate(monday), weekEnding: isoDate(friday) };
}

export function aggregateWeeklyVolumes(
  points: VolumePoint[],
  categories: string[],
): WeeklyVolumePoint[] {
  if (!points.length || !categories.length) return [];
  const ordered = [...points].sort((a, b) =>
    a.announcementDate.localeCompare(b.announcementDate),
  );
  const latestAnnouncementDate = ordered.at(-1)!.announcementDate;
  const weeks = new Map<string, WeeklyVolumePoint>();
  const datesByWeek = new Map<string, Set<string>>();
  for (const point of ordered) {
    const { weekStart, weekEnding } = weekBounds(point.announcementDate);
    if (weekEnding > latestAnnouncementDate) continue;
    const current = weeks.get(weekEnding) ?? {
      weekStart,
      weekEnding,
      counts: Object.fromEntries(categories.map((id) => [id, 0])),
      complete: true,
    };
    const dates = datesByWeek.get(weekEnding) ?? new Set<string>();
    dates.add(point.announcementDate);
    datesByWeek.set(weekEnding, dates);
    for (const id of categories) {
      const count = point.counts[id];
      if (count === null || count === undefined) {
        current.counts[id] = null;
        current.complete = false;
      } else if (current.counts[id] !== null)
        current.counts[id] = (current.counts[id] ?? 0) + count;
    }
    weeks.set(weekEnding, current);
  }
  for (const week of weeks.values()) {
    const expected = new Date(`${week.weekStart}T00:00:00Z`);
    const dates = datesByWeek.get(week.weekEnding) ?? new Set<string>();
    for (let offset = 0; offset < 5; offset += 1) {
      const date = new Date(expected);
      date.setUTCDate(expected.getUTCDate() + offset);
      if (!dates.has(isoDate(date))) week.complete = false;
    }
  }
  return [...weeks.values()].sort((a, b) =>
    a.weekEnding.localeCompare(b.weekEnding),
  );
}
