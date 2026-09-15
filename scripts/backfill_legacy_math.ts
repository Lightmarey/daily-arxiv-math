import { normalizeLegacyAnalysisFields } from '../lib/legacy-math-backfill';
import type { ProofOutline } from '../lib/types';
import { localD1 } from './local_d1';

type StoredReport = {
  id: string;
  progress_type: string;
  work_summary: string;
  techniques_json: string;
  breakthrough: string;
  limitations: string;
  proof_outline_json: string;
  priority_reason: string;
  low_priority_reason: string | null;
  revision_summary: string | null;
};

function parseJson<T>(value: string, field: string, reportId: string): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    throw new Error(`Invalid ${field} JSON for ${reportId}`);
  }
}

function parseTechniques(row: StoredReport): string[] {
  const value = parseJson<unknown>(row.techniques_json, 'techniques', row.id);
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string'))
    throw new Error(`Invalid techniques JSON for ${row.id}`);
  return value;
}

function parseProofOutline(row: StoredReport): ProofOutline {
  const value = parseJson<unknown>(
    row.proof_outline_json,
    'proof outline',
    row.id,
  );
  if (
    !value ||
    typeof value !== 'object' ||
    !Array.isArray((value as ProofOutline).steps)
  )
    throw new Error(`Invalid proof outline JSON for ${row.id}`);
  return value as ProofOutline;
}

const apply = process.argv.includes('--apply');
if (process.argv.slice(2).some((value) => value !== '--apply'))
  throw new Error('Usage: npm run math:backfill [-- --apply]');

const { miniflare, db } = await localD1();
try {
  const rows = await db
    .prepare(
      'SELECT id, progress_type, work_summary, techniques_json, breakthrough, limitations, proof_outline_json, priority_reason, low_priority_reason, revision_summary FROM tracking_reports',
    )
    .all<StoredReport>();
  const updates = rows.results.flatMap((row) => {
    const normalized = normalizeLegacyAnalysisFields({
      progressType: row.progress_type,
      workSummary: row.work_summary,
      techniques: parseTechniques(row),
      breakthrough: row.breakthrough,
      limitations: row.limitations,
      proofOutline: parseProofOutline(row),
      priorityReason: row.priority_reason,
      lowPriorityReason: row.low_priority_reason,
      revisionSummary: row.revision_summary,
    });
    if (!normalized.changedFields) return [];
    const value = normalized.value;
    return [
      db
        .prepare(
          'UPDATE tracking_reports SET progress_type = ?, work_summary = ?, techniques_json = ?, breakthrough = ?, limitations = ?, proof_outline_json = ?, priority_reason = ?, low_priority_reason = ?, revision_summary = ? WHERE id = ?',
        )
        .bind(
          value.progressType,
          value.workSummary,
          JSON.stringify(value.techniques),
          value.breakthrough,
          value.limitations,
          JSON.stringify(value.proofOutline),
          value.priorityReason,
          value.lowPriorityReason,
          value.revisionSummary,
          row.id,
        ),
    ];
  });
  if (apply && updates.length) await db.batch(updates);
  process.stdout.write(
    `${JSON.stringify({ mode: apply ? 'apply' : 'dry-run', scanned: rows.results.length, changed: updates.length })}\n`,
  );
} finally {
  await miniflare.dispose();
}
