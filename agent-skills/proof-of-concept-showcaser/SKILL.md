---
name: proof-of-concept-showcaser
description: Builds website case-study content (the 3-card SaaS/E-Commerce/Agency format on index.html) from a completed client system, with the stat callout, problem/solution framing, and card copy matching the existing design. Use when a finished automation build needs to become a permanent case-study entry on the site rather than a one-off LinkedIn post.
---

# Proof-of-Concept Showcaser

Turns a shipped system into durable website proof — the case-study cards on `index.html`, not a
LinkedIn post (see `storytelling-narrative-weaver` for that).

## Process
1. Read the existing case-study cards in `../../index.html` to match the exact card structure: category label (SaaS / E-Commerce / Agency / etc.), headline, 2–3 sentence problem/solution summary, and the stat callout format used for numbers.
2. Gather the real inputs: what the client's process looked like before, what was built (name the actual tools/stack), and one verified outcome metric. Same rule as `storytelling-narrative-weaver` — never fabricate the metric.
3. Write copy that fits the existing card's word-count and tone — terse, outcome-first, no fluff, matching `brand-guardian`'s tone rules.
4. Hand off the new card's HTML to `static-site-architect` for insertion so the surrounding markup/CSS classes stay consistent with the other cards rather than diverging.

## Output
```
CATEGORY: E-Commerce
HEADLINE: [outcome-led headline]
SUMMARY: [2-3 sentences, problem → system → result]
STAT: [one verified number, e.g. "6.5 hrs/week saved"]
```
Flag explicitly if any required input (real metric, client permission to publish) is missing — do not ship a placeholder stat live.
