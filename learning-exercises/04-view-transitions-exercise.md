# Exercise 4: View Transitions API

## Objective
Learn to implement smooth page transitions and animations using the View Transitions API, eliminating the need for JavaScript animation libraries in many common scenarios.

## Prerequisites
- Understanding of basic HTML and CSS
- Familiarity with CSS animations and transitions
- Access to a modern browser with View Transitions support (Chrome 111+, Firefox 125+, Safari 15.4+)
- Basic understanding of JavaScript (for navigation triggers)

## Exercise Setup
Create a simple multi-page website with smooth transitions between pages using the View Transitions API.

## Step-by-Step Instructions

### Step 1: Basic Project Structure
Create three HTML files: `index.html`, `about.html`, and `contact.html` in a folder called `vt-exercise`.

### Step 2: Base HTML Template
Create `index.html` with this content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home - View Transitions Exercise</title>
    <meta name="view-transition" content="same-origin">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="site-header">
        <h1>View Transitions Demo</h1>
        <nav class="site-navigation>
            <a href="index.html">Home</a>
            <a href="about.html">About</a>
            <a href="contact.html">Contact</a>
        </nav>
    </header>
    
    <main class="page-content">
        <section class="hero">
            <h2>Welcome to Our Site</h2>
            <p>Experience smooth transitions between pages using the View Transitions API.</p>
            <a href="about.html" class="cta-button">Learn About Us</a>
        </section>
        
        <section class="features">
            <h3>Features</h3>
            <div class="feature-grid">
                <div class="feature">
                    <h4>Fast Loading</h4>
                    <p>Optimized for performance</p>
                </div>
                <div class="feature">
                    <h4>Smooth Transitions</h4>
                    <p>Native page transitions</p>
                </div>
                <div class="feature">
                    <h4>Modern CSS</h4>
                    <p>Latest web platform features</p>
                </div>
            </div>
        </section>
    </main>
    
    <footer class="site-footer">
        <p>&copy; 2026 View Transitions Demo</p>
    </footer>
    
    <script>
        // Enable view transitions for SPA-like navigation
        if (!document.startViewTransition) {
            console.warn('View Transitions API not supported in this browser');
        }
        
        // Optional: Enhance transitions with JavaScript
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.getAttribute('href')?.startsWith('./') && 
                !link.hasAttribute('download') && 
                !link.hasAttribute('target')) {
                e.preventDefault();
                navigateTo(link.href);
            }
        });
        
        async function navigateTo(url) {
            if (!document.startViewTransition) {
                window.location.href = url;
                return;
            }
            
            try {
                await document.startViewTransition(() => {
                    window.location.href = url;
                });
            } catch (error) {
                console.error('View Transition failed:', error);
                window.location.href = url;
            }
        }
    </script>
</body>
</html>
```

### Step 3: Create About and Contact Pages
Create `about.html` with similar structure but different content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About - View Transitions Exercise</title>
    <meta name="view-transition" content="same-origin">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="site-header">
        <h1>View Transitions Demo</h1>
        <nav class="site-navigation">
            <a href="index.html">Home</a>
            <a href="about.html">About</a>
            <a href="contact.html">Contact</a>
        </nav>
    </header>
    
    <main class="page-content">
        <section class="page-hero">
            <h2>About Us</h2>
            <p>Learn more about our company and mission.</p>
        </section>
        
        <section class="about-content">
            <div class="about-text">
                <h3>Our Story</h4>
                <p>We believe in creating beautiful, functional websites that leverage the latest web platform features to provide exceptional user experiences.</p>
                <p>Our team combines expertise in modern CSS, JavaScript, and performance optimization to deliver cutting-edge solutions.</p>
            </div>
            
            <div class="about-image">
                <!-- In a real project, this would be an actual image -->
                <div class="placeholder">Team Illustration</div>
            </div>
        </section>
        
        <section class="values">
            <h3>Our Values</h3>
            <div class="values-grid">
                <div class="value">
                    <h4>Innovation</h4>
                    <p>We constantly explore new web technologies</p>
                </div>
                <div class="value">
                    <h4>Quality</h4>
                    <p>We never compromise on craftsmanship</p>
                </div>
                <div class="value">
                    <h4>Performance</h4>
                    <p>We optimize for speed and efficiency</p>
                </div>
            </div>
        </section>
    </main>
    
    <footer class="site-footer">
        <p>&copy; 2026 View Transitions Demo</p>
    </footer>
    
    <script>
        // Reuse the same navigation script
        if (!document.startViewTransition) {
            console.warn('View Transitions API not supported in this browser');
        }
        
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.getAttribute('href')?.startsWith('./') && 
                !link.hasAttribute('download') && 
                !link.hasAttribute('target')) {
                e.preventDefault();
                navigateTo(link.href);
            }
        });
        
        async function navigateTo(url) {
            if (!document.startViewTransition) {
                window.location.href = url;
                return;
            }
            
            try {
                await document.startViewTransition(() => {
                    window.location.href = url;
                });
            } catch (error) {
                console.error('View Transition failed:', error);
                window.location.href = url;
            }
        }
    </script>
</body>
</html>
```

Create `contact.html` similarly with contact form content.

### Step 4: Create Shared CSS
Create `styles.css` with shared styles and View Transitions customization:

```css
/* CSS Reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #fafafa;
}

/* Layout */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

.site-header {
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 100;
}

.site-header h1 {
    margin: 0;
    padding: 1.5rem 0;
    font-size: 2rem;
    color: #2c3e50;
}

.site-navigation {
    display: flex;
    gap: 2rem;
    justify-content: center;
}

.site-navigation a {
    text-decoration: none;
    color: #3498db;
    font-weight: 500;
    padding: 0.5rem 0;
    border-bottom: 2px solid transparent;
    transition: border-color 0.3s ease;
}

.site-navigation a:hover {
    border-color: #3498db;
}

.site-navigation a.active {
    color: #2c3e50;
    border-color: #2c3e50;
}

/* Page Content */
.page-content {
    padding: 3rem 0;
}

.hero {
    text-align: center;
    padding: 4rem 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 12px;
    margin-bottom: 3rem;
}

.hero h2 {
    margin-bottom: 1rem;
    font-size: 2.5rem;
}

.hero p {
    margin-bottom: 2rem;
    font-size: 1.25rem;
    opacity: 0.9;
}

.cta-button {
    background: #ff6b6b;
    color: white;
    text-decoration: none;
    padding: 1rem 2rem;
    border-radius: 6px;
    font-weight: 600;
    display: inline-block;
    transition: background 0.3s ease;
}

.cta-button:hover {
    background: #ff5252;
}

.features {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    padding: 2.5rem;
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
}

.feature {
    text-align: center;
    padding: 1.5rem;
    border: 1px solid #eee;
    border-radius: 8px;
}

.feature h4 {
    margin-bottom: 0.5rem;
    color: #2c3e50;
}

.about-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: start;
    margin-bottom: 3rem;
}

.about-text h3 {
    color: #2c3e50;
    margin-bottom: 1rem;
}

.about-text p {
    margin-bottom: 1.5rem;
    line-height: 1.7;
}

.about-image .placeholder {
    background: #ecf0f1;
    width: 100%;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    color: #7f8c8d;
    font-style: italic;
}

.values {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    padding: 2.5rem;
}

.values-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
}

.value {
    text-align: center;
    padding: 1.5rem;
    border: 1px solid #eee;
    border-radius: 8px;
}

.value h4 {
    margin-bottom: 0.5rem;
    color: #27ae60;
}

.site-footer {
    text-align: center;
    padding: 2rem 0;
    margin-top: 3rem;
    border-top: 1px solid #eee;
    color: #7f8c8d;
    font-size: 0.9rem;
}

/* === VIEW TRANSITIONS CUSTOMIZATION === */
/* These define how elements transition between pages */

/* Basic page transition - crossfade */
::view-transition-old(root),
::view-transition-new(root) {
    animation: 0.3s cubic-bezier(0.4, 0, 0.2, 1) both;
}

/* Optional: Custom transitions for specific elements */
/* Uncomment and adjust as needed */

/* 
::view-transition-old(.hero),
::view-transition-new(.hero) {
    animation: 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
}

::view-transition-old(.site-header h1),
::view-transition-new(.site-header h1) {
    animation: 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
}

::view-transition-old(.feature-grid),
::view-transition-new(.feature-grid) {
    animation: 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
}
*/

/* Reduced motion preference - disable animations for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.001ms !important;
    }
    
    /* Disable view transitions for reduced motion */
    ::view-transition-old(root),
    ::view-transition-new(root) {
        animation: none !important;
    }
}
```

### Step 5: Test and Verify
1. Serve the files using a local web server (required for View Transitions):
   ```bash
   # From the vt-exercise directory:
   python3 -m http.server 8080
   ```
2. Open `http://localhost:8080/index.html` in a modern browser
3. Navigate between pages using the navigation links
4. Open DevTools → Performance tab and record a navigation
5. Look for the "View Transition" section in the timeline
6. Inspect elements and look for `::view-transition` pseudo-elements in the Styles pane

### Challenge Exercises
1. Create custom transitions for specific elements (uncomment the examples in CSS)
2. Add page-specific transitions (different transitions for different page types)
3. Create a photo gallery where images transition smoothly between pages
4. Implement a tabbed interface using View Transitions for tab changes
5. Create a modal-like experience using View Transitions for opening/closing
6. Add layout transitions that animate changes in element position/size

## Verification Checklist
- [ ] Page transitions are smooth instead of jump cuts
- [ ] Navigation works correctly between all pages
- [ ] View Transitions appear in DevTools Performance tab
- [ ] Custom transitions work when uncommented
- [ ] Reduced motion media query disables animations when enabled
- [ ] Fallback navigation works in browsers without View Transitions support

## Learning Resources
- MDN: https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
- web.dev: https://web.dev/learn/css/view-transitions/
- Chrome Developers: https://developer.chrome.com/docs/web-platform/view-transitions/
- CSS Tricks: https://css-tricks.com/view-transitions/

## Solution Reference
Check `zer0state.com` implementation for View Transitions in styles.css (lines ~900-936).