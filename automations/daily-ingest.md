# Configurable arXiv Daily

这是工作日数据任务。成功时静默；某分类失败时继续处理其他分类，最终报告失败分类并让任务失败。不得打印令牌、Authorization、阅读偏好、论文正文或完整写入载荷。

## 本次运行边界

开始时生成唯一 `ARXIV_RUN_ID`，固定带时区的 `ARXIV_SCHEDULED_FOR`，并把 `ARXIV_CACHE_DIR` 指向保存项目的 `.automation/arxiv-cache` 绝对路径；先用 `scripts/daily_outcome.py --status running` 记录本次运行。所有 arXiv HTTP 读取必须经 `scripts/arxiv_http.py`，它跨进程共享 4 秒间隔、Retry-After 冷却及每次运行 20 分钟等待预算；遇到 `Deferred` 保留原运行 ID 和进度，不能换代理或并行绕过冷却。

## 抓取与分析

1. 启动时读取并校验 `config.local.json`（缺失时使用 `config.example.json`），固定 `configVersion`。从带鉴权的 `/api/ingest/state` 取得每个 `fetchCategories` 分类的 `latestAnnouncementDate`。发现窗口从该日期前 72 小时开始，以覆盖延迟公告；候选日必须比对 `/api/reports` coverage，只有尚未完整发布的分类/公告日才进入下载、模型分析和写入。没有新内容时立即成功退出。临时抓取或分析失败不得当作零篇，也不得推进对应日期；下次运行继续重试。
2. 运行 `scripts/arxiv_listing.py` 获取每类官方 New/Cross-list 清单。Replacements 不计发文量；清单存在且为空才是确认零篇。失败分类记录为 missing，不生成零值。
3. 用 `scripts/arxiv_fetch.py --manifest` 对成功分类的 ID 并集抓取一次元数据。按分类清单独立分析同一论文，主题使用该分类配置的稳定 `topicId`，优先级结合私有 `readingPreferences`。预期、抓取或分析数量不一致的分类不得调用写接口。
4. 为每篇论文调用 `gpt-5.6-luna`、`high` 推理的 subagent 下载并读取 PDF 或 HTML 正文。subagent 只返回结构化分析：`analysisDepth`、`progressType`、`workSummary`、`techniques`、`breakthrough`、`limitations`、`proofOutline`、`aiStatus`、`aiEvidence` 和 `aiEvidenceSource`。证明步骤必须分别给出主张、论证路线，以及可复查的节、定理、引理或页码证据；正文不采用定理证明结构时使用 `not_applicable`。同时检查致谢、AI/工具使用声明和正文末尾。`explicit` 仅表示作者明确披露在研究、证明、写作、代码或编辑过程中使用 AI 工具；论文主题、参考文献或孤立关键词提到 AI 不算披露。总装配只消费这份结构化输出，不得用摘要补造正文证据或把关键词命中直接判为披露。
5. 正文获取或解析失败时，必须写入 `analysisDepth: abstract`、`proofOutline: {status: not_reviewed, steps: []}`、`aiStatus: not_checked`，并且不填 AI 证据。只有实际检查指定范围且没有发现披露时才用 `no_disclosure_observed` 并在 `aiEvidenceSource` 写明检查范围；明确披露时才用 `explicit`，同时写证据和来源。
6. 每个成功分类用 `scripts/build_complete_report.py --category <id> --run-id "$ARXIV_RUN_ID" --scheduled-for "$ARXIV_SCHEDULED_FOR"` 生成独立 `ReportBatchV3`；同一运行的各分类必须保留同一 run ID。低优先级给出具体靠后理由。
7. 标题、作者与原始摘要保留来源原文；`progressType`、`workSummary`、`techniques`、`breakthrough`、`limitations`、`proofOutline`、`priorityReason`、`lowPriorityReason` 与 `revisionSummary` 必须使用简体中文。每个数学表达式必须用 `$...$` 或 `$$...$$` 包裹，并使用 LaTeX 命令；不得以裸 Unicode 数学符号替代公式，也不得翻译或破坏公式。

## 原子发布与追补

1. 用 `scripts/publish_payload.py --endpoint report-v3` 逐分类发布。它持有本地写锁，并在写入响应不确定时按完整报告 ID 与 coverage 复核；重试必须复用相同 payload。HTTP 409 表示配置快照已过期，丢弃剩余旧批次并重新开始；任何失败分类不得推进游标。
2. 按分类核对 `/api/reports` coverage、`/api/volume` 当日 count 和 `/api/ingest/state` 游标。
3. 日常任务不扫描或重写历史报告。历史回补、重新分析和趋势修复必须作为单独任务显式运行；日常任务只处理本轮发现且尚未完整发布的公告日。

## 公开镜像边界

本任务在完成本地 D1 写入和核对后结束。不得运行 `scripts/publish_static_mirror.sh`，不得写入 `daily-content`、GitHub Pages 或 Sites。公开镜像发布是单独的、显式授权的发布任务；它读取已经完整的本地/公开数据，并独立承担推送、构建和发布失败。

全部发布并完成第 2 步核对后，用 `scripts/daily_outcome.py --status success --ingest-verified` 写入相同 run ID、计划时段和 expected/published 总数；经核验没有新公告时写 `no_new`，失败或权限阻塞时写 `failed` 或 `blocked`。异常中止留下 `running`，不得代写成功。只输出运行 ID、公告日、各分类 expected/published、配置版本和脱敏错误摘要。
