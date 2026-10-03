# Design — Zero State

**Status: proposed — direction C · Cinematic monolith, pending owner review.** A sibling PR proposes the other direction. Whichever is approved becomes this file's locked system and is rolled out to every page before merge; until then the previous system (git history: `design.md` before 2026-10-02) still governs the inner pages.

## Genre

Atmospheric. Dark-first; the canvas carries the mood, type carries the meaning, one warm signal. Vibe: “monolith glow, cinematic void, bone serif”. Diversification axes: dark / classical-serif / chromatic-amber ~78°.

## Symbol system

Graphics are symbolic, never literal. `assets/glyphs.svg` holds one symbol per product, client, community entry, skill, and section, all built from the mark's own primitives: axis, split ring, orbit, node, frame corner, dashed passage. Symbols are `currentColor` hairlines (`vector-effect: non-scaling-stroke`), referenced with `<svg><use href="assets/glyphs.svg#g-<key>"></use></svg>`. Evidence images (screenshots, key art) stay as secondary figures, loaded on demand.

## Macrostructure family

- Home: Marquee Hero + Feature Stack — the lit logo fills the fold; the method plays as a pinned scene; the work list scrolls beside a pinned symbol; nav N9 edge-aligned minimal; footer Ft1 mast-headed.
- Inner pages (planned for the rollout): Product, skill, client, community: a title-card hero (serif name, symbol lit behind it) then the story as a pinned two-column scene with the evidence figure. Work: Feature Stack at full length. Philosophy: pinned statements, one per screen. About, contact, legal: Long Document with a quiet rail.

## Theme

- `--color-paper` oklch(12% 0.016 262)
- `--color-paper-2` oklch(15.5% 0.018 262)
- `--color-paper-3` oklch(19% 0.02 262)
- `--color-ink` oklch(94% 0.014 85)
- `--color-ink-2` oklch(81% 0.012 80)
- `--color-muted` oklch(67% 0.014 255)
- `--color-rule` oklch(29% 0.016 262)
- `--color-rule-2` oklch(22% 0.016 262)
- `--color-accent` oklch(82% 0.11 78)
- `--color-accent-ink` oklch(17% 0.02 78)
- `--color-focus` oklch(86% 0.14 78)

Neutrals are tinted toward the anchor hue; no pure black or white. The accent stays at or under 5 % of any viewport; at most two canvas blooms per page.

## Typography

- Display: Instrument Serif 400, roman only
- Body: Geist 400 (300/500 for small UI)

Headings are roman, never italic. Two families on the page. Display line-height 1.0–1.08, `overflow-wrap: anywhere` on headings. Faces are self-hosted (OFL 1.1, `assets/fonts/`).

## Spacing

Named 4-point scale in `tokens.css` (`--space-3xs` … `--space-3xl`). Pages reference tokens, never raw values.

## Motion

- One light: the logo emerges (18 px rise), then a single band of light crosses the blade once, masked to the mark's own shape.
- Pinned scenes, ≥ 62 rem and no-preference only: the method plays line by line across a 340 svh scroll; the local-intelligence frame corners close in as the section enters.
- State: the pinned symbol crossfades to whichever entry sits in the reading band; focus moves it too.

All motion is `transform` / `opacity` except the brand passage stroke. Every animation has a `prefers-reduced-motion` path (opacity only, ≤ 150 ms); scroll-linked motion is progressive enhancement (`@supports (animation-timeline: view())`) and never runs below 40 rem.

## Microinteractions stance

- Silent success; no toasts.
- Focus rings appear instantly (2 px, focus token, never animated).
- One hover signal per element.

## CTA voice

- Primary: Outlined pill, amber border; fills amber on hover. Light variant for the closing email.
- Secondary: Underlined text link that turns amber.
- Labels are verbs and never wrap.

## What pages MUST share

- The mark and wordmark (`assets/brand/`, `assets/danny-email-bundle/`).
- The tokens in `tokens.css`, the two faces, the CTA voice.
- The symbol system for every portfolio entry.

## What pages MAY differ on

- Macrostructure within the family above.
- Whether a page carries scroll-linked motion (home and work may; legal pages do not).

## Exports

### tokens.css

See [`tokens.css`](tokens.css) — the canonical source.

### DTCG `tokens.json`

```json
{
  "color": {
    "paper": {
      "$value": "oklch(12% 0.016 262)",
      "$type": "color"
    },
    "ink": {
      "$value": "oklch(94% 0.014 85)",
      "$type": "color"
    },
    "muted": {
      "$value": "oklch(67% 0.014 255)",
      "$type": "color"
    },
    "rule": {
      "$value": "oklch(29% 0.016 262)",
      "$type": "color"
    },
    "accent": {
      "$value": "oklch(82% 0.11 78)",
      "$type": "color"
    },
    "focus": {
      "$value": "oklch(86% 0.14 78)",
      "$type": "color"
    }
  },
  "font": {
    "display": {
      "$value": "Instrument Serif",
      "$type": "fontFamily"
    },
    "body": {
      "$value": "Geist",
      "$type": "fontFamily"
    }
  }
}
```
