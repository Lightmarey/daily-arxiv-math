'use client';

import { useMemo, useState } from 'react';
import { aggregateWeeklyVolumes } from '@/lib/volume';
import type { PublicTrackingConfig } from '@/lib/config';
import type { VolumePoint } from '@/lib/types';

const palette = [
  'var(--burgundy)',
  'var(--teal)',
  'var(--ochre)',
  '#5b5ea6',
  '#377d71',
  '#b05a2a',
];
const chart = {
  width: 900,
  height: 320,
  top: 12,
  right: 12,
  bottom: 34,
  left: 44,
};

export function TrendChart({
  volumes,
  range,
  categories,
}: {
  volumes: VolumePoint[];
  range: '6m' | '2y';
  categories: PublicTrackingConfig['categories'];
}) {
  const categoryIds = useMemo(
    () => categories.map((item) => item.id),
    [categories],
  );
  const series = useMemo(
    () =>
      categories.map((category, index) => ({
        id: category.id,
        color: category.color ?? palette[index % palette.length],
      })),
    [categories],
  );
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const weekly = useMemo(
    () => aggregateWeeklyVolumes(volumes, categoryIds),
    [volumes, categoryIds],
  );
  const data = (range === '6m' ? weekly.slice(-26) : weekly).filter((point) =>
    series.some((item) => typeof point.counts[item.id] === 'number'),
  );
  const latest = data.at(-1);
  const values = data.flatMap((point) =>
    series
      .filter((item) => !hidden[item.id])
      .flatMap((item) => {
        const value = point.counts[item.id];
        return typeof value === 'number' ? [value] : [];
      }),
  );
  const maximum = Math.max(5, ...values);
  const yMaximum = Math.ceil(maximum / 10) * 10 || 10;
  const plotWidth = chart.width - chart.left - chart.right;
  const plotHeight = chart.height - chart.top - chart.bottom;
  const x = (index: number) =>
    chart.left + (index / Math.max(1, data.length - 1)) * plotWidth;
  const y = (value: number) => chart.top + (1 - value / yMaximum) * plotHeight;
  const xTicks = [
    ...new Set(
      [0, 0.25, 0.5, 0.75, 1].map((part) =>
        Math.round(part * Math.max(0, data.length - 1)),
      ),
    ),
  ];
  const toggle = (id: string) =>
    setHidden((current) => ({ ...current, [id]: !current[id] }));

  return (
    <div>
      <div className="mb-2 flex justify-end text-[10px] text-muted-foreground">
        最新有数据周：
        {latest ? `${latest.weekStart} 至 ${latest.weekEnding}` : '暂无'}
      </div>
      <div
        className="mb-6 grid gap-x-5 border-y border-border"
        style={{
          gridTemplateColumns: `repeat(${Math.max(1, series.length)}, minmax(0, 1fr))`,
        }}
      >
        {series.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={!hidden[item.id]}
            onClick={() => toggle(item.id)}
            className={`py-3.5 text-left ${hidden[item.id] ? 'opacity-40' : ''}`}
          >
            <span className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span
                className="size-1.5 rounded-full"
                style={{ background: item.color }}
              />
              {item.id}／周
            </span>
            <span className="mt-1 block font-serif text-2xl font-semibold">
              {latest?.counts[item.id] ?? '—'}
            </span>
          </button>
        ))}
      </div>

      {data.length ? (
        <svg
          viewBox={`0 0 ${chart.width} ${chart.height}`}
          className={
            range === '2y' ? 'h-auto min-h-72 w-full' : 'h-auto w-full'
          }
          role="img"
          aria-label={`${range === '2y' ? '近两年' : '近六个月'}每周发文趋势`}
        >
          {[0, 0.25, 0.5, 0.75, 1].map((part) => {
            const value = Math.round(yMaximum * (1 - part));
            const yPosition = chart.top + plotHeight * part;
            return (
              <g key={part}>
                <line
                  x1={chart.left}
                  x2={chart.width - chart.right}
                  y1={yPosition}
                  y2={yPosition}
                  stroke="var(--border)"
                  strokeDasharray="2 5"
                />
                <text
                  x={chart.left - 8}
                  y={yPosition + 4}
                  textAnchor="end"
                  className="fill-muted-foreground text-[11px]"
                >
                  {value}
                </text>
              </g>
            );
          })}
          {xTicks.map((index) => (
            <text
              key={index}
              x={x(index)}
              y={chart.height - 8}
              textAnchor={
                index === 0
                  ? 'start'
                  : index === data.length - 1
                    ? 'end'
                    : 'middle'
              }
              className="fill-muted-foreground text-[11px]"
            >
              {data[index]?.weekEnding.slice(5)}
            </text>
          ))}
          {series
            .filter((item) => !hidden[item.id])
            .map((item) => (
              <g key={item.id}>
                <path
                  fill="none"
                  stroke={item.color}
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  d={data
                    .map((point, index) => {
                      const value = point.counts[item.id];
                      if (typeof value !== 'number') return '';
                      const previous = data[index - 1]?.counts[item.id];
                      return `${typeof previous === 'number' ? 'L' : 'M'}${x(index)},${y(value)}`;
                    })
                    .filter(Boolean)
                    .join(' ')}
                />
                {data.map((point, index) => {
                  const value = point.counts[item.id];
                  return typeof value === 'number' ? (
                    <circle
                      key={point.weekEnding}
                      cx={x(index)}
                      cy={y(value)}
                      r="7"
                      fill="transparent"
                    >
                      <title>{`${item.id} · ${point.weekStart} 至 ${point.weekEnding} · ${value} 篇`}</title>
                    </circle>
                  ) : null;
                })}
              </g>
            ))}
        </svg>
      ) : (
        <p className="py-12 text-center text-sm text-muted-foreground">
          暂无周数据
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-muted-foreground">
        {series.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => toggle(item.id)}
            className={`flex items-center gap-1.5 ${hidden[item.id] ? 'line-through opacity-45' : ''}`}
          >
            <span className="h-0.5 w-4" style={{ background: item.color }} />
            {item.id}
          </button>
        ))}
      </div>
    </div>
  );
}
