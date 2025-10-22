# Tech Stack

## Technology Stack Table

| Category             | Technology         | Version   | Purpose                                     | Rationale                                                                        |
| :------------------- | :----------------- | :-------- | :------------------------------------------ | :------------------------------------------------------------------------------- |
| Frontend Language    | TypeScript         | \~5.x      | Primary FE language                         | Strong typing, aligns with modern React/Next.js practices         |
| Frontend Framework   | Next.js (React)    | \~14.x     | App framework (SSR, SSG, API routes)        | Matches PRD, excellent Vercel integration, good DX               |
| UI Component Library | **MUI** or **Chakra UI** | Latest    | Pre-built React components                  | Accelerates UI development, ensures consistency. Choice TBD. |
| State Management     | **React Context** | Latest    | Global state management                     | Simple, fits prototype scope. Can upgrade to Zustand if needed.   |
| Backend Language     | TypeScript         | \~5.x      | Primary BE language                         | Consistency with frontend, strong typing for serverless functions |
| Backend Framework    | **Next.js API Routes** | \~14.x     | Backend logic hosting                       | Integrated with Next.js, simplest for Vercel functions            |
| API Style            | REST               | N/A       | FE/BE communication                         | Simple, standard, well-supported by Next.js API routes.                          |
| Database             | **Supabase (PostgreSQL)** | Latest    | Primary data storage                        | Serverless-friendly, generous free tier, easy setup.               |
| Cache                | N/A                | N/A       | (Not needed for prototype)                  | Keep scope minimal.                                               |
| File Storage         | **Vercel Blob** | Latest    | Image uploads (Story 1.5)       | Integrated with chosen platform, simple API.                                  |
| Authentication       | **NextAuth.js** | \~5.x      | User signup/login (Story 1.2)    | Standard for Next.js, handles email/password & social logins easily.             |
| Frontend Testing     | Jest + RTL         | Latest    | Unit/Integration tests                      | Standard for React/Next.js, fulfills PRD "Unit Only".             |
| Backend Testing      | Jest               | Latest    | Unit tests for API routes/functions         | Consistent with frontend, fulfills PRD "Unit Only".               |
| E2E Testing          | N/A                | N/A       | (Out of scope for prototype testing)        | Keep scope minimal.                                               |
| Build Tool           | Next.js (built-in) | \~14.x     | Bundling, Compiling                         | Comes integrated with the framework.                                             |
| Bundler              | Webpack/Turbopack  | Latest    | (Handled by Next.js)                        | Comes integrated with the framework.                                             |
| IaC Tool             | N/A                | N/A       | (Vercel handles infrastructure via UI/CLI)  | Platform handles deployment infra implicitly.                                    |
| CI/CD                | Vercel             | N/A       | Automated builds & deployments              | Integrated with platform, simple Git push workflow.                              |
| Monitoring           | Vercel Analytics   | N/A       | Basic usage/performance monitoring          | Built-in to platform, sufficient for prototype.                                  |
| Logging              | Vercel Functions Logs | N/A       | Backend function logging                  | Built-in to platform, sufficient for prototype debugging.                        |
| CSS Framework        | **Tailwind CSS** | Latest    | Utility-first CSS                           | Integrates well with component libraries, speeds up styling.                     |

-----
