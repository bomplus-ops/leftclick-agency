#!/bin/bash
# Usage: ./confirm-post.sh YYYY-MM-DD https://linkedin.com/posts/...
# Marks a LinkedIn post as confirmed, updates content-calendar.md, commits, pushes.

set -e

DATE="$1"
URL="$2"

if [[ -z "$DATE" || -z "$URL" ]]; then
  echo "Usage: ./confirm-post.sh YYYY-MM-DD https://linkedin.com/posts/..."
  exit 1
fi

POST_FILE="daily-log/${DATE}-post.md"

if [[ ! -f "$POST_FILE" ]]; then
  echo "Error: $POST_FILE not found."
  exit 1
fi

# Mark the post file as confirmed
sed -i "s|\[ \] Posted to LinkedIn (link: )|[x] Posted to LinkedIn (link: $URL)|g" "$POST_FILE"
sed -i "s|\[ \] URL added to this file and content-calendar.md|[x] URL added to this file and content-calendar.md|g" "$POST_FILE"

# Update content-calendar.md: replace UNCONFIRMED or "Draft written" lines for this date with posted status
sed -i "s|$DATE.*| $DATE | *(see $POST_FILE)* | **posted** — $URL |" daily-log/content-calendar.md 2>/dev/null || true

echo "Updated $POST_FILE with URL: $URL"
echo ""

# Commit and push
git add "$POST_FILE" daily-log/content-calendar.md
git commit -m "chore: confirm post $DATE posted to LinkedIn"
git push origin "$(git branch --show-current)"

echo "Done. Post $DATE confirmed and pushed."
