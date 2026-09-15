import { sites } from '@openai/sites-vite-plugin';
import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig } from 'vite';
import { execFile } from 'node:child_process';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';
import hostingConfig from './.openai/hosting.json';

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  '00000000-0000-4000-8000-000000000000';

const { d1, r2 } = hostingConfig;

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === 'seatbelt';

function localConfigWatcher(): Plugin {
  return {
    name: 'local-config-watcher',
    configureServer(server) {
      const paths = [
        resolve('config.local.json'),
        resolve('config.example.json'),
      ];
      server.watcher.add(paths);
      let timer: ReturnType<typeof setTimeout> | undefined;
      let child: ReturnType<typeof execFile> | undefined;
      let running = false;
      let dirty = false;
      let closed = false;
      const importLatest = () => {
        if (closed) return;
        if (running) {
          dirty = true;
          return;
        }
        running = true;
        dirty = false;
        child = execFile(
          process.execPath,
          [
            resolve('node_modules/tsx/dist/cli.mjs'),
            resolve('scripts/import_config.ts'),
          ],
          { cwd: process.cwd() },
          (error, stdout, stderr) => {
            child = undefined;
            running = false;
            if (error)
              server.config.logger.error(
                `[config] invalid update kept out of D1: ${stderr || error.message}`,
              );
            else
              server.config.logger.info(`[config] imported: ${stdout.trim()}`);
            if (dirty) importLatest();
          },
        );
      };
      server.watcher.on('all', (_event: string, changed: string) => {
        if (!paths.includes(resolve(changed))) return;
        clearTimeout(timer);
        timer = setTimeout(importLatest, 150);
      });
      server.httpServer?.once('close', () => {
        closed = true;
        clearTimeout(timer);
        child?.kill();
      });
    },
  };
}

const localBindingConfig = {
  main: 'vinext/server/fetch-handler',
  compatibility_flags: ['nodejs_compat'],
  d1_databases: d1
    ? [
        {
          binding: d1,
          database_name: 'site-creator-d1',
          database_id: SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
        },
      ]
    : [],
  r2_buckets: r2
    ? [
        {
          binding: r2,
          bucket_name: 'site-creator-r2',
        },
      ]
    : [],
};

export default defineConfig(async () => {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= 'false';
  process.env.WRANGLER_LOG_PATH ??= '.wrangler/logs';
  process.env.MINIFLARE_REGISTRY_PATH ??= '.wrangler/registry';

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import('@cloudflare/vite-plugin');

  return {
    css: { postcss: { plugins: [tailwindcss()] } },
    server: {
      watch: {
        ignored: ['**/artifacts/**'],
        ...(isCodexSeatbeltSandbox
          ? { useFsEvents: false, usePolling: true }
          : {}),
      },
    },
    plugins: [
      vinext(),
      sites(),
      localConfigWatcher(),
      cloudflare({
        viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] },
        config: localBindingConfig,
      }),
    ],
  };
});
