# Technical Assumptions

## Repository Structure: Monorepo
* A "monorepo" will be used, meaning all the code for your project (frontend website, backend chatbot logic, shared code) will live in a single repository.
* **Rationale:** This is the simplest approach for a prototype. It makes it easy to share code (like product definitions) between your website and your chatbot and simplifies development and deployment.

## Service Architecture: Serverless
* The system will use a "serverless" architecture. This means we won't be managing a full-time server.
* **Rationale:** The website can be a static or server-rendered site (e.g., on Vercel or Netlify), and the chatbot logic can be a simple "serverless function" (e.g., AWS Lambda, Vercel Function). This is low-cost, scales automatically, and is very fast to build for a prototype.

## Testing Requirements: Unit Only
* For the prototype, the development team will focus on writing "Unit Tests" (testing small, individual pieces of logic) to ensure the core functions (like searching, price lookup) work correctly.
* **Rationale:** This provides a good balance of quality for a competition prototype without the high overhead of full "Integration" or "End-to-End" testing.

## Additional Technical Assumptions and Requests
* **Frontend Framework:** React (or a React-based framework like Next.js) will be used for the website builder and product showcase.
    * **Rationale:** It is the most popular framework, has excellent support, and is ideal for building the simple, component-based grid you described.
* **Backend Language:** Node.js (JavaScript/TypeScript) will be used for the serverless chatbot functions.
    * **Rationale:** This allows the frontend and backend to use the same language, which simplifies development in a monorepo.
* **Database:** A simple, serverless-friendly database will be used (e.g., a free-tier PostgreSQL on Supabase/Neon or a NoSQL database like Firebase Firestore).
    * **Rationale:** These are easy to set up, connect to, and are perfect for storing the simple (Title, Price, Image) product data.

---
