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

- **Strategy 1 (Tiered Analysis / 分级精读)**:
  - **Phase 1 (Lightweight Triage)**: Determine preliminary 4-component priority scores based on title and abstract.
  - **Phase 2 (Tiered Reading)**:
    - **High Priority Tier (Top 30%–40%, Score $\ge 75$)**: Set `analysisDepth="full_text_sections"`. Read key PDF/HTML sections. Provide deep analysis (`workSummary` $\ge 140$ chars, `breakthrough` $\ge 90$, `limitations` $\ge 90$, $\ge 3$ techniques, and a 2–6 step `reviewed` proof outline).
    - **Abstract Tier (Remaining 60%–70%, Score $< 75$)**: Set `analysisDepth="abstract"`. Do not download full text. Provide concise abstract-level analysis (`workSummary` $\ge 80$, `breakthrough`/`limitations` $\ge 40$, $\ge 2$ techniques, and `proofOutline: {status: "not_applicable", steps: []}`). Scores are provisionally capped at 79.
- **Strict AI Disclosure Verification (消灭未核查)**:
  - Actively inspect paper Acknowledgments, Declarations, or front matter:
    - If authors explicitly declare generative AI/LLM use: set `aiStatus="explicit"`, excerpt the statement in `aiEvidence`, and note the section/page in `aiEvidenceSource`.
    - If verified that no disclosure is present: set `aiStatus="no_disclosure_observed"` and set `aiEvidenceSource="正文致谢与声明章节已核查，未见AI使用披露"`.
    - **Never** leave `aiStatus="not_checked"` for papers that have accessible text.
- **Strict LaTeX Math Formatting**:
  - Every mathematical symbol, variable, Greek letter, equation, and operator must be wrapped in LaTeX delimiters (`$ ... $`). Never leave bare math characters outside math mode.

## 3. Score Calibration & Distribution Rules

Across all unique papers in each announcement day:
- **$\ge 75$ (High Priority)**: $\le 35\%$ of total papers.
- **$< 50$ (Low Priority)**: $\ge 10\%$ of total papers. Low priority papers MUST provide a concrete `lowPriorityReason`.
- **$\ge 90$ (Top Breakthrough)**: $\le 5\%$ of total papers (must satisfy advance $\ge 30$, method $\ge 18$, strength $\ge 16$).
- **Median score**: $\le 72$.
- **Routine advance ($\le 12$)**: Total score cannot exceed 64.

## 4. Verification & Atomic Deployment

1. Assemble and validate batches using `scripts/build_complete_report.py` and `scripts/verify_batch_json.py`.
2. Generate `daily-overview.json` conforming to `docs/daily-overview.schema.json`.
3. Run preflight sync tests with `scripts/sync_static_mirror.ts`.
4. Run `powershell -ExecutionPolicy Bypass -File scripts/publish_static_mirror.ps1` to commit and push atomic updates to `daily-content`.
5. Monitor GitHub Actions (`gh run watch`) to ensure live deployment succeeds.
