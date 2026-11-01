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

// Reads the budget, per-visitor limits and prices from env vars. Returns null if any is missing or
// invalid, so the caller can fail closed instead of running the model without a cap.
export function readConfig(env) {
	const num = (v) => (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v)) && Number(v) >= 0 ? Number(v) : null);
	const int = (v) => (num(v) !== null && Number.isInteger(Number(v)) ? Number(v) : null);
	const budget = num(env.MONTHLY_BUDGET_USD);
	const ipDaily = num(env.IP_DAILY_BUDGET_USD);
	const perMinute = int(env.IP_PER_MINUTE);
	const perDay = int(env.IP_PER_DAY);
	const input = num(env.PRICE_INPUT_PER_M);
	const cached = num(env.PRICE_CACHED_INPUT_PER_M);
	const output = num(env.PRICE_OUTPUT_PER_M);
	if ([budget, ipDaily, perMinute, perDay, input, cached, output].includes(null)) return null;
	return {
		limitMicros: Math.round(budget * 1e6),
		ip: { perMinute, perDay, dailyMicros: Math.round(ipDaily * 1e6) },
		prices: { input, cached, output },
	};
}

// UTC day, e.g. "2026-11-01". Per-visitor daily limits reset at 00:00 UTC.
export function dayKey(date = new Date()) {
	return date.toISOString().slice(0, 10);
}

// Seconds until the next UTC day starts (for Retry-After on daily limits).
export function secondsUntilNextDay(date = new Date()) {
	const next = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1);
	return Math.max(1, Math.ceil((next - date.getTime()) / 1000));
}

// Provable upper bound on prompt tokens for a byte-level BPE tokenizer (DeepSeek's is): a token is
// never shorter than one UTF-8 byte, so tokens <= bytes. Dense text such as rare Unicode cannot beat
// it. Chat-template overhead (role markers, separators) is covered by a generous per-message and
// fixed allowance.
export const TEMPLATE_TOKENS_PER_MESSAGE = 32;
export const TEMPLATE_TOKENS_FIXED = 64;
const encoder = new TextEncoder();
export function inputTokenBound(messages) {
	let tokens = TEMPLATE_TOKENS_FIXED;
	for (const m of messages) tokens += encoder.encode(m.role).length + encoder.encode(m.content).length + TEMPLATE_TOKENS_PER_MESSAGE;
	return tokens;
}

// Worst-case cost of one answer, charged before the model runs: every input token billed at the
// uncached rate plus a full max_tokens reply.
export function reserveMicros(inputTokens, maxTokens, prices) {
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

// store (all methods synchronous, so one admit() can never interleave with another; the Durable
// Object's SQL API is):
//   get(month) -> micros, set(month, micros)                      monthly spend
//   hits(ip, sinceMs) -> [ts...] ascending, addHit(ip, ts)        per-visitor sliding minute
//   ipDay(ip, day) -> { n, micros }, setIpDay(ip, day, n, micros)  per-visitor daily count and spend
//   prune(nowMs, day)                                             drop expired minute hits and old days
//
// admit() is the single gate before a model call. It checks, in order: per-visitor requests in the
// last 60 s, per-visitor questions today, per-visitor spend today, then the month's spend. Only if
// all pass does it record the hit and reserve `amount` against both the visitor's day and the month.
// Returns { ok: true } or { ok: false, reason: 'rate_limited' | 'daily_limit' | 'budget_exhausted',
// retryAfter } (retryAfter in seconds, only for rate_limited; callers derive the others).
export function admit(store, { ip, now, month, day, amount, limitMicros, perMinute, perDay, dailyMicros }) {
	store.prune(now, day);
	const recent = store.hits(ip, now - 60_000);
	if (recent.length >= perMinute) {
		const retryAfter = Math.max(1, Math.ceil((recent[recent.length - perMinute] + 60_000 - now) / 1000));
		return { ok: false, reason: 'rate_limited', retryAfter };
	}
	const today = store.ipDay(ip, day);
	if (today.n >= perDay || today.micros + amount > dailyMicros) return { ok: false, reason: 'daily_limit' };
	const spent = store.get(month);
	if (spent + amount > limitMicros) return { ok: false, reason: 'budget_exhausted' };
	store.addHit(ip, now);
	store.setIpDay(ip, day, today.n + 1, today.micros + amount);
	store.set(month, spent + amount);
	return { ok: true };
}

// Replace a reservation with the real cost (refunds the difference, or charges more if it ran over),
// for the month and, when given, the visitor's day.
export function settle(store, month, reserved, actual, ip, day) {
	store.set(month, Math.max(0, store.get(month) - reserved + actual));
	if (ip === undefined || day === undefined) return;
	const today = store.ipDay(ip, day);
	if (today.n > 0) store.setIpDay(ip, day, today.n, Math.max(0, today.micros - reserved + actual));
}

// Monthly-only check kept for the legacy reserve() RPC (used by unit tests and old Worker versions).
export function reserve(store, month, amount, limit) {
	const spent = store.get(month);
	if (spent + amount > limit) return { ok: false };
	store.set(month, spent + amount);
	return { ok: true };
}
