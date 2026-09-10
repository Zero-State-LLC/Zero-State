# Agent contract — Zero State site

You are working in the **Zero State public website and brand surface**
(`Zero-State-LLC/Zero-State`). This file is the canonical contract for
Cursor, Claude, Codex, Grok, and OpenClaw. Harness adapters (`CLAUDE.md`)
only point here.

**Scope is site/brand only.** This repo presents the org portfolio. It is
not a product runtime. Do not invent product behavior, destinations,
availability, or new portfolio entries.

## Intent

Read the active `intent.md` under [`intent/`](intent/) before editing.
Next stage is a spec or plan grounded in this repo's existing docs — do
not skip to code.

If the change is non-trivial and no intent exists, draft one from
[`intent/_TEMPLATE.md`](intent/_TEMPLATE.md) and wait for a human to
accept it. Trivial docs and chore fixes do not need an intent file.
See [`intent/README.md`](intent/README.md).

## Commands

Fill only from this repo's scripts. Do not invent commands.

| Task | Command |
|---|---|
| Validate (test / build) | `npm test` |
| Local preview | `npm run serve` |

`npm test` is deterministic site validation (pages, assets, internal
links, product posture, identity-motion constraints). Dev server:
`http://localhost:8080`.

## Invariants

- Portfolio, clients, community, and skills pages map to sources already
  listed in `README.md` / `site-manifest.json`. Do not invent products.
- Do not make legal, contact, product-availability, trademark, or
  licensing claims without an approved source (`CONTRIBUTING.md`).
- Changes to the static mark or highway-centerline motion require
  explicit brand review.
- Official home is the dark landing (`index.html` + `styles-dark.css`).
- Evidence labels: `OBSERVED` / `INFERRED` / `ASPIRATIONAL` / `NOT_READY`
  / `NOT_COMPUTABLE`. App Store and production product URLs stay
  `NOT_READY` until a release is ready.
- Do not put secrets, tokens, or live credentials in the tree.
- Human yes on deploy, spend, and legal. Agents do not dispatch
  production deploys.

## Docs

No `graft/` in this repo. Start at `README.md`. Locked design:
`design.md`. Contribution and license rules: `CONTRIBUTING.md`,
`LICENSE_POLICY.md`.

## Escalation

If CI, tests, or validators look wrong — missing coverage, silent skips,
green-but-inert checks, or a suite that contradicts the site contract:

1. Open a bounded defect issue labeled `bug`. Do not expand the current
   task to paper over it.
2. Do **not** weaken, skip, or rewrite assertions to obtain a passing
   result.
3. Reward-hacking is forbidden: no silent skips, no fixture forgery, no
   green-at-any-cost edits.

Escalate to the owner instead of guessing on identity-motion changes,
legal / trademark / licensing claims, new portfolio entries, or Pages
production cutover. A red honest check is better than a green lie.

## Team context

Org and partner status is not this repo. When a task needs cross-repo
or partner state, load [Zero-State-LLC/agent-context](https://github.com/Zero-State-LLC/agent-context):

1. `HANDOFF.md`
2. `STATUS.md`
3. `DECISIONS.md` only if a prior choice affects this task

Clone: `gh repo clone Zero-State-LLC/agent-context ~/agent-context`.
Pull `--ff-only` before trusting a local copy.
