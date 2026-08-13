---
name: lead-ingestion-worker
description: Drafts the integration spec for a polling worker that pulls new leads/replies from Gmail and cold-email tooling (e.g. Instantly) into LeftClick's CRM/lead tracker on a schedule. Use when designing or documenting LeftClick's own internal lead-intake automation, not a client-facing system.
---

# Lead Ingestion Worker

Specs an internal background worker — output is a design spec ready for implementation, not the implementation itself, unless asked to also write the code.

## Process
1. Define the poll sources explicitly: which Gmail label/query, which cold-email tool's API/webhook, and the polling interval (default: every 10 minutes unless a tighter SLA is specified).
2. Define the dedup key (e.g. sender email + thread ID) so re-polling never creates duplicate CRM records.
3. Define the field mapping from source → CRM: sender, subject/first line, source channel, timestamp, and any reply-sentiment signal (positive/neutral/negative reply) if the source provides it.
4. Define failure behavior: what happens if the CRM write fails (retry count, dead-letter destination) and what happens if the poll itself fails (alert destination, not a silent skip).
5. State the idempotency guarantee explicitly: running the same poll window twice must not double-create records.

## Output
```
SOURCE: Gmail label "Replies", polled every 10 min
DEDUP KEY: message-id
MAPPING: from → contact.email, subject → lead.first_touch, internalDate → lead.received_at
ON CRM WRITE FAILURE: retry x3 (30s/60s/120s), then log to dead-letter sheet + Slack alert
ON POLL FAILURE: alert #ops-alerts immediately, do not silently skip the window
```
