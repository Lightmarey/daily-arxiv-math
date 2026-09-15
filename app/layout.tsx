import type { Metadata } from 'next';
import 'katex/dist/katex.min.css';
import './globals.css';
import { getPublicConfig } from '@/lib/repository';

export async function generateMetadata(): Promise<Metadata> {
  let name = 'arXiv 研究前沿日报',
    description = '由本地配置驱动的 arXiv 分类追踪与研究阅读指南。';
  try {
    const config = await getPublicConfig();
    name = config.site.name;
    description = config.site.description;
  } catch {
    /* unavailable config keeps generic metadata, never preview data */
  }
  return {
    metadataBase: new URL(process.env.SITE_ORIGIN ?? 'http://localhost:3000'),
    title: name,
    description,
    openGraph: { title: name, description, images: ['/og.png'] },
    twitter: {
      card: 'summary_large_image',
      title: name,
      description,
      images: ['/og.png'],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
