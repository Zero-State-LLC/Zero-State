# Zero State

Canonical website and public brand surface for Zero State — software for a world that keeps changing.

**Version:** `0.3.2` · **Status:** DEVELOPMENT_PREVIEW

Zero State is the willingness to return to first principles as the world is changing. We believe the tools for a more desirable future already exist; we are learning how to combine them wisely. Products are what this philosophy has produced so far.

## Status

| Classification | Meaning |
| --- | --- |
| OBSERVED | Static pages, brand assets, org portfolio, validation, and Pages deploy exist in this repository. |
| INFERRED | The site presents an adaptable first-principles practice and evidence-led portfolio. |
| ASPIRATIONAL | Philosophy statements describe the undertaking, not product guarantees. |
| NOT_READY | App Store / production product destinations, trademark review, and typography licensing review. |

## Portfolio

Public product pages map to org repositories:

| Product | Repository |
| --- | --- |
| Waykin | [Zero-State-LLC/Waykin](https://github.com/Zero-State-LLC/Waykin) |
| PatchHive | [Zero-State-LLC/Patch-Hive](https://github.com/Zero-State-LLC/Patch-Hive) |
| PsyFi | [Zero-State-LLC/Psy-Fi](https://github.com/Zero-State-LLC/Psy-Fi) |
| Surveillance Survivor | [Zero-State-LLC/Surveillance-Survivor](https://github.com/Zero-State-LLC/Surveillance-Survivor) |
| HexWire | [Zero-State-LLC/Hexwire](https://github.com/Zero-State-LLC/Hexwire) |
| Hollersports | [Zero-State-LLC/Hollersports](https://github.com/Zero-State-LLC/Hollersports) |
| Marigold Market | [Zero-State-LLC/Marigold-Market](https://github.com/Zero-State-LLC/Marigold-Market) |
| Noema | [noema.guru](https://noema.guru) |
| Pawl | [pypi.org/project/pawl-gate](https://pypi.org/project/pawl-gate/) |
| J-Chain | [j-chain.net](https://j-chain.net) |
| BlackDog | [Zero-State-LLC/BlackDog](https://github.com/Zero-State-LLC/BlackDog) |

### Clients

Client work is listed separately from Zero State products:

| Client | Public site |
| --- | --- |
| Autogive.app | [autogive.app](https://autogive.app) |
| zzThis | [zzthis.com](https://zzthis.com) |

### Community

Civic and hackathon work is listed separately from Zero State products and client work:

| Entry | Public page |
| --- | --- |
| SUAS | Not currently available (the former GitHub Pages site returns 404); see [community/suas.html](community/suas.html) |

### Collaborators

People who build with Zero State are listed on [collaborators.html](collaborators.html),
generated from `data/collaborators.json`. To add one: add an object to that file (see the
example in [docs/specs/collaborators.md](docs/specs/collaborators.md)), run
`npm run build:collaborators`, then `npm test`. Only profiles the person has approved.

### Hermes / OpenClaw skills

| Skill | Repository |
| --- | --- |
| Abraxas Orchestra | [Zero-State-LLC/Abraxas-Orchestra](https://github.com/Zero-State-LLC/Abraxas-Orchestra) |
| Hyperlex | [Zero-State-LLC/Hyperlex](https://github.com/Zero-State-LLC/Hyperlex) |
| Kubrick | [Zero-State-LLC/Kubrick](https://github.com/Zero-State-LLC/Kubrick) |
| Neon Genie | [Zero-State-LLC/NeonGenie](https://github.com/Zero-State-LLC/NeonGenie) |
| Sigil-Forge | [Zero-State-LLC/Sigil-Forge](https://github.com/Zero-State-LLC/Sigil-Forge) |

Org listing: https://github.com/orgs/Zero-State-LLC/repositories

## Custom domain (Apple enrollment)

Company domain **`zer0state.com`** should serve this site (not the Squarespace parking page).

See [docs/custom-domain.md](docs/custom-domain.md) for DNS records and cutover steps.

Until DNS is live, the public site is: https://zero-state-llc.github.io/Zero-State/

## Local development


```bash
npm run serve
npm test
```

`npm test` runs deterministic site validation (pages, assets, internal links, product posture, identity-motion constraints). Dev server: `http://localhost:8080`.

Pawl ratchets that validation in CI. Locally, run `/path/to/pawl check` after
installing `pawl-gate==0.2.0`; the gate records the canonical `npm test` result
without exposing the private product repositories.

## Social preview

`assets/og-image.png` (1200×630) is referenced by Open Graph and Twitter Card meta on every official page.

## Analytics

Cloudflare Web Analytics (cookieless, disclosed in `privacy.html` §2.3) loads from `site.js`, the one script every page shares. The site token goes in `CF_WEB_ANALYTICS_TOKEN` near the top of `site.js`. It stays empty until the owner adds `zer0state.com` in the Cloudflare dashboard (Web Analytics → Add a site) and pastes the token there; while it is empty, nothing loads. The token is public by design (it ships in the page), so it is not a secret.

## Agent contract

Humans and coding agents follow [`AGENTS.md`](AGENTS.md). [`CLAUDE.md`](CLAUDE.md) only points there. Non-trivial site/brand work starts with an intent under [`intent/`](intent/). Do not invent product work in this repository.

## Structure

| Path | Role |
| --- | --- |
| `AGENTS.md` | Agent / contributor contract (site/brand scope) |
| `CLAUDE.md` | Thin adapter → `AGENTS.md` |
| `intent/` | Stage-0 proto-spec for non-trivial site/brand work |
| `index.html`, `work.html`, `philosophy.html`, `about.html`, `contact.html` | Primary surfaces |
| `products/` | Parent-brand product summaries + repo links |
| `clients/` | Parent-brand client notes; live product remains on the client site |
| `community/` | Parent-brand notes for civic and hackathon work; not products for sale |
| `collaborators.html` + `data/collaborators.json` | Collaborators page; cards generated by `scripts/collaborators.js` |
| `index.html` + `home.css` + `home.js` | **Official home** (dark landing) |
| `tokens.css` + `site.css` + `site.js` | Shared system on every page: tokens, nav, footer, motion |
| `pages.css` | Inner-page templates: dossier, long document, catalogue |
| `styles-dark.css` | Legacy; kept because the validator asserts it exists |
| `assets/glyphs.svg` | Symbol system — one glyph per portfolio entry and section |
| `assets/fonts/` | Self-hosted OFL faces (see `assets/THIRD_PARTY_NOTICES.md`) |
| `aperture-3d.js` + `marks-3d.js` | 3D home marks; flat art stays as the fallback |
| `assets/vendor/three/` | Self-hosted three.js, verified and unmodified (see `assets/THIRD_PARTY_NOTICES.md`) |
| `concepts/dark-landing/` | Redirect to official home (legacy URL) |
| `assets/` | Marks, retina identity, product heroes |
| `design.md` | Locked design system |
| `scripts/validate-site.js` | CI / Pages build validation |
| `sitemap.xml`, `robots.txt` | Public crawler list at `https://zer0state.com/` |
| `404.html` | Not-found page; GitHub Pages serves it with a 404 status |
| `favicon.ico`, `site.webmanifest` | Icon set (16/32/48 ICO, 180 touch icon, 192/512 manifest icons), all from the mark 3 art |
| `.github/workflows/` | Site validation + GitHub Pages deploy |

## Deployment

| Workflow | Trigger | Job |
| --- | --- | --- |
| **Site validation** | push to `main`, pull requests, manual | validate |
| **Deploy GitHub Pages** | push to `main`, manual | build → deploy |

Pages source must be **GitHub Actions**. The deploy job uses the `github-pages` environment (branch `main` allowed).

| Surface | URL |
| --- | --- |
| Org (canonical) | https://zero-state-llc.github.io/Zero-State/ |
| Work | https://zero-state-llc.github.io/Zero-State/work.html |
| Official home (dark) | https://zero-state-llc.github.io/Zero-State/ |
| Legacy dark-landing URL | redirects to home |

## Release

See [CHANGELOG.md](CHANGELOG.md). Tags follow semver (`v0.3.2`).

```bash
# After docs bump on main
git tag -a v0.3.2 -m "Zero State site 0.3.0"
git push origin v0.3.2
gh release create v0.3.2 --title "v0.3.0" --notes-file CHANGELOG.md
```

## Launch blockers

- **Product destinations:** public sources are the org repositories and this site. App Store and production product URLs are not claimed until a release is ready.
- **Trademark review:** product and company marks still need formal trademark review before broad commercial use claims.
- **Typography licensing:** production face licensing must be confirmed before shipping non-system display type.
- Product names and marks are not licensed for unrelated use.


## License

Copyright © 2026 Zero State LLC. All Rights Reserved. Licensed under the Zero State Proprietary License v1.0. See [`LICENSE`](LICENSE).

Third-party components remain subject to their respective licenses.
