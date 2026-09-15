import { defineConfig } from 'astro/config';
import { resolve } from 'node:path';

const base = process.env.STATIC_MIRROR_BASE_PATH ?? '/daily-arxiv-math';
const outDir = process.env.STATIC_MIRROR_OUT_DIR
  ? resolve(process.env.STATIC_MIRROR_OUT_DIR)
  : resolve('static-site/dist');

export default defineConfig({
  site: 'https://lightmarey.github.io',
  base,
  outDir,
  output: 'static',
  trailingSlash: 'always',
});
