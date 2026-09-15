import { NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/auth';
export async function POST(request: Request) {
  if (!(await isAuthorized(request)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(
    {
      error:
        'ReportBatchV2 is retired; publish ReportBatchV3 to /api/ingest/v3',
    },
    { status: 410 },
  );
}
