# Ask Zero State · Worker

Answers visitor questions on zer0state.com using only the site's own copy.
Intent: [`intent/2026-10-31-ask-zero-state.md`](../../intent/2026-10-31-ask-zero-state.md).

- `knowledge.md`: generated from the official pages in `site-manifest.json` by
  `node scripts/ask-knowledge.js`. Do not edit by hand. `npm test` fails if it is stale,
  if a home-page project is missing from it, or if it carries any email other than
  `zer0state@zer0state.com` or a credential-like string.
- `src/index.js`: checks the request's origin, applies a per-IP rate limit (about 6 questions a minute per Cloudflare location),
  validates the conversation, and streams the model's answer as plain text.
- Model: `@cf/deepseek-ai/deepseek-v4.1-flash-1017` on Workers AI with reasoning off.
  No API key; billed to the Cloudflare account (Workers Paid plan). The knowledge prefix is
  identical on every request, so it is billed at the cached-input rate: about $0.0005 per
  answer. Change `MODEL` in `wrangler.jsonc` to swap models.
- The widget is `assets/ask/ask.js` + `ask.css`, loaded by `site.js`. It stays hidden
  unless the Worker answers its health check, so the site is safe to ship before the Worker.

## Local preview

```bash
cd workers/ask && npx wrangler@4 dev --port 8787
```

```bash
npm run serve
```

Open `http://localhost:8080`. The widget talks to `localhost:8787`. Workers AI runs remotely
even in dev, so local questions are billed (fractions of a cent).

## Deploy (human step)

After any site copy change, run `node scripts/ask-knowledge.js`, then:

```bash
cd workers/ask && npx wrangler@4 deploy
```

It deploys to `https://zs-ask.zer0state-noema.workers.dev`, the URL `assets/ask/ask.js`
expects. If the account's workers.dev subdomain differs, update `ENDPOINT` there.
Set a spending alert for Workers AI in the Cloudflare dashboard.
