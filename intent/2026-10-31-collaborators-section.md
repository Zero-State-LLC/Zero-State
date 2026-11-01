# Intent: add a Collaborators section

## Problem

The site shows products, client work, community entries, and skills, but not the
people who build with Zero State.

## Proposed outcome

A `collaborators.html` catalogue page generated from one data file, linked from the
primary nav and footer, with an empty state. Spec:
[`docs/specs/collaborators.md`](../docs/specs/collaborators.md).

Out of scope: home teaser, detail pages, quotes or testimonials, changes to existing
portfolio entries.

## Affected users / systems

Site visitors; `collaborators.html`; nav and footer on pages that share them;
`site-manifest.json`, `sitemap.xml`; `scripts/validate-site.js`.

## Constraints / non-goals

- No invented people, bios, quotes, or photos. The list ships empty.
- Each profile needs the collaborator's approval and Danny's yes before merge.
- No emails on profiles.

## Open questions

- First profile: Danny will send the link. Role, projects, approved bio, and photo
  consent come from Danny or the collaborator.

## Verified / assumed claims

| Claim | Label | Basis |
|---|---|---|
| Danny asked for a collaborators section | `OBSERVED` | Request, 2026-10-31 |
| No collaborator profile is approved yet | `OBSERVED` | Request says the first link is still to come |
| Empty state is never public in practice | `INFERRED` | PR merges only after the first entry is added |

## Author / date

- Author: Grok Bot for Danny
- Date: 2026-10-31
