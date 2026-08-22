#!/usr/bin/env node
/* Deterministic static-site checks; intentionally dependency-free for reproducible Pages builds. */
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const APEX = 'https://zer0state.com';
const requiredPages = [
  'index.html', 'work.html', 'philosophy.html', 'about.html', 'contact.html',
  'privacy.html', 'terms.html', 'marketing.html',
  'products/waykin.html', 'products/patchhive.html', 'products/psyfi.html',
  'products/surveillance-survivor.html', 'products/hexwire.html',
  'products/hollersports.html', 'products/marigold-market.html', 'products/slosh.html',
  'clients/autogive.html',
  'skills/orchestra.html', 'skills/hyperlex.html', 'skills/kubrick.html', 'skills/neon-genie.html'
];

function officialPageFile(entry) {
  if (entry === 'index' || entry === 'index.html') return 'index.html';
  return entry.endsWith('.html') ? entry : `${entry}.html`;
}

function officialPageLoc(file) {
  return file === 'index.html' ? `${APEX}/` : `${APEX}/${file}`;
}

function lastmodFor(file) {
  try {
    const date = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : '';
  } catch {
    return '';
  }
}

function sitemapMeta(file) {
  if (file === 'index.html') return { changefreq: 'weekly', priority: '1.0' };
  if (file === 'privacy.html' || file === 'terms.html') return { changefreq: 'yearly', priority: '0.4' };
  if (file === 'work.html' || file === 'marketing.html') return { changefreq: 'monthly', priority: '0.8' };
  if (file.startsWith('products/') || file.startsWith('skills/') || file.startsWith('clients/')) {
    return { changefreq: 'monthly', priority: '0.6' };
  }
  return { changefreq: 'monthly', priority: '0.7' };
}

function writeSitemap(files) {
  const urls = files.map((file) => {
    const loc = officialPageLoc(file);
    const lastmod = lastmodFor(file);
    const { changefreq, priority } = sitemapMeta(file);
    const lastmodXml = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
    return `  <url>\n    <loc>${loc}</loc>${lastmodXml}\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
  fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);
}

const requiredHeroes = [
  'assets/products/waykin-hero.png',
  'assets/products/patchhive-hero.jpg',
  'assets/products/psyfi-hero.jpg',
  'assets/products/surveillance-survivor-hero.png',
  'assets/products/hexwire-hero.png',
  'assets/products/hollersports-hero.jpg',
  'assets/products/marigold-hero.jpg',
  'assets/products/slosh-hero.gif',
  'assets/skills/orchestra-hero.jpg',
  'assets/skills/hyperlex-hero.jpg',
  'assets/skills/kubrick-hero.jpg',
  'assets/skills/neon-genie-hero.jpg',
  'assets/clients/autogive-hero.png'
];
const failures = [];
const fail = (file, message) => failures.push(`${file}: ${message}`);
const exists = (file) => fs.existsSync(path.join(root, file));
const htmlFiles = requiredPages.filter(exists);

for (const file of requiredPages) if (!exists(file)) fail(file, 'required page is missing');
for (const asset of ['assets/zero-state-mark.svg', 'assets/zero-state-mark-inverse.svg', ...requiredHeroes]) {
  if (!exists(asset)) fail(asset, 'required asset is missing');
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  for (const token of ['<!doctype html>', '<html lang="en">', '<title>', 'name="description"', '<main id="main"', 'Skip to content']) {
    if (!html.toLowerCase().includes(token.toLowerCase())) fail(file, `missing required document feature: ${token}`);
  }
  if (/<a\b[^>]*\bhref=["'](?:#|)["']/i.test(html)) fail(file, 'contains an empty or # link');
  if (/(?:href|src)=["']\//i.test(html)) fail(file, 'contains a root-absolute path that breaks project Pages');

  const links = [...html.matchAll(/(?:href|src)=["']([^"'#?]+)["']/gi)].map((match) => match[1]);
  for (const link of links) {
    if (/^(?:https?:|mailto:|tel:|data:)/i.test(link)) continue;
    const target = path.normalize(path.join(path.dirname(file), link));
    if (!exists(target)) fail(file, `broken internal reference: ${link}`);
  }
}

const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const work = fs.readFileSync(path.join(root, 'work.html'), 'utf8');
const surveillance = fs.readFileSync(path.join(root, 'products/surveillance-survivor.html'), 'utf8');
const patchhive = fs.readFileSync(path.join(root, 'products/patchhive.html'), 'utf8');
const waykin = fs.readFileSync(path.join(root, 'products/waykin.html'), 'utf8');
const psyfi = fs.readFileSync(path.join(root, 'products/psyfi.html'), 'utf8');
const hollersports = fs.readFileSync(path.join(root, 'products/hollersports.html'), 'utf8');
const marigold = fs.readFileSync(path.join(root, 'products/marigold-market.html'), 'utf8');
const hexwire = fs.readFileSync(path.join(root, 'products/hexwire.html'), 'utf8');
const slosh = fs.readFileSync(path.join(root, 'products/slosh.html'), 'utf8');
const cssDark = fs.readFileSync(path.join(root, 'styles-dark.css'), 'utf8');

// Official dark home — primary identity logo + social preview
if (!/aperture-mark/.test(index)) fail('index.html', 'primary identity aperture mark is missing');
if (!/zero_state_logo/.test(index)) fail('index.html', 'Zero State logo asset is missing from home');
if (!/Opportunity begins at zero/i.test(index)) fail('index.html', 'logo tagline alt text must say Opportunity begins at zero');
if (!/og:image/.test(index) || !/assets\/og-image\.png/.test(index)) fail('index.html', 'Open Graph social preview image is missing');
if (!/twitter:card/.test(index)) fail('index.html', 'Twitter card meta is missing');
if (!exists('assets/og-image.png')) fail('assets/og-image.png', 'social preview image file is missing');
if (!exists('styles-dark.css')) fail('styles-dark.css', 'official dark home stylesheet is missing');
if (!/hero-grid/.test(index)) fail('index.html', 'landing field grid is missing');

// Org portfolio completeness
for (const name of ['Waykin', 'PatchHive', 'PsyFi', 'Surveillance Survivor', 'HexWire', 'Hollersports', 'Marigold Market', 'Slosh']) {
  if (!index.includes(name)) fail('index.html', `${name} is missing from selected work`);
  if (!work.includes(name)) fail('work.html', `${name} is missing from portfolio`);
}
if (!/assets\/products\/waykin-hero\.png/.test(work)) fail('work.html', 'Waykin README hero image is missing');
if (!/assets\/products\/patchhive-hero\.jpg/.test(work)) fail('work.html', 'PatchHive README hero image is missing');
if (!/assets\/products\/psyfi-hero\.jpg/.test(work)) fail('work.html', 'PsyFi README hero image is missing');
if (!/assets\/products\/surveillance-survivor-hero\.png/.test(work)) fail('work.html', 'Surveillance Survivor README hero image is missing');
if (!/assets\/products\/hexwire-hero\.png/.test(work)) fail('work.html', 'HexWire hero image is missing');
if (!/assets\/products\/hollersports-hero\.jpg/.test(work)) fail('work.html', 'Hollersports hero image is missing');
if (!/assets\/products\/marigold-hero\.jpg/.test(work)) fail('work.html', 'Marigold Market hero image is missing');
if (!/assets\/products\/slosh-hero\.gif/.test(work)) fail('work.html', 'Slosh hero image is missing');

if (!/Active pre-alpha · simulator-ready · not release-ready/.test(work) && !/Active pre-alpha · simulator-ready vertical slice · not release-ready/.test(work)) {
  fail('work.html', 'Surveillance Survivor readiness posture is missing or overstated');
}
if (!/Stabilized vertical slice · CI-verified · device and App Store release gates remain/.test(work)) {
  fail('work.html', 'HexWire readiness posture is missing or overstated');
}
if (!/iPhone-first satirical survivor roguelite/.test(surveillance)) fail('products/surveillance-survivor.html', 'canonical README description is missing');
if (!/tactical cyberpunk hex-grid RPG/.test(hexwire)) fail('products/hexwire.html', 'canonical HexWire README description is missing');
if (!/Signal → Power → Trace → Escalation → Lay Low → Tempo Tradeoff/.test(hexwire)) fail('products/hexwire.html', 'canonical HexWire pressure loop is missing');
if (!/not medical advice/.test(psyfi)) fail('products/psyfi.html', 'PsyFi research-only disclaimer is missing');
if (!/Eurorack rig-intelligence/.test(patchhive)) fail('products/patchhive.html', 'PatchHive canonical product description is missing');
if (!/fifteen living water modes/i.test(slosh)) fail('products/slosh.html', 'Slosh water-mode description is missing');
if (!/watchOS \+ iOS/.test(slosh)) fail('products/slosh.html', 'Slosh platform posture is missing');
for (const [name, html] of [
  ['products/waykin.html', waykin], ['products/patchhive.html', patchhive],
  ['products/psyfi.html', psyfi], ['products/surveillance-survivor.html', surveillance],
  ['products/hexwire.html', hexwire], ['products/hollersports.html', hollersports],
  ['products/marigold-market.html', marigold], ['products/slosh.html', slosh]
]) {
  if (/<a\b[^>]*href=["'][^"']*(?:github\.com|gitlab\.com|bitbucket\.org)[^"']*["']/i.test(html)) {
    fail(name, 'product page exposes a codebase link');
  }
}

// Hermes / OpenClaw skills section
for (const name of ['Abraxas Orchestra', 'Hyperlex', 'Kubrick', 'Neon Genie']) {
  if (!index.includes(name)) fail('index.html', `${name} is missing from skills evidence`);
  if (!work.includes(name)) fail('work.html', `${name} is missing from skills portfolio`);
}
if (!/id=["']skills["']/.test(work)) fail('work.html', 'skills section anchor is missing');
if (!/id=["']clients["']/.test(work)) fail('work.html', 'clients section anchor is missing');
if (!/id=["']clients["']/.test(index)) fail('index.html', 'clients evidence block is missing');
if (!/Autogive\.app/.test(work)) fail('work.html', 'Autogive.app client card is missing');
if (!/Autogive\.app/.test(index)) fail('index.html', 'Autogive.app client row is missing');
if (!/assets\/clients\/autogive-hero\.png/.test(work)) fail('work.html', 'Autogive homepage screenshot is missing');
if (!/clients\/autogive\.html/.test(work)) fail('work.html', 'Autogive client card must open the parent-brand client page');
if (!/assets\/clients\/autogive-hero\.png/.test(index)) fail('index.html', 'Autogive homepage screenshot thumb is missing');
const autogive = fs.readFileSync(path.join(root, 'clients/autogive.html'), 'utf8');
if (!/https:\/\/autogive\.app/.test(autogive)) fail('clients/autogive.html', 'primary Autogive.app destination is missing');
if (!/noopener noreferrer/.test(autogive)) fail('clients/autogive.html', 'external Autogive.app link must use rel="noopener noreferrer"');
if (!/not a Zero State product/i.test(autogive)) fail('clients/autogive.html', 'must state Autogive is not a Zero State product');
if (!/does not process donations/i.test(autogive)) fail('clients/autogive.html', 'must not imply Zero State or Autogive process donations');
if (!/deterministic fixture/i.test(autogive)) fail('clients/autogive.html', 'must keep demonstration-fixture posture from the live site');
if (/HIPAA|donate through Zero State|Stripe checkout/i.test(autogive + work + index)) {
  fail('clients/autogive.html', 'contains disallowed donation-processing or medical claims');
}
if (!/Hermes \/ OpenClaw/.test(work) && !/Hermes \/ OpenClaw/.test(index)) {
  fail('work.html', 'Hermes / OpenClaw skills section label is missing');
}
const orchestra = fs.readFileSync(path.join(root, 'skills/orchestra.html'), 'utf8');
const hyperlex = fs.readFileSync(path.join(root, 'skills/hyperlex.html'), 'utf8');
const kubrick = fs.readFileSync(path.join(root, 'skills/kubrick.html'), 'utf8');
const neon = fs.readFileSync(path.join(root, 'skills/neon-genie.html'), 'utf8');
if (!/Zero-State-LLC\/Abraxas-Orchestra/.test(orchestra)) fail('skills/orchestra.html', 'canonical repository link is missing');
if (!/Zero-State-LLC\/Hyperlex/.test(hyperlex)) fail('skills/hyperlex.html', 'canonical repository link is missing');
if (!/Zero-State-LLC\/Kubrick/.test(kubrick)) fail('skills/kubrick.html', 'canonical repository link is missing');
if (!/Zero-State-LLC\/NeonGenie/.test(neon)) fail('skills/neon-genie.html', 'canonical repository link is missing');
if (!/symbolic maps/.test(orchestra)) fail('skills/orchestra.html', 'Orchestra README description is missing');
if (!/cultural radar for slang|memetic/.test(hyperlex)) fail('skills/hyperlex.html', 'Hyperlex README description is missing');
if (!/cinematic/.test(kubrick)) fail('skills/kubrick.html', 'Kubrick README description is missing');
if (!/advisory only|fail closed|fail-closed/.test(neon)) fail('skills/neon-genie.html', 'Neon Genie README description is missing');

const privacy = fs.readFileSync(path.join(root, 'privacy.html'), 'utf8');
const marketing = fs.readFileSync(path.join(root, 'marketing.html'), 'utf8');
const contact = fs.readFileSync(path.join(root, 'contact.html'), 'utf8');
const about = fs.readFileSync(path.join(root, 'about.html'), 'utf8');

if (!/Effective date:/.test(privacy)) fail('privacy.html', 'privacy notice has no effective date');
if (!/zer0state@zer0state\.com/.test(privacy)) fail('privacy.html', 'privacy contact is missing');
if (!/Zero State LLC/.test(privacy)) fail('privacy.html', 'legal entity name is missing');
if (!/Children/i.test(privacy)) fail('privacy.html', 'children section is missing');
if (!/Your privacy rights/i.test(privacy)) fail('privacy.html', 'privacy rights section is missing');
if (!/Information we collect/i.test(privacy)) fail('privacy.html', 'collection section is missing');
if (!/Effective date:/.test(fs.readFileSync(path.join(root, 'terms.html'), 'utf8'))) fail('terms.html', 'terms have no effective date');
if (!/zer0state@zer0state\.com/.test(fs.readFileSync(path.join(root, 'terms.html'), 'utf8'))) fail('terms.html', 'terms contact is missing');
if (!/zer0state@zer0state\.com/.test(contact)) fail('contact.html', 'operational contact is missing');
if (!/support/i.test(contact)) fail('contact.html', 'support framing is missing');
if (!/Zero State LLC/.test(marketing)) fail('marketing.html', 'legal entity name is missing');
if (!/Marigold Market/.test(marketing) || !/Slosh/.test(marketing)) fail('marketing.html', 'product marketing cards are incomplete');
if (!/privacy\.html/.test(marketing)) fail('marketing.html', 'privacy link is missing');
if (!/contact\.html/.test(marketing)) fail('marketing.html', 'support link is missing');
if (!/Zero State LLC/.test(about)) fail('about.html', 'legal entity name is missing');
if (/San Diego/i.test(index)) fail('index.html', 'San Diego location copy must be removed');
if (!/zer0state@zer0state\.com/.test(index)) fail('index.html', 'home contact email is missing');

if (!exists('robots.txt')) fail('robots.txt', 'crawler instructions file is missing');
if (!exists('site-manifest.json')) fail('site-manifest.json', 'official page list is missing');
if (exists('robots.txt')) {
  const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
  if (!/^User-agent:\s*\*/m.test(robots)) fail('robots.txt', 'must allow crawlers with User-agent: *');
  if (!/^Sitemap:\s*https:\/\/zer0state\.com\/sitemap\.xml\s*$/m.test(robots)) {
    fail('robots.txt', 'must point Sitemap at https://zer0state.com/sitemap.xml');
  }
}

const officialFiles = [];
const officialSitemapLocs = [];
if (exists('site-manifest.json')) {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'site-manifest.json'), 'utf8'));
  if (/Squarespace|DNS cutover|canonical_domain_pending/i.test(JSON.stringify(manifest))) {
    fail('site-manifest.json', 'stale custom-domain / Squarespace pending note must be removed');
  }
  if (manifest.public_sources?.site !== `${APEX}/`) {
    fail('site-manifest.json', `public site must be ${APEX}/`);
  }
  const pages = Array.isArray(manifest.pages) ? manifest.pages : [];
  for (const entry of pages) {
    const file = officialPageFile(entry);
    if (/dark-landing|site-manifest/i.test(file)) {
      fail('site-manifest.json', `must not list non-official page: ${entry}`);
      continue;
    }
    officialFiles.push(file);
    officialSitemapLocs.push(officialPageLoc(file));
  }
  writeSitemap(officialFiles);
}

if (!exists('sitemap.xml')) fail('sitemap.xml', 'public sitemap is missing');
if (exists('sitemap.xml') && officialSitemapLocs.length) {
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  const locs = [...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((match) => match[1].trim());
  if (locs.length !== officialSitemapLocs.length) {
    fail('sitemap.xml', `must list exactly ${officialSitemapLocs.length} official unique HTML pages`);
  }
  for (const loc of officialSitemapLocs) {
    if (!locs.includes(loc)) fail('sitemap.xml', `missing official page: ${loc}`);
  }
  for (const loc of locs) {
    if (!officialSitemapLocs.includes(loc)) fail('sitemap.xml', `unexpected loc: ${loc}`);
    if (/index\.html|dark-landing|site-manifest|www\.zer0state|github\.io/i.test(loc)) {
      fail('sitemap.xml', `must not list duplicate or non-official URL: ${loc}`);
    }
  }
}

for (const file of officialFiles) {
  if (!exists(file)) {
    fail(file, 'official manifest page is missing');
    continue;
  }
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const loc = officialPageLoc(file);
  const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  if (!canonical) fail(file, `missing canonical for ${loc}`);
  else if (canonical[1] !== loc) fail(file, `canonical must be ${loc}`);
}

if (failures.length) {
  console.error(`Zero State validation failed (${failures.length}):`);
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}
console.log(`PASS: ${requiredPages.length} pages, sitemap/robots, product heroes, dark home, social preview, internal links, metadata, and product-source posture validated.`);
