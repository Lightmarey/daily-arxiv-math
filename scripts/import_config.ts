import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseTrackingConfig } from '../lib/config';
import { TrackingRepository } from '../lib/repository-core';
import { localD1 } from './local_d1';

function value(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}
const explicit = value('--config');
const local = resolve(explicit ?? 'config.local.json');
const configPath = existsSync(local)
  ? local
  : explicit
    ? local
    : resolve('config.example.json');
if (!existsSync(configPath))
  throw new Error(`Configuration file not found: ${configPath}`);
const config = parseTrackingConfig(
  JSON.parse(readFileSync(configPath, 'utf8')),
);
const { miniflare, db } = await localD1();
try {
  const result = await new TrackingRepository(db).importConfig(config);
  process.stdout.write(`${JSON.stringify({ configPath, ...result })}\n`);
} finally {
  await miniflare.dispose();
}
