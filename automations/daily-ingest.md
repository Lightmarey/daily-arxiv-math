# Configurable arXiv Daily

这是工作日静态站数据任务。以 `config.local.json` 为分类与主题的唯一配置来源，固定本轮 `configVersion`；不要依赖旧 D1、`start-local.ps1` 或 `/api/ingest/*`。开始时为本计划时段设置唯一 `ARXIV_RUN_ID`，并把 `ARXIV_CACHE_DIR` 固定到项目的持久缓存目录；所有 arXiv HTTP 请求必须经过 `scripts/arxiv_http.py` 的共享节流、Retry-After 和运行级等待预算。

## 选择日期与恢复进度

1. 更新可信生成器到 `origin/main`，读取 `origin/daily-content:data/manifest.json`；现有日期一律保留。
2. 在最新已发布日之后查找官方公告日，按最早缺失日顺序处理；已出现在静态清单中的日期直接跳过。
3. 每个日期使用独立的 `.automation/static-runs/<date>/`。同一 `configVersion`、分类、公告日和 `expectedIds` 的 listing、metadata 与分析分片可以复用；但缺少 `priorityComponents` 的旧分析分片必须重新生成。其余缓存必须丢弃。
4. 一个公告日是原子单位。任一必需分类失败或不完整时不得发布该日，也不得用空值覆盖既有内容。官方页面缺失或无法确认时保持缺失，不得伪造零篇。

## 抓取与分析

1. 运行一次 `scripts/arxiv_listing.py --date <date>`，让它按 `fetchCategories` 生成同一个多分类 manifest。只把官方 New submissions 与 Cross-lists 计入，Replacements 不计入。
2. 把这个多分类 manifest 传给 `scripts/arxiv_fetch.py --manifest`，对全部分类的 ID 并集获取一次元数据；校验 `expectedIds` 与元数据完整一致。
3. 采用“两阶段分级精读（Tiered Analysis）”控制 Token 消耗并聚焦核心学术价值：
   - **Phase 1（前置快速粗筛）**：基于全量论文的标题与英文摘要快速初排主题与价值梯队，划分分析深度：前 30%–40% 的重大突破与核心理论采用 `analysisDepth="full_text_sections"`；其余 60%–70% 的常规推广、工程/生物应用或交叉模型采用 `analysisDepth="abstract"`。
   - **Phase 2（差异化并行分析）**：
     - **精读组（full_text_sections）**：逐篇阅读正文导论、主定理、方法或证明概览，撰写详实分析（`workSummary` 通常 140–350 字符，`breakthrough`/`limitations` >= 90 字符，`techniques` 给出 3–6 项特有技术，证明大纲给出 2–6 步 `reviewed` 步骤）。
     - **速览组（abstract）**：不抓取正文，直接基于摘要提炼核心问题与适用边界，注重语言精炼（`workSummary` >= 80 字符，`breakthrough`/`limitations`/`priorityReason` >= 40 字符，`techniques` 至少 2 项，证明大纲直接标记为 `status="not_applicable"`, `steps=[]`）。
4. 无论何种深度，分析字段均不得使用标题改写、摘要逐句直译、通用套话或短句占位，严禁出现裸露数学公式与 9 项指定违规套话。同一论文跨分类时正文只读一次，公共分数相同，主题归类可独立设置。
5. 证明大纲规范：有清晰证明结构的论文给出 2–6 步 `reviewed` 大纲（写清 claim、route 与定位证据）；综述、纯数值、常规模型或速览组统一使用 `status="not_applicable", steps=[]`。
6. 公共阅读优先级按四项独立评分并输出 `priorityComponents`：`advance` 数学推进 0–35，`method` 方法与技术复用性 0–25，`strength` 结果强度与完备度 0–20，`fieldValue` 领域价值 0–20；`priorityScore` 必须等于四项之和。数学推进 0–12 表示常规推广、适配或已有链条复现，13–22 表示既有框架下的实质新定理，23–29 表示尖锐或较广结果、解决明确障碍，30–35 只用于可能改变领域认识的推进。方法分 0–8 为标准方法直接应用，9–16 为有意义的组合或适配，17–21 为可复用技术推进，22–25 为新的核心方法。完备度 0–8 为部分或概念性结果，9–14 为范围明确的完整定理，15–17 为强或尖锐结果，18–20 为最优性、完整分类或特别完备的理论。领域价值 0–8 为很窄或增量工作，9–13 为明确的专门方向价值，14–17 为较广的子领域价值，18–20 为领域级价值。
7. 分档为 0–49 低、50–74 中、75–89 高、90–100 特别高；存储时 75 分以上仍使用 `priorityTier=high`。数学推进不超过 12 时总分不得超过 64。摘要级分析是暂定判断，方法分和完备度各不得超过 16，总分不得超过 79。90 分以上必须同时满足数学推进至少 30、方法至少 18、完备度至少 16。不得因篇幅、公式数量、作者声望或 AI 披露加分；同一论文跨分类时公共分数和四项分值相同，主题归类可以不同。`priorityReason` 必须写明四项分值及论文特有依据；低分另给具体 `lowPriorityReason`。
8. 全部论文评分后做一次分布复核：若 75 分以上超过 35%、低分不足 10%、中位数超过 72，或 90 分以上超过 5%，逐篇对照上述锚点复查高分和临界分；这只是发现整体虚高的信号，不得为了凑比例机械改分。个人阅读兴趣不进入公共分数。
9. 不做独立 proof-verifier 或逐篇数学审稿。每个分类直接用 `scripts/build_complete_report.py --category <id>` 生成 `ReportBatchV3`；`expected`、`fetched`、`analyzed` 必须完全一致。构建器的信息量或评分规则失败时只修正对应字段，不额外扩展为正确性核验。
10. 汇总同日全部分类，生成符合 `docs/daily-overview.schema.json` 的总览：通常 8 个带论文引用的具体结果和 2 个值得关注项。只写问题、结果、方法与意义，不写抓取、阅读、模型或防御性说明；数学表达式使用 LaTeX。

分析字段使用简体中文，标题、作者和英文摘要保留原文。
**AI 披露核查规范**：积极核查正文致谢（Acknowledgments）、声明（Declarations）或尾注：
- 若作者明确披露使用了大模型/生成式 AI，使用 `aiStatus="explicit"`，并在 `aiEvidence` 中完整摘录原句，在 `aiEvidenceSource` 中注明章节页码。
- 若核查后确认无 AI 使用声明，使用 `aiStatus="no_disclosure_observed"`，并在 `aiEvidenceSource` 中注明核查范围（例如 `正文致谢与声明章节已核查，未见AI使用披露`）。
- 尽量避免直接输出 `not_checked`，力求全站呈现清晰、透明的 AI 披露核查结论。

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
