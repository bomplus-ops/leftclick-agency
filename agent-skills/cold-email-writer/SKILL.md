---
name: cold-email-writer
description: Drafts personalized cold outbound emails pitching a specific LeftClick system (from Lead Gen, PM, Hiring, or Sales Admin categories) matched to the prospect's likely pain point, using merge-field placeholders like {{first_name}} and {{company}}. Use after prospect-scraper-filter has qualified a lead list and outreach copy is needed.
---

# Instantly/Cold Email Writer

One email, one specific pain point, one specific system — never a generic agency pitch.

## Process
1. Take the prospect's industry and fit signal (from `prospect-scraper-filter` output) and match to the single most relevant system category from `../../services.html`:
   - Agency with fulfillment pain → Project Management Systems
   - SaaS with onboarding drop-off → Automated Onboarding / Application Systems
   - Firm with hiring bottleneck → Hiring Systems (Intake/AI Scoring/Trial Processes)
   - Any ICP with slow lead response → AI Cold Email / Lead Generation Systems
2. Write a 3-4 sentence email: one line naming their likely specific pain (not generic), one line on the mechanism of the fix (not a vague benefit), one line with a concrete proof point (real case study number, or omit rather than invent one), one low-friction CTA.
3. Use merge placeholders consistently: `{{first_name}}`, `{{company}}`, `{{website}}`, plus any custom variable the personalization requires (e.g. `{{specific_pain_signal}}`).
4. Keep it short enough to read in under 15 seconds — cold email is not the place for the full pitch.

## Output
```
SUBJECT: [specific, non-clickbait, references their actual situation]
BODY:
Hey {{first_name}},

[pain line specific to {{company}}]. [mechanism line]. [proof point or omit].

[low-friction CTA]

—
```
Never fabricate a stat or client name in the proof line — omit it if nothing real is available.
