import { NextResponse } from 'next/server';
import { getPublicConfig } from '@/lib/repository';

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    return NextResponse.json(await getPublicConfig(), {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json(
      { error: 'config_unavailable' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
