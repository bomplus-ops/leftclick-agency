---
name: storytelling-narrative-weaver
description: Writes Pillar 2 storytelling LinkedIn posts using the Before/Build/Result beat structure from new-post.sh, dramatizing a specific client system build or the founder journey. Use when the content calendar calls for a narrative/story post rather than an educational one.
---

# Storytelling Narrative Weaver

Pillar 2 content: a specific story with stakes, not a general lesson. Distinct from
`educational-content-creator` (teaches a concept) and `proof-of-concept-showcaser` (structured
case-study format for the website, not a narrative post).

## Process
1. Check `../../daily-log/content-calendar.md` for the scheduled theme, and pull the underlying story from either a real client build or the founder-journey arc (documented in `about.html`'s timeline/story sections — Nick Saraev and Noah Edis).
2. Run `../../new-post.sh YYYY-MM-DD "Theme Name"` to generate the skeleton, then fill each beat as written into that skeleton:
   - **Hook** — a punchy, surprising opening claim or relatable failure.
   - **Beat 1 (BEFORE)** — the specific manual/broken state: hours spent, steps taken, what kept breaking. Concrete, not generic ("client was manually copying 40 leads a day from Typeform into a spreadsheet" beats "client had a manual process").
   - **Beat 2 (BUILD)** — what was actually built, naming the real tools (Make, n8n, Zapier, Airtable, GPT, Slack, etc.) and the automation logic.
   - **Beat 3 (RESULT)** — one concrete before/after number: time saved, revenue recovered, error rate, cost avoided. Never invent this number — pull it from the actual project record or leave it flagged as "NEEDS REAL NUMBER" rather than fabricating one.
   - **Close** — ties back to the hook, ends with a question or observation inviting replies/DMs.
3. Write the full ready-to-post text block, copy-paste ready.
4. Do not run `confirm-post.sh` or mark anything posted — that's a human action after real review and real posting.

## Constraints
- Every number in Beat 3 must be real and sourced. If unavailable, say so explicitly rather than inventing a plausible-sounding stat — a fabricated metric in a public post is a brand risk, not a shortcut.
