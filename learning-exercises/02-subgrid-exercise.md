# Exercise 2: Subgrid for Perfect Alignment

## Objective
Learn to use CSS subgrid to create perfectly aligned nested grids without JavaScript height-matching or fixed heights.

## Prerequisites
- Understanding of CSS Grid
- Familiarity with basic grid concepts (grid-template-columns, grid-template-rows)
- Access to a modern browser (Chrome 117+, Firefox 71+, Safari 16+)

## Exercise Setup
Create a product listing where product cards have consistent alignment of titles, descriptions, and buttons regardless of content length.

## Step-by-Step Instructions

### Step 1: Basic HTML Structure
Create a file `subgrid-exercise.html` with this content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subgrid Exercise</title>
    <style>
        /* Add your CSS here */
    </style>
</head>
<body>
    <div class="product-list">
        <h2>Featured Products</h2>
        
        <div class="product-grid">
            <!-- Product Card 1 -->
            <article class="product-card">
                <div class="product-thumbnail">
                    <img src="https://via.placeholder.com/300x200" alt="Product 1">
                </div>
                <div class="product-content">
                    <h3>Product A</h3>
                    <p>Short description.</p>
                    <p class="price">$29.99</p>
                    <button class="buy-btn">Add to Cart</button>
                </div>
            </article>
            
            <!-- Product Card 2 -->
            <article class="product-card">
                <div class="product-thumbnail">
                    <img src="https://via.placeholder.com/300x200" alt="Product 2">
                </div>
                <div class="product-content">
                    <h3>Product B with a Very Long Name That Would Normally Cause Alignment Issues</h3>
                    <p>This is a much longer description that spans multiple lines and would typically cause the buttons to mis-align with other cards in a traditional grid layout.</p>
                    <p class="price">$49.99</p>
                    <button class="buy-btn">Add to Cart</button>
                </div>
            </article>
            
            <!-- Product Card 3 -->
            <article class="product-card">
                <div class="product-thumbnail">
                    <img src="https://via.placeholder.com/300x200" alt="Product 3">
                </div>
                <div class="product-content">
                    <h3>Product C</h3>
                    <p>Medium length description that is neither too short nor too long.</p>
                    <p class="price">$39.99</p>
                    <button class="buy-btn">Add to Cart</button>
                </div>
            </article>
        </div>
    </div>
</body>
</html>
```

### Step 2: Add Main Grid Layout
In the CSS section, create the main product grid:

```css
.product-list {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
    /* Make this a grid container for subgrid */
    grid-template-rows: repeat(4, auto); /* Define 4 rows: thumbnail, title, description, price+button */
}
```

### Step 3: Apply Subgrid to Product Cards
Make each product card a subgrid that inherits the parent's row tracks:

```css
.product-card {
    border: 1px solid #eee;
    border-radius: 8px;
    overflow: hidden;
    display: grid;
    /* This is the key - inherit the parent's row tracks */
    grid-template-rows: subgrid;
    /* Span all 4 rows defined in the parent */
    grid-row: span 4;
}

.product-thumbnail {
    /* This item goes in the first row */
    grid-row: 1;
}

.product-thumbnail img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
}

.product-content {
    /* This item spans rows 2-4 */
    grid-row: 2 / 5;
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    gap: 1rem;
}

.product-content h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
    line-height: 1.3;
}

.product-content p {
    margin: 0;
    flex-grow: 1;
}

.price {
    font-weight: bold;
    font-size: 1.125rem;
    margin: 0.5rem 0;
}

.buy-btn {
    background: #28a745;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    margin-top: auto; /* Push to bottom */
}
```

### Step 4: Test and Verify
1. Open the file in a modern browser
2. Notice how the "Add to Cart" buttons are perfectly aligned despite different content lengths
3. Use DevTools to inspect the grid layout
4. In the Layout pane, enable grid overlays for both parent and child grids
5. Verify that the product-card items align with the parent grid's row lines

### Challenge Exercises
1. Add a fourth product with an extremely short title and see how alignment remains perfect
2. Make the thumbnail images have different aspect ratios and observe that the content alignment remains unaffected
3. Add a sale badge that absolutely positions within the thumbnail without affecting layout
4. Create a responsive version that changes the number of columns at different breakpoints while maintaining subgrid alignment
5. Try making only specific columns subgridded (e.g., subgrid columns but define your own rows)

## Verification Checklist
- [ ] All product cards have consistent row heights
- [ ] Titles start at the same vertical position in all cards
- [ ] Descriptions start at the same vertical position in all cards
- [ ] Buttons are perfectly aligned at the bottom of all cards
- [ ] Alignment remains perfect regardless of content length in any field
- [ ] Subgrid relationship visible in DevTools Layout pane

## Learning Resources
- MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Subgrid
- web.dev: https://web.dev/learn/css/subgrid/
- CSS Tricks: https://css-tricks.com/a-complete-guide-to-grid/#subgrid

## Solution Reference
Check `zer0state.com` implementation for real-world examples of subgrid in the product listings and work-list sections.