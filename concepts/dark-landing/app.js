const year = document.querySelector('[data-year]');
if (year) year.textContent = String(new Date().getFullYear());

const axis = document.querySelector('[data-axis]');
const replay = document.querySelector('[data-axis-replay]');

const replayAxis = () => {
  if (!axis) return;
  axis.style.animation = 'none';
  // Force reflow so the animation restarts cleanly.
  void axis.offsetWidth;
  axis.style.animation = '';
};

replay?.addEventListener('click', replayAxis);
