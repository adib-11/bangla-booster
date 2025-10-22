# Unified Project Structure

```plaintext
ai-chat-web-prototype/
├── apps/
│   ├── web/                    # Next.js Frontend + API Routes
│   │   ├── src/
│   │   │   ├── app/            # Or pages/
│   │   │   │   ├── (admin)/
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   └── page.tsx      # Admin Dashboard
│   │   │   │   ├── (auth)/
│   │   │   │   │   ├── login/page.tsx
│   │   │   │   │   └── signup/page.tsx
│   │   │   │   ├── api/        # API Routes
│   │   │   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   │   │   ├── owner/subdomain/route.ts
│   │   │   │   │   ├── products/route.ts
│   │   │   │   │   └── webhook/messenger/route.ts
│   │   │   │   ├── [subdomain]/
│   │   │   │   │   ├── page.tsx      # Showcase
│   │   │   │   │   └── product/[productId]/page.tsx # Detail
│   │   │   │   └── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── components/
│   │   │   ├── context/
│   │   │   ├── hooks/
│   │   │   ├── lib/            # DB client, utils
│   │   │   ├── services/
│   │   │   └── styles/
│   │   ├── public/
│   │   ├── middleware.ts
│   │   ├── next.config.js
│   │   ├── postcss.config.js
│   │   ├── tailwind.config.ts
│   │   └── package.json
├── packages/
│   ├── shared/                 # Shared types/utils
│   │   ├── src/
│   │   │   └── types.ts
│   │   └── package.json
│   └── config/                 # Shared configs (ESLint, TSConfig)
├── docs/
│   ├── PRD.md
│   ├── UI:UX.md
│   └── architecture.md
├── .env.example
├── .gitignore
├── package.json                # Root package.json (workspaces)
├── tsconfig.json
└── README.md
```

-----
