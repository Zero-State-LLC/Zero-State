// Ask Zero State · chat widget. Loaded on every page by site.js.
// Streams answers from the zs-ask Worker (workers/ask/). Shows nothing until the Worker answers a
// health check, so the page never offers a chat it cannot serve. Model output is never inserted as
// HTML: renderRich() builds text nodes, <strong> and allow-listed links only.
(() => {
  const local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const ENDPOINT = local ? 'http://localhost:8787' : 'https://zs-ask.zer0state-noema.workers.dev';
  if (!window.fetch || !window.TextDecoder || !window.AbortController) return;

  const MAX_HISTORY = 16;   // must equal MAX_MESSAGES in workers/ask/src/index.js
  const MAX_CHARS = 1000;   // must equal MAX_CHARS in workers/ask/src/index.js
  const GREETING = 'Ask about Zero State, our products, client work, agent skills, or local AI deployments.';
  const SUGGESTIONS = ['What does Zero State do?', 'What is live right now?', 'Tell me about HexWire', 'Can you deploy AI on our hardware?'];
  const CUT_OFF = 'The answer was cut off. Please try again.';
  const UNAVAILABLE = 'The assistant is unavailable right now. You can email zer0state@zer0state.com.';
  const here = new URL(document.currentScript.src);
  const base = new URL('../../', here);   // site root, from assets/ask/ask.js

  const ICONS = {
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    send: '<svg class="zsa-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg><svg class="zsa-stop" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="2"/></svg>',
  };

  let history = [];
  let controller = null;
  let ui = null;

  fetch(ENDPOINT, { method: 'GET', mode: 'cors' })
    .then((r) => { if (r.ok) mount(); })
    .catch(() => {});

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'text') node.textContent = v;
      else if (k === 'icon') node.innerHTML = v;   // static icons only, never model output
      else node.setAttribute(k, v);
    }
    children.forEach((c) => node.appendChild(c));
    return node;
  }

  function mount() {
    const css = el('link', { rel: 'stylesheet', href: new URL('ask.css', here).href });
    document.head.appendChild(css);

    const launcher = el('button', { type: 'button', class: 'zsa-launcher', 'aria-haspopup': 'dialog', 'aria-expanded': 'false' }, [
      el('span', { class: 'zsa-dot', 'aria-hidden': 'true' }), el('span', { text: 'Ask Zero State' }),
    ]);
    const close = el('button', { type: 'button', class: 'zsa-close', 'aria-label': 'Close chat', icon: ICONS.close });
    const log = el('div', { class: 'zsa-log', role: 'log', 'aria-live': 'polite' });
    const suggest = el('div', { class: 'zsa-suggest' }, SUGGESTIONS.map((q) => el('button', { type: 'button', class: 'zsa-chip', text: q })));
    const input = el('textarea', { class: 'zsa-input', rows: '1', maxlength: String(MAX_CHARS), placeholder: 'Ask a question…', 'aria-label': 'Your question' });
    const send = el('button', { type: 'submit', class: 'zsa-send', 'aria-label': 'Send', icon: ICONS.send });
    const form = el('form', { class: 'zsa-form' }, [input, send]);
    const note = el('p', { class: 'zsa-note' });
    note.append('AI answers from this site’s content. Can be wrong. ');
    note.appendChild(el('a', { href: new URL('privacy.html', base).href, text: 'Privacy' }));
    const panel = el('section', { class: 'zsa-panel', role: 'dialog', 'aria-label': 'Ask Zero State', hidden: '' }, [
      el('header', { class: 'zsa-head' }, [el('h2', { class: 'zsa-title', text: 'Ask Zero State' }), close]),
      log, suggest, form, note,
    ]);
    document.body.append(launcher, panel);
    ui = { launcher, panel, log, suggest, input, send, form };

    addMessage('bot', GREETING);
    launcher.addEventListener('click', open);
    close.addEventListener('click', hide);
    panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); });
    suggest.addEventListener('click', (e) => { const chip = e.target.closest('.zsa-chip'); if (chip) ask(chip.textContent); });
    form.addEventListener('submit', (e) => { e.preventDefault(); controller ? controller.abort() : ask(input.value); });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); }
    });
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = `${input.scrollHeight}px`;
    });
  }

  function open() {
    ui.panel.hidden = false;
    ui.launcher.hidden = true;
    ui.launcher.setAttribute('aria-expanded', 'true');
    ui.input.focus();
  }

  function hide() {
    ui.panel.hidden = true;
    ui.launcher.hidden = false;
    ui.launcher.setAttribute('aria-expanded', 'false');
    ui.launcher.focus();
  }

  function addMessage(who, text) {
    const node = el('div', { class: `zsa-msg zsa-msg--${who}` });
    renderRich(node, text);
    ui.log.appendChild(node);
    ui.log.scrollTop = ui.log.scrollHeight;
    return node;
  }

  async function ask(raw) {
    const question = raw.trim().slice(0, MAX_CHARS);
    if (!question || controller) return;
    ui.suggest.hidden = true;
    ui.input.value = '';
    ui.input.style.height = 'auto';
    addMessage('user', question);
    history.push({ role: 'user', content: question });
    while (history.length > MAX_HISTORY) history = history.slice(2);   // drop the oldest question and answer

    const reply = addMessage('bot', '');
    reply.classList.add('zsa-msg--pending');
    controller = new AbortController();
    ui.send.setAttribute('data-busy', '');
    ui.send.setAttribute('aria-label', 'Stop');
    let answer = '';
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const body = await res.json().catch(() => ({}));
        throw new Error(res.status === 429 ? body.error : UNAVAILABLE);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        renderRich(reply, answer);
        ui.log.scrollTop = ui.log.scrollHeight;
      }
      if (!answer.trim()) throw new Error(UNAVAILABLE);
      history.push({ role: 'assistant', content: answer.slice(0, MAX_CHARS) });
    } catch (err) {
      const stopped = err.name === 'AbortError';
      if (answer.trim()) {
        history.push({ role: 'assistant', content: answer.slice(0, MAX_CHARS) });
        if (!stopped) addMessage('error', CUT_OFF);
      } else {
        history.pop();   // keep roles alternating for the next question
        reply.remove();
        addMessage('error', stopped ? 'Stopped.' : (err.message || UNAVAILABLE));
      }
    } finally {
      reply.classList.remove('zsa-msg--pending');
      controller = null;
      ui.send.removeAttribute('data-busy');
      ui.send.setAttribute('aria-label', 'Send');
    }
  }

  // **bold** | [label](url) | https://url | email. Everything else is a text node.
  const TOKEN = /\*\*([^*\n]+)\*\*|\[([^\]\n]+)\]\(([^)\s]+)\)|(https:\/\/[^\s<>()]*[^\s<>().,;:!?'"])|([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;
  function renderRich(node, text) {
    node.textContent = '';
    let last = 0;
    for (const m of text.matchAll(TOKEN)) {
      node.append(text.slice(last, m.index));
      if (m[1]) node.appendChild(el('strong', { text: m[1] }));
      else if (m[2]) node.appendChild(link(m[3], m[2]));
      else if (m[4]) node.appendChild(link(m[4], m[4].replace(/^https:\/\//, '')));
      else node.appendChild(link(`mailto:${m[5]}`, m[5]));
      last = m.index + m[0].length;
    }
    node.append(text.slice(last));
  }

  function link(href, label) {
    let url;
    try { url = new URL(href, base); } catch { return document.createTextNode(label); }
    if (!['https:', 'mailto:'].includes(url.protocol) && !local) return document.createTextNode(label);
    // On a local preview, keep zer0state.com links on the preview.
    if (local && url.hostname === 'zer0state.com') url = new URL(url.pathname + url.hash, base);
    const internal = url.origin === location.origin || url.hostname === 'zer0state.com';
    const a = el('a', { href: url.href, text: label });
    if (!internal && url.protocol !== 'mailto:') { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    return a;
  }
})();
