# Spec: Collaborators section

Status: requested by Danny on 2026-10-31. Built in the PR that adds this file; it
merges only after the first approved profile is added and Danny says yes.
Intent: [`intent/2026-10-31-collaborators-section.md`](../../intent/2026-10-31-collaborators-section.md).

## Purpose

Show the people who build with Zero State, what each one works on, and which
portfolio entries that work belongs to, so visitors can see who is behind the work
and find the collaborators' own sites. It sits beside the portfolio (products,
clients, community, skills) and does not change it.

## URL and entry points

- Page: `collaborators.html` (canonical `https://zer0state.com/collaborators.html`,
  listed in `site-manifest.json` and the generated `sitemap.xml`).
- Each card has an anchor: `collaborators.html#<slug>`. This is the shareable link
  for one person.
- Primary nav: "Collaborators" after "Portfolio" on every page with the shared nav.
- Footer: "Collaborators" after "Community" (after "Products" on the two compact
  footers).
- No home teaser in v1. The home is the locked orbital map of the portfolio
  (`design.md`), and people are not portfolio entries. Revisit only with brand review.

## Data model

One file, `data/collaborators.json`, typed by `data/collaborators.schema.json`
(JSON Schema; editors validate as you type) and enforced by
`scripts/collaborators.js`. Adding a profile is one object in the array.

| Field | Required | Rules |
|---|---|---|
| `slug` | yes | lowercase-kebab-case, unique, max 60. Card anchor. |
| `name` | yes | As the person wants it shown. Max 80. |
| `role` | yes | What they collaborate on, e.g. "Hardware design for zzThis". Max 120. |
| `bio` | yes | 1-3 plain-text sentences the person approved. Max 600. No HTML. |
| `approved` | yes | `YYYY-MM-DD` the profile was approved for publication. Not rendered. `"pending"` renders locally (for review screenshots) but makes `npm test` and CI fail, so a drafted profile cannot pass before approval. |
| `photo` | no | `{ src, fallback?, alt, width, height }`. Local files under `assets/collaborators/` only. |
| `links` | no | `[{ type, url, label? }]`; `type` is `website`, `x`, `github`, `linkedin`, or `other` (needs `label`). https only; `x`/`github`/`linkedin` must be on their own domains. Rendered in the given order. |
| `projects` | no | `[{ page, label }]`; `page` must be an official page in `site-manifest.json`, e.g. `clients/zzthis.html`. |
| `featured` | no | `true` sorts first. No visible badge (the site gives entries equal footing). |
| `order` | no | Integer, ascending, after `featured`. Ties sort by name. |

Unknown fields fail validation (catches typos such as `quote`). Quotes,
testimonials, and endorsements are out of scope for v1.

### Example entry (EXAMPLE ONLY - fictional, never add to the site)

```json
{
  "slug": "example-collaborator",
  "name": "Example Collaborator",
  "role": "EXAMPLE ONLY - what they work on with Zero State",
  "bio": "One to three plain sentences, approved by the collaborator.",
  "approved": "2026-01-01",
  "photo": {
    "src": "assets/collaborators/example-collaborator.webp",
    "fallback": "assets/collaborators/example-collaborator.jpg",
    "alt": "Portrait of Example Collaborator",
    "width": 480,
    "height": 480
  },
  "links": [
    { "type": "website", "url": "https://example.com" },
    { "type": "github", "url": "https://github.com/example" },
    { "type": "other", "label": "Portfolio", "url": "https://example.org/work" }
  ],
  "projects": [{ "page": "clients/zzthis.html", "label": "zzThis" }]
}
```

## Where data lives and how the page is built

- The site is static HTML with no build step on deploy, so the cards are generated
  into `collaborators.html` and committed: `npm run build:collaborators` rewrites the
  block between the `collaborators:start` / `collaborators:end` markers. Visitors
  and crawlers get plain HTML; no client-side JavaScript is needed.
- `npm test` fails if the data is invalid, if the page is out of date with the data,
  if the page is not ASCII-only, or if any page with the shared nav or footer lacks
  the Collaborators link. Fixture tests live in `scripts/collaborators.test.js`.
- Generated output escapes every non-ASCII character as an HTML entity, so names
  with accents are safe and the file stays ASCII.

## Layout

- Catalogue macrostructure, same as `work.html`: `cat__head` (kicker, title,
  lede), one `cat__group` with a sticky group head on desktop, and a list.
- Card (`.person`): avatar (photo, or a monogram of initials in Geist Mono inside a
  hairline frame when there is no photo), role, name (h3), bio, "Works on" links to
  project pages, and pill links to the person's own sites (CTA voice from
  `design.md`). Tokens only; no new colours, fonts, or motion.
- Detail pages (`collaborators/<slug>.html`) are deferred. Add them only when a
  collaborator has a longer story and evidence to show; they would use the dossier
  macrostructure and be generated from the same data file.

## Empty state

The page and links ship even with an empty list. The block then says "Profiles are
on the way." and links to the portfolio. Reason: the nav and footer are hand-written
on every page, so hiding the link would mean editing ~30 pages each time the list
goes from 0 to 1 or back. The PR is held until the first approved profile is in,
so the public site never shows the empty state in practice; it is the fallback if
every profile is later removed.

## Accessibility

- One h1; the group is a labelled `section`; cards are `li > article` labelled by
  the name heading; lists use `role="list"`.
- Photos need real `alt` text and explicit `width`/`height` (no layout shift);
  the monogram is `aria-hidden` because the name is right beside it.
- External links open in a new tab with `rel="noopener noreferrer"` and an
  `aria-label` such as "Name - GitHub (opens in a new tab)".
- Shared focus ring, 40 px minimum link targets, token colours (contrast as the
  rest of the site). No motion added.

## SEO

- Title "Collaborators &mdash; Zero State" (em dash entity, like other pages), meta description, canonical, Open Graph and
  Twitter card tags using the site social image (`assets/og-image.png`).
- In `site-manifest.json` and `sitemap.xml`.
- Structured data (schema.org `Person`) is deferred until there are profiles.

## Images

- Only photos the collaborator supplied or approved. Never hotlink: copy into
  `assets/collaborators/<slug>.webp` (plus optional `.jpg` fallback).
- Square crop, 480 x 480 px, WebP under ~60 KB (JPEG fallback under ~90 KB).
  Strip EXIF/location metadata. Example:
  `cwebp -q 80 -resize 480 480 -metadata none in.jpg -o assets/collaborators/<slug>.webp`.
- No photo is fine: the monogram is the default. Never generate or invent a likeness.

## Adding a profile from a link

1. Open the link (personal site, X, GitHub, LinkedIn, or a doc). Pull only what it
   states: name, a short role, public profile URLs, and a photo only if the person
   offers one for use.
2. Get from Danny (or the person): the role in Zero State terms, which projects
   they work on, bio wording they approve, photo consent, and the approval date.
3. Add one object to `data/collaborators.json`, add any photo under
   `assets/collaborators/`, run `npm run build:collaborators`, then `npm test`.
4. Open a PR; merge after Danny's yes.

## Out of scope (v1)

Quotes or testimonials, contact forms, emails on profiles, home teaser, detail
pages, and any change to existing portfolio entries.
