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

## Monthly spend cap

The Worker stops calling the model once its estimated Workers AI spend for the month reaches
`MONTHLY_BUDGET_USD` (default `5`, in `wrangler.jsonc`).

- How it works: one global Durable Object (`AskBudget`, binding `BUDGET`, SQLite storage) keeps a
  per-month total in micro-dollars. Before each model call the Worker reserves the worst-case cost
  of that answer (every prompt token uncached at about 3 characters per token, plus a full
  `MAX_TOKENS` reply, about $0.0073 today). If the reservation would push the month over the cap,
  the model is not called. When the answer finishes, the reservation is replaced by the real cost
  from the token usage the model reports. If no usage arrives (visitor closed the tab, stream
  error) the full reservation stays charged. If the model call throws, the reservation is refunded.
  Because reservations are taken one at a time inside the Durable Object, a burst of concurrent
  requests cannot push the month past the cap.
- Pricing: `PRICE_INPUT_PER_M`, `PRICE_CACHED_INPUT_PER_M`, `PRICE_OUTPUT_PER_M` are USD per
  million tokens for `MODEL`, copied from the Cloudflare Workers AI pricing page. Update them if
  the model or its price changes.
- What visitors see: HTTP 503 with `{"error": "Ask Zero State is resting until next month...",
  "code": "budget_exhausted"}` and a `Retry-After` header. The widget shows that message. The
  per-IP rate limit is separate: HTTP 429, `"code": "rate_limited"`.
- Fail closed: if the budget vars are missing or invalid, or the Durable Object cannot be reached,
  the Worker logs `budget check failed` and returns 503 `"code": "budget_unavailable"` without
  calling the model.
- Resets: the month is the UTC calendar month, so the counter resets at 00:00 UTC on the 1st
  (4 PM PDT / 5 PM PST on the last day of the previous month).
- Approximate: this is an estimate from published prices, not Cloudflare's bill. Neuron rounding,
  price changes, the free daily allocation, and other Workers AI use on the account are not
  counted. Keep a Cloudflare billing notification as a second line of defence.
- No endpoint reports the spend. To inspect it, use the Durable Object's data in the dashboard or
  `wrangler tail` for the logs.
- Change the cap: edit `MONTHLY_BUDGET_USD` in `wrangler.jsonc` and redeploy (human step below).
  `0` pauses the assistant immediately. Raising the cap mid-month takes effect at once, since the
  stored total is compared against the current value.
- Test the cap without spending: `npx wrangler dev --var MONTHLY_BUDGET_USD:0`, then POST a
  question; expect 503 `budget_exhausted`. Unit tests: `npm run test:ask` from the repo root.

## Deploy (human step)

After any site copy change, run `node scripts/ask-knowledge.js`, then:

```bash
cd workers/ask && npx wrangler@4 deploy
```

It deploys to `https://zs-ask.zer0state-noema.workers.dev`, the URL `assets/ask/ask.js`
expects. If the account's workers.dev subdomain differs, update `ENDPOINT` there.
Set a spending alert for Workers AI in the Cloudflare dashboard.
