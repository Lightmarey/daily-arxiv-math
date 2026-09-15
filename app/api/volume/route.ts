import { NextResponse } from 'next/server';
import { getPublicConfig, listVolumes } from '@/lib/repository';
import { aggregateWeeklyVolumes } from '@/lib/volume';

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const range = params.get('range') === '2y' ? '2y' : '6m';
    const config = await getPublicConfig();
    const requested = params
      .get('categories')
      ?.split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    const categories = requested?.length ? requested : config.displayCategories;
    const points = await listVolumes('2y', categories);
    const weeks = aggregateWeeklyVolumes(points, categories);
    const selectedWeeks = range === '6m' ? weeks.slice(-26) : weeks;
    const firstWeekStart = selectedWeeks[0]?.weekStart;
    return NextResponse.json({
      range,
      categories,
      points:
        range === '6m' && firstWeekStart
          ? points.filter((point) => point.announcementDate >= firstWeekStart)
          : points,
      weeks: selectedWeeks,
    });
  } catch {
    return NextResponse.json(
      { error: 'data_unavailable', points: [], weeks: [] },
      { status: 503 },
    );
  }
}
