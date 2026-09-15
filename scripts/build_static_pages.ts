import {
  access,
  cp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import katex from 'katex';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { normalizeMathText } from '../lib/math-text';
import {
  STATIC_MIRROR_SCHEMA_VERSION,
  arxivSlug,
  normalizeStaticReport,
  type StaticDayV2,
  type StaticMirrorManifestV2,
  type StaticPaperV2,
  type StaticVolumeV2,
} from '../lib/static-mirror';
import { publicTrackingConfigSchema } from '../lib/config';
import type { PaperReport } from '../lib/types';
import { paperReportInputSchema } from '../lib/validation';

interface Args {
  content: string;
  out: string;
  basePath: string;
}

function parseArgs(argv: string[]): Args {
  const values = new Map<string, string>();
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith('--') || !value)
      throw new Error(`Invalid argument ${key}`);
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

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function scriptJson(value: unknown): string {
  return JSON.stringify(value)
    .replaceAll('<', '\\u003c')
    .replaceAll('\u2028', '\\u2028')
    .replaceAll('\u2029', '\\u2029');
}

function markdownToHtml(markdown: string): string {
  const normalized = normalizeMathText(markdown).replace(
    /\$\$([\s\S]*?)\$\$|\$([^$\n]*?)\$/g,
    (fragment, display: string | undefined, inline: string | undefined) => {
      const source = display ?? inline ?? '';
      try {
        katex.renderToString(source, {
          displayMode: display !== undefined,
          strict: 'ignore',
          throwOnError: true,
        });
        return fragment;
      } catch {
        const longestTicks = Math.max(
          0,
          ...Array.from(source.matchAll(/`+/g), (match) => match[0].length),
        );
        const fence = '`'.repeat(longestTicks + 1);
        return `${fence}${source}${fence}`;
      }
    },
  );
  return renderToStaticMarkup(
    createElement(
      ReactMarkdown,
      {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      },
      normalized,
    ),
  );
}

function inlineMarkdownToHtml(markdown: string): string {
  return markdownToHtml(markdown).replace(/^<p>([\s\S]*)<\/p>$/, '$1');
}

function pathUrl(basePath: string, value = ''): string {
  const suffix = value.replace(/^\/+/, '');
  return `${basePath}/${suffix}`.replace(/\/{2,}/g, '/');
}

function paperUrl(basePath: string, arxivId: string): string {
  return pathUrl(basePath, `papers/${arxivSlug(arxivId)}/`);
}

function priorityLabel(report: PaperReport): string {
  if (report.priorityTier === 'high') return '高优先级';
  if (report.priorityTier === 'medium') return '中优先级';
  return '低阅读优先级';
}

function proofOutlineHtml(report: PaperReport): string {
  if (report.proofOutline.status === 'not_reviewed') return '尚未补读正文';
  if (report.proofOutline.status === 'not_applicable')
    return '正文不采用定理证明结构';
  return `<ol>${report.proofOutline.steps
    .map(
      (step) =>
        `<li><div class="proof-claim">${markdownToHtml(step.claim)}</div><div>路线：${markdownToHtml(step.route)}</div></li>`,
    )
    .join('')}</ol>`;
}

function aiLabel(status: PaperReport['aiStatus']): string {
  if (status === 'explicit') return '明确披露 AI 使用';
  if (status === 'no_disclosure_observed') return '已核查未见 AI 披露';
  return '尚未核查 AI 声明';
}

function renderPaperCard(report: PaperReport, basePath: string): string {
  const search = [
    report.title,
    ...report.authors,
    report.abstract,
    report.workSummary,
    ...report.proofOutline.steps.flatMap((step) => [
      step.claim,
      step.route,
      step.evidence,
    ]),
  ]
    .join(' ')
    .toLocaleLowerCase('zh-CN');
  return `<article class="paper" data-paper data-ai="${report.aiStatus}" data-topic="${escapeHtml(`${report.categoryId}:${report.topicId}`)}" data-priority="${report.priorityTier}" data-search="${escapeHtml(search)}">
  <div class="paper-meta"><span>${escapeHtml(report.categories.join(' · '))}</span><span>${report.priorityScore} · ${priorityLabel(report)}</span></div>
  <p class="progress">${inlineMarkdownToHtml(report.progressType)}</p>
  <p class="analysis-depth">${report.analysisDepth === 'abstract' ? '摘要级分析' : '已补读正文关键部分'}</p>
  <h4><a href="${paperUrl(basePath, report.arxivId)}">${inlineMarkdownToHtml(report.title)}</a></h4>
  <p class="authors">${escapeHtml(report.authors.join(' · '))}</p>
  <dl>
    <div><dt>完成的工作</dt><dd>${inlineMarkdownToHtml(report.workSummary)}</dd></div>
    <div><dt>技术</dt><dd>${report.techniques.map(inlineMarkdownToHtml).join(' · ')}</dd></div>
    <div><dt>可能的突破</dt><dd>${inlineMarkdownToHtml(report.breakthrough)}</dd></div>
    <div><dt>需谨慎处</dt><dd>${inlineMarkdownToHtml(report.limitations)}</dd></div>
    <div><dt>证明逻辑/大纲</dt><dd>${proofOutlineHtml(report)}</dd></div>
    <div><dt>排序理由</dt><dd>${inlineMarkdownToHtml(report.lowPriorityReason ?? report.priorityReason)}</dd></div>
  </dl>
  <a class="detail-link" href="${paperUrl(basePath, report.arxivId)}">完整分析 →</a>
</article>`;
}

function renderInteractiveReports(day: StaticDayV2, basePath: string): string {
  const statuses: PaperReport['aiStatus'][] = [
    'not_checked',
    'no_disclosure_observed',
    'explicit',
  ];
  const groups = statuses
    .map((aiStatus) => {
      const reports = day.reports.filter(
        (report) => report.aiStatus === aiStatus,
      );
      if (!reports.length) return '';
      const topics = [
        ...new Map(
          reports.map((report) => [
            `${report.categoryId}:${report.topicId}`,
            {
              key: `${report.categoryId}:${report.topicId}`,
              label: report.topicLabel,
            },
          ]),
        ).values(),
      ]
        .map((topic) => {
          const topicReports = reports.filter(
            (report) => `${report.categoryId}:${report.topicId}` === topic.key,
          );
          if (!topicReports.length) return '';
          return `<section class="topic-group" data-group data-ai="${aiStatus}" data-topic="${escapeHtml(topic.key)}">
          <div class="topic-heading"><h3>${escapeHtml(topic.label)}</h3><span data-group-count>${topicReports.length}</span></div>
          ${topicReports.map((report) => renderPaperCard(report, basePath)).join('\n')}
        </section>`;
        })
        .join('\n');
      return `<section class="ai-group" data-ai-group="${aiStatus}">
        <h2>${aiLabel(aiStatus)}</h2>
        ${topics}
      </section>`;
    })
    .join('\n');
  return `${groups}<p class="empty" data-empty hidden>当前筛选条件下没有论文。</p>`;
}

function renderControls(
  day: StaticDayV2,
  manifest: StaticMirrorManifestV2,
): string {
  return `<form class="filters" data-filters>
    <label><span>公告日</span><select name="date" data-date>${manifest.days
      .map(
        (entry) =>
          `<option value="${entry.announcementDate}"${entry.announcementDate === day.announcementDate ? ' selected' : ''}>${entry.announcementDate}</option>`,
      )
      .join('')}</select></label>
    <label class="search"><span>搜索</span><input name="q" type="search" placeholder="题目、作者或摘要" autocomplete="off"></label>
    <label><span>主题</span><select name="topic"><option value="all">全部主题</option>${[...new Map(day.reports.map((report) => [`${report.categoryId}:${report.topicId}`, report.topicLabel])).entries()].map(([key, label]) => `<option value="${escapeHtml(key)}">${escapeHtml(label)}</option>`).join('')}</select></label>
    <label><span>AI 状态</span><select name="ai"><option value="all">全部</option><option value="not_checked">尚未核查</option><option value="no_disclosure_observed">已核查未见披露</option><option value="explicit">明确披露使用</option></select></label>
    <label><span>优先级</span><select name="priority"><option value="all">全部</option><option value="high">高</option><option value="medium">中</option><option value="low">低</option></select></label>
  </form>`;
}

function renderOverview(day: StaticDayV2): string {
  const breakthroughs = day.overview.breakthroughPoints.length
    ? day.overview.breakthroughPoints
        .map(
          (item) =>
            `<li><strong>${inlineMarkdownToHtml(item.title)}</strong>：${inlineMarkdownToHtml(item.summary)}</li>`,
        )
        .join('')
    : '<li>本期没有足够证据支持单独标注突破点。</li>';
  const cautions = day.overview.cautions.length
    ? day.overview.cautions
        .map((item) => `<li>${inlineMarkdownToHtml(item)}</li>`)
        .join('')
    : '<li>仍建议回查原论文的精确定理、假设和证明细节。</li>';
  return `<section class="overview">
    <div><p class="eyebrow">Daily synthesis</p><h2>当日总览</h2></div>
    <div class="overview-row"><h3>主要方向与技术进展</h3><div>${day.overview.mainProgress.map((item) => `<p>${inlineMarkdownToHtml(item)}</p>`).join('')}</div></div>
    <div class="overview-row"><h3>可能的突破点</h3><ul>${breakthroughs}</ul></div>
    <div class="overview-row"><h3>需谨慎处</h3><ul>${cautions}</ul></div>
  </section>`;
}

function layout(options: {
  title: string;
  description: string;
  body: string;
  basePath: string;
  data?: unknown;
  siteName: string;
}): string {
  const { title, description, body, basePath, data, siteName } = options;
  return `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}">
<link rel="stylesheet" href="${pathUrl(basePath, 'assets/site.css')}"><link rel="stylesheet" href="${pathUrl(basePath, 'assets/katex/katex.min.css')}"></head>
<body data-base-path="${escapeHtml(basePath)}"><header class="site-header"><div><a class="brand" href="${pathUrl(basePath)}"><i>A.</i><span>${escapeHtml(siteName)}</span></a><nav><a href="${pathUrl(basePath, 'archive/')}">日期归档</a></nav></div></header>
<main>${body}</main><footer>静态只读镜像 · 自动生成的阅读指南，关键结论请回查原论文。</footer>
${data === undefined ? '' : `<script id="mirror-data" type="application/json">${scriptJson(data)}</script>`}<script src="${pathUrl(basePath, 'assets/site.js')}" defer></script></body></html>`;
}

function renderDayPage(
  day: StaticDayV2,
  manifest: StaticMirrorManifestV2,
  volume: StaticVolumeV2,
  markdownHtml: string,
  basePath: string,
): string {
  const body = `<div class="page-head"><p class="eyebrow">${day.announcementDate}</p><h1>今日值得读什么</h1><p>完整收录 ${day.coverage.publishedCount} / ${day.coverage.expectedCount} · 明确披露 AI 协作 ${day.aiDisclosureCount} 篇</p></div>
  ${renderOverview(day)}
  <section class="reports"><div class="section-head"><h2>全部论文</h2><p>按主题与阅读优先级排列</p></div>${renderControls(day, manifest)}<div data-report-list>${renderInteractiveReports(day, basePath)}</div></section>
  <section class="trend"><div class="section-head"><div><p class="eyebrow">Publication pulse</p><h2>每周发文趋势</h2></div><button type="button" data-trend-toggle>展开至 2 年</button></div><p>按配置分类统计 New submissions 与 Cross-lists；缺失公告不会补成零。</p><div class="trend-legend">${manifest.config.categories
    .filter((item) => manifest.config.displayCategories.includes(item.id))
    .map(
      (item) =>
        `<span style="color:${item.color ?? 'currentColor'}">${escapeHtml(item.id)}</span>`,
    )
    .join('')}</div><div class="chart" data-chart></div></section>
  <details class="markdown-copy"><summary>查看 Markdown 版全文</summary><div class="markdown-body">${markdownHtml}</div></details>`;
  return layout({
    title: `${day.announcementDate} · ${manifest.config.site.name}`,
    description: manifest.config.site.description,
    body,
    basePath,
    data: { day, manifest, volume },
    siteName: manifest.config.site.name,
  });
}

async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, 'utf8')) as T;
}

async function writePage(path: string, html: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, html, 'utf8');
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
      if (!href || href.startsWith('#') || /^(?:https?:|mailto:)/.test(href))
        continue;
      if (!href.startsWith(localPrefix)) {
        throw new Error(`Link escapes Pages base path in ${file}: ${href}`);
      }
      let relative = decodeURIComponent(href.slice(localPrefix.length)).split(
        /[?#]/,
        1,
      )[0];
      if (!relative || relative.endsWith('/'))
        relative = `${relative}index.html`;
      await access(join(out, relative));
    }
  }
}

function validateContent(
  manifest: StaticMirrorManifestV2,
  days: StaticDayV2[],
  volume: StaticVolumeV2,
  papers: StaticPaperV2[],
): void {
  if (
    manifest.schemaVersion !== STATIC_MIRROR_SCHEMA_VERSION ||
    volume.schemaVersion !== STATIC_MIRROR_SCHEMA_VERSION
  ) {
    throw new Error('Unsupported static mirror schema version');
  }
  if (
    !manifest.days.length ||
    manifest.latestDate !== manifest.days[0].announcementDate
  ) {
    throw new Error(
      'Manifest latest date does not match the first archived day',
    );
  }
  const ids = new Set<string>();
  const paperById = new Map(papers.map((paper) => [paper.arxivId, paper]));
  for (const day of days) {
    if (
      day.schemaVersion !== STATIC_MIRROR_SCHEMA_VERSION ||
      !day.coverage.complete
    )
      throw new Error(`Incomplete static day ${day.announcementDate}`);
    for (const coverage of day.coverage.categories) {
      const count = day.analyses.filter(
        (report) =>
          report.categoryId === coverage.categoryId &&
          report.entryKind !== 'revision',
      ).length;
      if (coverage.status === 'not_collected') {
        if (coverage.requiredForCompletion || count !== 0)
          throw new Error(
            `Missing required coverage for ${coverage.categoryId} on ${day.announcementDate}`,
          );
        continue;
      }
      if (
        coverage.status !== 'complete' ||
        !coverage.complete ||
        coverage.expectedCount === null ||
        count !== coverage.expectedCount ||
        coverage.publishedCount !== coverage.expectedCount
      )
        throw new Error(
          `Coverage mismatch for ${coverage.categoryId} on ${day.announcementDate}`,
        );
    }
    day.analyses.forEach((report) => {
      if (!paperReportInputSchema.safeParse(report).success)
        throw new Error(
          `Invalid report ${report.arxivId} on ${day.announcementDate}`,
        );
      ids.add(report.arxivId);
      const paper = paperById.get(report.arxivId);
      if (
        !paper?.history.some(
          (item) =>
            item.announcementDate === day.announcementDate &&
            item.report.categoryId === report.categoryId &&
            item.report.version === report.version,
        )
      ) {
        throw new Error(
          `Paper history does not cover ${report.arxivId} on ${day.announcementDate}`,
        );
      }
    });
  }
  const paperIds = new Set(papers.map((paper) => paper.arxivId));
  for (const id of ids)
    if (!paperIds.has(id)) throw new Error(`Missing paper record for ${id}`);
  for (const point of volume.points) {
    if (
      Object.values(point.counts).some(
        (value) => value !== null && (!Number.isInteger(value) || value < 0),
      )
    )
      throw new Error(`Invalid volume point ${point.announcementDate}`);
  }
}

export async function buildStaticPages(args: Args): Promise<{
  latestDate: string;
  days: number;
  papers: number;
}> {
  const manifest = await readJson<StaticMirrorManifestV2>(
    join(args.content, 'data/manifest.json'),
  );
  const publicConfig = publicTrackingConfigSchema.parse(
    await readJson<unknown>(join(args.content, 'data/config.json')),
  );
  if (JSON.stringify(publicConfig) !== JSON.stringify(manifest.config)) {
    throw new Error('Public config does not match the static manifest');
  }
  const volume = await readJson<StaticVolumeV2>(
    join(args.content, 'data/volume.json'),
  );
  const days = (
    await Promise.all(
      manifest.days.map((entry) =>
        readJson<StaticDayV2>(
          join(args.content, `data/daily/${entry.announcementDate}.json`),
        ),
      ),
    )
  ).map((day) => ({
    ...day,
    reports: day.reports.map(normalizeStaticReport),
    analyses: day.analyses.map(normalizeStaticReport),
  }));
  const paperFiles = (await readdir(join(args.content, 'data/papers'))).filter(
    (name) => name.endsWith('.json'),
  );
  const papers = (
    await Promise.all(
      paperFiles.map((name) =>
        readJson<StaticPaperV2>(join(args.content, 'data/papers', name)),
      ),
    )
  ).map((paper) => ({
    ...paper,
    latest: normalizeStaticReport(paper.latest),
    history: paper.history.map((item) => ({
      ...item,
      report: normalizeStaticReport(item.report),
    })),
  }));
  validateContent(manifest, days, volume, papers);

  await rm(args.out, { recursive: true, force: true });
  await mkdir(join(args.out, 'assets/katex'), { recursive: true });
  await cp(
    resolve('static-mirror/site.css'),
    join(args.out, 'assets/site.css'),
  );
  await cp(resolve('static-mirror/site.js'), join(args.out, 'assets/site.js'));
  await cp(
    resolve('node_modules/katex/dist/katex.min.css'),
    join(args.out, 'assets/katex/katex.min.css'),
  );
  await cp(
    resolve('node_modules/katex/dist/fonts'),
    join(args.out, 'assets/katex/fonts'),
    { recursive: true },
  );
  await cp(join(args.content, 'data'), join(args.out, 'data'), {
    recursive: true,
  });
  await writeFile(join(args.out, '.nojekyll'), '', 'utf8');

  for (const day of days) {
    const markdown = await readFile(
      join(args.content, `daily/${day.announcementDate}.md`),
      'utf8',
    );
    const html = renderDayPage(
      day,
      manifest,
      volume,
      markdownToHtml(markdown),
      args.basePath,
    );
    await writePage(
      join(args.out, `daily/${day.announcementDate}/index.html`),
      html,
    );
    if (day.announcementDate === manifest.latestDate)
      await writePage(join(args.out, 'index.html'), html);
  }
  for (const paper of papers) {
    if (paper.slug !== arxivSlug(paper.arxivId))
      throw new Error(`Invalid paper slug for ${paper.arxivId}`);
    const markdown = await readFile(
      join(args.content, `papers/${paper.slug}.md`),
      'utf8',
    );
    const body = `<article class="markdown-body paper-page">${markdownToHtml(markdown)}</article>`;
    await writePage(
      join(args.out, `papers/${paper.slug}/index.html`),
      layout({
        title: `${paper.latest.title} · ${manifest.config.site.name}`,
        description: paper.latest.workSummary,
        body,
        basePath: args.basePath,
        siteName: manifest.config.site.name,
      }),
    );
  }
  const archiveMarkdown = await readFile(
    join(args.content, 'archive.md'),
    'utf8',
  );
  const archiveHtml = markdownToHtml(archiveMarkdown).replace(
    /href="daily\/(\d{4}-\d{2}-\d{2})\.md"/g,
    (_match, date: string) =>
      `href="${pathUrl(args.basePath, `daily/${date}/`)}"`,
  );
  await writePage(
    join(args.out, 'archive/index.html'),
    layout({
      title: `日期归档 · ${manifest.config.site.name}`,
      description: `${manifest.config.site.name}静态归档`,
      body: `<article class="markdown-body archive-page">${archiveHtml}</article>`,
      basePath: args.basePath,
      siteName: manifest.config.site.name,
    }),
  );
  await validateBuiltLinks(args.out, args.basePath);
  return {
    latestDate: manifest.latestDate,
    days: days.length,
    papers: papers.length,
  };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const result = await buildStaticPages(parseArgs(process.argv.slice(2)));
  process.stdout.write(`${JSON.stringify(result)}\n`);
}
