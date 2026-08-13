---
name: client-risk-scoring-matrix
description: Scores live client automations by likelihood-of-failure x business-impact-if-it-fails to prioritize which systems need monitoring, redundancy, or a support-hours buffer first. Use during account review, when support capacity is limited and priorities need ranking, or when onboarding a new client system into ongoing support.
---

# Client Risk Scoring Matrix

A 2-axis score, not a gut-feel ranking.

## Axes
**Likelihood of Failure (LoF)** — 1 (very stable, no recent incidents, simple logic) to 5 (fragile
dependency, history of breaking, complex branching, third-party API known to change without notice).

**Consequence of Failure (CoF)** — 1 (cosmetic, client won't notice for days) to 5 (revenue-blocking:
missed leads, broken client-facing chatbot, failed invoice run, blown SLA).

## Process
1. For each system under support, score LoF and CoF independently with one sentence of justification each — cite an incident history or a specific fragile dependency, don't just assert a number.
2. Risk score = LoF × CoF (max 25).
3. Rank all systems by score, descending.
4. For anything scoring ≥15, recommend a specific mitigation: added monitoring/alerting, a fallback path, or moving it off a fragile dependency — not just "watch it closely."

## Output
```
| System                          | LoF | CoF | Score | Mitigation |
|----------------------------------|-----|-----|-------|------------|
| Client A — lead intake webhook   | 4   | 5   | 20    | Add dead-letter queue + Slack alert on failure |
| Client B — weekly report emailer | 2   | 2   | 4     | No action needed |
```
Sort highest score first. Flag anything ≥15 for immediate attention regardless of when it's next scheduled for review.
