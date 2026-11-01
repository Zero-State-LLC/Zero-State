# Ask Zero State · Worker

Answers visitor questions on zer0state.com using only the site's own copy.
Intent: [`intent/2026-10-31-ask-zero-state.md`](../../intent/2026-10-31-ask-zero-state.md).

- `knowledge.md`: generated from the official pages in `site-manifest.json` by
  `node scripts/ask-knowledge.js`. Do not edit by hand. `npm test` fails if it is stale,
  if a home-page project is missing from it, or if it carries any email other than
  `zer0state@zer0state.com` or a credential-like string.
- `src/index.js`: checks the request's origin, validates the conversation, refuses obvious
  off-topic requests for free (`src/scope.mjs`), admits the request through the `AskBudget`
  Durable Object (strict per-visitor limits and the monthly spend cap, `src/budget.mjs` and
  `src/budget-do.js`), and streams the model's answer as plain text.
- Model: `@cf/deepseek-ai/deepseek-v4.1-flash-1017` on Workers AI with reasoning off.
  No API key; billed to the Cloudflare account (Workers Paid plan). The knowledge prefix is
  identical on every request, so it is billed at the cached-input rate: about $0.0003 to $0.0005
  per answer (about $0.005 when the prompt cache is cold). Answers are capped at 300 tokens. Change `MODEL` in `wrangler.jsonc` to swap models.
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

## Products-only scope

Ask Zero State answers only questions about Zero State's products and services as listed on the
site: products, games and apps, agent skills, client and community projects, local-intelligence
services, and how to buy, download, contact or work with us. Everything else gets one fixed reply
(`REFUSAL` in `src/scope.mjs`):

> I can only answer questions about Zero State's products and services. Try asking about HexWire,
> Noema, Pawl or our local-intelligence work, or email zer0state@zer0state.com.

Two layers:

1. Free pre-check before any model call (`precheck()` in `src/scope.mjs`). It refuses only
   obvious cases: prompt injection ("ignore previous instructions", "system prompt", "developer
   mode", ...) always; coding help, creative writing, math, news/markets and translation only when
   the question does not name Zero State or one of its products, skills or services. The topic
   list is built from the product, skill, client and community pages in `knowledge.md`, so new
   products are covered when the knowledge file is regenerated. A follow-up ("Is there any news
   about it?") counts as on topic if one of the visitor's earlier questions named a product;
   assistant replies are ignored for this. When unsure it lets the question
   through, so real product questions are never blocked by a keyword. Refusals return HTTP 200
   with the fixed text and an `X-Ask-Scope: refused` header, and do not count against the
   visitor's limits.
2. The system prompt is the real boundary: it limits the model to the website content and tells
   it to answer anything out of scope with exactly the same refusal text.

Messages are capped at 500 characters and conversations at 8 messages (`MAX_CHARS`,
`MAX_MESSAGES`; the widget uses the same values and a test checks they match). Longer input gets
HTTP 400 without a model call. Tests: `workers/ask/test/scope.test.mjs` lists the refused and the
allowed example questions; add to it when tuning.

## Limits and spend cap

### Per-visitor limits (strict)

Every question that reaches the model first passes one atomic check in the `AskBudget` Durable
Object, keyed by a SHA-256 hash of the visitor's IP (`CF-Connecting-IP`; the IP itself is never
stored):

| Var | Default | Over the limit |
| --- | --- | --- |
| `IP_PER_MINUTE` | `6` (sliding 60 s) | 429 `"code": "rate_limited"`, `Retry-After` in seconds |
| `IP_PER_DAY` | `30` questions per UTC day | 429 `"code": "daily_limit"` |
| `IP_DAILY_BUDGET_USD` | `0.25` estimated spend per UTC day | 429 `"code": "daily_limit"` |

The widget shows the Worker's message for both 429 codes. Minute hits are deleted after 60 s and
daily rows when the UTC day changes. The Durable Object uses its own clock at admission, so a
request delayed across midnight cannot count against, or clear, the wrong day. These replace the old Workers Rate Limiting binding
(`ASK_LIMIT`), which never returned 429 in production: that binding is approximate by design
(each instance checks a locally cached count and syncs in the background, separately per
Cloudflare location), so a limit as small as 6 a minute was not enforced. Cloudflare's docs
recommend a Durable Object for a strict limit. Visitors sharing an IP (offices, mobile carriers)
share these limits.

### Monthly spend cap

The Worker stops calling the model once its estimated Workers AI spend for the month reaches
`MONTHLY_BUDGET_USD` (default `5`, in `wrangler.jsonc`).

- How it works: one global Durable Object (`AskBudget`, binding `BUDGET`, SQLite storage) keeps a
  per-month total in micro-dollars. Before each model call the Worker reserves the worst-case cost
  of that answer: prompt tokens bounded by the UTF-8 byte count (the model's byte-level tokenizer
  never makes more tokens than bytes) plus chat-template overhead, all billed uncached, plus a full
  `MAX_TOKENS` reply. That is about $0.020 for a typical question and at most about $0.023. If the
  reservation would push the visitor's day or the month over its cap, the model is not called. When the answer finishes, the reservation is replaced by the real cost
  from the token usage the model reports. If no usage arrives (visitor closed the tab, stream
  error) the full reservation stays charged, for the month and the visitor's day. If the model call throws, the reservation is refunded.
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
- Change the per-visitor limits the same way (`IP_PER_MINUTE`, `IP_PER_DAY`,
  `IP_DAILY_BUDGET_USD`). Invalid or missing values fail closed (503 `budget_unavailable`).
- Test without spending: `npx wrangler dev --var MONTHLY_BUDGET_USD:0`, then POST a product
  question; expect 503 `budget_exhausted`. To test the per-visitor limits locally without the
  model, run `wrangler dev` with a copy of `wrangler.jsonc` that omits the `"ai"` binding: each
  admitted question returns 502 (no model) and the 7th within a minute returns 429
  `rate_limited`. Unit tests: `npm test` from the repo root runs every `workers/ask/test/*.test.mjs`.

## Deploy (human step)

After any site copy change, run `node scripts/ask-knowledge.js`, then:

```bash
cd workers/ask && npx wrangler@4 deploy
```

It deploys to `https://zs-ask.zer0state-noema.workers.dev`, the URL `assets/ask/ask.js`
expects. If the account's workers.dev subdomain differs, update `ENDPOINT` there.
Set a spending alert for Workers AI in the Cloudflare dashboard.
