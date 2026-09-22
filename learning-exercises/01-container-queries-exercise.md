# Exercise 1: Container Queries Fundamentals

## Objective
Learn to use container queries to create truly self-contained, reusable components that respond to their parent container size instead of the viewport.

## Prerequisites
- Understanding of basic CSS
- Familiarity with media queries
- Access to a modern browser (Chrome 105+, Firefox 110+, Safari 16+)

## Exercise Setup
Create a simple product card component that adapts its layout based on its container width.

## Step-by-Step Instructions

### Step 1: Basic HTML Structure
Create a file `container-query-exercise.html` with this content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Container Queries Exercise</title>
    <style>
        /* Add your CSS here */
    </style>
</head>
<body>
    <div class="container">
        <h2>Product Gallery</h2>
        
        <div class="card-grid">
            <!-- Card 1 -->
            <div class="card">
                <div class="card-content">
                    <h3>Product A</h3>
                    <p>This is a short description.</p>
                    <button>Buy Now</button>
                </div>
            </div>
            
            <!-- Card 2 -->
            <div class="card">
                <div class="card-content">
                    <h3>Product B with a Much Longer Name That Might Wrap</h3>
                    <p>This is a longer description that takes up more space and might cause layout issues in traditional approaches.</p>
                    <button>Buy Now</button>
                </div>
            </div>
            
            <!-- Card 3 -->
            <div class="card">
                <div class="card-content">
                    <h3>Product C</h3>
                    <p>Medium length description here.</p>
                    <button>Buy Now</button>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
```

### Step 2: Add Container Context
In the CSS section, add container context to the card grid:

```css
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.card-grid {
    display: grid;
    gap: 1.5rem;
    /* Add container query context */
    container-type: inline-size;
    /* Optional: name the container */
    container-name: product-grid;
}
```

### Step 3: Create Responsive Card Layouts
Add container queries to adapt the card layout based on container width:

```css
.card {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.card-content {
    padding: 1.5rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

.card h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 1.25rem;
}

.card p {
    flex-grow: 1;
    margin-bottom: 1.5rem;
    line-height: 1.5;
}

.card button {
    background: #007bff;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
}

/* Container Queries for responsive layout */
@container product-grid (min-width: 400px) {
    .card {
        flex-direction: row;
    }
    
    .card-content {
        padding: 2rem;
    }
    
    .card h3 {
        font-size: 1.5rem;
    }
}

@container product-grid (min-width: 600px) {
    .card-content {
        padding: 2.5rem;
    }
    
    .card h3 {
        font-size: 1.75rem;
    }
    
    .card p {
        font-size: 1.125rem;
    }
}
```

### Step 4: Test and Verify
1. Open the file in a modern browser
2. Resize the browser window to see how the cards adapt
3. Use DevTools to inspect the `.card-grid` element
4. In the Styles pane, look for the container query rules
5. Toggle the container width to see the layout change

### Challenge Exercises
1. Add a fourth breakpoint at 800px that changes the image-to-text ratio
2. Use container query units (`cqi`, `cqb`) for font sizing instead of fixed breakpoints
3. Create a nested container query (container within a container)
4. Add a fallback layout for browsers that don't support container queries using `@supports`

## Verification Checklist
- [ ] Cards display vertically in narrow containers (<400px)
- [ ] Cards switch to horizontal layout in medium containers (400px-600px)
- [ ] Typography and spacing increase in larger containers (>600px)
- [ ] Layout changes are based on container width, not viewport width
- [ ] Container query rules appear in DevTools Styles pane

## Learning Resources
- MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_container_queries
- web.dev: https://web.dev/learn/css/container-queries/
- Can I Use: https://caniuse.com/css-container-queries

## Solution Reference
Check `zer0state.com` implementation for real-world examples of container queries in the work-list sections.