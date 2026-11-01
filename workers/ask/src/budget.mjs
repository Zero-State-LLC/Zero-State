// Ask Zero State - monthly spend ledger. Pure logic, no Cloudflare imports, so it is unit-testable
// with plain Node (workers/ask/test/budget.test.mjs). The Durable Object in budget-do.js wraps it.
//
// Money is tracked in integer micro-dollars (1 USD = 1,000,000) to avoid float drift.
// Prices are in USD per million tokens, so "USD per M tokens" == "micro-dollars per token".

// Budget month in UTC, e.g. "2026-11". The counter resets at 00:00 UTC on the 1st.
export function monthKey(date = new Date()) {
	return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

// Seconds until the next UTC month starts (for Retry-After).
export function secondsUntilNextMonth(date = new Date()) {
	const next = Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1);
	return Math.max(1, Math.ceil((next - date.getTime()) / 1000));
}

// Reads the budget and prices from env vars. Returns null if any is missing or invalid,
// so the caller can fail closed instead of running the model without a cap.
export function readConfig(env) {
	const num = (v) => (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v)) && Number(v) >= 0 ? Number(v) : null);
	const budget = num(env.MONTHLY_BUDGET_USD);
	const input = num(env.PRICE_INPUT_PER_M);
	const cached = num(env.PRICE_CACHED_INPUT_PER_M);
	const output = num(env.PRICE_OUTPUT_PER_M);
	if ([budget, input, cached, output].includes(null)) return null;
	return { limitMicros: Math.round(budget * 1e6), prices: { input, cached, output } };
}

// Worst-case cost of one answer, charged before the model runs: every input token billed at the
// uncached rate (about 3 characters per token, deliberately pessimistic) plus a full max_tokens reply.
export function reserveMicros(inputChars, maxTokens, prices) {
	const inputTokens = Math.ceil(inputChars / 3);
	return Math.ceil(inputTokens * prices.input + maxTokens * prices.output);
}

// Actual cost from an OpenAI-style usage object:
// { prompt_tokens, completion_tokens, prompt_tokens_details: { cached_tokens } }.
// Returns null if usage is missing or malformed (the caller then keeps the reservation).
export function costMicros(usage, prices) {
	if (!usage || !Number.isFinite(usage.prompt_tokens) || !Number.isFinite(usage.completion_tokens)) return null;
	const cached = Math.min(usage.prompt_tokens, Math.max(0, Number(usage.prompt_tokens_details?.cached_tokens) || 0));
	const uncached = usage.prompt_tokens - cached;
	return Math.ceil(uncached * prices.input + cached * prices.cached + usage.completion_tokens * prices.output);
}

// store: { get(month) -> micros (0 if unset), set(month, micros) }. Both calls must be synchronous,
// so a check-and-increment can never interleave with another request (the Durable Object's SQL API is).
export function reserve(store, month, amount, limit) {
	const spent = store.get(month);
	if (spent + amount > limit) return { ok: false };
	store.set(month, spent + amount);
	return { ok: true };
}

// Replace a reservation with the real cost (refunds the difference, or charges more if it ran over).
export function settle(store, month, reserved, actual) {
	store.set(month, Math.max(0, store.get(month) - reserved + actual));
}
