// Zero State · Cinematic monolith — feature-stack pin follows the entry in the reading band.
(() => {
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  const stack = document.querySelector('[data-stack]');
  if (!stack || !('IntersectionObserver' in window)) return;
  const caption = stack.querySelector('[data-pin-caption]');
  const evidence = stack.querySelector('[data-pin-evidence]');
  const glyphs = new Map([...stack.querySelectorAll('[data-pin]')].map((g) => [g.dataset.pin, g]));
  let current = null;
  const activate = (entry) => {
    if (entry === current) return;
    current?.classList.remove('is-active');
    current = entry;
    entry.classList.add('is-active');
    glyphs.forEach((g, key) => g.classList.toggle('is-active', key === entry.dataset.key));
    caption.textContent = entry.querySelector('.entry__name')?.textContent || '';
    const src = entry.querySelector('.entry__evidence source')?.getAttribute('srcset') || entry.querySelector('img.entry__evidence, .entry__evidence img')?.getAttribute('src');
    if (src) {
      const img = new Image();
      img.alt = '';
      img.decoding = 'async';
      img.src = src;
      evidence.replaceChildren(img);
    }
  };
  const entries = [...stack.querySelectorAll('.entry')];
  const io = new IntersectionObserver((records) => {
    records.forEach((r) => { if (r.isIntersecting) activate(r.target); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  entries.forEach((e) => {
    io.observe(e);
    e.addEventListener('focusin', () => activate(e));
  });
  if (entries[0]) activate(entries[0]);
})();
