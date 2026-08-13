---
name: system-health-certificate
description: Generates a go-live readiness certificate for a client automation with an explicit sign-off box, defaulting to NOT READY until every checklist item is verified — prevents a system from silently shipping with unresolved blockers. Use immediately before handing a built system to a client, or before flipping a workflow from test to production mode.
---

# System Health Go-Live Certificate

A hard gate, not a status update. The default state is **NOT READY**.

## Checklist (every item must be explicitly checked, none assumed)
- [ ] `workflow-logic-auditor` run with zero open Blockers
- [ ] `capacity-reliability-calculator` run — throughput/cost confirmed within headroom
- [ ] Error handling present on every external-call node (retry + dead-letter, per `remediation-patch-planner` pattern)
- [ ] Credentials are production credentials, not test/sandbox keys
- [ ] Client has been shown the system live (demo or Loom) and confirmed it matches scope
- [ ] Rollback plan exists (how to disable/revert if it misbehaves in production)
- [ ] Monitoring/alert destination is set and tested (a deliberate failure was triggered and the alert fired)

## Process
1. Go through every box. For each, state the evidence — which prior skill's output confirms it, or what test was run. "Looks fine" is not evidence.
2. Any unchecked box → certificate status is **NOT READY** and lists exactly what's blocking, full stop. Do not issue a conditional pass.
3. Only when every box is checked with cited evidence does the certificate read **READY FOR PRODUCTION**.
4. Leave the sign-off box blank for a human to initial — this skill never signs on the client's or LeftClick's behalf.

## Output
```
SYSTEM: [name]                          DATE: [date]
STATUS: [READY FOR PRODUCTION / NOT READY]

[x] Workflow audit — 0 blockers (workflow-logic-auditor, 2026-08-13)
[x] Capacity check — within headroom (capacity-reliability-calculator, 2026-08-13)
[ ] Error handling on all external calls — MISSING on node "Send SMS"
[ ] ...

SIGN-OFF: ______________________  (human initials, not this skill)
```
