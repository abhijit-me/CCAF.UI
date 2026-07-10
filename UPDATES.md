# Slide Updates — Domains 1–5 PDF Reconciliation

This document records every change made to `src/slides.js` (and the supporting
navigation edits in `src/App.jsx`) after a deep comparison of the five Domain PDFs
against the existing deck. The "What this domain tests" task-statement tables in the
PDFs were ignored per instruction; only substantive teaching content was reconciled.

**Guiding rules applied:** existing styling, colors, slide structures, and callout
types were preserved. New material reuses the existing `content` slide primitives
(`bullets`, `code`, `table`, `callout`, `example`) — no new styling or slide types
were introduced. Content already present in the deck (and often *more* elaborate than
the PDFs) was left untouched.

---

## Summary

- **3 new slides added** (one previously-missing task statement per affected domain).
- **7 existing slides enhanced** with tables/code/bullets that were more elaborate in
  the PDFs or entirely absent.
- **Navigation indices updated** in `App.jsx` to account for the 3 inserted slides.

---

## New slides added

### D3 · Task 3.6 — "Tool Access — allowedTools & permissionMode"
- **Section:** Domain 3 (Claude Code Configuration), inserted after slide 3.5 (CI/CD),
  before the Domain 3 Principles slide.
- **Why:** The PDF (Domain 3, pp. 3–4) covers `allowedTools`, `disallowedTools`,
  `permissionMode` values (`default` vs `acceptEdits`), and the Claude Code
  `settings.json` `PostToolUse` hook that auto-runs the linter after every Write.
  **None of this had a dedicated slide** — it corresponds to task statement 3.6, which
  was entirely absent from the deck. Added as a full slide with bullets, a
  `settings.json` + `ClaudeAgentOptions` code block, a key callout, and a Local-vs-CI
  example.

### D4 · Task 4.6 — "Multi-Pass Review Architecture"
- **Section:** Domain 4 (Prompt Engineering), inserted after slide 4.5
  (Batch Processing), before the Domain 4 Principles slide.
- **Why:** The PDF (Domain 4, p. 5) presents the dedicated multi-pass pipeline
  (Pass 1 claim extraction → Pass 2 source verification → Pass 3 credibility scoring →
  final report with citations) and the attention-dilution rationale. The deck's 4.5
  slide covered *batch* and *multi-instance* review but **not the multi-pass
  single-document architecture**, a distinct task statement. Added as a full slide with
  the ASCII pipeline diagram as a code block, key callout, and 80-page-doc example.

### D5 · Task 5.6 — "Prompt Caching for Cost Optimization"
- **Section:** Domain 5 (Context Management), inserted after slide 5.5
  (Human Review, Confidence & Provenance), before the Domain 5 Principles slide.
- **Why:** Prompt caching (Domain 5, pp. 4–5) — `cache_control: {type: "ephemeral"}`,
  caching large stable prefixes, and the critical exam point that a **single-character
  change (a timestamp/version stamp) invalidates the entire prefix cache** — was
  **completely missing** from the deck despite being its own task statement. Added as a
  full slide with bullets, a `cache_control` code example, a warn callout on cache
  invalidation, and a 50K-token-system-prompt example.

---

## Existing slides enhanced

### D1 · 1.3 — Subagent Invocation, Context Passing & Spawning
- **Added:** a `code` block showing the structured `findings[]` context object
  (`content`, `source_url`, `source_title`, `retrieved_at`).
- **Why:** The slide asserted "use structured data formats… for attribution" but never
  showed the shape. The PDF (Domain 1, p. 3) gives the concrete JSON and the maxim
  "Plain concatenation loses attribution. Structured data preserves it." Added verbatim
  in spirit so the abstract bullet now has a concrete anchor.

### D1 · 1.5 — Agent SDK Hooks — Interception & Normalization
- **Added:** a `table` contrasting Hooks vs Prompt instructions
  (Compliance rate: **100% code runs** vs **~99% probabilistic**; Use-for rows).
- **Why:** The PDF (Domain 1, p. 4) quantifies the hooks-vs-prompts trade-off with the
  concrete 100% / ~99% figures. The deck stated the principle qualitatively but lacked
  the memorable numbers the exam leans on.

### D2 · 2.2 — Structured Error Responses for MCP Tools
- **Added:** a `table` of error categories with the recovery action column
  (transient→retry w/ backoff, validation→fix input, business→escalate,
  permission→rotate credentials/escalate) including the `isRetryable` value per row.
- **Why:** The PDF (Domain 2, p. 3) maps each category to a specific **agent action**.
  The deck listed the four categories in a bullet but omitted the category→recovery
  mapping, which is directly testable.

### D2 · 2.3 — Tool Distribution & tool_choice
- **Added:** a bullet on `strict: true` enabling Structured Outputs mode; a matching
  clause in the callout; and a new `example` showing least-privilege tool scoping
  across coordinator / web-search / synthesis agents.
- **Why:** The PDF (Domain 2, pp. 4–5) covers both `strict: true` (schema-compliance
  guarantee) and a concrete per-agent tool-scoping list. The deck discussed "4–5 tools"
  abstractly but lacked the scoping example and had no mention of `strict: true` in the
  Domain 2 context.

### D3 · 3.4 — Plan Mode, Direct Execution & Iterative Refinement
- **Added:** a `table` of scenarios that require plan mode (10+-file refactor, DB schema
  migration, CI/CD deployment, authentication changes) with the "Why" column.
- **Why:** The PDF (Domain 3, p. 3) enumerates exactly when plan mode is required. The
  deck described the plan-vs-direct heuristic in prose; the table makes the
  high-stakes triggers explicit and scannable.

### D4 · 4.5 — Batch Processing & Multi-Instance Review
- **Added:** the Batches-API vs Synchronous-API decision matrix `table`
  (User waiting / Latency / Volume / Cost priority / SLA), and a "never for blocking
  work" clarification in the callout.
- **Why:** The PDF (Domain 4, p. 4) presents this as a full decision matrix. The deck
  had the facts as bullets; the matrix form is the exam-canonical presentation and
  easier to reason against distractors.

### D5 · 5.1 — Preserve Critical Information Across Long Interactions
- **Added:** a bullet capturing the misconception that a **larger context window does
  NOT fix attention dilution** — it only relocates the diluted zone; the fix is always
  focused per-section passes + synthesis.
- **Why:** The PDF (Domain 5, p. 2) flags this explicitly as a "critical misconception
  the exam tests." The deck covered "lost in the middle" but not the
  bigger-window-doesn't-help corollary, which is a common distractor.

---

## Navigation edits (`src/App.jsx`)

The 3 inserted slides shifted the indices of Domains 4, 5, and the scenario section.
Updated the two hardcoded navigation targets accordingly:

- `domainSlideIndices`: `[4, 17, 28, 37, 46, 55]` → `[4, 17, 28, 38, 48, 58]`
- Scenario TOC link: `goToSlide(55)` → `goToSlide(58)`

Verified programmatically: domain-title slides now sit at indices 4/17/28/38/48 and
the scenario section at 58; total slide count 64 → 67. `npm run build` passes cleanly.

---

## Deliberately NOT changed

Content already in the deck that equals or exceeds the PDFs was left as-is, e.g.:
the agentic-loop code and three termination anti-patterns (1.1), hub-and-spoke
isolated-context treatment (1.2), the empty-vs-failure trap and full structured-error
shape (2.2 / Key Considerations), CLAUDE.md hierarchy and scope rules (3.1), few-shot
2–4 sweet spot and validation-retry feedback (4.2 / 4.4), and provenance/conflict
resolution (5.5). The deck's existing anti-pattern and scenario slides already
subsume the PDFs' warnings, so no duplication was introduced.
