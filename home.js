// Zero State · home — orbital map readout and the principles static (shared chrome lives in site.js).
(() => {
  // Centre the static's clear zone on the mark, at every size.
  const principles = document.querySelector('[data-principles]');
  const staticLayer = principles?.querySelector('.principles__static');
  const mark = principles?.querySelector('.principles__mark');
  if (principles && staticLayer && mark) {
    const place = () => {
      const s = principles.getBoundingClientRect();
      const m = mark.getBoundingClientRect();
      staticLayer.style.setProperty('--clear-x', `${((m.left + m.width / 2 - s.left) / s.width) * 100}%`);
      staticLayer.style.setProperty('--clear-y', `${((m.top + m.height / 2 - s.top) / s.height) * 100}%`);
    };
    place();
    new ResizeObserver(place).observe(principles);
  }

  // Deck summary — a full-screen slide player; the Local intelligence button and #deck links open it.
  const deck = document.querySelector('[data-deck]');
  const track = deck?.querySelector('[data-deck-track]');
  if (deck && track && typeof deck.showModal === 'function') {
    const slides = [...track.children];
    const prev = deck.querySelector('[data-deck-prev]');
    const next = deck.querySelector('[data-deck-next]');
    const count = deck.querySelector('[data-deck-count]');
    const still = matchMedia('(prefers-reduced-motion: reduce)');
    let at = 0;
    const mark = (i) => {
      at = i;
      slides.forEach((s, n) => s.classList.toggle('is-active', n === i));
      count.textContent = String(i + 1).padStart(2, '0');
      deck.style.setProperty('--deck-at', i + 1);
      prev.disabled = i === 0;
      next.disabled = i === slides.length - 1;
    };
    const go = (i) => {
      const n = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: n * track.clientWidth, behavior: still.matches ? 'instant' : 'smooth' });
      mark(n);
    };
    const open = () => {
      if (deck.open) return;
      deck.showModal();
      track.scrollTo({ left: 0, behavior: 'instant' });
      mark(0);
      next.focus();
    };
    let settle;
    track.addEventListener('scroll', () => {
      clearTimeout(settle);
      settle = setTimeout(() => {
        const i = Math.round(track.scrollLeft / track.clientWidth);
        if (i !== at) mark(i);
      }, 80);
    }, { passive: true });
    prev.addEventListener('click', () => go(at - 1));
    next.addEventListener('click', () => go(at + 1));
    deck.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(at + 1); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(at - 1); }
      else if (e.key === 'Home') { e.preventDefault(); go(0); }
      else if (e.key === 'End') { e.preventDefault(); go(slides.length - 1); }
    });
    document.querySelectorAll('[data-deck-open]').forEach((b) => b.addEventListener('click', open));
    deck.querySelector('[data-deck-close]')?.addEventListener('click', () => deck.close());
    deck.addEventListener('close', () => {
      if (location.hash === '#deck') history.replaceState(null, '', location.pathname + location.search);
    });
    window.addEventListener('resize', () => { if (deck.open) track.scrollTo({ left: at * track.clientWidth, behavior: 'instant' }); });
    if (location.hash === '#deck') open();
    window.addEventListener('hashchange', () => { if (location.hash === '#deck') open(); });
  }

  // Orbital map readout — hover or focus a symbol, read its posture.
  const map = document.querySelector('[data-map]');
  const readout = map?.querySelector('[data-readout]');
  if (!map || !readout) return;
  const groupName = (node) => node.closest('.map__group')?.querySelector('.map__legend h3')?.textContent.trim() || '';
  let active = null;
  const show = (node) => {
    if (node === active) return;
    active?.classList.remove('is-active');
    active = node;
    node.classList.add('is-active');
    const link = node.querySelector('.node__link');
    const name = node.querySelector('.node__name')?.textContent || '';
    const type = node.querySelector('.node__type')?.textContent || '';
    const status = node.querySelector('.node__status')?.textContent || '';
    const source = node.querySelector('.node__evidence source')?.getAttribute('srcset') || node.querySelector('.node__evidence img, img.node__evidence')?.getAttribute('src');
    const card = document.createElement('div');
    card.className = 'readout__card';
    card.innerHTML = `
      <p class="readout__group"></p>
      <h3 class="readout__name"></h3>
      <p class="readout__type"></p>
      <p class="readout__status"></p>
      ${source ? '<figure class="readout__evidence"><img alt="" width="1200" height="750" decoding="async"></figure>' : ''}
      <a class="text-link"></a>`;
    card.querySelector('.readout__group').textContent = groupName(node);
    card.querySelector('.readout__name').textContent = name;
    card.querySelector('.readout__type').textContent = type;
    card.querySelector('.readout__status').textContent = status;
    if (source) { const img = card.querySelector('img'); img.src = source; img.alt = `${name} — evidence from the project’s own source`; }
    const open = card.querySelector('a');
    open.href = link.getAttribute('href');
    open.textContent = `Open ${name} →`;
    readout.replaceChildren(card);
  };
  map.querySelectorAll('.node').forEach((node) => {
    node.addEventListener('pointerenter', () => show(node));
    node.addEventListener('focusin', () => show(node));
  });
})();
