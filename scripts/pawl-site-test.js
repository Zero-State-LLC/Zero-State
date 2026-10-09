#!/usr/bin/env node
/* JUnit bridge for Pawl: ratchet the site's canonical npm test as one stable suite. */
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');

const started = Date.now();
const result = spawnSync('npm', ['test'], { encoding: 'utf8' });
const seconds = ((Date.now() - started) / 1000).toFixed(3);
const output = `${result.stdout || ''}${result.stderr || ''}`;
const escapeXml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');
const failed = result.error || result.status !== 0;
const details = failed
  ? `<failure message="site validation failed">${escapeXml(result.error?.message || output)}</failure>`
  : '';
const report = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<testsuite name="Zero State site" tests="1" failures="${failed ? 1 : 0}" errors="0" skipped="0" time="${seconds}">` +
  `<testcase classname="site" name="npm test" time="${seconds}">${details}</testcase>` +
  `</testsuite>\n`;
fs.writeFileSync('pawl-test-results.xml', report, 'utf8');
if (result.error) process.stderr.write(`${result.error.message}\n`);
if (output) process.stdout.write(output);
process.exit(failed ? (result.status || 1) : 0);
