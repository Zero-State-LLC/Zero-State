#!/usr/bin/env node
/*
 * Collaborators: data/collaborators.json -> the generated block in collaborators.html.
 *
 *   node scripts/collaborators.js          validate the data and rewrite the block
 *   node scripts/collaborators.js --check  validate and fail if the page is out of date
 *
 * Dependency-free and deterministic. The output is ASCII-only: every non-ASCII
 * character in the data is written as an HTML numeric entity.
 * Spec: docs/specs/collaborators.md
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const DATA_FILE = 'data/collaborators.json';
const PAGE_FILE = 'collaborators.html';
const START = '<!-- collaborators:start (generated from data/collaborators.json by scripts/collaborators.js; do not edit by hand) -->';
const END = '<!-- collaborators:end -->';

const LINK_TYPES = {
  website: { label: 'Website', hosts: null },
  x: { label: 'X', hosts: ['x.com', 'twitter.com'] },
  github: { label: 'GitHub', hosts: ['github.com'] },
  linkedin: { label: 'LinkedIn', hosts: ['linkedin.com'] },
  other: { label: null, hosts: null }
};
const ENTRY_KEYS = ['slug', 'name', 'role', 'bio', 'approved', 'photo', 'links', 'projects', 'featured', 'order'];
const PHOTO_KEYS = ['src', 'fallback', 'alt', 'width', 'height'];
const LINK_KEYS = ['type', 'url', 'label'];
const PROJECT_KEYS = ['page', 'label'];
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PHOTO_RE = /^assets\/collaborators\/[a-z0-9]+(?:-[a-z0-9]+)*\.(?:webp|jpg|jpeg|png|avif)$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isText = (v, max) => typeof v === 'string' && v.trim() === v && v.length > 0 && v.length <= max && !/[<>]/.test(v);

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/[^\x00-\x7f]/gu, (ch) => `&#x${ch.codePointAt(0).toString(16)};`);
}

function officialPages(root) {
  try {
    const manifest = JSON.parse(fs.readFileSync(path.join(root, 'site-manifest.json'), 'utf8'));
    return new Set((manifest.pages || []).map((p) => (p === 'index' ? 'index.html' : /\.html$/.test(p) ? p : `${p}.html`)));
  } catch {
    return new Set();
  }
}

function unknownKeys(obj, allowed, where, errors) {
  for (const key of Object.keys(obj)) if (!allowed.includes(key)) errors.push(`${where}: unknown field "${key}"`);
}

/**
 * Validate parsed data. Returns a list of error strings (empty when valid).
 * approved: "pending" marks a drafted profile awaiting approval. Only the local build
 * (allowPending) accepts it, so `npm test` and CI stay red until a real date is set.
 */
function validate(data, root = ROOT, { allowPending = false } = {}) {
  const errors = [];
  if (!isObj(data) || !Array.isArray(data.collaborators)) {
    return [`${DATA_FILE}: must be an object with a "collaborators" array`];
  }
  unknownKeys(data, ['$schema', 'collaborators'], DATA_FILE, errors);
  const pages = officialPages(root);
  const slugs = new Set();
  data.collaborators.forEach((c, i) => {
    const where = `${DATA_FILE} collaborators[${i}]${isObj(c) && typeof c.slug === 'string' ? ` (${c.slug})` : ''}`;
    if (!isObj(c)) { errors.push(`${where}: must be an object`); return; }
    unknownKeys(c, ENTRY_KEYS, where, errors);
    if (typeof c.slug !== 'string' || !SLUG_RE.test(c.slug) || c.slug.length > 60) errors.push(`${where}: slug must be lowercase-kebab-case, max 60 chars`);
    else if (slugs.has(c.slug)) errors.push(`${where}: duplicate slug`);
    else slugs.add(c.slug);
    if (!isText(c.name, 80)) errors.push(`${where}: name is required (1-80 chars, no < or >, no surrounding spaces)`);
    if (!isText(c.role, 120)) errors.push(`${where}: role is required (1-120 chars, no < or >)`);
    if (!isText(c.bio, 600)) errors.push(`${where}: bio is required (1-600 chars, plain text, no < or >)`);
    if (c.approved === 'pending') {
      if (!allowPending) errors.push(`${where}: awaiting approval (approved is "pending"); set the YYYY-MM-DD approval date before merge`);
    } else if (typeof c.approved !== 'string' || !DATE_RE.test(c.approved) || Number.isNaN(Date.parse(c.approved))) {
      errors.push(`${where}: approved must be the YYYY-MM-DD date the profile was approved for publication`);
    }
    if (c.featured !== undefined && typeof c.featured !== 'boolean') errors.push(`${where}: featured must be true or false`);
    if (c.order !== undefined && !Number.isInteger(c.order)) errors.push(`${where}: order must be an integer`);

    if (c.photo !== undefined) {
      const p = c.photo;
      if (!isObj(p)) errors.push(`${where}: photo must be an object`);
      else {
        unknownKeys(p, PHOTO_KEYS, `${where} photo`, errors);
        for (const key of ['src', 'fallback']) {
          if (key === 'fallback' && p.fallback === undefined) continue;
          if (typeof p[key] !== 'string' || !PHOTO_RE.test(p[key])) errors.push(`${where}: photo.${key} must be a local file under assets/collaborators/ (no remote images)`);
          else if (!fs.existsSync(path.join(root, p[key]))) errors.push(`${where}: photo.${key} file is missing: ${p[key]}`);
        }
        if (!isText(p.alt, 200)) errors.push(`${where}: photo.alt is required (1-200 chars)`);
        for (const key of ['width', 'height']) {
          if (!Number.isInteger(p[key]) || p[key] < 64 || p[key] > 1200) errors.push(`${where}: photo.${key} must be an integer pixel size 64-1200`);
        }
      }
    }

    if (c.links !== undefined) {
      if (!Array.isArray(c.links)) errors.push(`${where}: links must be an array`);
      else c.links.forEach((l, j) => {
        const lw = `${where} links[${j}]`;
        if (!isObj(l)) { errors.push(`${lw}: must be an object`); return; }
        unknownKeys(l, LINK_KEYS, lw, errors);
        const type = LINK_TYPES[l.type];
        if (!type) { errors.push(`${lw}: type must be one of ${Object.keys(LINK_TYPES).join(', ')}`); return; }
        let url = null;
        try { url = new URL(l.url); } catch { /* reported below */ }
        if (!url || url.protocol !== 'https:' || typeof l.url !== 'string' || /["'<>\s]/.test(l.url)) {
          errors.push(`${lw}: url must be an absolute https URL`);
        } else if (type.hosts) {
          const host = url.hostname.replace(/^www\./, '');
          if (!type.hosts.includes(host)) errors.push(`${lw}: ${l.type} url must be on ${type.hosts.join(' or ')}`);
        }
        if (l.type === 'other' && !isText(l.label, 40)) errors.push(`${lw}: label is required for type "other" (1-40 chars)`);
        if (l.type !== 'other' && l.label !== undefined) errors.push(`${lw}: label is only used with type "other"`);
      });
    }

    if (c.projects !== undefined) {
      if (!Array.isArray(c.projects)) errors.push(`${where}: projects must be an array`);
      else c.projects.forEach((p, j) => {
        const pw = `${where} projects[${j}]`;
        if (!isObj(p)) { errors.push(`${pw}: must be an object`); return; }
        unknownKeys(p, PROJECT_KEYS, pw, errors);
        if (typeof p.page !== 'string' || !pages.has(p.page) || p.page === PAGE_FILE) {
          errors.push(`${pw}: page must be an existing official project page listed in site-manifest.json (e.g. clients/zzthis.html)`);
        }
        if (!isText(p.label, 60)) errors.push(`${pw}: label is required (1-60 chars)`);
      });
    }
  });
  return errors;
}

function sortEntries(list) {
  return [...list].sort((a, b) =>
    (b.featured === true) - (a.featured === true) ||
    (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER) ||
    a.name.localeCompare(b.name, 'en') ||
    a.slug.localeCompare(b.slug, 'en'));
}

function monogram(name) {
  const words = name.split(/\s+/).filter(Boolean);
  const first = [...words[0]][0] || '';
  const last = words.length > 1 ? [...words[words.length - 1]][0] : '';
  return (first + last).toUpperCase();
}

function renderAvatar(c) {
  if (!c.photo) {
    return `<span class="person__avatar person__avatar--mono" aria-hidden="true">${escapeHtml(monogram(c.name))}</span>`;
  }
  const p = c.photo;
  const img = `<img src="${escapeHtml(p.fallback || p.src)}" alt="${escapeHtml(p.alt)}" width="${p.width}" height="${p.height}" loading="lazy" decoding="async">`;
  if (p.fallback) {
    const type = p.src.endsWith('.webp') ? 'image/webp' : p.src.endsWith('.avif') ? 'image/avif' : '';
    const typeAttr = type ? ` type="${type}"` : '';
    return `<span class="person__avatar"><picture><source srcset="${escapeHtml(p.src)}"${typeAttr}>${img}</picture></span>`;
  }
  return `<span class="person__avatar">${img}</span>`;
}

function renderEntry(c) {
  const id = escapeHtml(c.slug);
  const name = escapeHtml(c.name);
  const parts = [
    `<li class="person" id="${id}">`,
    `<article class="person__card" aria-labelledby="${id}-name">`,
    renderAvatar(c),
    '<div class="person__text">',
    `<p class="person__role">${escapeHtml(c.role)}</p>`,
    `<h3 class="person__name" id="${id}-name">${name}</h3>`,
    `<p class="person__bio">${escapeHtml(c.bio)}</p>`
  ];
  if (c.projects && c.projects.length) {
    const items = c.projects.map((p) => `<li><a href="${escapeHtml(p.page)}">${escapeHtml(p.label)}</a></li>`).join('');
    parts.push(`<div class="person__projects"><p class="person__label" id="${id}-projects">Works on</p><ul role="list" aria-labelledby="${id}-projects">${items}</ul></div>`);
  }
  if (c.links && c.links.length) {
    const items = c.links.map((l) => {
      const label = l.type === 'other' ? l.label : LINK_TYPES[l.type].label;
      return `<li><a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(`${c.name} - ${label} (opens in a new tab)`)}">${escapeHtml(label)}</a></li>`;
    }).join('');
    parts.push(`<ul class="person__links" role="list" aria-label="${escapeHtml(`${c.name} elsewhere`)}">${items}</ul>`);
  }
  parts.push('</div>', '</article>', '</li>');
  return parts.join('');
}

const EMPTY_STATE = [
  '<div class="person-empty">',
  '<p class="person-empty__title">Profiles are on the way.</p>',
  '<p>Collaborator profiles appear here once each person has approved theirs. Until then, the work itself is on the <a href="work.html">portfolio</a>.</p>',
  '</div>'
].join('');

/** Render the generated block (markers included) for a validated list. */
function render(list) {
  const entries = sortEntries(list);
  const body = entries.length
    ? `<ul class="cat__list person-list" role="list">\n${entries.map(renderEntry).join('\n')}\n</ul>`
    : EMPTY_STATE;
  return `${START}\n${body}\n${END}`;
}

function replaceBlock(html, block) {
  const start = html.indexOf(START);
  const end = html.indexOf(END);
  if (start === -1 || end === -1 || end < start) return null;
  return html.slice(0, start) + block + html.slice(end + END.length);
}

function load(root) {
  const raw = fs.readFileSync(path.join(root, DATA_FILE), 'utf8');
  return JSON.parse(raw);
}

/** Validate data and page sync for the site validator. Returns error strings. */
function verify(root = ROOT) {
  let data;
  try { data = load(root); } catch (error) { return [`${DATA_FILE}: cannot read or parse (${error.message})`]; }
  const errors = validate(data, root);
  if (errors.length) return errors;
  const pageFile = path.join(root, PAGE_FILE);
  if (!fs.existsSync(pageFile)) return [`${PAGE_FILE}: page is missing`];
  const html = fs.readFileSync(pageFile, 'utf8');
  const next = replaceBlock(html, render(data.collaborators));
  if (next === null) return [`${PAGE_FILE}: generated-block markers are missing`];
  if (next !== html) return [`${PAGE_FILE}: out of date with ${DATA_FILE}; run npm run build:collaborators`];
  if (/[^\x00-\x7f]/.test(next)) return [`${PAGE_FILE}: must be ASCII-only (use HTML entities)`];
  return [];
}

function main(argv) {
  const check = argv.includes('--check');
  if (check) {
    const errors = verify(ROOT);
    if (errors.length) { errors.forEach((e) => console.error(`- ${e}`)); process.exit(1); }
    console.log('PASS: collaborators data valid and page in sync.');
    return;
  }
  const data = load(ROOT);
  const errors = validate(data, ROOT, { allowPending: true });
  if (errors.length) { errors.forEach((e) => console.error(`- ${e}`)); process.exit(1); }
  const pageFile = path.join(ROOT, PAGE_FILE);
  const html = fs.readFileSync(pageFile, 'utf8');
  const next = replaceBlock(html, render(data.collaborators));
  if (next === null) { console.error(`- ${PAGE_FILE}: generated-block markers are missing`); process.exit(1); }
  if (next !== html) fs.writeFileSync(pageFile, next);
  console.log(`Wrote ${PAGE_FILE}: ${data.collaborators.length} collaborator(s).`);
  const pending = data.collaborators.filter((c) => c.approved === 'pending').map((c) => c.slug);
  if (pending.length) console.warn(`WARNING: awaiting approval, npm test will fail until approved: ${pending.join(', ')}`);
}

module.exports = { validate, render, verify, escapeHtml, monogram, sortEntries, START, END };
if (require.main === module) main(process.argv.slice(2));
