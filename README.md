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

## Social preview

`assets/og-image.png` (1200×630) is referenced by Open Graph and Twitter Card meta on the home page.

## Structure

| Path | Role |
| --- | --- |
| `index.html`, `work.html`, `philosophy.html`, `about.html`, `contact.html` | Primary surfaces |
| `products/` | Parent-brand product summaries + repo links |
| `index.html` + `styles-dark.css` | **Official home** (dark landing) |
| `concepts/dark-landing/` | Redirect to official home (legacy URL) |
| `styles-light.css` | Secondary light pages (work, philosophy, about, …) |
| `assets/` | Marks, retina identity, product heroes |
| `styles.css`, `script.js` | Shared light-site presentation |
| `design.md` | Locked design system |
| `scripts/validate-site.js` | CI / Pages build validation |
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
- Repository source is Apache-2.0. Product names and marks are not licensed for unrelated use; Apache-2.0 expressly excludes trademark rights.
