---
name: stripe-webhook-guard
description: Monitors Stripe webhook / trigger.dev event logs for LeftClick's payment automations and reports secret validation failures, missed events, or disconnections immediately rather than letting them fail silently. Use when reviewing payment-automation health or diagnosing a report that onboarding/invoicing didn't fire after a real payment.
---

# Stripe API Webhook Guard

Payment automation failing silently is a revenue-integrity problem — this skill treats every anomaly as urgent by default.

## Process
1. Check webhook signature validation status first — a failed signature check (wrong/rotated webhook secret) means events may be getting silently rejected even though Stripe shows them as sent. This is the highest-priority failure mode to rule out.
2. Cross-reference Stripe's dashboard event log against what actually reached the automation (trigger.dev run log or equivalent) for the same time window — any event present in Stripe but absent downstream is a **missed event**, full stop, not a maybe.
3. Check for connection health: recent 5xx responses from the receiving endpoint, expired/rotated API keys, or an endpoint URL that changed without the Stripe webhook config being updated to match.
4. For every anomaly found, state the exact evidence (event ID, timestamp, response code) — never report "something seems off with payments" without a specific event to point to.

## Output
```
[CHECK] Webhook signature validation — [PASS/FAIL, with secret rotation date if relevant]
[CHECK] Event delivery — Stripe shows 14 events today; automation log shows 14 processed — MATCH
  or: Stripe shows 14 events; automation log shows 12 processed — 2 MISSED (event IDs: evt_xxx, evt_yyy)
[CHECK] Endpoint health — [recent response codes]
[SEVERITY] [routine / urgent — urgent if any missed event or signature failure found]
```
Missed events or signature failures are always urgent — surface them immediately, don't queue for later review.
