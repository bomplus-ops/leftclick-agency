# LeftClick — 26-Agent Co-Working Pipeline

A set of 26 Claude Code Skills for LeftClick's actual business: an AI automation
agency that designs and builds Lead Generation, Project Management, Hiring, and
Sales Administration systems (Make/n8n/Zapier/Airtable/GPT/Slack) for agencies,
SaaS companies, professional services firms, and e-commerce brands, and markets
that work through a daily LinkedIn content pipeline (see `../daily-log/`).

This pack replaces an earlier draft brief that described a different business
(NDT/metallurgical inspection under ASME/API codes, Thai-market branding). None
of that applied here, so every agent below is re-scoped to LeftClick's real
service lines, design system (`../CLAUDE.md`), and content workflow
(`../new-post.sh`, `../confirm-post.sh`).

## Install (global, on your own machine)

This repo can't write to your local `~/.claude/skills/` directly — remote
sessions run in an ephemeral container. To install globally:

```bash
cp -r agent-skills/* ~/.claude/skills/
```

Restart Claude Code so the slash commands are picked up. Each skill folder's
name is its slash command, e.g. `agent-skills/cold-email-writer/` → `/cold-email-writer`.

To scope them to just this repo instead, copy to `.claude/skills/` inside
`leftclick-agency/` and commit that directory.

## Divisions

1. **Automation Systems Engineering & QA** (7) — audits and QA gates for the
   automation systems LeftClick builds and ships to clients.
2. **Brand Authority & Inbound Content** (6) — enforces the design system and
   drives the daily/weekly content pipeline.
3. **Outbound Sales & Client Acquisition** (5) — cold email, Upwork, and demo
   scripting for landing new clients.
4. **RevOps & Background Workers** (4) — specs for the lead intake, invoicing,
   onboarding, and payment-webhook automations LeftClick runs on itself.
5. **Operations, Memory & QA** (4) — workspace hygiene, context management,
   and review orchestration for Claude Code sessions working this repo.

See each skill's `SKILL.md` for its trigger conditions and process.
