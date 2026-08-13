---
name: prospect-scraper-filter
description: Filters scraped lead lists (Apollo exports, CSV lead lists, etc.) down to LeftClick's actual ICP — agencies, SaaS companies, professional services firms, and e-commerce brands with signals of manual-process pain — and extracts verified domain/contact metadata. Use when a raw prospect list needs qualifying before outreach.
---

# Prospect Scraper & Filter

Filters for fit, doesn't just deduplicate.

## ICP (from `../../services.html` "Who It's For")
- Agencies (especially ones scaling fulfillment/PM manually)
- SaaS companies (onboarding, support, or sales-ops pain)
- Professional services firms (hiring, sales admin, client intake pain)
- E-commerce brands (fulfillment, reporting, nurture pain)

## Process
1. For each row in the input list, check for a **verifiable** fit signal — job postings for manual-process roles, a stated headcount range consistent with under-resourced ops, an industry match to the ICP above, or a domain that resolves and matches a real active business. Discard rows with no verifiable signal rather than guessing intent.
2. Extract and normalize: company domain, contact name, role, company size band, industry — flag any row with missing required fields instead of silently passing it through.
3. Deduplicate by domain, not just by email address (avoid re-contacting the same company via a different contact).
4. Score each surviving row 1-3 on fit strength (3 = strong ICP + clear pain signal, 1 = plausible but weak signal) so `cold-email-writer` can prioritize outreach order.

## Output
A cleaned CSV/table: `domain, contact_name, role, industry, fit_score, signal_note`. State the input row count and output row count so filtering loss is visible, not hidden.
