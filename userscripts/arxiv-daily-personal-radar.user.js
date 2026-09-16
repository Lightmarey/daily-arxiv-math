// ==UserScript==
// @name         Arxiv日报个人雷达
// @namespace    https://github.com/Lightmarey/daily-arxiv-math
// @version      1.0.0
// @description  在 Arxiv日报页面本地标记个人关注的论文
// @match        https://lightmarey.github.io/daily-arxiv-math/*
// @match        http://localhost:4321/*
// @match        http://127.0.0.1:4321/*
// @run-at       document-idle
// @grant        none
// @noframes
// ==/UserScript==

(function () {
  'use strict';

  const storageKey = 'arxiv-daily:personal-radar';
  const CONFIG = {
    topicWeights: {
      // 'category:topic-id': 3,
    },
    corePatterns: [
      // /your-core-pattern/iu,
    ],
    relatedPatterns: [
      // /your-related-pattern/iu,
    ],
  };

  const papers = [...document.querySelectorAll('[data-paper]')];
  if (!papers.length) return;

  const style = document.createElement('style');
  style.textContent = `
    :root[data-personal-radar='on'] article[data-personal-radar='core'] {
      border-inline-start: 3px solid var(--gold);
      padding-inline-start: 12px;
    }
    :root[data-personal-radar='on'] article[data-personal-radar='related'] {
      border-inline-start: 3px solid var(--teal);
      padding-inline-start: 12px;
    }
    [data-personal-radar-badge] {
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: 1px 6px;
      color: var(--wine);
      font-size: 10px;
      line-height: 1.4;
      white-space: nowrap;
    }
  `;
  document.head.append(style);

  const score = (paper) => {
    const text = (paper.dataset.search || '').toLocaleLowerCase('zh-CN');
    let value = CONFIG.topicWeights[paper.dataset.topic || ''] || 0;
    value +=
      CONFIG.corePatterns.filter((pattern) => pattern.test(text)).length * 4;
    value +=
      CONFIG.relatedPatterns.filter((pattern) => pattern.test(text)).length * 2;
    if (Number(paper.dataset.priorityScore || 0) >= 75) value += 1;
    return value;
  };

  const tier = (value) => {
    if (value >= 9) return 'core';
    if (value >= 5) return 'related';
    return null;
  };

  let enabled = localStorage.getItem(storageKey) !== 'off';
  const render = () => {
    document.documentElement.dataset.personalRadar = enabled ? 'on' : 'off';
    for (const paper of papers) {
      const currentTier = tier(score(paper));
      paper.dataset.personalRadar = currentTier || 'none';
      const meta = paper.querySelector('.paper-meta');
      if (!meta) continue;
      let badge = meta.querySelector('[data-personal-radar-badge]');
      if (!enabled || !currentTier) {
        badge?.remove();
        continue;
      }
      if (!badge) {
        badge = document.createElement('span');
        badge.dataset.personalRadarBadge = '';
        meta.append(badge);
      }
      badge.textContent =
        currentTier === 'core' ? '雷达 · 核心' : '雷达 · 相关';
    }
  };

  document.addEventListener('keydown', (event) => {
    if (!event.altKey || !event.shiftKey || event.key.toLowerCase() !== 'r')
      return;
    event.preventDefault();
    enabled = !enabled;
    localStorage.setItem(storageKey, enabled ? 'on' : 'off');
    render();
  });

  render();
})();
