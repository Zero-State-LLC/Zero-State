import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const workflow = readFileSync(path.join(root, '.github/workflows/deploy-glm-chat.yml'), 'utf8');

test('the smoke probe uses the deployed workers.dev host', () => {
  assert.match(workflow, /https:\/\/glm-chat\.zer0state-noema\.workers\.dev\/v1\/chat\/completions/);
  assert.doesNotMatch(workflow, /https:\/\/glm-chat\.zer0state\.workers\.dev\//);
});
const page = readFileSync(path.join(root, 'chat/index.html'), 'utf8');

function workerFns() {
  const start = workflow.indexOf('const ROLES');
  const end = workflow.indexOf('\n          WORKER');
  assert.ok(start > 0 && end > start, 'worker validation functions are present in the deploy workflow');
  return vm.runInNewContext(`${workflow.slice(start, end)}\n;({ cleanMessages, boundedTokens })`);
}

const { cleanMessages, boundedTokens } = workerFns();

function message(role, content) {
  return { role, content, extra: 'dropped' };
}

test('cleanMessages keeps only role and content inside the published bounds', () => {
  const one = cleanMessages([message('user', 'hello')]);
  assert.equal(JSON.stringify(one), JSON.stringify([{ role: 'user', content: 'hello' }]));
  assert.equal(cleanMessages([message('system', 'a'), message('assistant', 'b')]).length, 2);
  assert.equal(cleanMessages([message('user', 'x'.repeat(16000))])[0].content.length, 16000);
  assert.equal(cleanMessages(Array.from({ length: 16 }, () => message('user', 'ok'))).length, 16);
});

test('cleanMessages rejects shapes that must not reach the GPU', () => {
  assert.equal(cleanMessages(null), null);
  assert.equal(cleanMessages([]), null);
  assert.equal(cleanMessages(Array.from({ length: 17 }, () => message('user', 'ok'))), null);
  assert.equal(cleanMessages([message('tool', 'ok')]), null);
  assert.equal(cleanMessages([{ role: 'user', content: ['not', 'a', 'string'] }]), null);
  assert.equal(cleanMessages([message('user', '')]), null);
  assert.equal(cleanMessages([message('user', 'x'.repeat(16001))]), null);
  assert.equal(cleanMessages([message('assistant', 'x'.repeat(16001))]), null);
});

test('boundedTokens accepts only integers from 1 through 4096', () => {
  assert.equal(boundedTokens(undefined), 2048);
  assert.equal(boundedTokens('2048'), 2048);
  assert.equal(boundedTokens('x'), 2048);
  assert.equal(boundedTokens(Number.NaN), 2048);
  assert.equal(boundedTokens(0), 2048);
  assert.equal(boundedTokens(-3), 2048);
  assert.equal(boundedTokens(1.5), 2048);
  assert.equal(boundedTokens(true), 2048);
  assert.equal(boundedTokens(1), 1);
  assert.equal(boundedTokens(5000), 4096);
});

test('the chat page cannot resend an oversized user or assistant transcript', () => {
  assert.match(page, /maxlength="16000"/);
  assert.match(page, /function fitContent\(content\)/);
  assert.match(page, /content\.slice\(0, MAX_CHARS\)/);
  assert.match(page, /history\.push\(\{ role: 'assistant', content: fitContent\(reply\) \}\)/);
  assert.match(page, /outboundMessages\(history\)/);
  assert.match(page, /history\.splice\(i, 1\)/);
  const start = page.indexOf('function fitContent');
  const end = page.indexOf('const $');
  const { fitContent, outboundMessages } = vm.runInNewContext(
    `const MAX_CHARS = 16000;\n${page.slice(start, end)}\n;({ fitContent, outboundMessages })`,
  );
  assert.equal(fitContent('x'.repeat(16001)).length, 16000);
  assert.equal(fitContent('ok'), 'ok');
  const sent = outboundMessages([
    { role: 'assistant', content: 'y'.repeat(18000), n: 4 },
    { role: 'user', content: 'next' },
  ]);
  assert.equal(JSON.stringify(sent), JSON.stringify([
    { role: 'assistant', content: 'y'.repeat(16000) },
    { role: 'user', content: 'next' },
  ]));
});
