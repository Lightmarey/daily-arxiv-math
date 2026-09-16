# Configurable arXiv Daily

这是工作日静态站数据任务。以 `config.local.json` 为分类与主题的唯一配置来源，固定本轮 `configVersion`；不要依赖旧 D1、`start-local.ps1` 或 `/api/ingest/*`。开始时为本计划时段设置唯一 `ARXIV_RUN_ID`，并把 `ARXIV_CACHE_DIR` 固定到项目的持久缓存目录；所有 arXiv HTTP 请求必须经过 `scripts/arxiv_http.py` 的共享节流、Retry-After 和运行级等待预算。

## 选择日期与恢复进度

1. 更新可信生成器到 `origin/main`，读取 `origin/daily-content:data/manifest.json`；现有日期一律保留。
2. 在最新已发布日之后查找官方公告日，按最早缺失日顺序处理。当前一次性积压是 `2026-09-15`、`2026-09-16`；发布完成后回到普通增量。
3. 每个日期使用独立的 `.automation/static-runs/<date>/`。同一 `configVersion`、分类、公告日和 `expectedIds` 的 listing、metadata 与分析分片可以复用；其余缓存必须丢弃。
4. 一个公告日是原子单位。任一必需分类失败或不完整时不得发布该日，也不得用空值覆盖既有内容。官方页面缺失或无法确认时保持缺失，不得伪造零篇。

## 抓取与分析

1. 运行一次 `scripts/arxiv_listing.py --date <date>`，让它按 `fetchCategories` 生成同一个多分类 manifest。只把官方 New submissions 与 Cross-lists 计入，Replacements 不计入。
2. 把这个多分类 manifest 传给 `scripts/arxiv_fetch.py --manifest`，对全部分类的 ID 并集获取一次元数据；校验 `expectedIds` 与元数据完整一致。
3. 先对全部论文完成基于标题和摘要的分类分析，按分类分成不超过 25 篇的独立 subagent 批次并持久化分片；同一论文跨分类时分别使用各分类主题分析。不得为每篇论文单独启动一个 subagent。
4. 摘要初筛后，最多选择当日 6 篇高优先级论文补读 HTML/PDF 正文并补全可复查证明大纲。正文不可得不阻断日报，保留 `analysisDepth=abstract`、`proofOutline.status=not_reviewed`；不得根据摘要编造证明步骤或作者 AI 披露。
5. 每个分类用 `scripts/build_complete_report.py --category <id>` 生成独立 `ReportBatchV3`。`expected`、`fetched`、`analyzed` 必须完全一致；低优先级必须有具体靠后理由。
6. 汇总同日全部分类，生成符合 `docs/daily-overview.schema.json` 的总览：通常 8 个带论文引用的具体结果和 2 个值得关注项。只写问题、结果、方法与意义，不写抓取、阅读、模型或防御性说明；数学表达式使用 LaTeX。

分析字段使用简体中文，标题、作者和英文摘要保留原文。`explicit` 只用于作者明确披露 AI 使用；没有检查时使用 `not_checked`。

## 预检、发布与线上验收

1. 先在临时 `daily-content` worktree 上运行 `scripts/sync_static_mirror.ts` 和 `npm run static:build`，确认全部旧日期仍存在、目标日所有必需分类 coverage 完整、总览引用均能定位、静态页面无新增 KaTeX 错误。对同一输入再同步一次，确认无额外差异。
2. 预检通过后调用：

```powershell
& scripts/publish_static_mirror.ps1 `
  -ConfigPath <config.local.json> `
  -BatchPath <category-a.json,category-b.json> `
  -OverviewPath <daily-overview.json> `
  -RequiredDate <YYYY-MM-DD>
```

3. 记录脚本返回的完整 `contentSha`，找到该次 `Arxiv Brief Pages` 工作流并执行 `gh run watch <run-id> --exit-status`。工作流成功后回读线上首页和目标日期页，核对日期、分类计数、总览链接和页面状态。
4. 成功时静默。失败时只报告日期、分类、所处阶段与脱敏错误；保留可复用进度，但不得把半成品推到 `daily-content`。
