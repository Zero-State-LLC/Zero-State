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

// Cinematic motif control: the one controlled highway passage + residue state
const motion = document.querySelector('.identity-motion .highway-line');
const stage = document.querySelector('.identity-stage');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const playHighway = () => {
  if (!motion) return;
  motion.classList.add('is-ready');
  
  // After passage, apply residue state for latent trace
  setTimeout(() => {
    if (stage && !reducedMotion) {
      stage.classList.add('residue');
    }
  }, 5200);
};

if (motion && !reducedMotion && 'IntersectionObserver' in window && stage) {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      playHighway();
      observer.disconnect();
    }
  }, { threshold: 0.35 });
  observer.observe(stage);
} else if (motion && !reducedMotion) {
  playHighway();
}

// Optional: allow re-triggering the passage on click of the stage (for observation)
if (stage && motion) {
  stage.addEventListener('click', () => {
    if (reducedMotion) return;
    motion.classList.remove('is-ready');
    void motion.offsetWidth; // force reflow
    motion.classList.add('is-ready');
    stage.classList.remove('residue');
    setTimeout(() => stage.classList.add('residue'), 5200);
  });
  stage.style.cursor = 'pointer';
  stage.setAttribute('title', 'Click to replay the passage');
}


// Profound motif lifecycle: recurrence with mutation + residue accumulation (Kubrick)
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function applyMutation(el, className = 'mutated') {
  if (!el || reduced) return;
  el.classList.add(className);
}

const motifObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;

    if (el.classList.contains('product-card')) {
      const trace = el.querySelector('.scene-trace');
      applyMutation(trace);
    }

    if (el.classList.contains('threshold-cross')) {
      applyMutation(el);
    }

    if (el.classList.contains('identity-stage')) {
      // Already handled by highway, but ensure residue deepens
      setTimeout(() => el.classList.add('residue'), 4800);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.product-card, .threshold-cross, .identity-stage').forEach(el => {
  motifObserver.observe(el);
});

// One additional controlled passage on the first threshold (transfer of the signal)
const firstThreshold = document.querySelector('.threshold-cross');
if (firstThreshold && !reduced) {
  const stage = document.querySelector('.identity-stage');
  if (stage) {
    stage.addEventListener('click', () => {
      firstThreshold.classList.remove('mutated');
      void firstThreshold.offsetWidth;
      firstThreshold.classList.add('mutated');
    });
  }
}
