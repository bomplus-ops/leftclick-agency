#!/bin/bash
# Usage: ./new-post.sh YYYY-MM-DD "Theme Name"
# Creates a new LinkedIn post skeleton at daily-log/YYYY-MM-DD-post.md

set -e

DATE=$1
THEME=$2

if [ -z "$DATE" ] || [ -z "$THEME" ]; then
  echo "Usage: ./new-post.sh YYYY-MM-DD \"Theme Name\""
  echo "Example: ./new-post.sh 2026-07-31 \"Workflow Automation\""
  exit 1
fi

TARGET="daily-log/${DATE}-post.md"

if [ -f "$TARGET" ]; then
  echo "File already exists: $TARGET"
  echo "Open it directly to edit."
  exit 1
fi

cat > "$TARGET" << EOF
# LinkedIn Post — ${DATE} (${THEME})

**Publish date**: ${DATE} @ ~9am
**Theme**: ${THEME}
**Status**: SKELETON — fill beats the day before, post day-of at 9am

---

## Hook
[Write hook here — one or two punchy lines that open with a surprising claim or relatable failure]

---

## [BEAT 1 — BEFORE: the manual/broken state]
[What did the client's process look like before the system? Be specific: hours spent, steps taken, what kept going wrong.]

---

## [BEAT 2 — WHAT WE BUILT]
[Tools used, the automation logic, what it replaced. Name specific tools: Make, n8n, Zapier, Airtable, GPT, Slack, etc.]

---

## [BEAT 3 — RESULT]
[One concrete before/after number: time saved, revenue recovered, error rate, cost avoided.]

---

## Close
[Tie back to hook. End with a question or observation that invites replies or DMs.]

---

## Ready-to-Post Text
*Fill after all beats are confirmed. Copy and paste directly into LinkedIn.*

\`\`\`
[FULL POST TEXT GOES HERE]
\`\`\`

---

## Checklist
- [ ] Hook reviewed and tightened
- [ ] Beat 1: specific before scenario added
- [ ] Beat 2: tools/approach confirmed (specific stack named)
- [ ] Beat 3: outcome metric added (one concrete number)
- [ ] Close written and tied to hook
- [ ] Ready-to-post text written in full (copy-paste ready)
- [ ] Posted to LinkedIn (link: )
- [ ] URL added to this file and content-calendar.md
- [ ] Committed and pushed
EOF

echo "Created: $TARGET"
echo ""
echo "NEXT STEPS:"
echo "  1. Open $TARGET"
echo "  2. Write the Hook — one surprising claim or relatable failure"
echo "  3. Fill Beat 1 (BEFORE) — what did the manual process look like?"
echo "  4. Fill Beat 2 (BUILD) — what tools, what logic, what was automated?"
echo "  5. Fill Beat 3 (RESULT) — one concrete number"
echo "  6. Write the Ready-to-Post text (full LinkedIn copy, paste-ready)"
echo "  7. Commit: git add $TARGET && git commit -m 'content: skeleton ${DATE} ${THEME}' && git push"
