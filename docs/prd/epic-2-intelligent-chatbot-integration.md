# Epic 2: Intelligent Chatbot Integration

**Epic Goal**: To connect the AI chatbot to the live website database. This epic will deliver the core "intelligent" features: answering customer questions with product data, handling ambiguous queries, and funneling purchase intents to the website.

## Story 2.1: Owner Chatbot Integration
**As a** business owner,
**I want** to connect my Facebook Page's Messenger to my new website,
**so that** the AI chatbot can answer my customers' messages. (Based on "Areas for Further Exploration")

### Acceptance Criteria
1.  (AC1): On my admin dashboard, there is a "Connect to Messenger" button.
2.  (AC2): Clicking the button initiates a Facebook login/permissions flow.
3.  (AC3): I can select the specific Facebook Page I want to link.
4.  (AC4): After granting permissions, the system securely stores the necessary tokens to link my page to my product database.
5.  (AC5): The dashboard shows a "Connected" status.

---
## Story 2.2: Implement Direct Question Response
**As a** customer,
**I want** to ask the chatbot a direct question about a product (e.g., "price of 'Casual T-Shirt'"),
**so that** I get a complete answer with a picture and link.

### Acceptance Criteria
1.  (AC1): When a message is received, the chatbot identifies the business ID from the Facebook Page.
2.  (AC2): The chatbot queries that specific owner's product database.
3.  (AC3): If the query is a direct, answerable question (like price), the bot retrieves the Title, Price, and ImageURL.
4.  (AC4): The chatbot provides a "Full Showcase" response:
    * Text: "The 'Casual T-Shirt' is [Price]."
    * Image: [Sends the Product Image].
    * Link: "See more details or place an order here: [Link to product page]."

---
## Story 2.3: Implement Purchase Intent Funnel
**As a** customer,
**I want** to tell the chatbot "I want to buy this",
**so that** I am directed to the website to place my order.

### Acceptance Criteria
1.  (AC1): The chatbot can detect purchase-related intents (e.g., "buy now", "I want one", "order").
2.  (AC2): The chatbot's response **must not** attempt to collect any order information (address, quantity, payment).
3.  (AC3): The chatbot must reply by funneling the user to the website (e.g., "To place an order, please visit our website: [link to product or main page]").

---
## Story 2.4: Implement Ambiguous Query Response
**As a** customer,
**I want** to ask an ambiguous question (e.g., "do you have red shirts?"),
**so that** the chatbot provides a helpful, graceful response instead of just failing.

### Acceptance Criteria
1.  (AC1): The chatbot can parse a query to separate likely *intent* ("shirt") from *attributes* ("red").
2.  (AC2): The chatbot searches the product **Titles** using only the intent ("shirt").
3.  (AC3): The chatbot replies with a helpful, "honest" response stating its limitations (e.g., "I found 'Casual T-Shirt' and 'Formal Shirt,' but I cannot see colors.").
4.  (AC4): The response must include a helpful link to the website search page (e.g., "[subdomain.com/search?q=shirt]").

---
