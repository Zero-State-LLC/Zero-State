# Zero State

Canonical website and public brand surface for Zero State — software for a world that keeps changing.

Zero State is the willingness to return to first principles as the world is changing. We believe the tools for a more desirable future already exist; we are learning how to combine them wisely. Products are what this philosophy has produced so far.

## Status: DEVELOPMENT_PREVIEW

| Classification | Meaning |
| --- | --- |
| OBSERVED | Static pages, brand assets, and validation checks exist in this repository. |
| INFERRED | The site is designed to present an adaptable first-principles practice. |
| ASPIRATIONAL | Philosophy statements describe the undertaking, not product guarantees. |
| NOT_READY | App Store / production product destinations, trademark review, and typography licensing review. |

## Local development

```bash
npm run serve
npm test
```

`npm test` verifies required pages and assets, metadata and landmarks, internal links, Pages-safe paths, placeholder signaling, and the balanced highway motion constraints. The development server uses `http://localhost:8080`.

## Structure

- `index.html`, `work.html`, `philosophy.html`, `about.html`, `contact.html`: primary site pages
- `products/`: product-context pages
- `assets/`: Balanced Aperture mark variants
- `styles.css`, `script.js`: shared presentation and interaction
- `scripts/validate-site.js`: deterministic validation
- `.github/workflows/`: CI and official GitHub Pages deployment

## Deployment

| Workflow | Trigger | Job |
| --- | --- | --- |
| **Site validation** | push to `main`, pull requests, manual | validate |
| **Deploy GitHub Pages** | push to `main`, manual | build → deploy |

Pages source must be **GitHub Actions** (not “Deploy from a branch”). The deploy job uses the `github-pages` environment, which allows branch `main`.

If a merge to `main` does not start a deploy, check **Actions → Deploy GitHub Pages** for a `push` run. Re-run with **Run workflow** (`workflow_dispatch`) if needed.

| Surface | URL |
| --- | --- |
| Org (canonical) | https://zero-state-llc.github.io/Zero-State/ |
| Dark landing concept | https://zero-state-llc.github.io/Zero-State/concepts/dark-landing/ |

## Launch blockers

- **Product destinations:** public sources are the [Zero-State-LLC repositories](https://github.com/orgs/Zero-State-LLC/repositories) and this site. App Store and production product URLs are not claimed until a release is ready.
- **Trademark review:** product and company marks still need formal trademark review before broad commercial use claims.
- **Typography licensing:** production face licensing must be confirmed before shipping non-system display type.
- The repository source is licensed under Apache-2.0. Product names and marks
  are not licensed for unrelated use; Apache-2.0 expressly excludes trademark
  rights.
