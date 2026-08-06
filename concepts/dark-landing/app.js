document.getElementById('year').textContent = new Date().getFullYear();

const mark = document.querySelector('.aperture-stage');
const axis = document.querySelector('.axis');

mark?.addEventListener('click', () => {
  axis.style.animation = 'none';
  requestAnimationFrame(() => {
    axis.style.animation = '';
  });
});
