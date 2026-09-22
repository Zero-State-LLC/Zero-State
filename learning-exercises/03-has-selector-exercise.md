# Exercise 3: :has() Relational Selector

## Objective
Learn to use the `:has()` relational selector to style elements based on their descendants, eliminating the need for JavaScript class-toggling in many common scenarios.

## Prerequisites
- Understanding of CSS selectors
- Familiarity with pseudo-classes like `:hover`, `:focus`
- Access to a modern browser (Chrome 105+, Firefox 121+, Safari 15.4+)

## Exercise Setup
Create an interactive form and product list where styling changes based on content or state, without using JavaScript.

## Step-by-Step Instructions

### Step 1: Basic HTML Structure
Create a file `has-selector-exercise.html` with this content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>:has() Selector Exercise</title>
    <style>
        /* Add your CSS here */
    </style>
</head>
<body>
    <div class="container">
        <h2>Interactive Form</h2>
        
        <form class="interactive-form">
            <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
            </div>
            
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label for="message">Message:</label>
                <textarea id="message" name="message" rows="4"></textarea>
            </div>
            
            <button type="submit">Submit Form</button>
        </form>
        
        <h2>Product List</h2>
        
        <div class="product-list">
            <!-- Product 1 -->
            <div class="product-card">
                <img src="https://via.placeholder.com/200x150" alt="Product 1">
                <h3>Basic Product</h3>
                <p class="price">$19.99</p>
                <button class="add-to-cart">Add to Cart</button>
            </div>
            
            <!-- Product 2 -->
            <div class="product-card">
                <img src="https://via.placeholder.com/200x150" alt="Product 2">
                <h3>Featured Product</h3>
                <p class="price">$29.99</p>
                <button class="add-to-cart">Add to Cart</button>
                <span class="badge">Featured</span>
            </div>
            
            <!-- Product 3 -->
            <div class="product-card">
                <img src="https://via.placeholder.com/200x150" alt="Product 3">
                <h3>Another Product</h3>
                <p class="price">$15.99</p>
                <button class="add-to-cart">Add to Cart</button>
                <span class="badge sale">Sale!</span>
            </div>
        </div>
    </div>
</body>
</html>
```

### Step 2: Add Basic Styling
In the CSS section, add foundational styles:

```css
.container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
}

.interactive-form {
    background: #f8f9fa;
    padding: 2rem;
    border-radius: 8px;
    margin-bottom: 3rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0,123,255,0.25);
}

button {
    background: #007bff;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
}

button:hover {
    background: #0056b3;
}

.product-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
}

.product-card {
    border: 1px solid #eee;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.product-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.product-card h3 {
    margin: 1rem 1rem 0.5rem 1rem;
    font-size: 1.25rem;
}

.product-card .price {
    margin: 0 1rem 1rem 1rem;
    font-weight: bold;
    font-size: 1.125rem;
    color: #28a745;
}

.product-card .add-to-cart {
    margin: 1rem;
    align-self: flex-start;
}

.product-card .badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: #dc3545;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.875rem;
}

.product-card .badge.sale {
    background: #28a745;
}
```

### Step 3: Add :has() Selectors for Form Validation
Add these `:has()` rules to style the form based on input states:

```css
/* Style form group when any input is invalid */
.form-group:has(:invalid) {
    border-left: 3px solid #dc3545;
    padding-left: calc(1rem - 3px);
    background: rgba(220, 53, 69, 0.05);
}

/* Style form group when any input is valid (and not empty) */
.form-group:has(:valid:not(:placeholder-shown)) {
    border-left: 3px solid #28a745;
    padding-left: calc(1rem - 3px);
    background: rgba(40, 167, 69, 0.05);
}

/* Style form when all required fields are valid */
.interactive-form:has(:not(:invalid)) button[type="submit"] {
    background: #28a745;
}

.interactive-form:has(:not(:invalid)) button[type="submit"]:hover {
    background: #1e7e34;
}

/* Style form when any field is invalid */
.interactive-form:has(:invalid) button[type="submit"] {
    background: #6c757d;
    cursor: not-allowed;
    opacity: 0.7;
}

/* Style label when associated input is focused */
.form-group:has(:focus-within) label {
    color: #007bff;
}
```

### Step 4: Add :has() Selectors for Product List
Add these `:has()` rules to style products based on content:

```css
/* Style product cards that contain a badge */
.product-card:has(.badge) {
    border: 2px solid #dc3545;
    position: relative;
}

/* Style product cards that contain a sale badge */
.product-card:has(.badge.sale) {
    border: 2px solid #28a745;
    background: rgba(40, 167, 69, 0.05);
}

/* Style product cards that contain a featured badge */
.product-card:has(.badge:not(.sale)) {
    border: 2px solid #ffc107;
    background: rgba(255, 193, 7, 0.05);
}

/* Style product cards when hovering over them */
.product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

/* Style the badge when hovering over the product card */
.product-card:hover .badge {
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}
```

### Step 5: Test and Verify
1. Open the file in a modern browser
2. **Form Validation:**
   - Fill out the form fields and observe how the left borders change color based on validity
   - Try submitting with invalid email - notice the submit button grays out
   - Fill all fields correctly - notice the submit button turns green
3. **Product List:**
   - Observe how products with badges have different border colors
   - Notice the sale products have green borders and background tint
   - Hover over product cards to see the lift effect and pulsing badge
4. Use DevTools to inspect elements and see the `:has()` rules in the Styles pane

### Challenge Exercises
1. Create a navigation menu that highlights the parent `<li>` when a child `<a>` is active
2. Style a card differently when it contains an image with a specific alt text
3. Create a "select all" checkbox that changes styling of all related items when checked
4. Style a table row differently when any cell in that row contains specific text
5. Create a password strength indicator that changes the form styling based on password complexity

## Verification Checklist
- [ ] Form groups change left border color based on input validity
- [ ] Submit button grays out when form is invalid
- [ ] Submit button turns green when form is valid
- [ ] Labels change color when associated input is focused
- [ ] Product cards with badges have colored borders
- [ ] Sale products have green-themed styling
- [ ] Hover effects work on product cards
- [ ] `:has()` rules appear in DevTools Styles pane

## Learning Resources
- MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/:has
- web.dev: https://web.dev/learn/css/css-has/
- CSS Tricks: https://css-tricks.com/almanac/selectors/h/has/

## Solution Reference
Check `zer0state.com` implementation for real-world examples of `:has()` in the work-list sections (though note the current implementation uses it sparingly due to browser support considerations at time of writing).