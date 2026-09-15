import { execFile } from 'node:child_process';
import {
  access,
  cp,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
import { loadStaticContent } from '../static-site/src/lib/content';

interface Args {
  content: string;
  out: string;
  basePath: string;
}

const run = promisify(execFile);

function parseArgs(argv: string[]): Args {
  const values = new Map<string, string>();
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith('--') || !value) {
      throw new Error(`Invalid argument ${key}`);
    }
    values.set(key.slice(2), value);
  }
  const content = values.get('content');
  const out = values.get('out');
  if (!content || !out) {
    throw new Error(
      'Usage: build_static_pages.ts --content <dir> --out <dir> [--base-path /daily-arxiv-math]',
    );
  }
  const rawBase = values.get('base-path') ?? '/daily-arxiv-math';
  const basePath =
    rawBase === '/' ? '' : `/${rawBase.replace(/^\/+|\/+$/g, '')}`;
  return { content: resolve(content), out: resolve(out), basePath };
}

async function htmlFilesBelow(path: string): Promise<string[]> {
  const files: string[] = [];
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const child = join(path, entry.name);
    if (entry.isDirectory()) files.push(...(await htmlFilesBelow(child)));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(child);
  }
  return files;
}

async function validateBuiltLinks(
  out: string,
  basePath: string,
): Promise<void> {
  const localPrefix = `${basePath}/`.replace(/\/{2,}/g, '/');
  for (const file of await htmlFilesBelow(out)) {
    const html = await readFile(file, 'utf8');
    for (const match of html.matchAll(/(?:href|src)="([^"]*)"/g)) {
      const href = match[1];
      if (
        !href ||
        href.startsWith('#') ||
        /^(?:https?:|mailto:|data:)/.test(href)
      ) {
        continue;
      }
      if (!href.startsWith(localPrefix)) {
        throw new Error(`Link escapes Pages base path in ${file}: ${href}`);
      }
      let relative = decodeURIComponent(href.slice(localPrefix.length)).split(
        /[?#]/,
        1,
      )[0];
      if (!relative || relative.endsWith('/')) {
        relative = `${relative}index.html`;
      }
      await access(join(out, relative));
    }
  }
}

export async function buildStaticPages(args: Args): Promise<{
  latestDate: string;
  days: number;
  analyses: number;
}> {
  const content = resolve(args.content);
  const out = resolve(args.out);
  const root = resolve('static-site');
  const astroOut = await mkdtemp(join(root, '.build-'));
  const env = {
    ...process.env,
    STATIC_MIRROR_CONTENT_DIR: content,
    STATIC_MIRROR_OUT_DIR: astroOut,
    STATIC_MIRROR_BASE_PATH: args.basePath,
  };
  process.env.STATIC_MIRROR_CONTENT_DIR = content;
  process.env.STATIC_MIRROR_OUT_DIR = astroOut;
  process.env.STATIC_MIRROR_BASE_PATH = args.basePath;
  const staticContent = await loadStaticContent();

  try {
    await rm(out, { recursive: true, force: true });
    await run(
      process.execPath,
      [resolve('node_modules/astro/bin/astro.mjs'), 'build', '--root', root],
      { cwd: resolve('.'), env, maxBuffer: 10 * 1024 * 1024 },
    );
    await cp(astroOut, out, { recursive: true });
    await writeFile(join(out, '.nojekyll'), '', 'utf8');
    await validateBuiltLinks(out, args.basePath);
    return {
      latestDate: staticContent.manifest.latestDate,
      days: staticContent.days.length,
      analyses: staticContent.days.reduce(
        (count, day) => count + day.analyses.length,
        0,
      ),
    };
  } finally {
    await rm(astroOut, { recursive: true, force: true });
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const result = await buildStaticPages(parseArgs(process.argv.slice(2)));
  process.stdout.write(`${JSON.stringify(result)}\n`);
}
