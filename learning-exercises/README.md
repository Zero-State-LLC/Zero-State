# Learning Exercises: Cutting-Edge 2026 Web Design

This directory contains hands-on exercises to learn and practice the cutting-edge 2026 web platform features implemented in the zer0state.com redesign.

## Overview

These exercises complement the implementation in the `redesign-2026` branch and provide practical, hands-on experience with:

1. Container Queries
2. Subgrid
3. :has() Relational Selector
4. View Transitions API
5. Modern CSS Functions & Values

Each exercise includes:
- Step-by-step instructions
- HTML/CSS/JavaScript starter code
- Challenge exercises
- Verification checklists
- Learning resources

## Prerequisites

- Basic understanding of HTML, CSS, and JavaScript
- Modern browser (Chrome 105+, Firefox 110+, Safari 16+ for most features)
- Text editor or IDE
- Local web server (for some exercises requiring server context)

## Exercises

### 1. [Container Queries Fundamentals](01-container-queries-exercise.md)
Learn to create truly self-contained, reusable components that respond to their parent container size instead of the viewport.

**Key Concepts:**
- `container-type` and `container-name`
- `@container` rules
- Container query units (`cqw`, `cqh`, `cqb`, `cqcqi`)
- Fallback layouts with `@supports`

### 2. [Subgrid for Perfect Alignment](02-subgrid-exercise.md)
Learn to use CSS subgrid to create perfectly aligned nested grids without JavaScript height-matching or fixed heights.

**Key Concepts:**
- `grid-template-rows: subgrid` and `grid-template-columns: subgrid`
- Nested grid alignment
- Responsive subgrid layouts
- Combining subgrid with container queries

### 3. [:has() Relational Selector](03-has-selector-exercise.md)
Learn to use the `:has()` relational selector to style elements based on their descendants, eliminating the need for JavaScript class-toggling.

**Key Concepts:**
- `:has(selector)` syntax
- Styling parents based on child state
- Form validation styling
- Content-based styling (badges, featured items, etc.)
- Performance considerations

### 4. [View Transitions API](04-view-transitions-exercise.md)
Learn to implement smooth page transitions and animations using the View Transitions API.

**Key Concepts:**
- `document.startViewTransition()`
- `::view-transition` pseudo-elements
- Customizing transitions for specific elements
- Reduced motion preferences
- Fallback behavior for unsupported browsers

### 5. [Modern CSS Functions & Values](05-modern-css-exercise.md)
Learn to use modern CSS functions and values like `clamp()`, logical properties, OKLCH color space, and `:where()`/:is().

**Key Concepts:**
- `clamp()` for fluid typography and spacing
- Logical properties (`margin-inline`, `padding-block`, `inset-block`)
- OKLCH color space for perceptually uniform colors
- `:where()` and `:is()` for specificity-controlled grouping
- CSS custom properties (variables) for design tokens

## How to Use These Exercises

1. **Start with Exercise 1** (Container Queries) as it's foundational to modern component-based design
2. **Progress through the exercises** in order, as later exercises may build on earlier concepts
3. **Complete the challenge exercises** to deepen your understanding
4. **Refer to the zer0state.com implementation** in the `redesign-2026` branch for real-world examples
5. **Apply what you learn** to your client projects by auditing existing sites for opportunities to replace JavaScript with these CSS features

## Verification

Each exercise includes a verification checklist to confirm you've successfully implemented the concepts. For the best learning experience:

1. Use DevTools to inspect elements and see the CSS rules applied
2. Test in multiple browsers to verify cross-browser compatibility
3. Try breaking the implementation intentionally to understand edge cases
4. Measure performance improvements using Chrome DevTools Performance tab

## Connecting to zer0state.com Implementation

The exercises demonstrate simplified versions of the concepts implemented in zer0state.com. To see the real-world implementation:

1. Switch to the `redesign-2026` branch: `git checkout redesign-2026`
2. Examine the changes in:
   - `index.html`: Container name attributes on work-list elements
   - `styles.css`: Modern CSS features including cascade layers, subgrid, :has(), container queries, and view transitions
   - `CUTTING_EDGE_2026_CSS_IMPLEMENTATION.md`: Detailed documentation

## Applying to Client Projects

When working on client websites, consider this adoption strategy:

### Phase 1: Assessment
- Audit existing sites for JavaScript-dependent layout/responsiveness
- Identify components that would benefit from container queries
- Find alignment issues that could be solved with subgrid
- Locate state-based styling that uses JavaScript class-toggling
- Evaluate navigation experiences that could use view transitions

### Phase 2: Pilot Implementation
- Start with container queries on a single component type (e.g., product cards)
- Implement subgrid in one area requiring perfect alignment (e.g., listings)
- Replace one JavaScript class-toggling pattern with :has()
- Add view transitions to navigation between two pages
- Use modern CSS functions in a new component

### Phase 3: Expansion
- Expand container queries to more components
- Apply subgrid to additional layout areas
- Replace more JavaScript styling with :has()
- Implement view transitions site-wide
- Refactor existing CSS to use modern functions and values
- Consider adopting cascade layers for new development

### Phase 4: Optimization
- Measure performance improvements (INP, CLS, LCP)
- Gather user feedback on enhanced experiences
- Document patterns for team adoption
- Create component library using these modern features

## Browser Support (2026)

All features in these exercises are "Widely Available" according to webplatform.dev:

- **Container Queries**: Chrome 105+, Firefox 110+, Safari 16+, Edge 105+
- **Subgrid**: Chrome 117+, Firefox 71+, Safari 16+, Edge 117+
- **:has()**: Chrome 105+, Firefox 121+, Safari 15.4+, Edge 105+
- **View Transitions**: Chrome 111+, Firefox 125+, Safari 15.4+, Edge 111+
- **Modern CSS Functions**: Widely supported (clamp: Chrome 79+, Firefox 75+, Safari 13.1+)

For older browser support, use `@supports` checks and provide thoughtful fallbacks.

## Next Steps

After completing these exercises:

1. **Build a component library** using these modern CSS features
2. **Create a design system** with CSS custom properties and OKLCH colors
3. **Experiment with advanced features** like `@container style()`, anchor positioning, and scroll-driven animations
4. **Share your knowledge** with your team through workshops and documentation
5. **Stay updated** with new web platform features as they become widely available

Remember: The goal isn't to use every feature everywhere, but to choose the right tool for each job to create better, faster, more maintainable web experiences.

Happy learning! 🚀