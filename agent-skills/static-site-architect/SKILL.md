---
name: static-site-architect
description: Generates new landing-page sections or full pages matching LeftClick's actual architecture — single-file static HTML with embedded CSS/JS, no build step, no framework — including scroll-reveal animations and counters consistent with index.html/services.html. Use when adding a new page or section to the leftclick-agency site.
---

# Static HTML/CSS Web Architect

LeftClick's site has zero build dependencies. Every new page follows the same pattern as the
existing four: one `.html` file, embedded `<style>` and `<script>`, no imports, no bundler.

## Process
1. Before writing anything, read the existing page closest to what's being added (e.g. `services.html` for a new service section, `about.html` for a new bio-style block) to match its exact CSS variable names, spacing scale, and JS patterns — don't invent a parallel system.
2. Reuse the established interactive patterns rather than reinventing them:
   - Scroll-triggered reveal via `IntersectionObserver`
   - Animated counters with easeOutQuart easing
   - Mouse-following cursor glow (desktop only — must be gated behind a pointer/hover media check)
   - Scroll progress indicator in the header
   - Smooth-scroll navigation
3. Apply `brand-guardian`'s color/type/radius tokens directly — don't introduce new CSS custom properties without checking if an equivalent already exists in the target file.
4. Build mobile-first responsiveness down to small viewports; test the breakpoints already used elsewhere in the file rather than picking new ones.
5. Never overwrite `index.html` with new feature content — new pages get their own file, per CLAUDE.md's explicit warning about this exact failure mode.

## Output
The new HTML file or section, plus a one-line note on which existing page's patterns it borrowed CSS/JS from, so a reviewer can diff for consistency.
