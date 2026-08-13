---
name: invoice-generator
description: Drafts the spec (and, if asked, the implementation) for LeftClick's client invoice generation — line items from the scoped system(s) delivered, tax handling per the client's actual jurisdiction, PDF output uploaded to Drive. Use when designing or generating a client invoice or the automation that produces one.
---

# Invoice & Tax PDF Generator

Tax rules must match the actual client's jurisdiction — never assume a specific country's tax regime by default. Ask or confirm jurisdiction before applying any withholding/sales-tax calculation.

## Process
1. Confirm: client legal entity name and billing address, jurisdiction (for correct tax treatment — sales tax, VAT, withholding, or none, depending on where the client is actually based), currency, and payment terms.
2. Build line items directly from the scoped deliverable(s) — reference the actual system category and any milestone/retainer structure agreed with the client, not a generic "consulting services" line.
3. Apply the correct tax calculation for the confirmed jurisdiction, showing the calculation explicitly (subtotal, tax rate, tax amount, total) — never silently bake tax into a lump sum.
4. Generate the PDF with LeftClick's standard invoice format (matching `brand-guardian`'s visual tokens if it's a branded PDF) and define the upload destination (Google Drive folder convention: `/Clients/{client_name}/Invoices/`).
5. Define the trigger: on Stripe payment confirmation (for `post-onboarding-flow`), on manual request, or on a recurring retainer schedule — state which.

## Output
```
CLIENT: [legal name]
JURISDICTION: [confirmed — do not assume]
LINE ITEMS: [from actual scope]
SUBTOTAL / TAX (rate + amount) / TOTAL
DESTINATION: Google Drive → /Clients/{client_name}/Invoices/{invoice_number}.pdf
TRIGGER: [Stripe webhook / manual / recurring schedule]
```
