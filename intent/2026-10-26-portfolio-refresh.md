# Intent: refresh portfolio versions and statuses

## Problem

Several portfolio, product, client and skill entries carry versions or status
copy that no longer match the project's real state.

## Proposed outcome

Update only version strings and status copy that can be verified from a real
source (repo VERSION files, releases, PyPI, READMEs). Each dossier page also
gets a "Recent updates" block summarising the last 30 days from releases,
CHANGELOGs and merged PRs. Two entries are added at Danny's request (2026-10-26): J-Chain (folding in open PR #67) and BlackDog. Out of scope: release-window estimates, patent status, links
to repositories that are now private, and anything that could not be verified.

## Affected users / systems

Site visitors; `work.html`, `index.html`, `marketing.html`, `products/pawl.html`,
`products/patchhive.html`, `products/surveillance-survivor.html`,
`clients/zzthis.html`, `skills/{kubrick,neon-genie,orchestra}.html`; new `products/j-chain.html` and `products/blackdog.html`, glyphs, marks, validator, manifest, sitemap and README table.

## Constraints / non-goals

Site and brand scope only. No invented versions, metrics or dates. Validators
are not weakened. Deploy still needs Danny's yes.

## Open questions

- Hyperlex shows v0.4.0; org main VERSION says 0.4.2 while its README and
  STATUS say 0.4.0. Left unchanged until Danny picks the source of truth.
- Sigil-Forge shows v0.13.0; org main VERSION is 0.13.1 but the archived
  personal repo released v0.14.0 on 2026-09-23. Left unchanged.
- Approximate release windows (PatchHive H1 2027, Marigold Market, Surveillance
  Survivor Q1 2027) are not stated in the repos. Left as approved.
- PsyFi "web ship live now": repo says production-ready for a Docker ship; no
  public deployment URL was found.

- Waykin: PR #16 (2026-10-12) retargets the spec at Snap Spectacles, but the
  README and the site status still say iOS. Status left unchanged.
- J-Chain: the site uses the live j-chain.net mark (https://j-chain.net/brand/mark-v2.svg, added 2026-10-24) at assets/products/jchain-mark.svg and as the g-jchain glyph, replacing the mark from PR #67 (Danny, 2026-10-26). The mark is the repo's "original stand-in mark", so it may change.
- BlackDog: the entry mark and carousel glyph (a waveform) are site-side art, not a BlackDog brand asset.
- Autogive (no repo with tracked changes) and Sigil-Forge (version conflict
  above) have no Recent updates block.

## Verified / assumed claims

| Claim | Label | Basis |
|---|---|---|
| Pawl is 0.5.0 on PyPI | `OBSERVED` | https://pypi.org/pypi/pawl-gate/json |
| PatchHive latest release is v0.3.0-alpha.2 | `OBSERVED` | GitHub releases, Zero-State-LLC/Patch-Hive |
| Kubrick 0.27.15, Neon Genie 3.36.0, Orchestra 0.8.1 | `OBSERVED` | VERSION, CHANGELOG and README on each org repo main |
| Hollersports is v0.5.0 advisory beta | `OBSERVED` | package version and tag v0.5.0-advisory-beta |
| Pawl benchmark: 21/23 cheats caught in CI, 0/9 clean blocked | `OBSERVED` | pawl README, saved 2026-10-10 benchmark |
| zzThat iOS/Android apps are live in alpha/beta | `OBSERVED` | Danny, 2026-10-18 (the zzthat README Status still says not release-qualified and is out of date) |
| J-Chain runs spec v0.2.44, invite-only beta | `OBSERVED` | JChain README Status; j-chain.net/start and /llms.txt |
| BlackDog spec 0.3.11, no release or tag, package 0.0.0, no model-quality claim | `OBSERVED` | BlackDog README, docs/VERSIONING.md, pyproject.toml, specs/001-faustcoder/spec.md |

## Author / date

- Author: Grok Bot, for Danny
- Date: 2026-10-26
