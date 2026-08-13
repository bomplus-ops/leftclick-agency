---
name: capacity-reliability-calculator
description: Calculates throughput, rate-limit headroom, and cost-per-run for an automation before it goes live, using an explicit input-formula-result-source math trace (no invented numbers). Use before launching any client automation that runs on a schedule or webhook volume, or when a client asks "will this scale."
---

# Capacity & Reliability Calculator

Every number produced must be traceable: **input → formula → result → source**. Never state a
throughput or cost figure without showing the calculation and citing where each input came from
(API docs, client-provided volume estimate, or a measured test run).

## Inputs
- Expected event volume (leads/day, emails/day, API calls/day) — from the client or a measured baseline.
- Rate limits of each connected service (e.g. platform API calls/min, email sends/day, LLM tokens/min) — from that service's published docs, not assumption.
- Cost per unit (per API call, per token, per email send) — from current published pricing.

## Process
1. List every external service the workflow touches and its rate limit + pricing, with a source (doc URL or "client-provided, dated X").
2. Compute peak throughput: `min(all rate limits) × safety margin (default 80%)`. Show the arithmetic.
3. Compute cost-per-run and cost-at-expected-volume. Show the arithmetic.
4. Identify the binding constraint — the single lowest-headroom service — and state the volume at which the system will start failing or queuing.
5. If any input is missing or unverifiable, say so explicitly instead of estimating. **Do not fabricate a rate limit or price.**

## Output
```
[INPUT] Instantly.ai send limit: 500/day/mailbox (source: instantly.ai/docs, checked 2026-08-13)
[FORMULA] 3 mailboxes × 500/day × 0.8 safety margin
[RESULT] 1,200 sends/day headroom
[STATUS] Client volume (400/day) is within headroom — no scaling risk.
```
Flag anything within 20% of a hard limit as **at risk**.
