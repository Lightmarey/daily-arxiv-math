import { Dashboard } from '@/components/dashboard';
import { loadDashboard, loadPreviewDashboard } from '@/lib/repository';
import { publicConfig } from '@/lib/config';
import { previewConfig } from '@/lib/fixtures';
import type { DashboardData } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{
    date?: string;
    preview?: string;
    categories?: string;
  }>;
}) {
  const query = await searchParams;
  const categories = query?.categories
    ?.split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  let initialData: DashboardData;
  if (query?.preview === '1') initialData = loadPreviewDashboard();
  else if (process.env.NODE_ENV === 'development') {
    try {
      initialData = await loadDashboard(query?.date, categories);
    } catch {
      initialData = {
        latestDate: query?.date ?? new Date().toISOString().slice(0, 10),
        lastUpdated: '',
        config: publicConfig(previewConfig),
        volumes: [],
        reports: [],
        overview: {
          paperCount: 0,
          mainProgress: [],
          breakthroughPoints: [],
          cautions: [],
        },
        dataMode: 'unavailable',
        coverage: [],
      };
    }
  } else {
    initialData = {
      latestDate: query?.date ?? new Date().toISOString().slice(0, 10),
      lastUpdated: '',
      config: publicConfig(previewConfig),
      volumes: [],
      reports: [],
      overview: {
        paperCount: 0,
        mainProgress: [],
        breakthroughPoints: [],
        cautions: [],
      },
      dataMode: 'loading',
      coverage: [],
    };
  }
  return <Dashboard initialData={initialData} requestedDate={query?.date} />;
}
