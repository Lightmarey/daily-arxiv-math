import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { localD1 } from './local_d1';

const journal = JSON.parse(
  await readFile(join('drizzle', 'meta', '_journal.json'), 'utf8'),
) as { entries: Array<{ idx: number; tag: string; when: number }> };
const { miniflare, db } = await localD1();
try {
  await db
    .prepare(
      'CREATE TABLE IF NOT EXISTS d1_migrations (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE, applied_at TEXT NOT NULL)',
    )
    .run();
  const applied = await db
    .prepare('SELECT name FROM d1_migrations')
    .all<{ name: string }>();
  const names = new Set(applied.results.map((row) => row.name));
  for (const entry of journal.entries) {
    if (names.has(entry.tag)) continue;
    const sql = await readFile(join('drizzle', `${entry.tag}.sql`), 'utf8');
    const statements = sql
      .split('--> statement-breakpoint')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => db.prepare(item));
    statements.push(
      db
        .prepare(
          'INSERT INTO d1_migrations (id, name, applied_at) VALUES (?, ?, ?)',
        )
        .bind(entry.idx, entry.tag, new Date().toISOString()),
    );
    await db.batch(statements);
    process.stdout.write(`Applied local migration ${entry.tag}\n`);
  }
} finally {
  await miniflare.dispose();
}
