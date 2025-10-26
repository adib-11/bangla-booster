# AI Chat-Web Platform Prototype Product Requirements Document (PRD)

## Goals and Background Context

### Goals
* Build a foundational database and a simple website builder (3-field form: Title, Price, Image) for non-technical business owners.
* Create a customer-facing website (on a subdomain) with a grid layout and a title-only search bar.
* Implement an intelligent Messenger chatbot that is the key differentiator for the competition.
* The chatbot must act as an information funnel, directing all purchase intents to the website and *not* handling transactions.
* The chatbot must intelligently answer direct questions (e.g., price) with a "Full Showcase" response (Text, Image, Link).

### Background Context
This PRD defines a prototype for an idea competition. The target users are small to large Bangladeshi businesses that primarily operate on Facebook and WhatsApp without a dedicated product webpage.

The core problem is that these businesses handle customer queries inefficiently via manual messaging, leading to poor response times. The core value proposition is the direct link between a simple-to-use website (the data source) and an intelligent AI chatbot (the information funnel), which provides a better customer experience.

The prototype's scope is strictly limited to the website builder and the Messenger chatbot to demonstrate this core link. Key principles are simplicity for the owner and graceful failure (e.g., handling unanswerable queries) for the chatbot.

### Change Log
| Date           | Version | Description        | Author    |
| :------------- | :------ | :----------------- | :-------- |
| Oct 22, 2025   | 1.0     | Initial PRD draft  | John (PM) |

---

## Requirements

### Functional
* **FR1:** The system shall allow a business owner to add a new product by filling out a simple form with three fields: **Title**, **Price**, and **Image Upload**.
* **FR2:** The system shall store these product details (Title, Price, Image URL) in a database.
* **FR3:** The system shall provide each business owner with a unique subdomain.
* **FR4:** The system shall display all of a business's products on their subdomain page in a **grid layout**.
* **FR5:** The subdomain page shall include a **search bar**.
* **FR6:** The search bar shall filter the product grid by matching the search text against the **Product Title** only.
* **FR7:** The system shall provide an AI chatbot integrated with the business's Facebook Page (Messenger).
* **FR8:** The chatbot shall connect to the product database to retrieve information.
* **FR9:** When a customer asks a direct question for an item (e.g., "price of 'Casual T-Shirt'"), the chatbot shall provide a "Full Showcase" response: the **Price** (text), the **Image**, and a **Link** to the product page.
* **FR10:** When a customer expresses purchase intent (e.g., "I want to buy this"), the chatbot shall respond by directing the user to the website product page and **must not** attempt to process the transaction.
* **FR11:** When a customer query is ambiguous or asks for attributes not in the database (e.g., "red shirts"), the chatbot shall search based on known intent (e.g., "shirt"), provide a link to the web search results, and state its limitations (e.g., "I cannot see colors...").

### Non Functional
* **NFR1:** The "Add New Product" form must be simple and friendly, usable by a non-technical person.
* **NFR2:** The chatbot's primary function must be information retrieval and navigation; it must not handle transactions.

---

## User Interface Design Goals

### Overall UX Vision
The core UX vision is **Simplicity and Friendliness**. The interface must be intuitive for a non-technical business owner to manage their products. For the end-customer, the showcase must be clean, familiar, and easy to navigate.

### Key Interaction Paradigms
1.  **Owner (Admin):** The primary interaction is a simple "Add New Product" flow: a button opens a modal or a new page with exactly three fields and a "Save" button.
2.  **Customer (Public):** The primary interactions are 1) browsing products in a grid and 2) using a search bar to filter that grid by product title.

### Core Screens and Views
* **Admin View (Owner):** A minimal "Product Dashboard" that shows a list of existing products and the "Add New Product" button.
* **Public View (Customer):** The "Product Showcase" page (on the subdomain) that displays the product grid and the search bar.
* **Public View (Customer):** A "Product Detail Page" (Assumption: clicking a product in the grid will lead here, as implied by chatbot link).

### Accessibility: WCAG AA
(Assumption: We will aim for WCAG AA compliance, a standard for web accessibility. This was not in the brief but is a best practice.)

### Branding
(Assumption: Branding will be minimal for the prototype. The platform will provide a clean, neutral template, and the business's own product images will provide the visual identity.)

### Target Device and Platforms: Web Responsive
(Assumption: Given the target market uses Facebook/WhatsApp, a mobile-first, web-responsive design is required. The showcase must look good on both mobile phones and desktops.)

---

## Technical Assumptions

### Repository Structure: Monorepo
* A "monorepo" will be used, meaning all the code for your project (frontend website, backend chatbot logic, shared code) will live in a single repository.
* **Rationale:** This is the simplest approach for a prototype. It makes it easy to share code (like product definitions) between your website and your chatbot and simplifies development and deployment.

### Service Architecture: Serverless
* The system will use a "serverless" architecture. This means we won't be managing a full-time server.
* **Rationale:** The website can be a static or server-rendered site (e.g., on Vercel or Netlify), and the chatbot logic can be a simple "serverless function" (e.g., AWS Lambda, Vercel Function). This is low-cost, scales automatically, and is very fast to build for a prototype.

### Testing Requirements: Unit Only
* For the prototype, the development team will focus on writing "Unit Tests" (testing small, individual pieces of logic) to ensure the core functions (like searching, price lookup) work correctly.
* **Rationale:** This provides a good balance of quality for a competition prototype without the high overhead of full "Integration" or "End-to-End" testing.

### Additional Technical Assumptions and Requests
* **Frontend Framework:** React (or a React-based framework like Next.js) will be used for the website builder and product showcase.
    * **Rationale:** It is the most popular framework, has excellent support, and is ideal for building the simple, component-based grid you described.
* **Backend Language:** Node.js (JavaScript/TypeScript) will be used for the serverless chatbot functions.
    * **Rationale:** This allows the frontend and backend to use the same language, which simplifies development in a monorepo.
* **Database:** A simple, serverless-friendly database will be used (e.g., a free-tier PostgreSQL on Supabase/Neon or a NoSQL database like Firebase Firestore).
    * **Rationale:** These are easy to set up, connect to, and are perfect for storing the simple (Title, Price, Image) product data.

---

## Epic List

* **Epic 1: Foundational Setup & Core Web Platform**
    * **Goal:** To establish the project's foundation (database, subdomain structure) and deliver a complete, simple website. This epic will allow business owners to sign up, get a subdomain, and list their products, and will allow customers to browse and search those products on the website.
* **Epic 2: Intelligent Chatbot Integration**
    * **Goal:** To connect the AI chatbot to the live website database. This epic will deliver the core "intelligent" features: answering customer questions with product data, handling ambiguous queries, and funneling purchase intents to the website.

---

## Epic 1: Foundational Setup & Core Web Platform

**Epic Goal**: To establish the project's foundation (database, subdomain structure) and deliver a complete, simple website. This epic will allow business owners to sign up, get a subdomain, and list their products, and will allow customers to browse and search those products on the website.

### Story 1.1: Project Foundation Setup
**As a** developer,
**I want** to set up the monorepo, serverless backend, database, and React frontend,
**so that** we have a stable foundation for building all subsequent features.

#### Acceptance Criteria
1.  (AC1): The monorepo structure is created and pushed to a Git repository.
2.  (AC2): The serverless backend (Node.js) is initialized and configured.
3.  (AC3): The serverless database (e.g., Supabase) is provisioned and connection details are secured.
4.  (AC4): The React (Next.js) frontend application is initialized and configured within the monorepo.
5.  (AC5): The database schema for a "Product" (Title, Price, ImageURL) is defined and migrated.

---
### Story 1.2: Business Owner Signup
**As a** new business owner,
**I want** to sign up for an account,
**so that** I can get my own subdomain and start listing products. (Based on "Areas for Further Exploration")

#### Acceptance Criteria
1.  (AC1): A user can navigate to a "Signup" page.
2.  (AC2): A user can register using an email and password.
3.  (AC3): Upon successful registration, a new "Owner" record is created in the database.
4.  (AC4): The user is automatically logged in after signup.

---
### Story 1.3: Subdomain Provisioning
**As a** registered owner,
**I want** to specify my business name,
**so that** the system can generate my unique subdomain.

#### Acceptance Criteria
1.  (AC1): After signup, the owner is prompted to enter their "Business Name" (e.g., "Adib's Kicks").
2.  (AC2): The system checks if the business name is available as a subdomain.
3.  (AC3): The system generates and saves the unique subdomain (e.g., `adibs-kicks.ourplatform.com`) and links it to the owner's account.
4.  (AC4): The owner is redirected to their new admin dashboard, (e.g., `adibs-kicks.ourplatform.com/admin`).

---
### Story 1.4: Owner Product Form
**As a** business owner,
**I want** to see an "Add New Product" button on my admin dashboard,
**so that** I can access the simple form to list my products.

#### Acceptance Criteria
1.  (AC1): The `/admin` page is protected and only visible to the logged-in owner.
2.  (AC2): The page displays a clear "Add New Product" button.
3.  (AC3): Clicking the button opens a simple form (modal or new page) containing exactly three fields: "Product Title" (text), "Product Price" (text/number), and "Product Image" (upload).
4.  (AC4): The form includes a "Save" button.

---
### Story 1.5: Product Listing Submission
**As a** business owner,
**I want** to fill out the form and click "Save",
**so that** my new product is added to my website's database.

#### Acceptance Criteria
1.  (AC1): The "Save" button is disabled until all three fields (Title, Price, Image) are filled.
2.  (AC2): When "Save" is clicked, the image is uploaded to a storage service and a URL is generated.
3.  (AC3): A new "Product" record is created in the database, containing the Title, Price, and Image URL, and linked to the owner's account.
4.  (AC4): The owner sees a success message, and the form is cleared/closed.

---
### Story 1.6: Public Product Showcase
**As a** customer,
**I want** to visit a business's subdomain,
**so that** I can see all their products displayed in a grid.

#### Acceptance Criteria
1.  (AC1): When a user visits a valid subdomain (e.g., `adibs-kicks.ourplatform.com`), they see the public showcase page.
2.  (AC2): The page fetches all products associated with that subdomain's owner from the database.
3.  (AC3): All products are displayed in a responsive **grid layout**.
4.  (AC4): Each item in the grid clearly displays its **Image**, **Title**, and **Price**.

---
### Story 1.7: Public Product Search
**As a** customer,
**I want** to use a search bar on the showcase page,
**so that** I can quickly find a product by its name.

#### Acceptance Criteria
1.  (AC1): The showcase page displays a prominent **search bar** at the top.
2.  (AC2): As the customer types in the search bar, the product grid filters in real-time.
3.  (AC3): The filtering logic only matches against the **Product Title**.
4.  (AC4): If no products match, a "No products found" message is displayed.

---

## Epic 2: Intelligent Chatbot Integration

**Epic Goal**: To connect the AI chatbot to the live website database. This epic will deliver the core "intelligent" features: answering customer questions with product data, handling ambiguous queries, and funneling purchase intents to the website.

### Story 2.1: Owner Chatbot Integration
**As a** business owner,
**I want** to connect my Facebook Page's Messenger to my new website,
**so that** the AI chatbot can answer my customers' messages. (Based on "Areas for Further Exploration")

#### Acceptance Criteria
1.  (AC1): On my admin dashboard, there is a "Connect to Messenger" button.
2.  (AC2): Clicking the button initiates a Facebook login/permissions flow.
3.  (AC3): I can select the specific Facebook Page I want to link.
4.  (AC4): After granting permissions, the system securely stores the necessary tokens to link my page to my product database.
5.  (AC5): The dashboard shows a "Connected" status.

---
### Story 2.2: Implement Direct Question Response
**As a** customer,
**I want** to ask the chatbot a direct question about a product (e.g., "price of 'Casual T-Shirt'"),
**so that** I get a complete answer with a picture and link.

#### Acceptance Criteria
1.  (AC1): When a message is received, the chatbot identifies the business ID from the Facebook Page.
2.  (AC2): The chatbot queries that specific owner's product database.
3.  (AC3): If the query is a direct, answerable question (like price), the bot retrieves the Title, Price, and ImageURL.
4.  (AC4): The chatbot provides a "Full Showcase" response:
    * Text: "The 'Casual T-Shirt' is [Price]."
    * Image: [Sends the Product Image].
    * Link: "See more details or place an order here: [Link to product page]."

---
### Story 2.3: Implement Purchase Intent Funnel
**As a** customer,
**I want** to tell the chatbot "I want to buy this",
**so that** I am directed to the website to place my order.

#### Acceptance Criteria
1.  (AC1): The chatbot can detect purchase-related intents (e.g., "buy now", "I want one", "order").
2.  (AC2): The chatbot's response **must not** attempt to collect any order information (address, quantity, payment).
3.  (AC3): The chatbot must reply by funneling the user to the website (e.g., "To place an order, please visit our website: [link to product or main page]").

---
### Story 2.4: Implement Ambiguous Query Response
**As a** customer,
**I want** to ask an ambiguous question (e.g., "do you have red shirts?"),
**so that** the chatbot provides a helpful, graceful response instead of just failing.

#### Acceptance Criteria
1.  (AC1): The chatbot can parse a query to separate likely *intent* ("shirt") from *attributes* ("red").
2.  (AC2): The chatbot searches the product **Titles** using only the intent ("shirt").
3.  (AC3): The chatbot replies with a helpful, "honest" response stating its limitations (e.g., "I found 'Casual T-Shirt' and 'Formal Shirt,' but I cannot see colors.").
4.  (AC4): The response must include a helpful link to the website search page (e.g., "[subdomain.com/search?q=shirt]").

---

## Checklist Results Report

### Executive Summary
* **Overall PRD completeness:** 95% (Excellent)
* **MVP scope appropriateness:** Just Right (Clearly defined for a competition prototype)
* **Readiness for architecture phase:** Ready
* **Most critical gaps or concerns:** Minor clarification needed on subdomain/signup flow details, but not blocking.

### Category Analysis Table
| Category                         | Status    | Critical Issues                                                                                             |
| :------------------------------- | :-------- | :---------------------------------------------------------------------------------------------------------- |
| 1. Problem Definition & Context  | PASS      | None                                                                                                        |
| 2. MVP Scope Definition          | PASS      | None                                                                                                        |
| 3. User Experience Requirements  | PASS      | Minor assumptions (e.g., Product Detail Page) need final confirmation but are reasonable for a prototype. |
| 4. Functional Requirements       | PASS      | None                                                                                                        |
| 5. Non-Functional Requirements   | PASS      | None                                                                                                        |
| 6. Epic & Story Structure        | PASS      | None                                                                                                        |
| 7. Technical Guidance            | PASS      | None                                                                                                        |
| 8. Cross-Functional Requirements | N/A       | Minimal data/integration requirements for this prototype.                                                     |
| 9. Clarity & Communication       | PASS      | Document is well-structured based on brief.                                                                 |

### Top Issues by Priority
* **BLOCKERS:** None.
* **HIGH:** None.
* **MEDIUM:**
    * Need to finalize the exact flow for owner signup and subdomain creation (Stories 1.2, 1.3). The current stories are logical but details will need architect input.
* **LOW:**
    * Consider adding an "Edit Product" story to Epic 1 for owner convenience, though not strictly required by the brief.

### MVP Scope Assessment
* The scope aligns perfectly with the competition prototype goals defined in the brief.
* Features are minimal but viable.
* No scope creep identified.
* Complexity seems appropriate for a prototype.

### Technical Readiness
* Technical assumptions are clear and provide good constraints for the Architect.
* The chosen stack (React/Node/Serverless) is well-suited for the prototype.
* No major technical risks identified at this stage.

### Recommendations
* Proceed to the Architecture phase.
* During Architecture, pay close attention to the implementation details for Story 1.3 (Subdomain Provisioning) and Story 2.1 (Owner Chatbot Integration) as these involve external systems/complexity.
* Discuss adding an "Edit Product" feature with the user/stakeholder after the prototype.

---
