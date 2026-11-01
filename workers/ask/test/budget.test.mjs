// Unit tests for the monthly spend ledger (workers/ask/src/budget.js). Run: npm run test:ask
import assert from 'node:assert/strict';
import test from 'node:test';
import { costMicros, monthKey, readConfig, reserve, reserveMicros, secondsUntilNextMonth, settle } from '../src/budget.js';

const ENV = { MONTHLY_BUDGET_USD: '5', PRICE_INPUT_PER_M: '0.30', PRICE_CACHED_INPUT_PER_M: '0.006', PRICE_OUTPUT_PER_M: '1.20' };
const { prices, limitMicros } = readConfig(ENV);
const memoryStore = () => {
	const data = new Map();
	return { get: (m) => data.get(m) ?? 0, set: (m, v) => data.set(m, v) };
};

test('config: $5 budget in micro-dollars; missing or bad vars fail closed', () => {
	assert.equal(limitMicros, 5_000_000);
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
});

test('reservation is a pessimistic upper bound on the real cost', () => {
	const chars = 66_000;   // about the size of the system prompt plus a question
	const reserved = reserveMicros(chars, 600, prices);
	assert.equal(reserved, Math.ceil(22_000 * 0.3 + 600 * 1.2));   // 7,320 micro-dollars, about $0.0073
	// Same request with a cold cache at a realistic 4 chars/token, and a full-length answer:
	assert.ok(costMicros({ prompt_tokens: 16_500, completion_tokens: 600 }, prices) <= reserved);
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
