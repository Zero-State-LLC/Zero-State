// Performance-optimized JavaScript for zer0state.com (2026 standards)
// Implements scheduler.yield() for INP optimization and other performance best practices

const year = document.querySelector('[data-year]');
if (year) year.textContent = String(new Date().getFullYear());

const masthead = document.querySelector('[data-masthead]');

// INP Optimization: Utility function to yield to browser before expensive operations
async function yieldThen(callback) {
  await scheduler.yield();
  return callback();
}

// Optimized scroll handler with requestAnimationFrame and yielding
let ticking = false;
let lastScrollY = 0;

const updateMast = () => {
  // Yield to browser first for INP optimization
  return yieldThen(() => {
    const scrollY = window.scrollY;
    
    // Only update if scroll position has changed significantly
    if (Math.abs(scrollY - lastScrollY) > 5) {
      masthead?.classList.toggle('is-scrolled', scrollY > 12);
      lastScrollY = scrollY;
    }
  });
};

// Scroll event listener with throttling and yielding
window.addEventListener('scroll', (e) => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateMast();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true }); // Passive for better scrolling performance

// Optional: Add intersection observer for lazy loading if we implement more lazy elements
// This would be for future enhancements beyond current lazy loading

// Function to handle clicks with INP optimization
function handleClickWithYield(element, callback) {
  element.addEventListener('click', async (e) => {
    // Prevent default if it's a link and we want to handle navigation specially
    if (element.tagName === 'A' && element.hasAttribute('href')) {
      e.preventDefault();
      await yieldThen(() => {
        // Handle navigation - for now just follow the link
        window.location.href = element.getAttribute('href');
      });
    } else {
      // For buttons and other elements
      await yieldThen(() => {
        callback(e);
      });
    }
  });
}

// Example usage for specific elements (uncomment and adapt as needed)
// handleClickWithYield(document.querySelector('.some-button'), (e) => {
//   // Your click handling logic here
//   console.log('Button clicked');
// });

// Resize handler optimization (if needed)
let resizing = false;
window.addEventListener('resize', () => {
  if (!resizing) {
    resizing = true;
    window.requestAnimationFrame(() => {
      // Add resize handling logic here if needed
      resizing = false;
    });
  }
});

// Visibility change handler to pause/resume animations if needed
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden - pause any expensive operations
  } else {
    // Page is visible - resume operations
  }
});

// Export utility functions for use in other scripts if needed
window.zer0state = {
  yieldThen,
  handleClickWithYield
};
