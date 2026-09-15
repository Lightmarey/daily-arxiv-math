import { env } from 'cloudflare:workers';
import { previewDashboard } from './fixtures';
import { TrackingRepository } from './repository-core';
import { summarizeReportFeed } from './dashboard';
import type { DashboardData } from './types';
import type { ReportBatchV3, VolumeHistoryV2 } from './validation';

function repository(): TrackingRepository {
  if (!env.DB) throw new Error('Cloudflare D1 binding `DB` is unavailable');
  return new TrackingRepository(env.DB);
}

export const getPublicConfig = () => repository().getPublicConfig();
export const listVolumes = (range: '6m' | '2y' = '2y', categories?: string[]) =>
  repository().listVolumes(range, categories);
export const listReports = (date?: string, categories?: string[]) =>
  repository().listReports(date, categories);
export const loadReportFeed = (date?: string, categories?: string[]) =>
  repository().loadReportFeed(date, categories);
export const loadDashboardFeed = async (date?: string, categories?: string[]) =>
  summarizeReportFeed(await repository().loadReportFeed(date, categories));
export const getPaper = (arxivId: string, categories?: string[]) =>
  repository().getPaper(arxivId, categories);
export const getIngestState = () => repository().getIngestState();
export const getHealthSnapshot = () => repository().getHealthSnapshot();
export const ingestBatchV3 = (batch: ReportBatchV3) =>
  repository().ingestBatch(batch);
export const ingestVolumeHistory = (history: VolumeHistoryV2) =>
  repository().ingestVolumeHistory(history);

export async function loadDashboard(
  date?: string,
  categories?: string[],
): Promise<DashboardData> {
  const repo = repository();
  const config = await repo.getPublicConfig();
  const selected = categories ?? config.displayCategories;
  const [fullFeed, volumes] = await Promise.all([
    repo.loadReportFeed(date, selected),
    repo.listVolumes('2y', selected),
  ]);
  const feed = summarizeReportFeed(fullFeed);
  return {
    latestDate: feed.date,
    lastUpdated: feed.lastUpdated,
    config,
    volumes,
    reports: feed.reports,
    overview: feed.overview,
    dataMode: 'database',
    coverage: feed.coverage,
  };
}

export function loadPreviewDashboard(): DashboardData {
  return previewDashboard;
}
