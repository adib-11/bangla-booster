# Epic 1: Foundational Setup & Core Web Platform

**Epic Goal**: To establish the project's foundation (database, subdomain structure) and deliver a complete, simple website. This epic will allow business owners to sign up, get a subdomain, and list their products, and will allow customers to browse and search those products on the website.

## Story 1.1: Project Foundation Setup
**As a** developer,
**I want** to set up the monorepo, serverless backend, database, and React frontend,
**so that** we have a stable foundation for building all subsequent features.

### Acceptance Criteria
1.  (AC1): The monorepo structure is created and pushed to a Git repository.
2.  (AC2): The serverless backend (Node.js) is initialized and configured.
3.  (AC3): The serverless database (e.g., Supabase) is provisioned and connection details are secured.
4.  (AC4): The React (Next.js) frontend application is initialized and configured within the monorepo.
5.  (AC5): The database schema for a "Product" (Title, Price, ImageURL) is defined and migrated.

---
## Story 1.2: Business Owner Signup
**As a** new business owner,
**I want** to sign up for an account,
**so that** I can get my own subdomain and start listing products. (Based on "Areas for Further Exploration")

### Acceptance Criteria
1.  (AC1): A user can navigate to a "Signup" page.
2.  (AC2): A user can register using an email and password.
3.  (AC3): Upon successful registration, a new "Owner" record is created in the database.
4.  (AC4): The user is automatically logged in after signup.

---
## Story 1.3: Subdomain Provisioning
**As a** registered owner,
**I want** to specify my business name,
**so that** the system can generate my unique subdomain.

### Acceptance Criteria
1.  (AC1): After signup, the owner is prompted to enter their "Business Name" (e.g., "Adib's Kicks").
2.  (AC2): The system checks if the business name is available as a subdomain.
3.  (AC3): The system generates and saves the unique subdomain (e.g., `adibs-kicks.ourplatform.com`) and links it to the owner's account.
4.  (AC4): The owner is redirected to their new admin dashboard, (e.g., `adibs-kicks.ourplatform.com/admin`).

---
## Story 1.4: Owner Product Form
**As a** business owner,
**I want** to see an "Add New Product" button on my admin dashboard,
**so that** I can access the simple form to list my products.

### Acceptance Criteria
1.  (AC1): The `/admin` page is protected and only visible to the logged-in owner.
2.  (AC2): The page displays a clear "Add New Product" button.
3.  (AC3): Clicking the button opens a simple form (modal or new page) containing exactly three fields: "Product Title" (text), "Product Price" (text/number), and "Product Image" (upload).
4.  (AC4): The form includes a "Save" button.

---
## Story 1.5: Product Listing Submission
**As a** business owner,
**I want** to fill out the form and click "Save",
**so that** my new product is added to my website's database.

### Acceptance Criteria
1.  (AC1): The "Save" button is disabled until all three fields (Title, Price, Image) are filled.
2.  (AC2): When "Save" is clicked, the image is uploaded to a storage service and a URL is generated.
3.  (AC3): A new "Product" record is created in the database, containing the Title, Price, and Image URL, and linked to the owner's account.
4.  (AC4): The owner sees a success message, and the form is cleared/closed.

---
## Story 1.6: Public Product Showcase
**As a** customer,
**I want** to visit a business's subdomain,
**so that** I can see all their products displayed in a grid.

### Acceptance Criteria
1.  (AC1): When a user visits a valid subdomain (e.g., `adibs-kicks.ourplatform.com`), they see the public showcase page.
2.  (AC2): The page fetches all products associated with that subdomain's owner from the database.
3.  (AC3): All products are displayed in a responsive **grid layout**.
4.  (AC4): Each item in the grid clearly displays its **Image**, **Title**, and **Price**.

---
## Story 1.7: Public Product Search
**As a** customer,
**I want** to use a search bar on the showcase page,
**so that** I can quickly find a product by its name.

### Acceptance Criteria
1.  (AC1): The showcase page displays a prominent **search bar** at the top.
2.  (AC2): As the customer types in the search bar, the product grid filters in real-time.
3.  (AC3): The filtering logic only matches against the **Product Title**.
4.  (AC4): If no products match, a "No products found" message is displayed.

---
