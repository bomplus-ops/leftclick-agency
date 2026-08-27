# LinkedIn Content Calendar

Last updated: 2026-08-27 (bot)

| Date | Theme | Hook Direction | Status |
|------|-------|----------------|--------|
| 2026-06-10 | Intro / Agency Story | Why we started LeftClick | ✅ POSTED (first post) |
| 2026-07-03 | Cold Outreach | AI cold email system stats | ✗ MISSED — window closed (Day 39). Closed 2026-08-11 |
| 2026-07-07 | Hiring Automation | AI scoring vs. manual resume review | ✗ MISSED — window closed (Day 35). Closed 2026-08-11 |
| 2026-07-10 | Workflow Automation | Manual follow-up → automated (proposal/invoice chasing) | ✗ MISSED |
| 2026-07-14 | Lead Gen | Cold email system stats — volume + reply rate from a real client result | ✗ MISSED — window closed (Day 28). Closed 2026-08-11 |
| 2026-07-17 | Client Results | Specific before/after numbers from a case study (reporting client, 4h/week × 6 months) | ✗ MISSED — window closed (Day 25). Closed 2026-08-11 |
| 2026-07-21 | Sales Admin | CRM chaos → automated pipeline | ✗ MISSED — final window (Jul 24) passed |
| 2026-07-28 | Hiring Automation | Time cost of bad hires vs. AI scoring (follow-up to Jul 7) | ✗ MISSED — window closed (Day 14). Closed 2026-08-11 |
| 2026-07-31 | TBD | No draft created | ✗ MISSED — no action taken |
| 2026-08-04 | Reporting Automation | Make + OpenAI + Slack automated reporting pipeline | ✗ MISSED — draft was ready; no post. Closed 2026-08-10 |
| 2026-08-07 | Chatbot / Client Onboarding | HubSpot → Slack bot → Calendly onboarding sequence | ✗ MISSED — draft was ready; no post. Closed 2026-08-10 |
| 2026-08-11 | PM Automation | Manual status reporting → automated project tracking | ✗ MISSED — window closed Thu Aug 13. 11th consecutive miss since Jun 10. |
| 2026-08-14 | AI Asset Generators | Manual proposal writing → AI-generated client deliverables | ✗ MISSED — window closed 2026-08-20 (no URL confirmed by deadline) |
| 2026-08-17 | Workflow Automation | Manual ops audit → 4 targeted automations → 14h/week recovered | ✗ MISSED — window closed 2026-08-24 (7 days past due, no URL confirmed) |
| 2026-08-21 | Cold Outreach / Lead Gen | AI cold email system: 1.2% → 4.7% reply rate, 4× meetings (client result) | ✗ MISSED — window closed 2026-08-24 (3 days past Thu publish date, no URL confirmed). Draft reused for Aug 28. |
| 2026-08-25 | Hiring Automation / AI Screening | 200 applicants screened in 40 min — AI shortlist → human final call | ✗ MISSED — window closed Tue Aug 26 (15th consecutive miss since Jun 10) |
| **2026-08-28** | **Cold Outreach / Lead Gen** | **1.2% → 4.7% reply rate, 4× meetings — AI personalization at scale** | **⏳ DRAFT READY — POST THU AUG 28 ~9am** |

## Cadence
- Posts go out on Mondays and Thursdays, targeting ~9am local.
- Bot pre-writes drafts: Saturdays for Monday posts, Wednesdays for Thursday posts.
- After posting: copy URL → update post file with `[x] Posted to LinkedIn (link: <URL>)` → commit → push.
- Run `./confirm-post.sh YYYY-MM-DD <URL>` to confirm a post quickly.

## Post Files
Each post draft lives at `daily-log/YYYY-MM-DD-post.md` matching its publish date.
