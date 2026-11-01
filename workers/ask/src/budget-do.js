// One global Durable Object holds the month's spend. Durable Objects run one request at a time and
// the SQL API is synchronous, so reserve() is an atomic check-and-increment: concurrent questions
// cannot push the month past MONTHLY_BUDGET_USD. Stores only "YYYY-MM" -> micro-dollars; no visitor data.
import { DurableObject } from 'cloudflare:workers';
import { reserve, settle } from './budget.mjs';

export class AskBudget extends DurableObject {
	constructor(ctx, env) {
		super(ctx, env);
		const sql = ctx.storage.sql;
		sql.exec('CREATE TABLE IF NOT EXISTS spend (month TEXT PRIMARY KEY, micros INTEGER NOT NULL)');
		this.store = {
			get: (month) => sql.exec('SELECT micros FROM spend WHERE month = ?', month).toArray()[0]?.micros ?? 0,
			set: (month, micros) =>
				sql.exec('INSERT INTO spend (month, micros) VALUES (?, ?) ON CONFLICT(month) DO UPDATE SET micros = excluded.micros', month, micros),
		};
	}

	reserve(month, amount, limit) {
		return reserve(this.store, month, amount, limit);
	}

	settle(month, reserved, actual) {
		settle(this.store, month, reserved, actual);
	}
}
