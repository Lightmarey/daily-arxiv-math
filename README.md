# daily-arxiv-math

面向研究阅读的 arXiv 分析与几何日报。站点由 Astro 完全预渲染并部署到 GitHub Pages；浏览器只运行筛选、日期切换和趋势图交互，不访问 API。

## 配置与数据

复制 `config.example.json` 为被 Git 忽略的 `config.local.json`。每个 arXiv 分类独立定义：

- 稳定分类 ID、展示名和颜色；
- 与该分类关联的主题；
- 仅供生成任务使用的阅读偏好。

`fetchCategories` 控制本轮采集，`displayCategories` 控制站点展示。新增领域只影响新日期或显式回填；已有日期按自己的 coverage 快照保留，不会因新领域缺少历史数据而消失。

内容分支 `daily-content` 使用 schema v4：

```text
data/config.json
data/manifest.json
data/volume.json
data/daily/YYYY-MM-DD.json
```

每日文件保存所有领域分析和当日 coverage。站点不生成论文详情、Markdown 全文或日期归档页；首页与每日 URL 都直接展示该日全部论文，标题链接到 arXiv。

## 数据流

1. `scripts/arxiv_listing.py` 分领域读取 arXiv New submissions 与 Cross-lists。
2. `scripts/arxiv_fetch.py` 对本轮所有领域的 ID 并集获取一次元数据。
3. 各领域独立生成一个 `ReportBatchV3`；同一论文可以保留多份领域分析。
4. 汇总当天全部领域分析，生成符合 [`docs/daily-overview.schema.json`](docs/daily-overview.schema.json) 的日级总览 sidecar。
5. `scripts/sync_static_mirror.ts` 在本地把同日批次和总览原子合并进 v4 内容快照。
6. `scripts/publish_static_mirror.ps1`（Windows）或 `.sh`（Unix）快进推送 `daily-content`，并以精确内容 SHA 触发 Pages 构建。

当日总览的论文总数和主题计数由站点按唯一 arXiv ID 计算；结果短语与值得关注项来自日级 sidecar，页面切换领域或主题时保持不变。

## 本地检查

需要 Node.js 22.13 或更高版本和 Python 3。

```bash
npm ci
npm run ci
npm run static:build -- --content <daily-content-worktree> --out <site-dir> --base-path /daily-arxiv-math
```

发布命令：

```powershell
& scripts/publish_static_mirror.ps1 `
  -ConfigPath <config.local.json> `
  -BatchPath <math.AP-batch.json,math.DG-batch.json> `
  -OverviewPath <daily-overview.json> `
  -RequiredDate <YYYY-MM-DD>
```

完整约束见 [docs/operations.md](docs/operations.md)。
