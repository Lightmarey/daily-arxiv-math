import { NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/auth';
import { ingestBatchV3 } from '@/lib/repository';
import {
  BatchValidationError,
  ConfigConflictError,
} from '@/lib/repository-core';
import { reportBatchV3Schema } from '@/lib/validation';

export async function POST(request: Request) {
  if (!(await isAuthorized(request)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!request.headers.get('content-type')?.includes('application/json'))
    return NextResponse.json(
      { error: 'Expected application/json' },
      { status: 415 },
    );
  if (Number(request.headers.get('content-length') ?? 0) > 8_000_000)
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
  try {
    const parsed = reportBatchV3Schema.safeParse(await request.json());
    if (!parsed.success)
      return NextResponse.json(
        {
          error: 'Invalid or incomplete ReportBatchV3',
          issues: parsed.error.issues,
        },
        { status: 400 },
      );
    return NextResponse.json(await ingestBatchV3(parsed.data));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Ingestion failed' },
      {
        status:
          error instanceof ConfigConflictError
            ? 409
            : error instanceof BatchValidationError
              ? 400
              : 500,
      },
    );
  }
}
