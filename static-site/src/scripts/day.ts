import { radarScore, radarTier } from '../lib/radar';

interface WeeklyPoint {
  weekStart: string;
  weekEnding: string;
  counts: Record<string, number | null>;
  complete: boolean;
}

interface MirrorPayload {
  volume: { weeks26: WeeklyPoint[]; weeks104: WeeklyPoint[] };
  config: {
    displayCategories: string[];
    categories: Array<{ id: string; color?: string }>;
  };
  dates: string[];
}

const dataNode = document.querySelector<HTMLScriptElement>('#mirror-data');
if (!dataNode) throw new Error('Static mirror data is unavailable');
const payload = JSON.parse(dataNode.textContent || '{}') as MirrorPayload;
const filterRoot = document.querySelector<HTMLElement>('[data-filter-root]');
const basePath = document.body.dataset.basePath || '';
const normalize = (value: string) => value.trim().toLocaleLowerCase('zh-CN');

if (filterRoot) {
  const radarStorageKey = 'arxiv-daily:personal-radar';
  let radarEnabled = localStorage.getItem(radarStorageKey) === 'on';
  const papers = [
    ...filterRoot.querySelectorAll<HTMLElement>('[data-paper]'),
  ];
  for (const paper of papers) {
    const score = radarScore({
      topic: paper.dataset.topic ?? '',
      priorityScore: Number(paper.dataset.priorityScore ?? 0),
      text: paper.dataset.search ?? '',
    });
    paper.dataset.radarTier = radarTier(score) ?? 'none';
  }

  const fields = ['q', 'category', 'topic', 'ai', 'priority'] as const;
  const params = new URLSearchParams(location.search);
  const field = (name: string) =>
    filterRoot.querySelector(`[name="${name}"]`) as
      | HTMLInputElement
      | HTMLSelectElement
      | null;
  for (const name of fields) {
    const value = params.get(name);
    const node = field(name);
    if (node && value) node.value = value;
  }

  const topicSelect = field('topic') as HTMLSelectElement | null;
  const topicGroups = topicSelect
    ? [...topicSelect.querySelectorAll('optgroup')].map(
        (group) => group.cloneNode(true) as HTMLOptGroupElement,
      )
    : [];

  const fieldValue = (name: string): string => field(name)?.value ?? '';
  const syncTopics = () => {
    const category = fieldValue('category');
    if (!topicSelect) return;
    const selectedValue = topicSelect.value;
    topicSelect.querySelectorAll('optgroup').forEach((group) => group.remove());
    for (const group of topicGroups) {
      if (category === 'all' || group.dataset.category === category)
        topicSelect.append(group.cloneNode(true));
    }
    topicSelect.value = [...topicSelect.options].some(
      (option) => option.value === selectedValue,
    )
      ? selectedValue
      : 'all';
  };
  const applyFilters = () => {
    const values = Object.fromEntries(
      fields.map((name) => [name, fieldValue(name)]),
    );
    let visible = 0;
    for (const paper of papers) {
      const matches =
        (!values.q ||
          normalize(paper.dataset.search ?? '').includes(
            normalize(values.q),
          )) &&
        (values.category === 'all' ||
          paper.dataset.category === values.category) &&
        (values.topic === 'all' || paper.dataset.topic === values.topic) &&
        (values.ai === 'all' || paper.dataset.ai === values.ai) &&
        (values.priority === 'all' ||
          paper.dataset.priority === values.priority) &&
        (!radarEnabled || paper.dataset.radarTier !== 'none');
      paper.hidden = !matches;
      if (matches) visible += 1;
    }
    for (const item of filterRoot.querySelectorAll<HTMLElement>(
      '[data-toc-paper]',
    )) {
      const paper = document.getElementById(item.dataset.reportTarget ?? '');
      item.hidden = !paper || paper.hidden;
    }
    for (const item of filterRoot.querySelectorAll<HTMLElement>(
      '[data-toc-topic]',
    )) {
      item.hidden = !item.querySelector('[data-toc-paper]:not([hidden])');
    }
    for (const item of filterRoot.querySelectorAll<HTMLElement>(
      '[data-toc-category]',
    )) {
      item.hidden = !item.querySelector('[data-toc-paper]:not([hidden])');
    }
    for (const group of filterRoot.querySelectorAll<HTMLElement>(
      '[data-group]',
    )) {
      const count = group.querySelectorAll('[data-paper]:not([hidden])').length;
      group.hidden = count === 0;
      const node = group.querySelector<HTMLElement>('[data-group-count]');
      if (node) node.textContent = String(count);
    }
    const narrowed =
      Boolean(values.q) ||
      values.topic !== 'all' ||
      values.ai !== 'all' ||
      values.priority !== 'all' ||
      radarEnabled;
    for (const group of filterRoot.querySelectorAll<HTMLElement>(
      '[data-field-group]',
    )) {
      const categoryMatches =
        values.category === 'all' ||
        group.dataset.fieldGroup === values.category;
      const total = group.querySelectorAll('[data-paper]').length;
      const count = group.querySelectorAll('[data-paper]:not([hidden])').length;
      group.hidden = !categoryMatches || (total > 0 ? count === 0 : narrowed);
      const node = group.querySelector<HTMLElement>('[data-field-count]');
      if (node) node.textContent = String(count);
    }
    const empty = filterRoot.querySelector<HTMLElement>('[data-empty]');
    if (empty) empty.hidden = visible !== 0;

    const next = new URLSearchParams();
    for (const name of fields) {
      if (values[name] && values[name] !== 'all') {
        next.set(name, values[name]);
      }
    }
    history.replaceState(
      null,
      '',
      `${location.pathname}${next.size ? `?${next}` : ''}`,
    );
  };
  filterRoot.addEventListener('input', applyFilters);
  for (const link of filterRoot.querySelectorAll<HTMLAnchorElement>(
    '[data-summary-link]',
  )) {
    link.addEventListener('click', () => {
      for (const name of fields) {
        const node = field(name);
        if (node) node.value = name === 'q' ? '' : 'all';
      }
      syncTopics();
      applyFilters();
    });
  }
  filterRoot.addEventListener('change', (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.matches('[data-date]')) {
      if (!payload.dates.includes(target.value)) {
        target.setCustomValidity('该日期没有日报');
        target.reportValidity();
        target.value = target.defaultValue;
        return;
      }
      target.setCustomValidity('');
      location.href = `${basePath}/daily/${encodeURIComponent(target.value)}/`;
      return;
    }
    if (target instanceof HTMLSelectElement && target.name === 'category')
      syncTopics();
    applyFilters();
  });
  syncTopics();
  applyFilters();

  const radarTrigger = document.querySelector<HTMLButtonElement>(
    '[data-radar-trigger]',
  );
  const syncRadarState = () => {
    document.documentElement.dataset.radar = radarEnabled ? 'on' : 'off';
    radarTrigger?.setAttribute('aria-pressed', String(radarEnabled));
    radarTrigger?.setAttribute(
      'aria-label',
      radarEnabled ? '个人雷达已开启' : '站点标记',
    );
  };
  const radarClicks: number[] = [];
  radarTrigger?.addEventListener('click', () => {
    const now = Date.now();
    while (radarClicks.length && now - radarClicks[0] > 3000)
      radarClicks.shift();
    radarClicks.push(now);
    if (radarClicks.length < 5) return;
    radarClicks.length = 0;
    radarEnabled = !radarEnabled;
    localStorage.setItem(radarStorageKey, radarEnabled ? 'on' : 'off');
    syncRadarState();
    applyFilters();
  });
  syncRadarState();
}

const toc = document.querySelector<HTMLDetailsElement>('[data-toc]');
if (toc && matchMedia('(max-width: 900px)').matches) toc.open = false;

const themeToggle = document.querySelector<HTMLButtonElement>(
  '[data-theme-toggle]',
);
const themeIcon = themeToggle?.querySelector<HTMLElement>('[data-theme-icon]');
const syncThemeToggle = () => {
  if (!themeToggle) return;
  const dark = document.documentElement.dataset.theme === 'dark';
  if (themeIcon) themeIcon.textContent = dark ? '☀' : '☾';
  themeToggle.setAttribute(
    'aria-label',
    dark ? '切换为浅色模式' : '切换为深色模式',
  );
  themeToggle.title = dark ? '切换为浅色模式' : '切换为深色模式';
  themeToggle.setAttribute('aria-pressed', String(dark));
};
themeToggle?.addEventListener('click', () => {
  const theme =
    document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('theme', theme);
  syncThemeToggle();
});
syncThemeToggle();

const siteHeader = document.querySelector<HTMLElement>('.site-header');
let previousScrollY = scrollY;
addEventListener(
  'scroll',
  () => {
    if (!siteHeader) return;
    const currentScrollY = scrollY;
    if (Math.abs(currentScrollY - previousScrollY) < 6) return;
    const hidden =
      currentScrollY > previousScrollY &&
      currentScrollY > siteHeader.offsetHeight;
    siteHeader.toggleAttribute('data-scroll-hidden', hidden);
    siteHeader.inert = hidden;
    previousScrollY = currentScrollY;
  },
  { passive: true },
);

const chart = document.querySelector<HTMLElement>('[data-chart]');
const toggle = document.querySelector<HTMLButtonElement>('[data-trend-toggle]');
let expanded = false;

const svgNode = <K extends keyof SVGElementTagNameMap>(
  name: K,
): SVGElementTagNameMap[K] =>
  document.createElementNS('http://www.w3.org/2000/svg', name);

const renderChart = () => {
  if (!chart) return;
  const weeks = (
    expanded ? payload.volume.weeks104 : payload.volume.weeks26
  ).filter((week) => week.complete);
  const categories = payload.config.categories.filter((item) =>
    payload.config.displayCategories.includes(item.id),
  );
  if (!weeks.length) {
    chart.textContent = '暂无完整周数据。';
    return;
  }

  const width = 900;
  const height = 330;
  const padding = { top: 18, right: 16, bottom: 42, left: 42 };
  const values = weeks.flatMap((week) =>
    categories
      .map((category) => week.counts[category.id])
      .filter((value): value is number => Number.isInteger(value)),
  );
  const max = Math.max(1, ...values);
  const x = (index: number) =>
    padding.left +
    (index / Math.max(1, weeks.length - 1)) *
      (width - padding.left - padding.right);
  const y = (value: number) =>
    height -
    padding.bottom -
    (value / max) * (height - padding.top - padding.bottom);
  const svg = svgNode('svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `最近 ${weeks.length} 个完整周的分类发文趋势`);

  for (const ratio of [0, 0.25, 0.5, 0.75, 1]) {
    const line = svgNode('line');
    const lineY = y(max * ratio);
    line.setAttribute('x1', String(padding.left));
    line.setAttribute('x2', String(width - padding.right));
    line.setAttribute('y1', String(lineY));
    line.setAttribute('y2', String(lineY));
    line.setAttribute('class', 'grid');
    svg.appendChild(line);
    const label = svgNode('text');
    label.setAttribute('x', String(padding.left - 8));
    label.setAttribute('y', String(lineY + 4));
    label.setAttribute('text-anchor', 'end');
    label.textContent = String(Math.round(max * ratio));
    svg.appendChild(label);
  }

  const palette = [
    '#8b1e3f',
    '#16796f',
    '#a56820',
    '#5b5ea6',
    '#377d71',
    '#b05a2a',
  ];
  categories.forEach((category, seriesIndex) => {
    const path = svgNode('path');
    path.setAttribute(
      'd',
      weeks
        .map((week, index) => {
          const count = week.counts[category.id];
          return `${index ? 'L' : 'M'}${x(index).toFixed(2)},${y(typeof count === 'number' ? count : 0).toFixed(2)}`;
        })
        .join(' '),
    );
    path.setAttribute('fill', 'none');
    path.setAttribute(
      'stroke',
      category.color || palette[seriesIndex % palette.length],
    );
    path.setAttribute('stroke-width', '2');
    svg.appendChild(path);
  });

  const tickEvery = Math.max(1, Math.ceil(weeks.length / 7));
  weeks.forEach((week, index) => {
    if (index % tickEvery && index !== weeks.length - 1) return;
    const label = svgNode('text');
    label.setAttribute('x', String(x(index)));
    label.setAttribute('y', String(height - 14));
    label.setAttribute('text-anchor', 'middle');
    label.textContent = week.weekEnding.slice(5);
    svg.appendChild(label);
  });

  const guide = svgNode('line');
  guide.setAttribute('class', 'chart-guide');
  guide.setAttribute('y1', String(padding.top));
  guide.setAttribute('y2', String(height - padding.bottom));
  guide.style.display = 'none';
  svg.appendChild(guide);

  const tooltip = document.createElement('div');
  tooltip.className = 'chart-tooltip';
  tooltip.hidden = true;
  const hideTooltip = () => {
    tooltip.hidden = true;
    guide.style.display = 'none';
  };
  const showTooltip = (week: WeeklyPoint, index: number) => {
    const heading = document.createElement('strong');
    heading.textContent = `${week.weekStart} 至 ${week.weekEnding}`;
    const list = document.createElement('dl');
    for (const category of categories) {
      const row = document.createElement('div');
      const name = document.createElement('dt');
      const value = document.createElement('dd');
      name.textContent = category.id;
      name.style.color = category.color || 'currentColor';
      value.textContent = String(week.counts[category.id] ?? '—');
      row.appendChild(name);
      row.appendChild(value);
      list.appendChild(row);
    }
    tooltip.replaceChildren(heading, list);
    tooltip.style.left = `${Math.min(88, Math.max(12, (x(index) / width) * 100))}%`;
    tooltip.hidden = false;
    guide.setAttribute('x1', String(x(index)));
    guide.setAttribute('x2', String(x(index)));
    guide.style.display = '';
  };

  weeks.forEach((week, index) => {
    const previousX =
      index === 0 ? padding.left : (x(index - 1) + x(index)) / 2;
    const nextX =
      index === weeks.length - 1
        ? width - padding.right
        : (x(index) + x(index + 1)) / 2;
    const hit = svgNode('rect');
    const summary = `${week.weekStart} 至 ${week.weekEnding}：${categories
      .map(
        (category) => `${category.id} ${week.counts[category.id] ?? '无数据'}`,
      )
      .join('，')}`;
    hit.setAttribute('class', 'chart-hit');
    hit.setAttribute('x', String(previousX));
    hit.setAttribute('y', String(padding.top));
    hit.setAttribute('width', String(Math.max(1, nextX - previousX)));
    hit.setAttribute('height', String(height - padding.top - padding.bottom));
    hit.setAttribute('tabindex', '0');
    hit.setAttribute('aria-label', summary);
    const title = svgNode('title');
    title.textContent = summary;
    hit.appendChild(title);
    hit.addEventListener('pointerenter', () => showTooltip(week, index));
    hit.addEventListener('focus', () => showTooltip(week, index));
    hit.addEventListener('pointerleave', hideTooltip);
    hit.addEventListener('blur', hideTooltip);
    svg.appendChild(hit);
  });

  chart.replaceChildren(svg, tooltip);
};

toggle?.addEventListener('click', () => {
  expanded = !expanded;
  toggle.textContent = expanded ? '收回至 6 个月' : '展开至 2 年';
  toggle.setAttribute('aria-expanded', String(expanded));
  renderChart();
});
renderChart();
