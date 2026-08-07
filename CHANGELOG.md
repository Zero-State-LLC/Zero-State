# Changelog

All notable changes to the Zero State public website are documented here.

## 0.3.1 — 2026-08-07

- Promote dark landing to the **official home** (`index.html` + `styles-dark.css`); legacy `concepts/dark-landing/` redirects.
- Logo tagline: **Opportunity begins at zero** (was Intelligence begins at zero).
- Hero field grid slightly brighter with cool “electrified” signal tint.
- Social preview: `assets/og-image.png` + Open Graph / Twitter Card meta on home.

## 0.3.0 — 2026-08-07

Public brand surface aligned to the Zero-State-LLC org portfolio, with Hallmark layout fixes and automated Pages deploy.

### Portfolio
- List products from [Zero-State-LLC repositories](https://github.com/orgs/Zero-State-LLC/repositories): Waykin, PatchHive, PsyFi, Surveillance Survivor, HexWire, Hollersports, Marigold Market.
- Product heroes vendored from each repo’s README/brand assets (`assets/products/`).
- README-aligned product pages with repository links as public source of truth.
- Remove orphan pages not in the org portfolio (Abraxas product page, Experiments, legacy HexWire path before org transfer).
- Strip Abraxas and ABX-Core language from parent-brand copy; Hollersports grounded in isolation/provenance/calibration from its README.

### Design
- Dark landing: single **method** band (collapsed dual manifesto + philosophy); one doctrine signal rail.
- Featured Waykin + compact evidence grids on homepage and work.
- Dark landing evidence rows: thumb + title/type only.
- Identity stage: logo only — no corner labels, no frame border, transparent stage.
- Header nav left-to-right starts with **Begin here**, then progressive destinations.
- Footer parity (company statement) across light, dark landing, and product surfaces.
- Production CSS stamped to `design.md` (modern-minimal / Split Studio + evidence reel).

### Platform
- GitHub Pages deploy: official build → deploy job split; verified **push** to `main` auto-deploys.
- Site validation on push, pull request, and manual dispatch.
- `site-manifest.json` records portfolio repos, public sources, and remaining launch blockers.

### Launch blockers (unchanged)
- App Store / production product destinations not claimed until release.
- Trademark review and typography licensing remain open.

## 0.2.0 — 2026-07-26

- Imported the approved responsive multi-page Zero State website baseline.
- Normalized links for GitHub Pages project paths.
- Added deterministic site validation, CI, and GitHub Pages deployment workflows.
- Marked contact and legal content as launch blockers.
