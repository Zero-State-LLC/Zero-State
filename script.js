
const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');
const year = document.querySelector('[data-year]');

if (year) year.textContent = new Date().getFullYear();

const updateHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 10);
};
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav?.classList.toggle('is-open', !open);
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('is-open');
  });
});

// Re-trigger the one-pass highway motion when the hero enters the viewport.
const motion = document.querySelector('.identity-motion .highway-line');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const playMotion = () => motion?.classList.add('is-ready');
if (motion && !reducedMotion && 'IntersectionObserver' in window) {
  const stage = document.querySelector('.identity-stage');
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      playMotion();
      observer.disconnect();
    }
  }, { threshold: 0.35 });
  if (stage) observer.observe(stage);
} else if (motion && !reducedMotion) {
  playMotion();
}
