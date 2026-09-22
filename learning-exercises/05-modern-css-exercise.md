# Exercise 5: Modern CSS Functions & Values

## Objective
Learn to use modern CSS functions and values like `clamp()`, logical properties, OKLCH color space, and `:where()`/:is() to create more maintainable, responsive, and accessible designs.

## Prerequisites
- Understanding of basic CSS
- Familiarity with CSS functions (like `calc()`) and variables
- Access to a modern browser (most features are widely supported in 2026 browsers)

## Exercise Setup
Create a responsive card component that demonstrates modern CSS functions and values for typography, spacing, layout, and color.

## Step-by-Step Instructions

### Step 1: Basic HTML Structure
Create a file `modern-css-exercise.html` with this content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern CSS Functions & Values Exercise</title>
    <style>
        /* Add your CSS here */
    </style>
</head>
<body>
    <div class="container">
        <h1>Modern CSS Showcase</h1>
        
        <div class="card-grid">
            <!-- Card 1 -->
            <section class="feature-card">
                <div class="card-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L2 17L12 22L20 17L12 12L20 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h2>Responsive Typography</h2>
                <p>Using clamp() for fluid typography that scales smoothly between viewport sizes.</p>
                <a href="#" class="learn-more">Learn More →</a>
            </section>
            
            <!-- Card 2 -->
            <section class="feature-card">
                <div class="card-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15 8H22L13 12L22 16H15L22 22L12 16L2 22H9L12 16L2 10H9L2 4L12 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h2>Logical Properties</h2>
                <p>Using margin-inline, padding-block for writing-mode agnostic layouts.</p>
                <a href="#" class="learn-more">Learn More →</a>
            </section>
            
            <!-- Card 3 -->
            <section class="feature-card">
                <div class="card-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L2 17L12 22L20 17L12 12L20 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h2>OKLCH Color Space</h2>
                <p>Perceptually uniform colors that are easier to work with than RGB/HSL.</p>
                <a href="#" class="learn-more">Learn More →</a>
            </section>
            
            <!-- Card 4 -->
            <section class="feature-card">
                <div class="card-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 4H15L12 11L9 4ZM12 14L17 21H7L12 14Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h2>:where() & :is() Selectors</h2>
                <p>Specificity-controlled grouping selectors for cleaner CSS.</p>
                <a href="#" class="learn-more">Learn More →</a>
            </section>
        </div>
    </div>
</body>
</html>
```

### Step 2: Add CSS Variables and Base Styles
In the CSS section, add CSS variables and base styling:

```css
/* CSS Variables for Modern CSS */
:root {
    /* Color variables using OKLCH */
    --color-primary: oklch(0.62 0.2 30); /* Blue */
    --color-secondary: oklch(0.65 0.15 25); /* Purple */
    --color-accent: oklch(0.7 0.2 60); /* Yellow */
    --color-background: oklch(0.95 0.005 30); /* Near white */
    --color-surface: oklch(0.92 0.005 30); /* Light surface */
    --color-text: oklch(0.25 0.005 30); /* Dark text */
    --color-text-muted: oklch(0.5 0.005 30); /* Medium text */
    
    /* Size variables */
    --radius-sm: 0.375rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    
    /* Transition duration */
    --transition-speed: 0.25s;
}

/* Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    /* Use 62.5% for easier rem calculations (10px = 1rem) */
    font-size: 62.5%;
}

body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    background-color: var(--color-background);
    color: var(--color-text);
}

.container {
    width: min(90%, 1200px);
    margin-inline: auto; /* Logical property for left/right margins */
    padding-block: 2rem; /* Logical property for top/bottom padding */
}

h1 {
    text-align: center;
    margin-block-end: 2rem; /* Logical property for margin-bottom */
    font-size: clamp(2.5rem, 5vw, 4rem); /* Fluid typography */
    line-height: 1.2;
}

/* Card Grid Layout */
.card-grid {
    display: grid;
    gap: 2rem;
    /* Responsive grid with auto-fit and minmax */
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

/* Feature Card Styles */
.feature-card {
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%; /* Make cards equal height */
    transition: transform var(--transition-speed) ease, box-shadow var(--transition-speed) ease;
    /* Group selectors with :is() for cleaner hover/focus states */
}

.feature-card:is(:hover, :focus-within) {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card-icon {
    /* Logical properties for padding */
    padding-inline: 2rem; /* Left/right padding */
    padding-block-start: 2rem; /* Top padding */
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--color-background);
    border-block-end: 1px solid oklch(from var(--color-background) l c h / 0.1); /* Bottom border with 10% opacity */
}

.card-icon svg {
    width: 2.5rem;
    height: 2.5rem;
    /* Color using CSS variable */
    stroke: var(--color-primary);
    fill: none;
}

.feature-card h2 {
    /* Logical properties for margin and padding */
    margin-block-start: 1.5rem; /* Top margin */
    margin-inline: 2rem; /* Left/right margins */
    margin-block-end: 1rem; /* Bottom margin */
    /* Fluid typography with clamp() */
    font-size: clamp(1.5rem, 2.5vw, 2rem);
    font-weight: 600;
    line-height: 1.3;
    color: var(--color-text);
}

.feature-card p {
    /* Logical properties for margin and padding */
    margin-inline: 2rem; /* Left/right margins */
    margin-block-end: 1.5rem; /* Bottom margin */
    /* Fluid typography with clamp() */
    font-size: clamp(1rem, 1.5vw, 1.25rem);
    line-height: 1.6;
    color: var(--color-text-muted);
    flex-grow: 1; /* Take available space */
}

.learn-more {
    /* Logical properties for margin and padding */
    margin-inline: 2rem; /* Left/right margins */
    margin-block-end: 2rem; /* Bottom margin */
    display: inline-block;
    /* Fluid typography */
    font-size: clamp(0.875rem, 1.5vw, 1rem);
    font-weight: 500;
    color: var(--color-primary);
    text-decoration: none;
    border-bottom: 1px solid currentColor;
    padding-block: 0.25rem; /* Top/bottom padding for hover effect */
    transition: color var(--transition-speed) ease, border-bottom-color var(--transition-speed) ease;
}

.learn-more:hover {
    color: oklch(from var(--color-primary) l c h / 0.8); /* Slightly darker */
}

/* Responsive Adjustments */
@media (max-width: 480px) {
    .container {
        padding-block: 1.5rem;
    }
    
    .card-grid {
        grid-template-columns: 1fr;
    }
    
    .feature-card {
        margin-block: 1rem; /* Vertical margin between cards in single column */
    }
}
```

### Step 3: Test and Verify
1. Open the file in a modern browser
2. Resize the browser window to see how the typography, spacing, and layout respond
3. Use DevTools to inspect elements and verify:
   - `clamp()` values in the Computed tab
   - Logical properties showing correct values
   - OKLCH colors being applied
   - `:is()` selector working for hover/focus states
4. Test in different viewport sizes to see the responsive behavior

### Challenge Exercises
1. Create a CSS custom property system using OKLCH colors with tints and shades
2. Use `clamp()` for spacing (padding, margin, gap) instead of just typography
3. Create a dark/light theme switcher using CSS variables and OKLCH colors
4. Use `:where()` to create low-specificity base styles that are easy to override
5. Combine `clamp()` with CSS variables for a design token system
6. Create a print stylesheet using these modern techniques

## Verification Checklist
- [ ] Typography scales smoothly with viewport size using `clamp()`
- [ ] Logical properties (margin-inline, padding-block) work correctly
- [ ] OKLCH colors are applied and visually correct
- [ ] `:is()` selector correctly applies styles to hover/focus states
- [ ] `:where()` selector can be used for low-specificity base styles (try adding it)
- [ ] Responsive layout adapts to different screen sizes
- [ ] Hover states work with smooth transitions
- [ ] All modern CSS functions appear correctly in DevTools

## Learning Resources
- MDN clamp(): https://developer.mozilla.org/en-US/docs/Web/CSS/clamp()
- MDN Logical Properties: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties
- MDN OKLCH: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch()
- MDN :where(): https://developer.mozilla.org/en-US/docs/Web/CSS/:where
- MDN :is(): https://developer.mozilla.org/en-US/docs/Web/CSS/:is
- web.dev: https://web.dev/learn/css/modern-css/
- CSS Tricks: https://css-tricks.com/clamp-is-the-better-viewport-unit/

## Solution Reference
Check `zer0state.com` styles.css for real-world examples of:
- `clamp()` used throughout for typography and spacing
- Logical properties like `margin-inline`, `padding-block`
- CSS variables (though not yet using OKLCH, the framework is there)
- `:is()` selector used in several places