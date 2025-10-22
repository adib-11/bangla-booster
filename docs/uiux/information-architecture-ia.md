# Information Architecture (IA)

## Site Map / Screen Inventory
```mermaid
graph TD
    subgraph Owner (Admin Area)
        A[Admin Login] --> B(Product Dashboard);
        B -- Add Product --> C{Add Product Form/Modal};
    end

    subgraph Customer (Public Area)
        D[Product Showcase (Subdomain)] --> E[Product Detail Page];
        D -- Search --> D;
    end

    C -- Save --> B;
    E -- Back --> D;
````

## Navigation Structure

  * **Primary Navigation (Public):** Minimal. Likely just the business name/logo linking back to the showcase homepage.
  * **Primary Navigation (Admin):** Minimal. May include "Products" and "Logout".
  * **Secondary Navigation:** None anticipated for the prototype.
  * **Breadcrumb Strategy:** Not necessary for this simple structure.

-----
