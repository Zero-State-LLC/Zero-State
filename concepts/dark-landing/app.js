const year = document.querySelector('[data-year]');
if (year) year.textContent = String(new Date().getFullYear());

const axis = document.querySelector('[data-axis]');
const replay = document.querySelector('[data-axis-replay]');
const masthead = document.querySelector('[data-masthead]');

const replayAxis = () => {
  if (!axis) return;
  axis.style.animation = 'none';
  void axis.offsetWidth;
  axis.style.animation = '';
};

replay?.addEventListener('click', replayAxis);

const updateMast = () => {
  masthead?.classList.toggle('is-scrolled', window.scrollY > 12);
};
updateMast();
window.addEventListener('scroll', updateMast, { passive: true });
