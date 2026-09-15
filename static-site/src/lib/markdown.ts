import { createElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { normalizeMathText } from '../../../lib/math-text';

function MarkdownLink({ href, children }: { href?: string; children?: ReactNode }) {
  if (!href?.startsWith('https://')) {
    return createElement('span', null, '[', children, '](', href ?? '', ')');
  }

  return createElement('a', { href, rel: 'noreferrer' }, children);
}

export function markdownToHtml(markdown: string): string {
  return renderToStaticMarkup(
    createElement(
      ReactMarkdown,
      {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
        components: { a: MarkdownLink },
      },
      normalizeMathText(markdown),
    ),
  );
}

export function inlineMarkdownToHtml(markdown: string): string {
  return markdownToHtml(markdown).replace(/^<p>|<\/p>$/g, '');
}
