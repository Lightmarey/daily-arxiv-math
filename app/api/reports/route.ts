import { NextResponse } from 'next/server';
import { loadDashboardFeed } from '@/lib/repository';

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const date = params.get('date') ?? undefined;
  const requested = params
    .get('categories')
    ?.split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  try {
    const feed = await loadDashboardFeed(
      date,
      requested?.length ? requested : undefined,
    );
    return NextResponse.json(feed);
  } catch {
    return NextResponse.json(
      { date: date ?? null, error: 'data_unavailable', reports: [] },
      { status: 503 },
    );
  }
}
