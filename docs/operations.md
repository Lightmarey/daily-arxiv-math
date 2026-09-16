# 静态站运维

## 架构边界

唯一公开站点是 GitHub Pages。`main` 保存 Astro 模板、内容协议和离线生成工具；`daily-content` 保存公开 JSON 快照。没有运行时数据库、写入接口或服务器端应用。

每个历史日是不可变快照：该日自己的 `categories` 与 `coverage.categories` 决定是否有效。当前配置新增 `math.DG` 时，旧的 math.AP-only 日期保持可访问；只有显式回填该日期才会写入 DG 分析。

## 日常采集

1. 从 `config.local.json` 固定本轮配置版本。
2. 分别读取每个 `fetchCategories` 分类的官方公告列表。Replacements 不计发文量；无法确认的日期保持缺失，不能写成零篇。
3. 对所有分类的论文 ID 并集读取一次共享元数据，再按分类主题和阅读偏好独立分析。
4. 每个分类生成一个 `ReportBatchV3`。同日所有仍抓取且展示的分类批次齐全后，再跨领域生成一个日级总览 sidecar。
5. sidecar 必须符合 [`daily-overview.schema.json`](daily-overview.schema.json)：包含 1–12 个结果和 0–3 个值得关注项，所有引用对应当日不同的 arXiv 论文。
6. 静态同步只重建本轮日期；其他 v4 日期先独立校验，再原样保留。manifest 不设隐式“最近 N 天”裁剪。

离线预览：

```bash
npx tsx scripts/sync_static_mirror.ts \
  --output <daily-content-worktree> \
  --config <config.local.json> \
  --batch <ap.json,dg.json> \
  --overview <daily-overview.json> \
  --required-date <YYYY-MM-DD> \
  --volume-file <volume.json>

npm run static:build -- \
  --content <daily-content-worktree> \
  --out <site-dir> \
  --base-path /daily-arxiv-math
```

一次性从 v3 迁移历史内容时，先为 manifest 中每个日期生成一个以日期命名的 sidecar。sidecar 可以直接放在目录中，也可以分放在 `a/`、`b/` 等子目录；文件名必须全局唯一。迁移器完整读取并校验全部日期后才原子创建新目录：

```bash
npx tsx scripts/migrate_static_mirror_v4.ts \
  --content <v3-content> \
  --overviews <sidecar-root> \
  --output <new-v4-content>
```

## 发布

`scripts/publish_static_mirror.ps1`（Windows）和 `.sh`（Unix）使用本地锁和临时 worktree：

1. 从 `origin/daily-content` 创建临时检出；
2. 校验并合并同日批次；
3. 扫描公开内容中的敏感信息；
4. 提交并快进推送 `daily-content`；
5. 用精确 40 位内容 SHA 触发 `Arxiv Brief Pages`。

Pages 工作流始终从受信任的 `main` 构建器生成站点，并验证请求 SHA 属于 `daily-content`。产物必须包含首页和全部 manifest 日期页，不得包含 `/archive/`、`/papers/`、内容 JSON、运行时 API 请求或越出 `/daily-arxiv-math/` 的内部链接。

恢复旧内容时，手动运行 Pages 工作流并输入 `daily-content` 历史中的完整 SHA。恢复只切换公开快照，不改写分支历史。

## 验收

代码合并前运行：

```bash
npm ci
npm run ci
npm run static:build -- --content <known-good-content> --out <site-dir> --base-path /daily-arxiv-math
```

部署后检查：

- 首页和最早/最新日期可访问；
- 日期日历与顶部搜索可用；
- math.AP 与 math.DG 及各自主题独立筛选；
- 当日总览不随筛选改变，摘要锚点跳到对应论文；
- 论文标题打开 arXiv；
- 完成的工作、技术、AI 披露默认展开；可能的突破、需谨慎、证明逻辑默认折叠；
- 周趋势悬浮或键盘聚焦时显示各领域数额。
