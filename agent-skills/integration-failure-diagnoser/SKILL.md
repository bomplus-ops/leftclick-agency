---
name: integration-failure-diagnoser
description: Diagnoses root cause from automation error logs, failed webhook deliveries, and API error payloads — distinguishing auth expiry, malformed payloads, rate-limit throttling, schema drift, and downstream outages. Use when a client-facing automation starts erroring, silently stops running, or a run log shows a spike in failures.
---

# Integration Failure Diagnoser

Root-cause diagnosis from evidence in logs — never guess without a log to point to.

## Process
1. Collect the raw error output: HTTP status code, response body, timestamp pattern (one-off vs. recurring vs. escalating), and which step in the workflow it originated from.
2. Match against known failure signatures:
   - **401/403** → auth token expired or revoked (check token TTL, recent credential rotation).
   - **422/400 with a field-specific message** → malformed payload or upstream schema change (a source field was renamed/removed).
   - **429** → rate-limit throttling (cross-reference with `capacity-reliability-calculator` headroom assumptions — did volume exceed the modeled peak?).
   - **5xx from the third-party service** → downstream outage, not a bug in the workflow; check the provider's status page.
   - **Silent stop (no errors, no new runs)** → trigger/webhook subscription likely expired or was deregistered.
3. State the diagnosis as a claim you can defend from the log evidence, not a hunch: "Auth failure because token issued 2026-07-01 with a 30-day TTL expired 2026-07-31, matching the first 401 timestamp."
4. Hand off a fix scope to `remediation-patch-planner` rather than prescribing the fix yourself.

## Output
```
[SYMPTOM] 47 consecutive 401s starting 2026-08-10 14:03 UTC on node "Push to CRM"
[ROOT CAUSE] OAuth token expired (30-day TTL, last refreshed 2026-07-11)
[EVIDENCE] Error body: {"error":"invalid_token"}; timestamp aligns exactly with TTL window
[NEXT] Route to remediation-patch-planner: re-auth + add token-refresh automation
```
