import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const commands = [
  [
    process.execPath,
    [resolve('node_modules/tsx/dist/cli.mjs'), 'tests/config.test.ts'],
  ],
  [
    process.execPath,
    [resolve('node_modules/tsx/dist/cli.mjs'), 'tests/validation.test.ts'],
  ],
  [
    process.execPath,
    [resolve('node_modules/tsx/dist/cli.mjs'), 'tests/volume.test.ts'],
  ],
  [
    process.execPath,
    [resolve('node_modules/tsx/dist/cli.mjs'), 'tests/math-text.test.ts'],
  ],
  [
    process.execPath,
    [resolve('node_modules/tsx/dist/cli.mjs'), 'tests/static-mirror.test.ts'],
  ],
  [
    process.execPath,
    [resolve('node_modules/tsx/dist/cli.mjs'), 'tests/radar.test.ts'],
  ],
  ['python', ['-m', 'unittest', 'discover', '-s', 'tests', '-p', 'test_*.py']],
];
for (const [command, args] of commands) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    env: { ...process.env, PYTHONPATH: 'scripts' },
    shell: false,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
