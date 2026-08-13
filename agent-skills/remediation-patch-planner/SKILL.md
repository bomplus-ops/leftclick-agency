---
name: remediation-patch-planner
description: Drafts a concrete fix spec for a broken or fragile automation node — replacement logic, added error handling, retry/backoff, or a schema-change fix — ready to hand to implementation. Use after integration-failure-diagnoser or workflow-logic-auditor has identified a specific defect and it's time to plan the fix.
---

# Remediation & Patch Planner

Turns a diagnosed defect into an implementable patch spec — not a general suggestion.

## Inputs
- The specific defect (from `integration-failure-diagnoser` or `workflow-logic-auditor`), including the exact node/step name and evidence.

## Process
1. Restate the defect and its evidence in one line.
2. Specify the fix at the node level: which step changes, what the new logic is, and what stays the same. Name the exact configuration (e.g. "add a Filter step before 'Push to CRM' that rejects records missing `email`" — not "add validation").
3. Add failure handling the original lacked: retry count + backoff interval for transient errors (429/5xx), a dead-letter path (log to a sheet/Slack) for anything that exhausts retries, and an alert destination.
4. Note anything the patch does NOT fix (e.g. "this does not address the root schema change upstream — that needs a conversation with the client's dev team") so scope stays honest.
5. Estimate the blast radius: does this patch touch shared logic used elsewhere in the same workflow or other client systems?

## Output
```
[DEFECT] Node "Push to CRM" — 401s from expired OAuth token (see integration-failure-diagnoser log)
[PATCH] Add a token-refresh sub-scenario triggered on 401, using the stored refresh_token; retry the original request once after refresh succeeds.
[ERROR HANDLING] 3 retries, 30s/60s/120s backoff, on 429/5xx only. Exhausted retries → log row to "Failures" sheet + Slack #ops-alerts.
[NOT FIXED] Underlying token TTL is 30 days — recommend client rotate to a long-lived service account if available.
[BLAST RADIUS] Isolated to this scenario; no shared modules affected.
```
