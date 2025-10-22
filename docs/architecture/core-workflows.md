# Core Workflows

## Workflow 1: Owner Adds New Product (Stories 1.4, 1.5)

```mermaid
sequenceDiagram
    participant Owner as Business Owner
    participant FE as Frontend App (Next.js)
    participant API as Backend API (Vercel Func)
    participant Store as Image Storage
    participant DB as Database (Supabase)

    Owner->>FE: Navigates to Admin Dashboard
    FE-->>Owner: Displays Dashboard with 'Add Product' button
    Owner->>FE: Clicks 'Add New Product'
    FE-->>Owner: Displays Product Form (Title, Price, Image Upload)
    Owner->>FE: Fills form & Selects Image
    Owner->>FE: Clicks 'Save'
    FE->>API: Request Presigned URL for Image Upload
    API-->>FE: Provides Presigned URL
    FE->>Store: Uploads Image using URL
    Store-->>FE: Confirms Image Upload Success
    FE->>API: POST /api/products (Title, Price, ImageURL)
    API->>DB: INSERT INTO products (ownerId, title, price, imageUrl)
    DB-->>API: Confirms Product Saved
    API-->>FE: Returns Success (201 Created)
    FE-->>Owner: Shows Success Message & Clears Form/Redirects
```

## Workflow 2: Customer Views Showcase & Searches (Stories 1.6, 1.7)

```mermaid
sequenceDiagram
    participant Cust as Customer
    participant FE as Frontend App (Next.js)
    participant API as Backend API (Vercel Func)
    participant DB as Database (Supabase)
    participant Store as Image Storage

    Cust->>FE: Visits subdomain (e.g., adibs-kicks.ourplatform.com)
    FE->>API: GET /api/products?subdomain=adibs-kicks
    API->>DB: SELECT * FROM products WHERE ownerId = (SELECT id FROM owners WHERE subdomain = 'adibs-kicks')
    DB-->>API: Returns List of Products
    API-->>FE: Returns Product List JSON
    FE-->>Store: Requests Product Images via URLs
    Store-->>FE: Returns Images
    FE-->>Cust: Renders Product Showcase Grid

    Cust->>FE: Types 'Shirt' in Search Bar
    FE-->>FE: Filters product list client-side based on Title
    FE-->>Cust: Updates Grid to show only 'Shirt' products
```

## Workflow 3: Customer Interacts with Chatbot (Stories 2.2, 2.3, 2.4)

```mermaid
sequenceDiagram
    participant Cust as Customer
    participant FB as Facebook Messenger API
    participant ChatFunc as Chatbot Function (Vercel Func)
    participant DB as Database (Supabase)
    participant FE as Frontend App (Next.js) # For Links

    Cust->>FB: Sends Message (e.g., "Price of T-Shirt?") to Page
    FB->>ChatFunc: POST Webhook Event (Message Received)
    ChatFunc->>ChatFunc: Parse Message & Identify Intent/Entities
    ChatFunc->>DB: SELECT price, imageUrl FROM products WHERE title LIKE '%T-Shirt%' AND ownerId = 'pageOwnerId'
    DB-->>ChatFunc: Returns Product Data
    ChatFunc->>FB: POST /me/messages (Text: Price is X)
    ChatFunc->>FB: POST /me/messages (Image: Send ImageURL)
    ChatFunc->>FB: POST /me/messages (Button/Link: View on Website -> FE Product Page)
    FB-->>Cust: Displays Text Response
    FB-->>Cust: Displays Image
    FB-->>Cust: Displays Link Button

    Cust->>FB: Sends Message (e.g., "I want to buy")
    FB->>ChatFunc: POST Webhook Event
    ChatFunc->>ChatFunc: Detect Purchase Intent
    ChatFunc->>FB: POST /me/messages (Text: To order, visit website -> FE Link)
    FB-->>Cust: Displays Link to Website

    Cust->>FB: Sends Message (e.g., "Any red shirts?")
    FB->>ChatFunc: POST Webhook Event
    ChatFunc->>ChatFunc: Parse Intent ('shirt'), Attribute ('red')
    ChatFunc->>DB: SELECT title FROM products WHERE title LIKE '%shirt%' AND ownerId = 'pageOwnerId'
    DB-->>ChatFunc: Returns Product Titles
    ChatFunc->>FB: POST /me/messages (Text: Found 'T-Shirt'. I can't see colors. Check website -> FE Search Link for 'shirt')
    FB-->>Cust: Displays Text Response with Search Link
```

-----
