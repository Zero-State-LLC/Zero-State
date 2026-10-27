# Intent: refresh portfolio versions and statuses

## Problem

Several portfolio, product, client and skill entries carry versions or status
copy that no longer match the project's real state.

## Proposed outcome

Update only version strings and status copy that can be verified from a real
source (repo VERSION files, releases, PyPI, READMEs). No portfolio entries are
added or removed. Out of scope: release-window estimates, patent status, links
to repositories that are now private, and anything that could not be verified.

## Affected users / systems

Site visitors; `work.html`, `index.html`, `marketing.html`, `products/pawl.html`,
`products/patchhive.html`, `products/surveillance-survivor.html`,
`clients/zzthis.html`, `skills/{kubrick,neon-genie,orchestra}.html`.

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

## Verified / assumed claims

| Claim | Label | Basis |
|---|---|---|
| Pawl is 0.5.0 on PyPI | `OBSERVED` | https://pypi.org/pypi/pawl-gate/json |
| PatchHive latest release is v0.3.0-alpha.2 | `OBSERVED` | GitHub releases, Zero-State-LLC/Patch-Hive |
| Kubrick 0.27.15, Neon Genie 3.36.0, Orchestra 0.8.1 | `OBSERVED` | VERSION, CHANGELOG and README on each org repo main |
| Hollersports is v0.5.0 advisory beta | `OBSERVED` | package version and tag v0.5.0-advisory-beta |
| Pawl benchmark: 21/23 cheats caught in CI, 0/9 clean blocked | `OBSERVED` | pawl README, saved 2026-10-10 benchmark |
| zzThat apps are not release-qualified | `OBSERVED` | zzthat README Status |

## Author / date

- Author: Grok Bot, for Danny
- Date: 2026-10-26
