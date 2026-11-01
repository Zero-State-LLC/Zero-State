// Unit tests for the monthly spend ledger (workers/ask/src/budget.mjs). Run: node --test workers/ask/test/budget.test.mjs (also run by npm test)
import assert from 'node:assert/strict';
import test from 'node:test';
import { admit, costMicros, dayKey, inputTokenBound, monthKey, readConfig, reserve, reserveMicros, secondsUntilNextDay, secondsUntilNextMonth, settle } from '../src/budget.mjs';

const ENV = { MONTHLY_BUDGET_USD: '5', IP_PER_MINUTE: '6', IP_PER_DAY: '30', IP_DAILY_BUDGET_USD: '0.25', PRICE_INPUT_PER_M: '0.30', PRICE_CACHED_INPUT_PER_M: '0.006', PRICE_OUTPUT_PER_M: '1.20' };
const { prices, limitMicros, ip: ipLimits } = readConfig(ENV);
const memoryStore = () => {
	const data = new Map();
	return { get: (m) => data.get(m) ?? 0, set: (m, v) => data.set(m, v) };
};

test('config: $5 budget in micro-dollars; missing or bad vars fail closed', () => {
	assert.equal(limitMicros, 5_000_000);
	assert.deepEqual(ipLimits, { perMinute: 6, perDay: 30, dailyMicros: 250_000 });
	assert.equal(readConfig({ ...ENV, IP_PER_MINUTE: '2.5' }), null);
	assert.equal(readConfig({ ...ENV, IP_DAILY_BUDGET_USD: '' }), null);
	assert.equal(readConfig({ ...ENV, MONTHLY_BUDGET_USD: undefined }), null);
	assert.equal(readConfig({ ...ENV, PRICE_OUTPUT_PER_M: 'abc' }), null);
	assert.equal(readConfig({ ...ENV, MONTHLY_BUDGET_USD: '-1' }), null);
	assert.equal(readConfig({ ...ENV, MONTHLY_BUDGET_USD: '0' }).limitMicros, 0);
});

test('month key and reset are UTC calendar months', () => {
	assert.equal(monthKey(new Date('2026-11-30T23:59:59Z')), '2026-11');
	assert.equal(monthKey(new Date('2026-12-01T00:00:00Z')), '2026-12');
	assert.equal(monthKey(new Date('2026-12-31T23:00:00Z')), '2026-12');
	assert.equal(secondsUntilNextMonth(new Date('2026-11-30T23:59:00Z')), 60);
	assert.equal(dayKey(new Date('2026-11-01T23:59:59Z')), '2026-11-01');
	assert.equal(secondsUntilNextDay(new Date('2026-11-01T23:59:30Z')), 30);
});

test('input bound is UTF-8 bytes plus template overhead, so dense Unicode cannot exceed it', () => {
	const ascii = inputTokenBound([{ role: 'user', content: 'hello' }]);
	assert.equal(ascii, 64 + 4 + 5 + 32);
	// 1,000 rare CJK characters: 1,000 JS chars but 3,000 UTF-8 bytes, so at least 3,000 tokens reserved
	// (a byte-level BPE tokenizer can never produce more tokens than bytes).
	const dense = inputTokenBound([{ role: 'user', content: '\u9fa5'.repeat(1000) }]);
	assert.ok(dense >= 3_000 + 32 + 64);
	// Astral characters (surrogate pairs) are 4 bytes each.
	assert.ok(inputTokenBound([{ role: 'user', content: '\u{1F600}'.repeat(10) }]) >= 40);
});

test('reservation covers a cold-cache, full-length answer', () => {
	const messages = [{ role: 'system', content: 'x'.repeat(65_000) }, { role: 'user', content: 'What is live?' }];
	const bound = inputTokenBound(messages);
	const reserved = reserveMicros(bound, 600, prices);
	assert.equal(reserved, Math.ceil(bound * 0.3 + 600 * 1.2));   // about $0.020
	// Worst real case: one token per byte, nothing cached, full reply.
	assert.ok(costMicros({ prompt_tokens: bound, completion_tokens: 600 }, prices) <= reserved);
});

test('actual cost uses cached-input pricing when the model reports it', () => {
	const warm = costMicros({ prompt_tokens: 16_000, completion_tokens: 200, prompt_tokens_details: { cached_tokens: 15_800 } }, prices);
	assert.equal(warm, Math.ceil(200 * 0.3 + 15_800 * 0.006 + 200 * 1.2));   // 395 micro-dollars, about $0.0004
	assert.equal(costMicros(null, prices), null);
	assert.equal(costMicros({ completion_tokens: 5 }, prices), null);
});

test('reserve refuses once the month would go over the cap, and the next month starts fresh', () => {
	const store = memoryStore();
	const limit = 10_000;
	assert.deepEqual(reserve(store, '2026-11', 7_000, limit), { ok: true });
	assert.deepEqual(reserve(store, '2026-11', 7_000, limit), { ok: false });   // would be 14,000 > 10,000
	assert.equal(store.get('2026-11'), 7_000);
	assert.deepEqual(reserve(store, '2026-12', 7_000, limit), { ok: true });
});

test('a zero budget refuses every request (how to test the cap without spending)', () => {
	assert.deepEqual(reserve(memoryStore(), '2026-11', 1, 0), { ok: false });
});

test('settle swaps the reservation for the real cost; burst of reservations never exceeds the cap', () => {
	const store = memoryStore();
	const limit = 5_000_000;
	let admitted = 0;
	for (let i = 0; i < 2_000; i++) if (reserve(store, '2026-11', 7_320, limit).ok) admitted++;
	assert.equal(admitted, Math.floor(limit / 7_320));   // 683 in flight at worst-case cost
	assert.ok(store.get('2026-11') <= limit);
	settle(store, '2026-11', 7_320, 400);   // one answer finished cheaply: refund 6,920
	assert.equal(store.get('2026-11'), admitted * 7_320 - 6_920);
	settle(memoryStore(), '2026-11', 7_320, 0);   // never goes negative
});

// In-memory version of the Durable Object's SQL store, same interface as budget-do.js.
const fullStore = () => {
	const spend = new Map();
	let hits = [];
	const days = new Map();
	return {
		get: (m) => spend.get(m) ?? 0,
		set: (m, v) => spend.set(m, v),
		hits: (ip, since) => hits.filter((h) => h.ip === ip && h.ts > since).map((h) => h.ts).sort((a, b) => a - b),
		addHit: (ip, ts) => hits.push({ ip, ts }),
		ipDay: (ip, day) => days.get(`${ip}|${day}`) ?? { n: 0, micros: 0 },
		setIpDay: (ip, day, n, micros) => days.set(`${ip}|${day}`, { n, micros }),
		prune: (now, day) => {
			hits = hits.filter((h) => h.ts > now - 60_000);
			for (const k of days.keys()) if (!k.endsWith(`|${day}`)) days.delete(k);
		},
		size: () => ({ hits: hits.length, days: days.size }),
	};
};
const T0 = Date.parse('2026-11-01T12:00:00Z');
const req = (over = {}) => ({ ip: 'a', now: T0, month: '2026-11', day: '2026-11-01', amount: 20_000, limitMicros, ...ipLimits, ...over });

test('strict per-IP limit: the 7th request inside 60 s is refused, with Retry-After', () => {
	const store = fullStore();
	for (let i = 0; i < 6; i++) assert.deepEqual(admit(store, req({ now: T0 + i * 1000 })), { ok: true });
	const seventh = admit(store, req({ now: T0 + 6000 }));
	assert.equal(seventh.reason, 'rate_limited');
	assert.equal(seventh.retryAfter, 54);   // oldest of the last 6 (T0) leaves the window at T0 + 60 s
	assert.equal(admit(store, req({ ip: 'b', now: T0 + 6000 })).ok, true);   // other visitors unaffected
	assert.equal(admit(store, req({ now: T0 + 60_001 })).ok, true);          // window slides
	assert.equal(store.get('2026-11'), 8 * 20_000);                         // refused requests reserve nothing
});

test('daily per-IP question cap', () => {
	const store = fullStore();
	let ok = 0;
	for (let i = 0; i < 40; i++) if (admit(store, req({ now: T0 + i * 20_000, amount: 100 })).ok) ok++;
	assert.equal(ok, 30);
	assert.equal(admit(store, req({ now: T0 + 900_000, amount: 100 })).reason, 'daily_limit');
	// Next UTC day: fresh allowance, and yesterday's rows are pruned.
	assert.equal(admit(store, req({ now: T0 + 86_400_000, day: '2026-11-02', amount: 100 })).ok, true);
	assert.equal(store.size().days, 1);
});

test('daily per-IP dollar cap stops one visitor before the monthly budget', () => {
	const store = fullStore();
	let ok = 0;
	for (let i = 0; i < 30; i++) if (admit(store, req({ now: T0 + i * 20_000, amount: 35_000 })).ok) ok++;
	assert.equal(ok, 7);   // 7 x $0.035 = $0.245 <= $0.25; the 8th would exceed it
	assert.equal(admit(store, req({ now: T0 + 999_000, amount: 35_000 })).reason, 'daily_limit');
	// Settling to the real cost frees the visitor's daily allowance again.
	settle(store, '2026-11', 35_000, 500, 'a', '2026-11-01');
	assert.equal(store.ipDay('a', '2026-11-01').micros, 6 * 35_000 + 500);
	assert.equal(store.get('2026-11'), 6 * 35_000 + 500);
});

test('monthly budget is checked after the visitor limits and blocks everyone', () => {
	const store = fullStore();
	store.set('2026-11', limitMicros - 10_000);
	assert.equal(admit(store, req()).reason, 'budget_exhausted');
	assert.equal(admit(store, req({ ip: 'z' })).reason, 'budget_exhausted');
	assert.deepEqual(store.ipDay('a', '2026-11-01'), { n: 0, micros: 0 });   // nothing recorded
});
