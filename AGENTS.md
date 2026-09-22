# arXiv Daily Pipeline Agent Rules

This workspace operates an automated daily arXiv ingestion, analysis, and publication pipeline for `math.AP` and `math.DG`.

## 1. Automated Scheduled Tasks & Planning Mode Exemption

- **No Planning Mode for Routine Automation**:
  When a user prompt or scheduled task arrives with `# Configurable arXiv Daily`, `daily-ingest`, or any daily automated pipeline trigger:
  - **DO NOT enter Planning Mode**.
  - **DO NOT generate an implementation plan artifact with `RequestFeedback: true`**.
  - **DO NOT block, pause, or wait for user "Proceed" approval**.
  - Immediately and autonomously execute the complete pipeline end-to-end according to [`automations/daily-ingest.md`](automations/daily-ingest.md).
  - Adhere strictly to the silent operation protocol: **succeed silently without unnecessary conversation rounds; output logs only when an unrecoverable failure occurs**.

## 2. Ingestion & Analysis Execution Standards

- **Strategy 1 (Tiered Analysis / 分级精读 - 各方向独立 25% 配额)**:
  - **Phase 1 (Lightweight Triage / 前置分流)**: 
    - 运行 `scripts/triage_papers.py` 分别计算各学科方向（`math.AP` 与 `math.DG`）的 25% 精读名额（配额公式：$\lfloor 0.25 \times N_{\text{category}} \rfloor$），不同方向独立计算，严禁聚合后混合统算。
    - 交叉重叠论文（Cross-lists）若在任一学科方向入选前 25%，则该论文统一赋予 `analysisDepth="full_text_sections"` 并共享分析结果。
  - **Phase 2 (Target Section Slicing & Automated AI Scan / 靶向截取与AI预检)**:
    - 运行 `scripts/extract_paper_sections.py`。
    - **全量论文（100%）**：脚本层自动正则表达式扫描致谢（Acknowledgments）与声明（Declarations），自动预填 `aiStatus`（`explicit` 或 `no_disclosure_observed`）及 `aiEvidenceSource`，杜绝大模型漏检或遗留 `not_checked`。
    - **速览组（剩余 75%，Score $< 75$）**：设置 `analysisDepth="abstract"`。零正文抓取，完全基于标题与摘要提炼。
      - 质量底线：`workSummary` $\ge 80$，`breakthrough`/`limitations`/`priorityReason` $\ge 40$ 字符，$\ge 2$ 项特有技术。
      - **Schema 严格约束**：`proofOutline: { status: "not_reviewed", steps: [] }`（严禁填 `not_applicable`，否则 Zod 校验报错）。
      - 评分上限：方法与强度各 $\le 16$，总分 $< 75$（或受暂定上限 74 分约束）。
    - **高优组（各方向前 25%，Score $\ge 75$）**：设置 `analysisDepth="full_text_sections"`。
      - 仅靶向截取 HTML 中的导言、主定理、证明思路与致谢（截取后文本控制在 15k 字符内，丢弃 80% 以上冗余证明与附录）。
      - 质量标准：`workSummary` $\ge 140$，`breakthrough`/`limitations` $\ge 90$ 字符，$\ge 3$ 项特有技术，提供 2–6 步 `reviewed` 证明大纲（纯综述或纯数值工作除外，可设 `not_applicable`）。
- **Strict AI Disclosure Verification (消灭未核查)**:
  - 必须保证全站 100% 具备明确核查结论：
    - 若显式披露使用大模型/生成式 AI：`aiStatus="explicit"`，在 `aiEvidence` 摘录原句，并在 `aiEvidenceSource` 标明章节位置。
    - 若未见使用披露：`aiStatus="no_disclosure_observed"`，`aiEvidenceSource="正文致谢与声明章节已核查，未见AI使用披露"`。
    - **严禁**在可查正文或摘要时输出 `aiStatus="not_checked"`。
- **Strict LaTeX Math Formatting**:
  - 所有数学符号、变量、希腊字母、方程与算子必须严格使用 LaTeX 界定符（`$ ... $`）包裹，严禁裸露数学符号；严禁 11 项指定违规套话。

## 3. Score Calibration & Distribution Rules

各学科方向（`math.AP` 与 `math.DG`）**独立**满足以下分布硬性约束：
- **$\ge 75$ (High Priority)**：$\le 25\%$（各分类独立控制在各自总篇数的 25% 以内）。
- **$< 50$ (Low Priority)**：$\ge 10\%$（低分论文必须提供详实且非通用的 `lowPriorityReason`）。
- **$\ge 90$ (Top Breakthrough)**：$\le 5\%$（必须同时满足 advance $\ge 30$, method $\ge 18$, strength $\ge 16$）。
- **中位数 (Median score)**：$\le 72$。
- **常规推进 (advance $\le 12$)**：总分严禁超过 64。

## 4. Verification & Atomic Deployment

1. 运行 `scripts/triage_papers.py` 与 `scripts/extract_paper_sections.py` 完成分流与靶向提取。
2. 调度模型（统一使用 `flash`，每批 4 篇）生成结构化分析。
3. 运行 `scripts/sanitize_analyses.py` 进行格式修复与各方向 25% 配额校准。
4. 使用 `scripts/build_complete_report.py` 与 `scripts/verify_batch_json.py` 装配并严格验证各分类 ReportBatchV3。
5. 生成 `daily-overview.json` 并通过 `docs/daily-overview.schema.json` 校验。
6. 本地预检通过后，执行 `powershell -ExecutionPolicy Bypass -File scripts/publish_static_mirror.ps1` 原子更新 `daily-content` 并监控 GitHub Actions 部署。
