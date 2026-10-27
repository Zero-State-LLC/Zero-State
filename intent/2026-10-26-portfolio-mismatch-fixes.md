# Intent: portfolio mismatch fixes (2026-10-26)

Danny ("Yes fix it up", 2026-10-26 7:17 PM PT) asked for the leftover mismatches
from the portfolio refresh to be fixed from real sources only.

## Claims and sources

| Claim | Label | Source |
| --- | --- | --- |
| Hollersports is "on hold": the Work card has said so since PR #58 (2026-10-06, "stalled, no active resumption evidence"). The Hollersports repo itself does not use the words "on hold". | `OBSERVED` for the card; `INFERRED` for the status | PR #58; repo has only dependency bumps since 2026-08-07 and a template commit on 2026-09-04 |
| Hollersports is v0.5.0 advisory beta | `OBSERVED` | README status table, package 0.5.0, tag v0.5.0-advisory-beta |
| hollersports.com is a parked Cloudflare Registrar page | `OBSERVED` | curl 2026-10-26 |
| PsyFi has no public URL; the repo calls it a production-ready Docker web ship with web, PWA, API and Docker gates complete, native iOS deferred | `OBSERVED` | Zero-State-LLC/Psy-Fi README and docs/CONTINUATION_PLAN.md; no homepage set on the repo |
| Waykin PR #16 (spec, ADR-0004) and PR #17 (TS core port) are merged (2026-10-12); iOS stays the reference implementation; Spectacles Lens still needs editor work | `OBSERVED` | gh pr view; ADR-0004; PR #17 body |
| SUAS GitHub Pages and both SUAS repos return 404 | `OBSERVED` | curl 2026-10-26; the repos are private under scrimshawlife-ctrl |
| Hyperlex canonical version is 0.4.2 | `OBSERVED` | VERSION file; pyproject.toml reads it (`version = {file = "VERSION"}`) |
| Sigil-Forge version is 0.13.1 | `OBSERVED` | org repo VERSION file; no newer tag or release on the org repo |

## Open questions

- Hollersports "on hold" wording is not in the repo; confirm it is still the intended status.
- Hyperlex README badge and STATUS still say 0.4.0 (repo-side fix, not a site change).
- Autogive: autogive.app has no public source repo (the only related repo is the archived Autonomous-Giving-Specs, last pushed 2026-08-22), so no Recent updates were added.
- Hexwire, Marigold-Market and Surveillance-Survivor source links 404 (private repos); left as is.
- "Patent pending" and the approximate release windows remain unverifiable and unchanged.
- Waykin PR #26 (SPECS 27 core port, Swift parity) is still open and is not described on the site.
