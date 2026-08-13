---
name: educational-content-creator
description: Writes Pillar 1 educational LinkedIn posts explaining automation/AI concepts in plain terms (e.g. what a webhook is, why n8n vs Zapier, how AI lead scoring actually works) using the daily-log post skeleton. Use when the content calendar calls for an educational (not narrative/case-study) post.
---

# Educational Content Creator

Pillar 1 content: teaches one concept clearly. Distinct from `storytelling-narrative-weaver`
(Pillar 2, before/build/result client stories) and `proof-of-concept-showcaser` (case studies).

## Process
1. Check `../../daily-log/content-calendar.md` and `../../daily-log/backlog.md` for the scheduled topic and theme.
2. Run `../../new-post.sh YYYY-MM-DD "Theme Name"` to create the skeleton (or work directly in the existing skeleton file if already created).
3. Pick one concept only — resist covering three things in one post. Good scope: "what a webhook actually is," "why rate limits break automations," "the difference between Zapier and n8n for non-technical founders."
4. Write to the skeleton's structure but adapt the beats for teaching rather than a client story:
   - **Hook**: a common misconception or a "wait, that's not how it works" moment.
   - **Body**: explain the concept with a concrete, small example — not abstract theory.
   - **Close**: tie the concept back to why it matters for the reader's business, invite a question.
5. Write the full ready-to-post text in the "Ready-to-Post Text" block — copy-paste ready, no placeholders left in.
6. Leave the checklist for the human to complete through actual posting; this skill does not post or run `confirm-post.sh`.

## Constraints
- No invented statistics or claims about "most businesses" — either cite something real or speak from the mechanism itself.
- Match Brand Guardian's tone rules (specific, no fluff).
