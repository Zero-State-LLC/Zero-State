#!/usr/bin/env node
/* Deterministic static-site checks; intentionally dependency-free for reproducible Pages builds. */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const requiredPages = [
  'index.html', 'work.html', 'philosophy.html', 'about.html', 'contact.html',
  'privacy.html', 'terms.html', 'products/abraxas.html', 'products/waykin.html',
  'products/patchhive.html', 'products/surveillance-survivor.html', 'products/experiments.html'
];
const failures = [];
const fail = (file, message) => failures.push(`${file}: ${message}`);
const exists = (file) => fs.existsSync(path.join(root, file));
const htmlFiles = requiredPages.filter(exists);

for (const file of requiredPages) if (!exists(file)) fail(file, 'required page is missing');
for (const asset of ['assets/zero-state-mark.svg', 'assets/zero-state-mark-inverse.svg']) {
  if (!exists(asset)) fail(asset, 'required logo asset is missing');
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
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

if ((index.match(/identity-motion/g) || []).length < 1) fail('index.html', 'identity motion element is missing');
if (/class=["'][^"']*identity-base/.test(index)) fail('index.html', 'motion and logo must not use separately positioned SVG/image layers');
if (!/<svg[^>]*class=["'][^"']*identity-mark[^"']*identity-motion[^"']*["'][^>]*viewBox=["']0 0 1000 1000["']/.test(index)) {
  fail('index.html', 'logo mark and highway motion must share one authoritative SVG coordinate system');
}
if (!/data-logo-center-x=["']500["'][^>]*data-logo-center-y=["']500["'][^>]*data-split-angle=["']-45["']/.test(index)) {
  fail('index.html', 'authoritative zero center and split-angle metadata are missing');
}
if (!/class=["']highway-line["'][^>]*d=["']M -260 1260 L 1260 -260["']/.test(index)) {
  fail('index.html', 'highway path must cross the 1000×1000 logo viewBox through the zero center on the -45° split axis');
}
if (!/data-axis-center=["']500,500["']/.test(index)) fail('index.html', 'highway axis does not explicitly declare the zero center');
if ((index.match(/class=["']zero-ring-arc["']/g) || []).length !== 2) fail('index.html', 'split zero must contain exactly two governed ring arcs');
if (!/stroke-dasharray:\s*150\s+150/.test(css)) fail('styles.css', 'highway dash and gap are not equal');
if (!/@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.highway-line\s*\{\s*display:\s*none/.test(css)) fail('styles.css', 'reduced-motion does not hide the highway');
if (!/\.highway-line\.is-ready\s*\{\s*animation:\s*highway\s+4\.8s\s+linear\s+1\s+both/.test(css)) fail('styles.css', 'highway animation must be linear and one-pass');
if (!/Surveillance Survivor/.test(index)) fail('index.html', 'Surveillance Survivor is missing from selected work');
if (!/Active pre-alpha · simulator-ready vertical slice · not release-ready/.test(work)) fail('work.html', 'Surveillance Survivor readiness posture is missing or overstated');
if (!/iPhone-first satirical survivor roguelite/.test(surveillance)) fail('products/surveillance-survivor.html', 'canonical README description is missing');
if (!/scrimshawlife-ctrl\/Surveillance-Survivor/.test(surveillance)) fail('products/surveillance-survivor.html', 'canonical repository link is missing');
if (!/Effective date:/.test(fs.readFileSync(path.join(root, 'privacy.html'), 'utf8'))) fail('privacy.html', 'privacy notice has no effective date');
if (!/admin@lastreetshits\.com/.test(fs.readFileSync(path.join(root, 'privacy.html'), 'utf8'))) fail('privacy.html', 'privacy contact is missing');
if (!/Effective date:/.test(fs.readFileSync(path.join(root, 'terms.html'), 'utf8'))) fail('terms.html', 'terms have no effective date');
if (!/admin@lastreetshits\.com/.test(fs.readFileSync(path.join(root, 'terms.html'), 'utf8'))) fail('terms.html', 'terms contact is missing');
if (!/admin@lastreetshits\.com/.test(fs.readFileSync(path.join(root, 'contact.html'), 'utf8'))) fail('contact.html', 'operational contact is missing');

if (failures.length) {
  console.error(`Zero State validation failed (${failures.length}):`);
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}
console.log(`PASS: ${requiredPages.length} pages, internal links, metadata, accessibility smoke checks, product-source posture, and collinear identity-motion geometry validated.`);