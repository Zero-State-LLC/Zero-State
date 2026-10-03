# Design — Zero State

**Status: proposed — direction A · Observatory, pending owner review.** A sibling PR proposes the other direction. Whichever is approved becomes this file's locked system and is rolled out to every page before merge; until then the previous system (git history: `design.md` before 2026-10-02) still governs the inner pages.

## Genre

Atmospheric. Dark-first; the canvas carries the mood, type carries the meaning, one warm signal. Vibe: “observatory void, bone light, ember signal”. Diversification axes: dark / geometric-sans / warm.

## Symbol system

Graphics are symbolic, never literal. `assets/glyphs.svg` holds one symbol per product, client, community entry, skill, and section, all built from the mark's own primitives: axis, split ring, orbit, node, frame corner, dashed passage. Symbols are `currentColor` hairlines (`vector-effect: non-scaling-stroke`), referenced with `<svg><use href="assets/glyphs.svg#g-<key>"></use></svg>`. Evidence images (screenshots, key art) stay as secondary figures, loaded on demand.

## Macrostructure family

- Home: Map / Diagram — the portfolio is an orbital system map around the zero; hero H9 (logo inside a hand-built SVG instrument); nav N10 floating-on-scroll morph; footer Ft5 statement.
- Inner pages (planned for the rollout): Product, skill, client, community: a dossier page whose hero is the entry's symbol on its orbit, with the evidence image as a framed figure beneath. Work: the orbital map at full size plus the list. Philosophy, about, contact, legal: Long Document with a hairline rail.

## Theme

- `--color-paper` oklch(13% 0.008 65)
- `--color-paper-2` oklch(16% 0.009 65)
- `--color-paper-3` oklch(19.5% 0.01 65)
- `--color-ink` oklch(93% 0.018 80)
- `--color-ink-2` oklch(81% 0.014 75)
- `--color-muted` oklch(65% 0.012 70)
- `--color-rule` oklch(31% 0.01 65)
- `--color-rule-2` oklch(23% 0.009 65)
- `--color-accent` oklch(72% 0.14 50)
- `--color-accent-ink` oklch(17% 0.02 50)
- `--color-focus` oklch(78% 0.17 50)

Neutrals are tinted toward the anchor hue; no pure black or white. The accent stays at or under 5 % of any viewport; at most two canvas blooms per page.

## Typography

- Display: Geist 200 (headings 200, small heads 500)
- Body: Geist 400
- Mono: Geist Mono 400/500 — labels, status, readouts

Headings are roman, never italic. Two families on the page. Display line-height 1.0–1.08, `overflow-wrap: anywhere` on headings. Faces are self-hosted (OFL 1.1, `assets/fonts/`).

## Spacing

Named 4-point scale in `tokens.css` (`--space-3xs` … `--space-3xl`). Pages reference tokens, never raw values.

## Motion

- One orchestrated load: kicker, title lines, lede, doors rise 14 px in a 90 ms stagger; the instrument settles from 96.5 %.
- Scroll-linked, ≥ 40 rem and no-preference only: hero orbits turn up to 140°, “The world moves.” drifts 26 % while “The reference remains.” holds still; the field grid moves toward the reader; the orbital map turns ±24° as it crosses the viewport (all rings rigidly, so spacing never collapses).
- Reveal once: the method glyph's passage (brand-token spec: 4800 ms, linear, one pass); the enclosure's frame corners close in.
- State: N10 nav morph (one curve, 520 ms); map readout crossfade on hover or focus.

All motion is `transform` / `opacity` except the brand passage stroke. Every animation has a `prefers-reduced-motion` path (opacity only, ≤ 150 ms); scroll-linked motion is progressive enhancement (`@supports (animation-timeline: view())`) and never runs below 40 rem.

## Microinteractions stance

- Silent success; no toasts.
- Focus rings appear instantly (2 px, focus token, never animated).
- One hover signal per element.

## CTA voice

- Primary: Outlined pill, ember border; fills ember on hover. Solid variant for the closing email.
- Secondary: Underlined text link, rule-coloured underline that turns ember.
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
      "$value": "oklch(13% 0.008 65)",
      "$type": "color"
    },
    "ink": {
      "$value": "oklch(93% 0.018 80)",
      "$type": "color"
    },
    "muted": {
      "$value": "oklch(65% 0.012 70)",
      "$type": "color"
    },
    "rule": {
      "$value": "oklch(31% 0.01 65)",
      "$type": "color"
    },
    "accent": {
      "$value": "oklch(72% 0.14 50)",
      "$type": "color"
    },
    "focus": {
      "$value": "oklch(78% 0.17 50)",
      "$type": "color"
    }
  },
  "font": {
    "display": {
      "$value": "Geist",
      "$type": "fontFamily"
    },
    "body": {
      "$value": "Geist",
      "$type": "fontFamily"
    }
  }
}
```
