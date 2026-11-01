# Intent

Status: PROPOSED. Merging the PR that adds this file is the human acceptance.

## Problem

A security review of this repo found that the passphrase-gated GLM chat Worker
(defined inline in `.github/workflows/deploy-glm-chat.yml`) forwards the client's
request body to the self-hosted GLM API almost unchanged:

- `max_tokens` is capped with `Math.min(body.max_tokens || 2048, 4096)`. A
  non-numeric value becomes `NaN`, which `JSON.stringify` sends upstream as
  `null`, so the cap does not apply.
- Every other field (`n`, `tools`, sampling settings, ...) passes through, so a
  caller can multiply GPU work per request.
- The deploy step interpolates secrets into the shell script text
  (`echo -n "${{ secrets.X }}"`), which breaks or injects if a value contains
  `"`, `$` or a backtick.

## Proposed outcome

- The Worker builds the upstream body from scratch: `model`, validated
  `messages` (1 to 16 items, roles system/user/assistant, string content up to
  16000 chars), `max_tokens` as an integer 1..4096 (default 2048), `stream: false`.
  Invalid input returns 400 before any upstream call.
- Secrets reach the deploy step as `env:` values and are piped with `printf '%s'`.

Out of scope: the per-IP KV rate limit is read-then-write and can be raced by
parallel requests, and there is no site-wide cap. Fixing that needs a Durable
Object (as `workers/ask` uses) and is left for a separate change.

## Affected users / systems

`chat/index.html` visitors who hold the access phrase; the `glm-chat` Worker;
the GLM upstream. The page already sends `{ messages: history.slice(-16), max_tokens: 2048 }`,
which stays valid.

## Constraints / non-goals

No deploy. The workflow is `workflow_dispatch` only; a human runs it.
No change to the gate, CORS, rate limit, or site pages.

## Open questions

- Should the `system` role be refused? The page never sends one. Kept allowed
  to avoid breaking other callers. Owner decides.

## Verified / assumed claims

| Claim | Label | Basis |
|---|---|---|
| Non-numeric `max_tokens` reached upstream as `null` before this change | `OBSERVED` | `Math.min('x', 4096)` is `NaN`; `JSON.stringify({a: NaN})` is `{"a":null}` |
| New body drops extras and bounds `max_tokens` | `OBSERVED` | Worker extracted from the workflow and exercised in Node with a stubbed `fetch` |
| Upstream treats `max_tokens: null` as unbounded | `INFERRED` | Common in OpenAI-compatible servers; not tested against the GLM host |
| `npm test` passes | `OBSERVED` | Local run, 27 pages validated |

## Author / date

- Author: Claude (security review, requested by the owner)
- Date: 2026-11-01
