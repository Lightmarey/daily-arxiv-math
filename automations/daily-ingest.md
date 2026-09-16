# Configurable arXiv Daily

这是工作日静态站数据任务。以 `config.local.json` 为分类与主题的唯一配置来源，固定本轮 `configVersion`；不要依赖旧 D1、`start-local.ps1` 或 `/api/ingest/*`。开始时为本计划时段设置唯一 `ARXIV_RUN_ID`，并把 `ARXIV_CACHE_DIR` 固定到项目的持久缓存目录；所有 arXiv HTTP 请求必须经过 `scripts/arxiv_http.py` 的共享节流、Retry-After 和运行级等待预算。

## 选择日期与恢复进度

1. 更新可信生成器到 `origin/main`，读取 `origin/daily-content:data/manifest.json`；现有日期一律保留。
2. 在最新已发布日之后查找官方公告日，按最早缺失日顺序处理；已出现在静态清单中的日期直接跳过。
3. 每个日期使用独立的 `.automation/static-runs/<date>/`。同一 `configVersion`、分类、公告日和 `expectedIds` 的 listing、metadata 与分析分片可以复用；其余缓存必须丢弃。
4. 一个公告日是原子单位。任一必需分类失败或不完整时不得发布该日，也不得用空值覆盖既有内容。官方页面缺失或无法确认时保持缺失，不得伪造零篇。

## 抓取与分析

1. 运行一次 `scripts/arxiv_listing.py --date <date>`，让它按 `fetchCategories` 生成同一个多分类 manifest。只把官方 New submissions 与 Cross-lists 计入，Replacements 不计入。
2. 把这个多分类 manifest 传给 `scripts/arxiv_fetch.py --manifest`，对全部分类的 ID 并集获取一次元数据；校验 `expectedIds` 与元数据完整一致。
3. 标题和摘要只用于初筛、主题分类与安排正文读取顺序，不是最终分析。按去重后的论文分成每批不超过 4 篇的数学分析 subagent，逐篇读取可用的 arXiv HTML 或 PDF 正文并持久化一篇一份的结果；同一论文跨分类时正文证据只读取一次，再分别生成各分类的主题与优先级判断。不得设置“每天只读若干篇正文”的上限。
4. 每篇论文必须给出有信息密度的完整分析：`workSummary` 用 2–4 句覆盖研究问题、关键假设和全部主要结果；`techniques` 给出 3–6 项论文特有的方法，并说明各自在论证中的作用；`breakthrough` 与 `limitations` 分别说明相对已有工作的推进及结论边界。不能用标题改写、摘要逐句翻译、通用方法名或短句占位。
5. 有定理证明结构的论文必须生成 `reviewed` 证明大纲，通常 2–6 步；每步分别写清 claim、关键估计/构造如何推进到下一步的 route，以及节、定理、引理、公式或 PDF 页码 evidence。综述、纯数值或没有可辨认定理证明结构的正文才可使用 `not_applicable`。只有 HTML/PDF 确实不可得时才允许 `analysisDepth=abstract`、`proofOutline.status=not_reviewed`，并在运行分片中记录失败 URL 与错误；不得根据摘要编造证明步骤或作者 AI 披露。
6. 每个分析分片完成后交给独立 proof-verifier subagent 核对主结果、证明路线和 evidence 是否与正文相符；不一致的逐篇退回重做。随后每个分类用 `scripts/build_complete_report.py --category <id>` 生成独立 `ReportBatchV3`。`expected`、`fetched`、`analyzed` 必须完全一致；低优先级必须有具体靠后理由。构建器的逐篇质量门槛失败时必须退回对应分片重做，不得为了覆盖率缩短内容或降级正文分析。
7. 汇总同日全部分类，生成符合 `docs/daily-overview.schema.json` 的总览：通常 8 个带论文引用的具体结果和 2 个值得关注项。只写问题、结果、方法与意义，不写抓取、阅读、模型或防御性说明；数学表达式使用 LaTeX。

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
