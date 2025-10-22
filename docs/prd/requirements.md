# Requirements

## Functional
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

## Non Functional
* **NFR1:** The "Add New Product" form must be simple and friendly, usable by a non-technical person.
* **NFR2:** The chatbot's primary function must be information retrieval and navigation; it must not handle transactions.

---
