import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  Bot,
  BookOpen,
  Gauge,
  Sparkles,
} from 'lucide-react';
import { MathText } from '@/components/math-text';
import { getPaper, getPublicConfig } from '@/lib/repository';

const getPaperForRequest = cache(getPaper);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const [record, config] = await Promise.all([
    getPaperForRequest(decodeURIComponent(id)),
    getPublicConfig(),
  ]);
  if (!record) return { title: `论文未找到 · ${config.site.name}` };
  const paper = record.primary;
  return {
    title: `${paper.title} · ${config.site.name}`,
    description: paper.workSummary,
    openGraph: {
      title: paper.title,
      description: paper.workSummary,
      images: [],
    },
    twitter: {
      card: 'summary',
      title: paper.title,
      description: paper.workSummary,
      images: [],
    },
  };
}

export default async function PaperPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = await getPaperForRequest(decodeURIComponent(id));
  if (!record) notFound();
  const paper = record.primary;
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            返回日报
          </Link>
          <a
            href="https://lightmarey.github.io/daily-arxiv-math/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            静态镜像 <ArrowUpRight className="size-3.5" />
          </a>
        </div>
        <article className="paper-panel p-6 sm:p-10">
          <div className="flex flex-wrap gap-2">
            {paper.categories.map((category) => (
              <span
                key={category}
                className="inline-flex h-5 items-center rounded-full border border-border px-2 text-xs font-medium"
              >
                {category}
              </span>
            ))}
            <span
              className={`inline-flex h-5 items-center rounded-full px-2 text-xs font-medium ${paper.priorityTier === 'low' ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'}`}
            >
              {paper.priorityScore} ·{' '}
              {paper.priorityTier === 'high'
                ? '高优先级'
                : paper.priorityTier === 'medium'
                  ? '中优先级'
                  : '低阅读优先级'}
            </span>
          </div>
          <h1 className="mt-5 font-serif text-3xl font-semibold leading-tight sm:text-4xl">
            <MathText inline>{paper.title}</MathText>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {paper.authors.join(' · ')}
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="size-3.5" />
              {paper.analysisDepth === 'abstract'
                ? '摘要级分析'
                : '已补读正文关键部分'}
            </span>
            <span className="flex items-center gap-1">
              <Gauge className="size-3.5" />
              {paper.categoryId} · {paper.topicLabel}
            </span>
            <span className="flex items-center gap-1">
              {paper.aiStatus === 'explicit' ? (
                <Bot className="size-3.5" />
              ) : (
                <Sparkles className="size-3.5" />
              )}
              {paper.aiStatus === 'explicit'
                ? '明确披露 AI 使用'
                : paper.aiStatus === 'no_disclosure_observed'
                  ? '已核查未见 AI 披露'
                  : '尚未核查 AI 声明'}
            </span>
          </div>
          <div className="mt-10 grid gap-7 sm:grid-cols-2">
            <section>
              <p className="field-label">完成的工作</p>
              <MathText className="leading-7">{paper.workSummary}</MathText>
            </section>
            <section>
              <p className="field-label">主要突破</p>
              <MathText className="leading-7">{paper.breakthrough}</MathText>
            </section>
            <section>
              <p className="field-label">使用技术</p>
              <ul className="space-y-2">
                {paper.techniques.map((technique) => (
                  <li key={technique} className="flex gap-2">
                    <span className="mt-2 size-1.5 rounded-full bg-primary" />
                    <MathText>{technique}</MathText>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <p className="field-label">限制与不确定性</p>
              <MathText className="leading-7">{paper.limitations}</MathText>
            </section>
          </div>
          <section className="mt-10 border-t border-border pt-8">
            <p className="field-label">证明逻辑/大纲</p>
            {paper.proofOutline.status === 'reviewed' ? (
              <ol className="mt-4 space-y-5">
                {paper.proofOutline.steps.map((step, index) => (
                  <li
                    key={`${paper.id}-proof-${index}`}
                    className="border-l-2 border-primary/25 pl-4"
                  >
                    <p className="text-xs font-semibold text-primary">
                      第 {index + 1} 步
                    </p>
                    <MathText className="mt-1 font-medium">
                      {step.claim}
                    </MathText>
                    <MathText className="mt-2 text-sm leading-6 text-muted-foreground">
                      {`路线：${step.route}`}
                    </MathText>
                    <MathText className="mt-2 text-sm leading-6 text-muted-foreground">
                      {`依据：${step.evidence}`}
                    </MathText>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                {paper.proofOutline.status === 'not_reviewed'
                  ? '尚未补读正文'
                  : '正文不采用定理证明结构'}
              </p>
            )}
          </section>
          <section className="mt-10 border-t border-border pt-8">
            <p className="field-label">原始英文摘要</p>
            <div className="prose-abstract mt-3 leading-7 text-foreground/85">
              <MathText>{paper.abstract}</MathText>
            </div>
          </section>
          <section className="mt-8 rounded-lg bg-muted p-4">
            <p className="field-label">排序理由</p>
            <MathText className="text-sm leading-6">
              {paper.priorityReason}
            </MathText>
            {paper.lowPriorityReason ? (
              <MathText className="mt-2 text-sm leading-6 text-muted-foreground">
                {paper.lowPriorityReason}
              </MathText>
            ) : null}
          </section>
          {paper.aiStatus !== 'not_checked' ? (
            <section className="mt-5 rounded-lg border border-[var(--teal)]/25 bg-[var(--teal)]/5 p-4">
              <p className="field-label">
                {paper.aiStatus === 'explicit'
                  ? 'AI 使用披露证据'
                  : 'AI 声明核查范围'}
              </p>
              {paper.aiEvidence ? (
                <MathText className="text-sm">{paper.aiEvidence}</MathText>
              ) : null}
              <p className="mt-1 text-xs text-muted-foreground">
                来源：{paper.aiEvidenceSource}
              </p>
            </section>
          ) : null}
          <div className="mt-8 flex gap-3">
            <a
              href={paper.arxivUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
            >
              arXiv 页面 <ArrowUpRight className="size-4" />
            </a>
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium"
            >
              PDF <ArrowUpRight className="size-4" />
            </a>
          </div>
        </article>
        {record.analyses.length > 1 ? (
          <section className="mt-8 border-t border-border pt-7">
            <h2 className="font-serif text-2xl font-semibold">其他分类分析</h2>
            <div className="mt-4 space-y-4">
              {record.analyses
                .filter((analysis) => analysis.id !== paper.id)
                .map((analysis) => (
                  <article
                    key={analysis.id}
                    className="rounded-lg border border-border bg-card p-5"
                  >
                    <p className="text-xs font-semibold text-primary">
                      {analysis.categoryId} · {analysis.topicLabel}
                    </p>
                    <MathText className="mt-2 font-serif text-lg font-semibold">
                      {analysis.workSummary}
                    </MathText>
                    <MathText className="mt-2 text-sm leading-6 text-muted-foreground">
                      {analysis.priorityReason}
                    </MathText>
                    <div className="mt-4 border-t border-border pt-4">
                      <p className="field-label">证明逻辑/大纲</p>
                      {analysis.proofOutline.status === 'reviewed' ? (
                        <ol className="mt-3 space-y-3">
                          {analysis.proofOutline.steps.map((step, index) => (
                            <li
                              key={`${analysis.id}-proof-${index}`}
                              className="border-l-2 border-border pl-3"
                            >
                              <MathText className="text-sm font-medium">
                                {step.claim}
                              </MathText>
                              <MathText className="mt-1 text-xs leading-5 text-muted-foreground">
                                {`路线：${step.route}`}
                              </MathText>
                              <MathText className="mt-1 text-xs leading-5 text-muted-foreground">
                                {`依据：${step.evidence}`}
                              </MathText>
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {analysis.proofOutline.status === 'not_reviewed'
                            ? '尚未补读正文'
                            : '正文不采用定理证明结构'}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
