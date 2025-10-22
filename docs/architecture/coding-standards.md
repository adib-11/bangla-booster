# Coding Standards

## Critical Fullstack Rules

  * Use TypeScript; avoid `any`; use shared types (`packages/shared`).
  * Access environment variables via `process.env`; use `.env.example`; secure secrets; use `NEXT_PUBLIC_` prefix correctly.
  * Use API service layer in frontend; don't call `fetch`/`axios` in components.
  * Basic try/catch error handling; log errors via `console.error`.
  * Use defined state management pattern (Context/Zustand).
  * Use data access functions for DB operations.
  * Use Tailwind CSS utilities primarily for styling.
  * Follow basic security (input validation, auth checks).

## Naming Conventions

| Element        | Frontend                | Backend (API Routes/Funcs) | Example                        |
| :------------- | :---------------------- | :------------------------- | :----------------------------- |
| Files (TS/TSX) | `PascalCase.tsx`/`.ts`  | `kebab-case.ts` (API route)| `ProductCard.tsx`, `db.ts`     |
| Components     | `PascalCase`            | N/A                        | `ProductGrid`                  |
| Hooks          | `useCamelCase`          | N/A                        | `useAuth`                      |
| Variables/Funcs| `camelCase`             | `camelCase`                | `productTitle`, `fetchProducts`|
| CSS Classes    | (Tailwind Utilities)    | N/A                        | `text-lg`, `bg-blue-500`       |
| API Routes     | N/A                     | `kebab-case`               | `/api/user-profile`            |
| DB Tables/Cols | N/A                     | `snake_case`               | `owners`, `owner_id`           |

-----
