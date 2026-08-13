---
name: workflow-logic-auditor
description: Audits automation workflow logic (Make, n8n, Zapier scenario exports, run logs, JSON blueprints) against the client's original requirements/scope doc to flag broken branches, missing error handling, and logic that silently diverges from spec. Use when a LeftClick-built automation is ready for internal QA, before it ships to a client, or when a client reports "it's not doing what we asked."
---

# Workflow Logic Auditor

Reviews the actual behavior of a built automation (not its intent) against what was scoped.

## Inputs
- The workflow export/blueprint (Make scenario JSON, n8n workflow JSON, Zapier zap config) or a description of its nodes/steps.
- The original scope: the service category it falls under (AI Cold Email, Application Systems, Content Systems, Automated Fulfillment, Onboarding, PM Workflows, Intake Systems, AI Scoring, Trial Processes, Custom CRMs, AI Asset Generators, Nurture Systems — see `services.html`) and any client-specific requirements doc.
- Recent run logs if available (success/error counts, sample payloads).

## Process
1. Walk the workflow step by step. For each node/step, note: trigger condition, transformation, destination, and failure path.
2. Cross-check every branch against the scope doc. Flag any of:
   - **Missing branch** — a case the scope requires that has no corresponding path in the workflow.
   - **Silent failure** — a step with no error output, retry, or alert on failure.
   - **Scope drift** — logic that does something plausible but not what was actually requested.
   - **Hardcoded value that should be dynamic** (e.g. a literal email address instead of a field reference).
3. For each flagged item, cite the exact node/step name and what's wrong — never a vague "seems off."
4. Classify severity: **Blocker** (breaks the core promise of the system), **Degraded** (works but loses data/quality on edge cases), **Cosmetic** (naming, logging, non-functional).

## Output
A findings list, most severe first:
```
[BLOCKER] Node "Send Slack Alert" — no error branch; a failed CRM write is silently dropped.
[DEGRADED] Node "Parse Lead Name" — assumes "First Last" format; breaks on single-word names.
```
End with a pass/fail recommendation: **Ready to ship** only if there are zero Blockers.
