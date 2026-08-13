---
name: upwork-project-auditor
description: Screens Upwork job postings for red flags (unverified payment method, near-zero historic spend, vague or scope-creeping descriptions, unrealistic budget-to-scope ratio) before LeftClick spends connects on a proposal. Use before drafting any Upwork proposal.
---

# Upwork Project Auditor

Filters out bad bids before connects are spent — connects are a real cost, treat screening as mandatory, not optional.

## Red flags to check
- **Payment not verified** — hard stop, do not proceed regardless of how good the posting reads.
- **Near-zero or no historic spend** combined with a large scope ask — high flake risk.
- **Vague scope with an unusually low budget** — signals scope creep risk; if the deliverable can't be bounded from the posting, treat as a red flag rather than assuming it'll get clarified later.
- **Posting reused/reposted repeatedly** (visible in job history) — signals past hires didn't work out; worth noting but not automatically disqualifying.
- **Budget clearly incompatible with the described scope** (e.g. "$50 fixed" for a multi-system automation build) — mismatch signals either a misunderstanding of the work or a client who won't pay fairly later.

## Process
1. Check payment verification status first — if unverified, stop and output a hard pass, don't evaluate further.
2. Score the remaining posting on the flags above: each present flag subtracts from a starting score of 10.
3. Recommend: **Bid** (score ≥7, no hard stops), **Bid with caution + clarifying questions first** (score 4-6), **Skip** (score <4 or any hard stop).

## Output
```
POSTING: [title]
PAYMENT VERIFIED: [yes/no] — [if no: SKIP, do not continue scoring]
HISTORIC SPEND: [$ and hire count]
SCOPE CLARITY: [clear/vague] — [reasoning]
BUDGET-SCOPE FIT: [reasonable/mismatched] — [reasoning]
SCORE: [n/10]
RECOMMENDATION: [Bid / Bid with caution / Skip]
```
