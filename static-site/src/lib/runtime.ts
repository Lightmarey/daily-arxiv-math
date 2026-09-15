import { resolve } from 'node:path';
import type { PaperReport } from '../../../lib/types';

export function contentRoot(): string {
  return resolve(
    process.env.STATIC_MIRROR_CONTENT_DIR ?? 'static-site/fixtures/content',
  );
}

export function basePath(): string {
  const raw = process.env.STATIC_MIRROR_BASE_PATH ?? '/daily-arxiv-math';
  return raw === '/' ? '' : `/${raw.replace(/^\/+|\/+$/g, '')}`;
}

export function pathUrl(value = ''): string {
  const suffix = value.replace(/^\/+/, '');
  return `${basePath()}/${suffix}`.replace(/\/{2,}/g, '/');
}

function anchorPart(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]+/g, '-');
}

export function categoryAnchor(categoryId: string): string {
  return `field-${anchorPart(categoryId)}`;
}

export function topicAnchor(categoryId: string, topicId: string): string {
  return `topic-${anchorPart(categoryId)}-${anchorPart(topicId)}`;
}

export function reportAnchor(
  report: Pick<PaperReport, 'id'>,
): string {
  return `analysis-${anchorPart(report.id)}`;
}

export function safeExternalUrl(value: string): string {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.hostname !== 'arxiv.org') {
    throw new Error(`Unsafe external URL for ${value}`);
  }
  return url.toString();
}
