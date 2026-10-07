// Zero State · shared chrome — nav morph, menu sheet, reveal-once, symbol hand-off between pages.
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

  // Reveal once.
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

  // Cross-document view transitions: the symbol you leave through becomes the next page's hero symbol.
  window.addEventListener('pageswap', (event) => {
    const url = event.activation?.entry?.url;
    if (!event.viewTransition || !url) return;
    const target = url.split('#')[0];
    const link = [...document.querySelectorAll('a[href]')].find((a) => a.href.split('#')[0] === target && a.querySelector('.glyph'));
    const symbol = link?.querySelector('.glyph');
    if (!symbol) return;
    symbol.style.viewTransitionName = 'zs-symbol';
    event.viewTransition.finished.finally(() => { symbol.style.viewTransitionName = ''; });
  });
})();
