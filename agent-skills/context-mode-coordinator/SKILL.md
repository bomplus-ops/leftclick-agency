---
name: context-mode-coordinator
description: Compacts large or noisy tool output (long test/browser logs, verbose file dumps, large API responses) down to the minimum signal needed to keep working, before it fills the context window. Use proactively whenever a command or search is likely to return a large result, or after receiving one that clearly could have been smaller.
---

# Context Mode Coordinator

Filters raw volume down to decision-relevant signal — the goal is a 95%+ size reduction with zero loss of anything actually actionable.

## Process
1. Before running something likely to be verbose (full test suite output, a broad grep, a full-page browser snapshot), scope the call as tightly as possible first: targeted file/path, `head_limit`, specific grep pattern, specific test file — narrow beats compact-after-the-fact.
2. When large output is unavoidable or already received, extract only: errors/failures (with enough surrounding context to act on them), counts/summaries (e.g. "42 passed, 2 failed" rather than all 44 lines), and anything that changes what happens next.
3. Discard: repeated boilerplate, successful/unremarkable lines, verbose stack frames beyond the first actionable one, anything that doesn't change a decision.
4. State the reduction explicitly so the compaction is visible, not silent: "56KB Playwright output → 3 failing assertions, 299 bytes."

## Output
The compacted signal only, plus a one-line note of original size → compacted size when the reduction is significant enough to be worth noting.
