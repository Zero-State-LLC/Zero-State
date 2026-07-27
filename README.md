# Zero State

Canonical website and public brand surface for Zero State — software for a world that keeps changing.

Zero State is the willingness to return to first principles as the world is changing. We believe the tools for a more desirable future already exist; we are learning how to combine them wisely. Products are what this philosophy has produced so far.

## Status: DEVELOPMENT_PREVIEW

| Classification | Meaning |
| --- | --- |
| OBSERVED | Static pages, brand assets, and validation checks exist in this repository. |
| INFERRED | The site is designed to present an adaptable first-principles practice. |
| ASPIRATIONAL | Philosophy statements describe the undertaking, not product guarantees. |
| NOT_READY | Contact endpoint, legal text, external product destinations, trademark review, and typography licensing review. |

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

- Replace the visibly labeled `hello@zerostate.example` in `contact.html` with a monitored operational address.
- Replace reviewed privacy and terms text in `privacy.html` and `terms.html`.
- Confirm external product destinations and product-claim approvals.
- Complete trademark and typography-licensing review.
- Select and add an approved repository license; see `LICENSE-TODO.md`.
