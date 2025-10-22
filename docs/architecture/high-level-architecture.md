# High Level Architecture

## Technical Summary
This project employs a **serverless, fullstack architecture** designed for rapid prototyping and cost-efficiency, aligning with the competition goal. It utilizes a **React/Next.js frontend** hosted statically or server-rendered, communicating with **Node.js serverless functions** for backend logic (like product saving and chatbot responses). Data is stored in a simple, **serverless-friendly database** (e.g., Supabase PostgreSQL). Key integrations include image storage and the **Facebook Messenger API**. The entire system is structured within a **monorepo** for simplified code sharing and deployment. This architecture directly supports the goals of providing a simple website builder and an integrated chatbot.

## Platform and Infrastructure Choice
* **Recommendation:** **Vercel**.
* **Rationale:** Excellent Next.js support, built-in serverless functions, straightforward subdomain management potential, integrated workflow, generous free tier suitable for prototype.
* **Platform:** Vercel.
* **Key Services:** Vercel Hosting, Vercel Functions, Vercel Blob (or similar like Cloudinary/AWS S3 for image storage).
* **Deployment Host and Regions:** Vercel Global Edge Network.

## Repository Structure
* **Structure:** Monorepo.
* **Monorepo Tool:** npm workspaces (or pnpm/yarn workspaces).
* **Package Organization:** Use a standard structure like `apps/` (for `web` frontend, `chatbot` backend) and `packages/` (for `shared` types/code).

## High Level Architecture Diagram

```mermaid
graph TD
    subgraph Browser
        U[User/Customer] --> FE[Next.js Frontend on Vercel];
    end

    subgraph Facebook Messenger
        C[Customer] <-- Msgs --> FB[Facebook Messenger API];
    end

    subgraph Vercel Platform
        FE -- API Calls --> API[Vercel Functions (Node.js)];
        API -- DB Ops --> DB[(Serverless DB e.g., Supabase)];
        API -- Img Ops --> Store[Image Storage (Vercel Blob / S3)];
        FB -- Webhook --> ChatFunc[Chatbot Vercel Function (Node.js)];
        ChatFunc -- DB Ops --> DB;
        ChatFunc -- Msgs --> FB;
    end

    subgraph Admin Area (Part of FE)
        Owner[Business Owner] --> AdminFE[Admin Dashboard in Next.js];
        AdminFE -- API Calls --> API;
    end

    FE -- Reads Images --> Store;
    AdminFE -- Uploads Images --> API;
````

## Architectural Patterns

  * **Jamstack/Serverless:** Using a statically generated or server-rendered frontend with serverless functions for dynamic backend logic. *Rationale:* Aligns with PRD for low cost, scalability, and rapid development.
  * **Component-Based UI:** Using React/Next.js components for the frontend. *Rationale:* Standard practice for React, promotes reusability and maintainability.
  * **API Layer (Serverless Functions):** Backend logic exposed via simple HTTP endpoints deployed as serverless functions. *Rationale:* Simple, scalable, fits the chosen platform.
  * **Webhook Integration:** Facebook Messenger integration via webhooks triggering a serverless function. *Rationale:* Standard pattern for chatbot integrations.

-----
