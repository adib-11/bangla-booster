# Wireframes & Mockups

**Primary Design Files:** (Assumption: We will use Figma for detailed mockups and prototypes, but this needs confirmation).

## Key Screen Layouts

### Admin View (Owner): Product Dashboard

  * **Purpose:** Allow the owner to see their products and access the 'Add Product' function.
  * **Key Elements:**
      * Header (Minimal: maybe just Business Name).
      * **'Add New Product' Button** (Prominently displayed).
      * A simple list or grid showing existing products (Image, Title, Price) - enough to identify them. (Note: Editing/Deleting is out of scope for now).
  * **Interaction Notes:** Clicking 'Add New Product' triggers the form/modal.
  * **Design File Reference:** [Link to specific Figma frame TBD]

### Admin View (Owner): Add Product Form/Modal

  * **Purpose:** Provide the simple 3-field form for adding a product.
  * **Key Elements:**
      * **Product Title** input field (Text).
      * **Product Price** input field (Text/Number).
      * **Product Image** upload button/area.
      * **'Save' Button** (Initially disabled).
      * 'Cancel' or 'Close' button.
  * **Interaction Notes:** 'Save' enabled only when all fields are valid. Success/Error messages shown after attempting save.
  * **Design File Reference:** [Link to specific Figma frame TBD]

### Public View (Customer): Product Showcase

  * **Purpose:** Display products in a grid and allow searching.
  * **Key Elements:**
      * Header (Minimal: Business Name/Logo).
      * **Search Bar** (Prominently at the top).
      * **Product Grid** (Responsive: e.g., 2 columns on mobile, 3-4 on desktop) displaying Image, Title, Price for each item.
      * Placeholder text/image if no products exist.
      * 'No products found' message area for search results.
  * **Interaction Notes:** Typing in search filters the grid in real-time. Clicking a product item navigates to the Product Detail Page.
  * **Design File Reference:** [Link to specific Figma frame TBD]

### Public View (Customer): Product Detail Page

  * **Purpose:** Show details for a single product (Assumption based on PRD chatbot links).
  * **Key Elements:**
      * Header (Consistent with Showcase).
      * Larger Product **Image**.
      * Product **Title**.
      * Product **Price**.
      * (Optional but recommended: Simple 'Back' link to Showcase).
  * **Interaction Notes:** This is primarily a display page for the prototype. No purchase action needed here based on chatbot flow.
  * **Design File Reference:** [Link to specific Figma frame TBD]

-----
