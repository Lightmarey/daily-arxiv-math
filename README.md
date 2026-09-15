# 可配置 arXiv 研究前沿日报

站点按 arXiv 官方 New submissions 与 Cross-lists 生成研究阅读指南。追踪范围、展示范围、主题、阅读偏好和站点文字由本地配置驱动；仓库默认只追踪 `math.AP`。

## 本地配置

复制 `config.example.json` 为被 Git 忽略的 `config.local.json`，再修改：

- `categories` 使用标准 arXiv 分类 ID；每个分类定义展示名、可选颜色、稳定主题 ID、主题名称和私有阅读偏好。
- `fetchCategories` 决定下一轮抓取哪些分类，可以为空。
- `displayCategories` 决定页面默认展示哪些分类。停止抓取不会删除历史，仍可继续展示该分类。

`npm run dev` 会先把迁移和有效配置导入本地 D1。开发服务器监听配置文件；有效修改写入 D1 后在下一次请求生效，非法修改会报错且保留上一份有效配置。也可单独运行：

```bash
npm run db:local:migrate
npm run config:import
```

旧报告的分析字段可由确定性规则回填为 LaTeX（不调用 AI）：先预览，再显式写入本地 D1。

```bash
npm run math:backfill
npm run math:backfill -- --apply
```

转换会保留标题、作者、原始摘要和 AI 披露原文；仅处理日报分析、技术列表、证明大纲和排序理由。它映射已有的 Unicode 数学符号、希腊字母及上下标，无法从含糊的纯文本推断作者未标记的数学结构。

缺少 `config.local.json` 时命令使用仓库的 AP 示例；显式指定但不存在或内容非法的文件会失败。公开 `/api/config` 只返回展示字段，不包含 `fetchCategories` 或 `readingPreferences`。示例论文只在 `/?preview=1` 显式预览模式出现，数据库错误不会回退到示例数据。

## 数据流

1. `scripts/arxiv_listing.py` 按配置分类读取官方 `new/catchup` 清单，分别保存 New 与 Cross-list 事件；某分类失败会记录在 `failures`，不阻止成功分类继续，也不会伪造零篇。
2. `scripts/arxiv_fetch.py --manifest` 对成功清单的 ID 并集只抓一次共享元数据。
3. 每个分类独立分析，读取该分类的主题与阅读偏好；较低成本 subagent 逐篇读取 PDF 或 HTML 正文，输出带节、定理、引理或页码证据的证明大纲，并检查致谢、声明和正文末尾的 AI 使用披露。正文不可用时明确保留为“尚未补读正文／尚未核查 AI 声明”。
4. `scripts/build_complete_report.py --category ...` 只组装结构化分析，生成一个 `ReportBatchV3`。
5. `scripts/publish_payload.py --endpoint report-v3` 发布到 `/api/ingest/v3`。服务端在同一事务中校验当前配置版本和抓取范围，并只替换该分类、该公告日的报告。
6. `scripts/backfill_volume.py` 用官方 catchup 页回填精确公告事件；`scripts/backfill_volume_metadata.py` 则从 arXiv OAI 分类元数据批量补足长期趋势，不下载论文正文，并保留已有的精确公告计数优先级。页面会明确披露两种统计口径。

论文元数据按 arXiv ID 共享，分析按“分类＋公告日＋论文＋版本”保存。同一论文跨分类时列表按 `displayCategories` 顺序显示一张卡，详情保留各分类分析。趋势点使用 `counts: Record<categoryId, number | null>`，因此已确认零篇和未采集可以区分。

公开只读接口为 `/api/config`、`/api/reports?categories=math.AP`、`/api/volume?range=6m|2y&categories=math.AP` 与 `/api/health`。受保护接口为 `/api/ingest/state`、`/api/ingest/v3` 和 `/api/ingest/volume-history`；旧 V1/V2 写入接口在鉴权后返回 `410`。

## 检查与静态镜像

本地开发和构建推荐使用 Node.js 24；本轮在 Node.js 24.19.0 完成构建验证。

```bash
npm run lint
npm run typecheck
npm test
npm run db:check
npm run security:check
npm run build
```

静态镜像格式为 schema v2，保存公开配置快照、逐分类 coverage、全部分类分析和动态趋势。离线同步多分类公告日时，`--batch` 传入逗号分隔的 V3 文件；当天仍抓取且显示的分类必须全部覆盖，已停抓但继续显示的分类明确记为 `not_collected`。详细发布、迁移和回滚约束见 [docs/operations.md](docs/operations.md)。
