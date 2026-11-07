# Intent

## Problem

Grant, program and partner applications keep asking the same questions about each
Zero State project: what changed, what is next, and what it is built with. The site
answers none of these in one place. Each product and skill page has a hand-written
"Recent updates" list covering only the last 30 days, no list of technologies, and
no roadmap.

The pages also do not say which projects are open source, and repository links do
not follow the license. Six pages link a repository, but only one of those six
repositories is under an open-source license. One link, on the Neon Genie page,
points at a private repository and returns 404 for visitors.

## Proposed outcome

Every product and skill page (12 under `products/`, 5 under `skills/`) gets the same
three additions, written in plain English:

1. **Built with.** The technologies the project integrates: languages, frameworks,
   platforms, hardware and outside services, taken from the repository's own
   manifests and README.
2. **Changelog.** Dated milestones in plain English, replacing the 30-day "Recent
   updates" list with a longer history grouped by month.
3. **Roadmap.** What is planned next, in plain English, each item labeled with this
   repo's evidence labels (`ASPIRATIONAL`, `NOT_READY`). No promised dates.

Open source is shown only where it is true:

- A project counts as open source when its repository is public **and** carries an
  OSI-approved license. Today that is Pawl (Apache-2.0) and Kubrick (MIT).
- Those pages get an "Open source · <license>" label and a link to the repository.
- No other page links a repository. This removes the links on BlackDog, J-Chain,
  Hyperlex, Orchestra, Sigil Forge and Neon Genie.
- `site-manifest.json` gets an `open_source` list (repository and license) so the
  label and links come from one approved source.

Out of scope: client pages (`clients/`), the community page (`community/`), the
home page, new portfolio entries, and any change to product availability claims.

## Affected users / systems

- Site visitors and anyone reading the pages for an application.
- 17 pages: `products/*.html` and `skills/*.html`.
- `pages.css`, for one shared style for the three new sections and the label.
- `site-manifest.json`, for the new `open_source` list.
- `scripts/validate-site.js`. Lines 276–279 currently fail the build unless the
  Orchestra, Hyperlex, Kubrick and Neon Genie pages link their repositories. Under
  this intent they would check the opposite: a page links its repository only if
  that repository is in `open_source`, and every page listed there shows the label.
  This changes what the validator asserts, so it needs owner approval. It does not
  weaken it.

## Constraints / non-goals

- Site and brand scope only. No invented products, features, dates or availability.
- No proprietary information: no internal architecture, prompts, model weights or
  training data, client names, contract terms, pricing, credentials, or anything
  from a private repository beyond the plain facts already public on the site.
- For private repositories, "Built with" and the changelog stay at the level of
  what the site already says about the product.
- No licensing claim except the two facts read from GitHub: the repository is
  public, and its license is a named OSI license. Proprietary repositories get no
  license label at all.
- Roadmap items describe intent, not commitments, and carry evidence labels.
- `npm test` must pass without skipping or loosening any other assertion.

## Open questions

1. Should client pages (Autogive, zzThis) and the SUAS community page get the same
   sections? Proposed: no, they are out of scope here. Decides: owner.
2. Is "public repository + OSI-approved license" the right test for open source?
   Proposed: yes. Decides: owner.
3. May the validator change described above go in with this work? Decides: owner.
4. How far back should each changelog go? Proposed: from each repository's first
   public milestone, grouped by month. Decides: owner.
5. Who signs off on roadmap wording per project? Proposed: the owner reviews every
   roadmap in the PR before merge.

## Verified / assumed claims

| Claim | Label | Basis |
|---|---|---|
| Pawl's repository is public under Apache-2.0 | `OBSERVED` | GitHub API, `Zero-State-LLC/pawl`, 2026-11-07 |
| Kubrick's repository is public under MIT | `OBSERVED` | GitHub API, `Zero-State-LLC/Kubrick`, 2026-11-07 |
| NeonGenie's repository is private (MIT license file, not public) | `OBSERVED` | GitHub API, `Zero-State-LLC/NeonGenie`, 2026-11-07 |
| BlackDog, JChain, Hyperlex, Abraxas-Orchestra, Sigil-Forge and Noema are under the Zero State Proprietary License v1.0 | `OBSERVED` | Each repository's LICENSE file, 2026-11-07 |
| Other portfolio repositories report a non-OSI license | `OBSERVED` | GitHub API `license.spdx_id = NOASSERTION`, 2026-11-07 |
| The Neon Genie page links a repository that returns 404 to visitors | `INFERRED` | The repository is private; not checked while signed out |
| Every product and skill page has a hand-written "Recent updates" list and no generator builds it | `OBSERVED` | Page markup; no script under `scripts/` writes it |
| `validate-site.js` requires repository links on four skill pages | `OBSERVED` | `scripts/validate-site.js` lines 276–279 |
| Technologies and history can be read from each repository without exposing proprietary detail | `INFERRED` | Not yet checked repository by repository |

## Author / date

- Author: Claude (Opus 5.5), at Aaron's request
- Date: 2026-11-07
