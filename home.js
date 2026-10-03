// Zero State · Observatory — nav morph, menu sheet, reveal-once, orbital readout.
(() => {
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  // N10 floating-on-scroll morph: one DOM, one class, boolean-flip guard.
  const nav = document.querySelector('[data-nav]');
  if (nav) {
    const THRESHOLD = 80;
    let floating = false;
    let ticking = false;
    const update = () => {
      const next = window.scrollY > THRESHOLD;
      if (next !== floating) {
        floating = next;
        nav.classList.toggle('is-floating', floating);
      }
    };
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { update(); ticking = false; });
    }, { passive: true });
    update();

    const menu = nav.querySelector('[data-menu]');
    const close = () => { nav.classList.remove('is-open'); menu?.setAttribute('aria-expanded', 'false'); };
    menu?.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    });
    nav.querySelectorAll('.nav__links a').forEach((a) => a.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  // Reveal once — the method passage and the closing frame.
  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.45 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-revealed'));
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
