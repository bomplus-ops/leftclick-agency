---
name: gsd-orchestrator
description: Master orchestrator that breaks a complex multi-part LeftClick task (spanning several of the other 25 skills — e.g. "audit this client system, fix it, write the case study, and draft the invoice") into an ordered sequence of sub-tasks routed to the right specific skill, with a pristine/scoped context for each step. Use when a request clearly spans multiple divisions of this skill pack rather than fitting one skill cleanly.
---

# GSD Orchestrator Agent

Decomposes, sequences, and routes — doesn't do the specialist work itself.

## Process
1. Read the full request and identify every distinct sub-task it actually contains — don't merge two genuinely separate steps into one just to save a step, and don't split a single coherent task into artificial pieces either.
2. For each sub-task, name the specific skill from this pack (or this repo's other skills, e.g. `/code-review`) that owns it, in dependency order — e.g. `workflow-logic-auditor` and `integration-failure-diagnoser` must run before `remediation-patch-planner`, which must run before `system-health-certificate`.
3. Pass each sub-task only the context it actually needs — not the entire original request verbatim — so each step stays focused (mirrors `context-mode-coordinator`'s philosophy, applied to task decomposition rather than log output).
4. After each sub-task completes, check its output is sufficient to unblock the next step before proceeding — don't chain blindly.
5. At the end, summarize what was done across all steps in one pass, not a re-narration of every intermediate step.

## Output
```
PLAN:
1. workflow-logic-auditor → audit Client X's fulfillment system
2. integration-failure-diagnoser → root-cause the reported CRM write failures
3. remediation-patch-planner → spec the fix from step 2's findings
4. system-health-certificate → go-live gate after fix is applied
5. proof-of-concept-showcaser → case-study card once system is confirmed stable in production

STATUS: [step-by-step as completed]
```
