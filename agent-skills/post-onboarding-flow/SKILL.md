---
name: post-onboarding-flow
description: Drafts the spec for LeftClick's automated post-payment onboarding sequence — welcome message, contract delivery, and Calendly kickoff-call scheduling — triggered once Stripe payment is confirmed. Use when designing or documenting the client onboarding automation.
---

# Post-Onboarding Automated Flow

Fires once, on confirmed payment — never on invoice-sent or checkout-started events, which aren't yet a commitment.

## Process
1. Define the exact trigger: Stripe `checkout.session.completed` or `invoice.paid` webhook (confirm which event the actual integration uses — see `stripe-webhook-guard` for the guard around this).
2. Sequence the steps in order, each with its own failure handling:
   - Welcome message (email or the channel the client used to sign) — personalized with client name and the specific system(s) purchased.
   - Contract delivery — reference the actual signed/pending contract doc, not a generic template link, if the contract was already handled pre-payment; otherwise trigger the e-signature flow here.
   - Calendly kickoff-call link (`calendly.com/leftclick-meeting-30` pattern, or a dedicated onboarding-specific link if one exists) sent with clear next-step framing.
3. Define what happens on partial failure — e.g. welcome email sends but Calendly link generation fails: does the flow retry just that step, or alert a human to send it manually? State it explicitly, don't leave it implicit.
4. Note the handoff point to `invoice-generator` (the paid invoice itself) so the two flows stay in sync rather than duplicating logic.

## Output
```
TRIGGER: Stripe webhook — [event name]
STEP 1: Welcome email — [content summary] — on failure: retry x2, then alert #ops-alerts
STEP 2: Contract delivery — [mechanism] — on failure: alert immediately (legal/financial step, no silent retry)
STEP 3: Calendly kickoff link — [link] — on failure: retry x2, then alert
```
