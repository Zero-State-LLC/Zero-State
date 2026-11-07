// One global Durable Object is the single gate before every model call. Durable Objects run one
// request at a time and the SQL API is synchronous, so admit() is an atomic check-and-increment:
// concurrent questions cannot exceed a visitor's per-minute or daily limits, the site-wide limits,
// or the month's budget. Visitor data: only a SHA-256 hash of the visitor key (IPv4 address or IPv6
// /64, never the IP), with minute hits deleted after 60 s and daily rows deleted when the UTC day
// changes. Site-wide counts use the same tables under the key '*site*' (see budget.mjs).
import { DurableObject } from 'cloudflare:workers';
import { admit, dayKey, monthKey, reserve, settle } from './budget.mjs';

export class AskBudget extends DurableObject {
	constructor(ctx, env) {
		super(ctx, env);
		const sql = ctx.storage.sql;
		sql.exec('CREATE TABLE IF NOT EXISTS spend (month TEXT PRIMARY KEY, micros INTEGER NOT NULL)');
		sql.exec('CREATE TABLE IF NOT EXISTS hits (ip TEXT NOT NULL, ts INTEGER NOT NULL)');
		sql.exec('CREATE INDEX IF NOT EXISTS hits_ip_ts ON hits (ip, ts)');
		sql.exec('CREATE TABLE IF NOT EXISTS ipday (ip TEXT NOT NULL, day TEXT NOT NULL, n INTEGER NOT NULL, micros INTEGER NOT NULL, PRIMARY KEY (ip, day))');
		this.store = {
			get: (month) => sql.exec('SELECT micros FROM spend WHERE month = ?', month).toArray()[0]?.micros ?? 0,
			set: (month, micros) =>
				sql.exec('INSERT INTO spend (month, micros) VALUES (?, ?) ON CONFLICT(month) DO UPDATE SET micros = excluded.micros', month, micros),
			hits: (ip, since) => sql.exec('SELECT ts FROM hits WHERE ip = ? AND ts > ? ORDER BY ts', ip, since).toArray().map((r) => r.ts),
			addHit: (ip, ts) => sql.exec('INSERT INTO hits (ip, ts) VALUES (?, ?)', ip, ts),
			ipDay: (ip, day) => sql.exec('SELECT n, micros FROM ipday WHERE ip = ? AND day = ?', ip, day).toArray()[0] ?? { n: 0, micros: 0 },
			setIpDay: (ip, day, n, micros) =>
				sql.exec('INSERT INTO ipday (ip, day, n, micros) VALUES (?, ?, ?, ?) ON CONFLICT(ip, day) DO UPDATE SET n = excluded.n, micros = excluded.micros', ip, day, n, micros),
			prune: (now, day) => {
				sql.exec('DELETE FROM hits WHERE ts <= ?', now - 60_000);
				sql.exec('DELETE FROM ipday WHERE day < ?', day);   // ISO dates sort as strings; never drops today
			},
		};
	}

	// Time, month and day come from the Durable Object's own clock at admission, never from the caller,
	// so out-of-order or delayed requests cannot count against (or prune) the wrong day. The month and
	// day used are returned so the Worker settles against the same rows.
	admit(request) {
		const date = new Date();
		const at = { now: date.getTime(), month: monthKey(date), day: dayKey(date) };
		return { ...admit(this.store, { ...request, ...at }), month: at.month, day: at.day };
	}

	settle(month, reserved, actual, ip, day) {
		settle(this.store, month, reserved, actual, ip, day);
	}

	// Legacy monthly-only reservation (kept so a Worker version from before this change keeps working
	// during a rollout).
	reserve(month, amount, limit) {
		return reserve(this.store, month, amount, limit);
	}
}
