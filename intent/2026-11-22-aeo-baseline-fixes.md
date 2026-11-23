# Intent

## Problem

GAP's 2026-11-22 AEO baseline found that zer0state.com is close to invisible on non-branded buyer questions. Google Search Console (2026-08-01 to 2026-11-22) showed 90 impressions, 0 clicks, and 1 non-branded query. Context.dev web-answers recommended Zero State on 2 of 19 non-branded questions. Local intelligence (Q01-Q05) scored 0 of 5 on every engine, including OpenRouter Perplexity/sonar. `/llms.txt` returns 404. Only `index.html` has JSON-LD. Pawl answers sometimes collided with other similarly named repositories. Perplexity treated HexWire as not clearly live, even though this repo already says it is live on the App Store.

## Proposed outcome

Ship a PR that, without inventing metrics, prices, customers, or stack details:

1. Adds an indexable `local-intelligence.html` page (top priority, Q01-Q05) and an `/llms.txt` file, and links the new page from the homepage `#local` section and primary nav.
2. Reworks `products/pawl.html` with problem-led copy, a legacy-repo / known-failures section, a comparison limited to verifiable facts, structured data, and explicit identity: GitHub `Zero-State-LLC/pawl`, PyPI package `pawl-gate`.
3. Makes HexWire's live App Store status and price machine-readable (VideoGame + Offer JSON-LD), and adds SoftwareApplication JSON-LD on the J-Chain, Noema, and Kubrick pages. Tightens Kubrick's buyer language using only words already on that page.

Out of scope: production deploy, merge, directory or `dev.to` outreach, OpenRouter key rotation, a retest routine, and any comparison claims about third-party tools that this repo does not already state.

## Affected users / systems

Site visitors and AI answer engines. Pages, `sitemap.xml` (regenerated from `site-manifest.json` by `npm test`), `scripts/validate-site.js`, `workers/ask/knowledge.md` (regenerated from official pages), primary nav.

## Constraints / non-goals

- Site/brand scope only. No invented products or destinations.
- Claims must already appear in this repo or on the existing public pages. Unknown TCO numbers, hardware SKUs, and third-party feature matrices stay as TODOs for Danny, not as published copy.
- Keep the existing Observatory / HANCORE-style design system (`tokens.css`, `site.css`, `pages.css`).
- NVIDIA framing only where it is already true: "such as NVIDIA GPUs," and "Zero State LLC is a member of NVIDIA Inception." Do not attribute BlackDog's DGX Spark smoke run to Local intelligence.
- Agents do not deploy zer0state.com. This intent does not authorize merge or production cutover.
- Do not weaken or skip `scripts/validate-site.js`.

## Open questions

Answered by Danny's 2026-11-22 9:52 PM PT request to diagnose and fix, so this intent is implemented in the same PR rather than held for a separate accept step.

Still for Danny after the PR:

- Publish a TCO or hardware-sizing guide if he wants numbers on the Local intelligence page.
- Source a feature-by-feature comparison with SonarQube, Test Ratchet, or noskip if he wants that table filled in.
- The public Pawl page keeps only the official identity (Zero-State-LLC/pawl, PyPI pawl-gate) and does not name other projects.

## Verified / assumed claims

| Claim | Label | Basis |
|---|---|---|
| `/llms.txt` is 404 | `OBSERVED` | GAP technical audit, 2026-11-22 |
| Local intelligence lives only as `index.html#local` | `OBSERVED` | this repo; no standalone page in `site-manifest.json` |
| HexWire is live on the App Store at $3.99, id6800604898 | `OBSERVED` | `products/hexwire.html`, `work.html` validator |
| Pawl is installed as `pawl-gate` from PyPI; source is `Zero-State-LLC/pawl`; Apache-2.0; v0.5.0 | `OBSERVED` | `products/pawl.html`, README, `site-manifest.json` |
| GSC 90 impressions, 0 clicks, 1 non-branded query (Aug 1–Nov 22, 2026) | `OBSERVED` | GAP baseline from Search Console |
| Perplexity hit Pawl on Q09 but also cited another similarly named repository; HexWire was not clearly live in that answer | `OBSERVED` | GAP Perplexity summary, 2026-11-22 9:50 PM PT |

## Author / date

- Author: Boof executor, from GAP baseline and Danny's 2026-11-22 9:52 PM PT fix request
- Date: 2026-11-22
