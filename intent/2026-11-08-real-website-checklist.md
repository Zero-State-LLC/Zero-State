# Intent: real-website baseline (12-item checklist)

## Problem

The owner asked on 2026-11-08 ("Make sure all of our websites have all of this.") that zer0state.com
meet a 12-item baseline: custom 404, a CTA above the fold, a title and a meta description per page,
an Open Graph image, a favicon set, robots.txt, sitemap.xml, alt text on every image, loading states,
a privacy policy, and analytics. That request is the owner's acceptance of this intent.

Audit before this change: no 404.html (GitHub Pages served its default page); no primary CTA above
the fold on the home at 390×844 (the nav pill showed from 40rem only and the hero doors sit below
the fold); Open Graph and Twitter Card meta on 2 of 30 official pages; thin descriptions on about,
philosophy and terms; only `favicon-64.png` and `apple-touch-icon.png` linked (no favicon.ico, no
manifest); the Ask widget's pending reply had no text for screen readers and Enter aborted it; the
chat preview log was not a live region; no analytics. Already met: unique titles, robots.txt,
sitemap.xml, alt attributes, footer Privacy link on every page.

## Proposed outcome

- `404.html` in the shared chrome, noindex, with the primary button home and a link to the portfolio.
- Home only: the "Begin here" pill shows from 24rem, one spacing step tighter, so it is above the fold
  on phones (verified in Chromium at 384–640 px and 1440×900); the nav mark keeps its 20 px.
- Every official page: Open Graph + Twitter Card meta (shared `assets/og-image.png`, 1200×630),
  `favicon.ico` (16/32/48), apple-touch-icon, `site.webmanifest` (192/512 icons, theme colour).
  Every icon is resized from the existing mark 3 art with the recipes that reproduce the shipped
  `favicon-64.png` and `apple-touch-icon.png` pixel for pixel. No new mark.
- Ask widget: a polite status line ("Answering…") and `aria-busy` while a reply is pending; Enter
  no longer aborts it. Chat preview: the log is a polite live region.
- Analytics: Cloudflare Web Analytics, cookieless, loaded from `site.js` only when
  `CF_WEB_ANALYTICS_TOKEN` is set and the host is zer0state.com. `privacy.html` §2.3 discloses it
  and "Last updated" moves to 2026-11-08; no other legal text changes.
- `npm test` gains checks for all of the above (none are relaxed).

Out of scope: the unlisted game and preview pages (`games/`, `play/`, `roost.html`, `chat/`,
`concepts/`) beyond the alt and loading audit; any hosting change.

## Affected users / systems

Site visitors; every official page head; `home.css`, `site.js`, `assets/ask/`, `chat/index.html`;
`privacy.html` §2.3; `scripts/validate-site.js`; `workers/ask/knowledge.md` (regenerated from the
privacy text); README.

## Constraints / non-goals

Site/brand scope only. The static mark and highway-centerline motion are untouched. No invented
products or claims. No deploy: GitHub Pages deploys on merge to `main` after a human yes.

## Decisions (owner, 2026-11-08)

- Analytics: enable cookieless Cloudflare Web Analytics with a JS beacon and site token; the owner
  creates the site in the Cloudflare dashboard and pastes the token. No token is invented here.
- Hosting: a move of zer0state.com from GitHub Pages to Cloudflare was raised and then **deferred by
  the owner on 2026-11-08**. The site stays on GitHub Pages; no Cloudflare hosting files are added.

## Open questions

- Privacy policy §12 (Do Not Track) still says the site does not run first-party analytics, and §14
  promises a new effective date on revision; the owner asked for §2.3 and "Last updated" only.
- Whether the unlisted game pages should be indexed, described, or carry analytics (they do not load
  `site.js`, and their builds come from their own sources).

## Verified / assumed claims

| Claim | Label | Basis |
|---|---|---|
| `assets/og-image.png` is 1200×630 | `OBSERVED` | PNG header; asserted by `npm test` |
| New icons match the shipped mark 3 icons | `OBSERVED` | recipe reproduces `favicon-64.png` and `apple-touch-icon.png` with zero pixel difference |
| Home CTA visible without scrolling at 390×844 and 1440×900 | `OBSERVED` | Playwright, local preview |
| 404.html renders styled at root and nested missing paths | `OBSERVED` | Playwright with a Pages-like 404 route |
| GitHub Pages serves `/404.html` with HTTP 404 | `INFERRED` | GitHub Pages documentation; live site not reachable from this sandbox |
| Cloudflare Web Analytics sets no cookies | `INFERRED` | Cloudflare's product description; not measured here |

## Author / date

- Author: Claude Code agent session, at the owner's request (relayed by the coordinating session)
- Date: 2026-11-08
