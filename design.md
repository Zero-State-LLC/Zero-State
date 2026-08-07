# Design — Zero State

A locked design system for the Zero State public website.

## Genre

Modern-minimal: quiet, structural, and exact. Cinematic restraint with one controlled expressive element — the Balanced Aperture mark and its highway-centerline passage.

## Iteration (2026-08 redesign)

- Previous: Marquee Hero dominant with asymmetric editorial.
- Current: Split Studio diptych energy for marketing surfaces + indexed "evidence" / reel presentation for work. Philosophy and content pages remain Long Document.
- Emphasis on recurring motif (aperture as anchor across folds), tighter vertical rhythm, document-like ruled sections, and evidence language over marketing card uniformity.

## Hallmark audit pass (2026-08-07)

- Dark landing: collapse dual manifesto + philosophy into one **method** band (position lines + single doctrine rail + two short prose grafs).
- One signal side-stripe only (doctrine).
- Evidence lists: thumbs + title/type (dark landing); featured Waykin + compact cards (homepage/work); drop per-card essay bodies and ordinal indices on grids.
- Remove evidence hover scale; stamp production CSS to this design.md; product heroes content-height (no forced 100vh).

## Release 0.3.0 notes (2026-08-07)

- Identity stage is logo-only: no corner chrome, no frame border, transparent stage over page void.
- Primary nav leads with **Begin here**, then progressive destinations.
- Portfolio and heroes are org-repo-bound; parent-brand product copy avoids external stack brand names (Abraxas / ABX-Core).
- See `CHANGELOG.md` for the full release inventory.

## Full repo sweep (August 2026)

- Work page converted to evidence-list style for consistency with homepage.
- Philosophy, About, Contact, and all product pages refreshed for structural alignment (Long Document and Workbench).
- Legal pages lightly aligned.
- Added supporting CSS for page-hero, product-detail, longform, and status elements.
- All changes preserve exact copy, the Balanced Aperture mark + highway animation, and validation requirements.

## Macrostructure family

- Marketing / Homepage: Split Studio (diptych text + aperture proof) with asymmetric editorial sections and recurring motif dividers.
- Work / Product listings: Indexed reel / findings list (ruled rows, minimal cards, status as metadata).
- Product pages: Workbench product brief (preserve existing).
- Philosophy, About, legal: Long Document.

## Theme (evolved tokens)

- Paper / base: #FBF9F4 (light), #F4F0E8 (stone)
- Ink: #1D2321 (carbon)
- Rule / line: #B9B2A7
- Signal / Highway (sole chromatic accent): #F2C200 (used sparingly, only for the passage and key signals)
- Secondary: #486F6A (deep teal) for meta labels
- Supporting: softer inks for captions and rules

The yellow highway remains the only strong color signal. Everything else is warm neutrals with high contrast.

## Typography

- Display: Georgia (serif), 600–700 weight, generous but controlled letter-spacing on large sizes.
- Body: Inter / system-ui sans, 400–600.
- Mono: system monospace for labels, status, meta, captions.
- No italics on headings.

## Spacing and motion

4-point scale (see styles.css tokens). 

Motion stance remains extremely quiet:
- One controlled linear highway passage on the identity mark (IntersectionObserver + click replay).
- Residue / mutation traces only.
- No hover lifts, no decorative reveals, no bouncy easings.
- prefers-reduced-motion: opacity crossfades only.

## Shared page rules

- Masthead header (frame-like, not floating SaaS nav).
- Section labels / eyebrows only when they name a real category or domain.
- Footer closes with the company statement.
- The Balanced Aperture mark (reference frame + split zero + highway) is sacred — never alter the SVG coordinate system or core animation semantics.
- Product names and status language are preserved as factual evidence.

## Constraints for this redesign

- Preserve every line of existing philosophy and product copy.
- Do not introduce new product claims or invented metrics.
- Keep GitHub Pages compatibility (relative paths, no root-absolute links).
- Maintain deterministic validation (required landmarks, no empty links, Pages-safe assets).
