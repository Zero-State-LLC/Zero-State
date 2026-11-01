#!/usr/bin/env node
/*
 * Fixture checks for scripts/collaborators.js. Run by scripts/validate-site.js (npm test)
 * and directly with: node scripts/collaborators.test.js
 * The fixture is a clearly fictional example; it is never written to the site.
 */
const assert = require('node:assert/strict');
const path = require('node:path');
const { validate, render, escapeHtml, monogram, sortEntries, START, END } = require('./collaborators.js');

const root = path.resolve(__dirname, '..');
const EXAMPLE = {
  slug: 'example-collaborator',
  name: 'Example Collaborator',
  role: 'EXAMPLE ONLY - not a real person',
  bio: 'Fixture entry used by the collaborators tests. It is never published.',
  approved: '2026-01-01',
  links: [
    { type: 'website', url: 'https://example.com' },
    { type: 'github', url: 'https://github.com/example' },
    { type: 'other', label: 'Portfolio', url: 'https://example.org/work' }
  ],
  projects: [{ page: 'clients/zzthis.html', label: 'zzThis' }]
};
const withEntry = (patch) => ({ collaborators: [{ ...EXAMPLE, ...patch }] });

const cases = [
  ['empty list is valid and renders the empty state', () => {
    assert.deepEqual(validate({ collaborators: [] }, root), []);
    const html = render([]);
    assert.ok(html.startsWith(START) && html.endsWith(END));
    assert.match(html, /class="person-empty"/);
    assert.doesNotMatch(html, /class="person"/);
  }],
  ['example entry validates and renders a card with anchor, links and project', () => {
    assert.deepEqual(validate({ collaborators: [EXAMPLE] }, root), []);
    const html = render([EXAMPLE]);
    assert.match(html, /<li class="person" id="example-collaborator">/);
    assert.match(html, /<h3 class="person__name" id="example-collaborator-name">Example Collaborator<\/h3>/);
    assert.match(html, /<a href="clients\/zzthis\.html">zzThis<\/a>/);
    assert.match(html, /href="https:\/\/github\.com\/example" target="_blank" rel="noopener noreferrer"/);
    assert.match(html, />Portfolio<\/a>/);
    assert.match(html, /person__avatar--mono" aria-hidden="true">EC</);
    assert.doesNotMatch(html, /[^\x00-\x7f]/);
  }],
  ['non-ASCII and markup in data are escaped', () => {
    assert.equal(escapeHtml('Zo\u00eb <b>"x"</b> & \u00d8'), 'Zo&#xeb; &lt;b&gt;&quot;x&quot;&lt;/b&gt; &amp; &#xd8;');
    assert.equal(monogram('\u00c9mile Zola'), '\u00c9Z');
  }],
  ['required fields are enforced', () => {
    for (const key of ['slug', 'name', 'role', 'bio', 'approved']) {
      const entry = { ...EXAMPLE };
      delete entry[key];
      assert.ok(validate({ collaborators: [entry] }, root).length > 0, `missing ${key} should fail`);
    }
  }],
  ['unknown fields, duplicate slugs and HTML in text are rejected', () => {
    assert.ok(validate(withEntry({ quote: 'x' }), root).some((e) => /unknown field "quote"/.test(e)));
    assert.ok(validate({ collaborators: [EXAMPLE, EXAMPLE] }, root).some((e) => /duplicate slug/.test(e)));
    assert.ok(validate(withEntry({ bio: 'Hi <script>' }), root).some((e) => /bio/.test(e)));
  }],
  ['links must be https and on the right host', () => {
    assert.ok(validate(withEntry({ links: [{ type: 'website', url: 'http://example.com' }] }), root).length > 0);
    assert.ok(validate(withEntry({ links: [{ type: 'x', url: 'https://example.com/someone' }] }), root).length > 0);
    assert.ok(validate(withEntry({ links: [{ type: 'other', url: 'https://example.com' }] }), root).length > 0);
    assert.deepEqual(validate(withEntry({ links: [{ type: 'x', url: 'https://x.com/example' }, { type: 'linkedin', url: 'https://www.linkedin.com/in/example' }] }), root), []);
  }],
  ['projects must be official project pages', () => {
    assert.ok(validate(withEntry({ projects: [{ page: 'products/not-a-page.html', label: 'Nope' }] }), root).length > 0);
    assert.ok(validate(withEntry({ projects: [{ page: 'collaborators.html', label: 'Self' }] }), root).length > 0);
  }],
  ['photos must be local files with alt and size', () => {
    assert.ok(validate(withEntry({ photo: { src: 'https://example.com/a.jpg', alt: 'x', width: 400, height: 400 } }), root).length > 0);
    assert.ok(validate(withEntry({ photo: { src: 'assets/collaborators/missing-file.webp', alt: 'x', width: 400, height: 400 } }), root)
      .some((e) => /file is missing/.test(e)));
    assert.ok(validate(withEntry({ photo: { src: 'assets/collaborators/x.webp', width: 400, height: 400 } }), root).some((e) => /alt/.test(e)));
  }],
  ['pending approval renders locally but fails strict validation', () => {
    const data = withEntry({ approved: 'pending' });
    assert.ok(validate(data, root).some((e) => /awaiting approval/.test(e)));
    assert.deepEqual(validate(data, root, { allowPending: true }), []);
    assert.ok(validate(withEntry({ approved: 'soon' }), root, { allowPending: true }).length > 0);
  }],
  ['sort: featured first, then order, then name', () => {
    const list = [
      { ...EXAMPLE, slug: 'c', name: 'Charlie' },
      { ...EXAMPLE, slug: 'b', name: 'Bravo', order: 1 },
      { ...EXAMPLE, slug: 'a', name: 'Alpha' },
      { ...EXAMPLE, slug: 'z', name: 'Zulu', featured: true }
    ];
    assert.deepEqual(sortEntries(list).map((c) => c.slug), ['z', 'b', 'a', 'c']);
  }]
];

/** Returns a list of failure strings (empty when every case passes). */
function run() {
  const failures = [];
  for (const [name, fn] of cases) {
    try { fn(); } catch (error) { failures.push(`collaborators test "${name}": ${error.message}`); }
  }
  return failures;
}

module.exports = { run };
if (require.main === module) {
  const failures = run();
  failures.forEach((f) => console.error(`- ${f}`));
  if (failures.length) process.exit(1);
  console.log(`PASS: ${cases.length} collaborators checks.`);
}
