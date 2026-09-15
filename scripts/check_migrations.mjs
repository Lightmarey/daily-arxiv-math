#!/usr/bin/env node

import { readFileSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';

const migrationDirectory = 'drizzle';
const journal = JSON.parse(
  readFileSync(join(migrationDirectory, 'meta', '_journal.json'), 'utf8'),
);
const sqlFiles = readdirSync(migrationDirectory)
  .filter((name) => /^\d{4}_.+\.sql$/.test(name))
  .sort();
const journalFiles = journal.entries.map((entry) => `${entry.tag}.sql`);

if (JSON.stringify(sqlFiles) !== JSON.stringify(journalFiles)) {
  console.error(
    'Migration SQL files and Drizzle journal entries do not match.',
  );
  process.exit(1);
}

const destructiveRules = [
  /\bDROP\s+(?:TABLE|COLUMN|INDEX)\b/i,
  /\bTRUNCATE\b/i,
  /\bDELETE\s+FROM\b/i,
  /\bALTER\s+TABLE\b[\s\S]*?\bRENAME\b/i,
  /\bALTER\s+TABLE\b[\s\S]*?\bALTER\s+COLUMN\b/i,
];

const unsafe = [];
const destructiveAllowlist = new Map([
  [
    '0002_lonely_chamber.sql',
    [
      'DROP TABLE `announcement_days`;',
      'DROP TABLE `automation_runs`;',
      'DROP TABLE `daily_volume`;',
      'DROP TABLE `report_entries`;',
    ],
  ],
]);
for (const file of sqlFiles) {
  let sql = readFileSync(join(migrationDirectory, file), 'utf8');
  for (const statement of destructiveAllowlist.get(file) ?? []) {
    if (!sql.includes(statement)) {
      console.error(
        `Allowlisted migration statement is missing from ${file}: ${statement}`,
      );
      process.exit(1);
    }
    sql = sql.replace(statement, '');
  }
  if (destructiveRules.some((rule) => rule.test(sql)))
    unsafe.push(basename(file));
}

if (unsafe.length) {
  console.error(
    `Destructive migration statements require an explicit migration plan: ${unsafe.join(', ')}`,
  );
  process.exit(1);
}

console.log(
  `Migration integrity check passed for ${sqlFiles.length} migrations.`,
);
