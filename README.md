# Zero State

Canonical website and public brand surface for Zero State — software for a world that keeps changing.

Zero State is the willingness to return to first principles as the world is changing. We believe the tools for a more desirable future already exist; we are learning how to combine them wisely. Products are what this philosophy has produced so far.

## Status: DEVELOPMENT_PREVIEW

| Classification | Meaning |
| --- | --- |
| OBSERVED | Static pages, brand assets, and validation checks exist in this repository. |
| INFERRED | The site is designed to present an adaptable first-principles practice. |
| ASPIRATIONAL | Philosophy statements describe the undertaking, not product guarantees. |
| NOT_READY | External product destinations, trademark review, and typography licensing review. |

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

Pushes to `main` run validation and deploy through the GitHub Pages Actions workflow. Expected URL after the repository exists and Pages is enabled: `https://scrimshawlife-ctrl.github.io/zero-state/`.

## Launch blockers

- Confirm external product destinations and product-claim approvals.
- Complete trademark and typography-licensing review.
- The repository source is licensed under Apache-2.0. Product names and marks
  are not licensed for unrelated use; Apache-2.0 expressly excludes trademark
  rights.
