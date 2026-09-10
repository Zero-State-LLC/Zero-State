const year = document.querySelector('[data-year]');
if (year) year.textContent = String(new Date().getFullYear());

const masthead = document.querySelector('[data-masthead]');

const updateMast = () => {
  masthead?.classList.toggle('is-scrolled', window.scrollY > 12);
};
updateMast();
window.addEventListener('scroll', updateMast, { passive: true });
