// Ask Zero State - which "visitor" a request belongs to, for the per-visitor limits. Pure logic,
// unit-tested with plain Node (workers/ask/test/visitor.test.mjs).
//
// IPv4: the full address. IPv6: the /64 prefix, because one household, phone or server usually
// holds a whole /64 and can rotate addresses inside it freely. IPv4-mapped IPv6 (::ffff:a.b.c.d,
// either notation) is treated as the IPv4 address it carries. The key is hashed before it reaches
// the Durable Object (index.js), so no raw address is ever stored.

const IPV4 = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

// Parses an IPv6 address into 8 16-bit numbers, or returns null if it is not valid IPv6.
export function parseIpv6(text) {
	let s = text;
	const dotted = s.match(/^(.*:)(\d+\.\d+\.\d+\.\d+)$/);   // embedded IPv4 in the last 32 bits
	if (dotted) {
		if (!IPV4.test(dotted[2])) return null;
		const [a, b, c, d] = dotted[2].split('.').map(Number);
		s = `${dotted[1]}${((a << 8) | b).toString(16)}:${((c << 8) | d).toString(16)}`;
	}
	const halves = s.split('::');
	if (halves.length > 2) return null;
	const part = (h) => (h === '' ? [] : h.split(':'));
	const head = part(halves[0]);
	const rest = halves.length === 2 ? part(halves[1]) : [];
	if (halves.length === 2 && head.length + rest.length > 7) return null;
	const groups = halves.length === 2 ? [...head, ...Array(8 - head.length - rest.length).fill('0'), ...rest] : head;
	if (groups.length !== 8 || !groups.every((g) => /^[0-9a-f]{1,4}$/i.test(g))) return null;
	return groups.map((g) => parseInt(g, 16));
}

// Returns the per-visitor key for a CF-Connecting-IP value: "v4:a.b.c.d", "v6:xxxx:xxxx:xxxx:xxxx"
// (the /64), or "other:<text>" for anything unparseable (still limited, just not grouped).
export function visitorKey(raw) {
	const ip = String(raw ?? '').trim().replace(/^\[|\]$/g, '').replace(/%.*$/, '').toLowerCase();
	if (IPV4.test(ip)) return `v4:${ip}`;
	const g = ip.includes(':') ? parseIpv6(ip) : null;
	if (!g) return `other:${ip || 'unknown'}`;
	if (g.slice(0, 5).every((x) => x === 0) && g[5] === 0xffff) {   // ::ffff:0:0/96, IPv4-mapped
		return `v4:${g[6] >> 8}.${g[6] & 255}.${g[7] >> 8}.${g[7] & 255}`;
	}
	return `v6:${g.slice(0, 4).map((x) => x.toString(16).padStart(4, '0')).join(':')}`;
}
