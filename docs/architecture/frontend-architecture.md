# Frontend Architecture

## Component Architecture

### Component Organization

Components organized by feature in `apps/web/src/components/`. Shared UI elements in `ui` sub-directory or `packages/ui`.

```text
apps/web/src/
├── components/
│   ├── ui/                 # Basic, reusable UI elements
│   ├── products/           # Product related components
│   │   ├── ProductGrid.tsx
│   │   ├── ProductCard.tsx   #
│   │   └── SearchBar.tsx     #
│   ├── owner/              # Admin dashboard components
│   │   ├── AddProductForm.tsx #
│   │   └── OwnerDashboard.tsx #
│   └── auth/               # Auth components
│       ├── LoginForm.tsx
│       └── SignupForm.tsx    #
└── ...
```

### Component Template

Standard React functional components with TypeScript props. Use UI library components (MUI/Chakra).

```typescript
import React from 'react';
// Import UI library components

type MyComponentProps = { /* ... */ };

const MyComponent: React.FC<MyComponentProps> = (props) => {
  // ... state and effects ...
  return (
    {/* Use UI Library components */}
  );
};
export default MyComponent;
```

## State Management Architecture

### State Structure

Start with **React Context** for global auth state. Manage feature state locally or lift state up.

```typescript
// Example: apps/web/src/context/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
// ... AuthState, AuthContextProps ...
const AuthContext = createContext<AuthContextProps | undefined>(undefined);
export const AuthProvider = ({ children }: { children: ReactNode }) => { /* ... */ };
export const useAuth = () => { /* ... */ };
```

### State Management Patterns

  * Use context hooks (`useAuth`).
  * Prefer local `useState`.
  * Consider server state libraries (React Query/SWR) later for API data caching.

## Routing Architecture

### Route Organization

Use Next.js file-system router (`pages/` or `app/`).

```text
apps/web/src/
├── pages/ or app/
│   ├── index.tsx                 # Public showcase (dynamic)
│   ├── [subdomain]/index.tsx     # Dynamic route for showcase
│   ├── [subdomain]/product/[id].tsx # Product Detail Page
│   ├── admin/                    # Owner admin area (protected)
│   │   ├── index.tsx             # Product Dashboard
│   │   └── add-product.tsx     # Add Product Page
│   ├── auth/
│   │   ├── login.tsx
│   │   └── signup.tsx            #
│   └── api/                      # Backend API routes
└── ...
```

### Protected Route Pattern

Use NextAuth.js middleware to protect `/admin/*` routes.

```typescript
// Example: apps/web/middleware.ts
export { auth as middleware } from "./auth"
export const config = { matcher: ["/admin/:path*"] };
```

## Frontend Services Layer

### API Client Setup

Use `axios` wrapper configured for base URL and interceptors.

```typescript
// Example: apps/web/src/services/apiClient.ts
import axios from 'axios';
const apiClient = axios.create({ baseURL: '/api', /* ... */ });
// Optional interceptors for auth/errors
export default apiClient;
```

### Service Example

Encapsulate API calls by domain.

```typescript
// Example: apps/web/src/services/productService.ts
import apiClient from './apiClient';
import { Product } from 'packages/shared/src/types';

export const addProduct = async (/* ... */): Promise<Product> => { /* ... */ };
export const getProductsBySubdomain = async (/* ... */): Promise<Product[]> => { /* ... */ };
```

-----
