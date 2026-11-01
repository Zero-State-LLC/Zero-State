// Unit tests for per-visitor keys (workers/ask/src/visitor.mjs). Run: node --test workers/ask/test/visitor.test.mjs (also run by scripts/validate-site.js)
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parseIpv6, visitorKey } from '../src/visitor.mjs';

test('IPv4 is keyed by the full address', () => {
	assert.equal(visitorKey('104.28.205.143'), 'v4:104.28.205.143');
	assert.notEqual(visitorKey('104.28.205.143'), visitorKey('104.28.205.144'));
	assert.equal(visitorKey(' 10.0.0.1 '), 'v4:10.0.0.1');
});

test('IPv6 is keyed by the /64, so rotating the interface ID does not help', () => {
	const a = visitorKey('2a09:bac1:76a0:7d8::77:5b');
	assert.equal(a, 'v6:2a09:bac1:76a0:07d8');
	assert.equal(visitorKey('2a09:bac1:76a0:07d8:ffff:1:2:3'), a);
	assert.equal(visitorKey('2A09:BAC1:76A0:7D8:0:0:0:1'), a);            // case and zero padding
	assert.equal(visitorKey('[2a09:bac1:76a0:7d8::1]'), a);               // brackets
	assert.equal(visitorKey('fe80::1%eth0'), 'v6:fe80:0000:0000:0000');   // zone ID dropped
	assert.notEqual(visitorKey('2a09:bac1:76a0:7d9::1'), a);              // neighbouring /64 is a different visitor
	assert.equal(visitorKey('2001:db8::'), 'v6:2001:0db8:0000:0000');
	assert.equal(visitorKey('::1'), 'v6:0000:0000:0000:0000');
	assert.equal(visitorKey('1::2:3:4:5:6:7'), 'v6:0001:0000:0002:0003');
});

test('IPv4-mapped IPv6 is the IPv4 address it carries, in either notation', () => {
	for (const ip of ['::ffff:1.2.3.4', '::FFFF:1.2.3.4', '::ffff:102:304', '::ffff:0102:0304', '0:0:0:0:0:ffff:1.2.3.4']) {
		assert.equal(visitorKey(ip), 'v4:1.2.3.4', ip);
	}
	assert.notEqual(visitorKey('::ffff:1.2.3.5'), visitorKey('::ffff:1.2.3.4'));   // not collapsed into ::/64
	// Other embedded-IPv4 forms (NAT64, IPv4-compatible) are ordinary IPv6.
	assert.equal(visitorKey('64:ff9b::1.2.3.4'), 'v6:0064:ff9b:0000:0000');
	assert.equal(visitorKey('::1.2.3.4'), 'v6:0000:0000:0000:0000');
});

test('anything unparseable is still limited, under its own key', () => {
	assert.equal(visitorKey(null), 'other:unknown');
	assert.equal(visitorKey(''), 'other:unknown');
	assert.equal(visitorKey('256.1.1.1'), 'other:256.1.1.1');
	for (const bad of ['1:2:3:4:5:6:7:8:9', '1::2::3', '1:::2', ':1:2:3:4:5:6:7', '1:2:3:4:5:6:7:', '::ffff:256.1.1.1', '12345::', 'g::1']) {
		assert.equal(parseIpv6(bad), null, bad);
		assert.match(visitorKey(bad), /^other:/);
	}
	assert.deepEqual(parseIpv6('1:2:3:4:5:6:7:8'), [1, 2, 3, 4, 5, 6, 7, 8]);
});

test('the Worker hashes the visitor key and never stores the raw address', () => {
	const src = readFileSync(new URL('../src/index.js', import.meta.url), 'utf8');
	assert.match(src, /ip = await hashKey\(visitorKey\(request\.headers\.get\('CF-Connecting-IP'\)\)\);/);
	assert.match(src, /crypto\.subtle\.digest\('SHA-256'/);
});
