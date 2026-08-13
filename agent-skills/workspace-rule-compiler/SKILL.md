---
name: workspace-rule-compiler
description: Builds and maintains this repo's CLAUDE.md so rules stay accurate and locked across sessions — updating it when the design system, file structure, or workflow genuinely changes, and flagging drift between what CLAUDE.md claims and what the repo actually contains. Use after any change that affects repo conventions, or periodically to audit CLAUDE.md accuracy.
---

# Workspace Rule Compiler

CLAUDE.md is only useful if it's true. This skill's job is keeping it that way, not adding to it speculatively.

## Process
1. Diff CLAUDE.md's claims against the actual repo state: does the File Structure section match what's really at the root? Do the documented page sections match what's actually in each HTML file? Is the design system's color/font/radius table still accurate?
2. When a repo change genuinely alters a convention (a new page added, a color token changed, a new script introduced), update the relevant CLAUDE.md section — don't leave stale documentation in place.
3. Never add speculative rules for hypothetical future situations; only document what's actually true of the repo today.
4. Keep edits minimal and targeted — this is a maintenance pass, not a rewrite. Preserve the existing structure and voice of CLAUDE.md.
5. Flag (don't silently fix) anything ambiguous — e.g. if a new file's purpose isn't obvious enough to document confidently, surface it for a human decision rather than guessing.

## Output
Either a direct edit to CLAUDE.md with a one-line summary of what changed and why, or a short drift report if changes need human confirmation first:
```
[DRIFT] CLAUDE.md lists 4 pages; repo now has 5 (new: pricing.html). Recommend adding a Page Structure entry.
```
