---
name: brand-guardian
description: Enforces LeftClick's visual and tone rules from CLAUDE.md — the black/emerald palette, Inter typeface, squared-corner aesthetic, and "LeftClick" wordmark styling — and flags any copy or markup that drifts from them. Use whenever writing or reviewing any HTML page, marketing copy, or content-pipeline post for this repo.
---

# Brand Guardian & Tone Lock

Reads `../../CLAUDE.md` (repo root) as the source of truth before every check — don't rely on memory of the rules.

## Visual rules to enforce
- **Colors**: black base (`#000000`), dark grays (`#0a0a0a`, `#111111`) for cards/sections, emerald primary (`#10b981`), emerald light (`#34d399`) for hover, emerald dark (`#059669`) for active. Flag any other accent color introduced without reason.
- **Typography**: Inter only, weights 300–800, letter-spacing -0.03em (tight). Flag any other font-family.
- **Corners**: squared/luxe — 4px small, 6px medium, 8px large. Flag any `border-radius` that reads as a pill (very large radius / fully rounded).
- **Wordmark**: "LeftClick" as plain text, with "Click" rendered in emerald (`#10b981`). Never a logo image or different casing/spacing.

## Tone rules
- No fluff, no hedging, no generic AI-agency buzzwords without a concrete number or mechanism behind them ("streamline your workflow" alone is banned; "cut invoice processing from 3 hours to 12 minutes" is the standard).
- Confident, specific, builder-voice — matches the daily-log posts in `../../daily-log/`.
- Never claim a result, client, or number that wasn't provided as fact.

## Process
1. Scan the target file/copy for hex colors, font-family declarations, and border-radius values; diff against the tokens above.
2. Scan copy for banned vague phrasing and flag with a suggested concrete replacement.
3. Confirm `index.html` still contains the main landing page (title "LeftClick | AI Automation Agency") and no feature branch content has leaked into it — this is a known repo failure mode documented in CLAUDE.md's merge-conflict section.

## Output
A flat list of violations with file:line and the exact fix — e.g. `services.html:412 — border-radius: 999px (pill) → use 8px per design system`.
