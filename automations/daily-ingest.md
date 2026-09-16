# Configurable arXiv Daily

这是工作日数据任务。读取 `config.local.json` 并固定 `configVersion`。每个 arXiv HTTP 请求必须经过 `scripts/arxiv_http.py` 的共享节流和 Retry-After 处理。

## 抓取与分析

1. 从 `origin/daily-content:data/manifest.json` 取得已发布日期，仅处理官方公告中尚未完整保存的日期。
2. 对每个 `fetchCategories` 分类分别运行 `scripts/arxiv_listing.py`。只有找到相应公告区且为空时才记零；失败分类保持缺失。
3. 使用 `scripts/arxiv_fetch.py --manifest` 对所有成功分类的 ID 并集获取一次元数据。
4. 按分类独立分析并使用该分类的主题与阅读偏好。同一论文跨分类时保留各自分析。
5. 每个成功分类用 `scripts/build_complete_report.py --category <id>` 生成 `ReportBatchV3`。expected、抓取和分析数量不一致时停止该分类。
6. 汇总同日所有分类的报告，生成符合 `docs/daily-overview.schema.json` 的总览 JSON：用 1–12 个带论文引用的短语概括当天具体结果，并可选 0–3 个值得关注项；写数学结果及其意义，不写阅读过程、章节位置或防御性说明。

输出字段使用简体中文；数学表达式使用 LaTeX。证明大纲只记录可复查的论证步骤。`explicit` 只用于作者明确披露 AI 使用；未检查时使用 `not_checked`。

## 原子发布

同一公告日所有仍抓取且展示的分类批次完成后，调用：

```bash
bash scripts/publish_static_mirror.sh \
  <config.local.json> \
  <category-a.json,category-b.json> \
  <daily-overview.json> \
  <YYYY-MM-DD> \
  <volume.json>
```

脚本将批次合并进 `daily-content`、保留全部既有日期并触发 GitHub Pages。任一必需分类不完整时不得发布该日期，也不得用空值覆盖已有内容。发布后核对 Pages 工作流成功和线上首页日期；成功时静默，失败时报告分类、日期和脱敏错误摘要。
