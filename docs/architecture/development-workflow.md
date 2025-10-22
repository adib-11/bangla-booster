# Development Workflow

## Local Development Setup

### Prerequisites

  * Node.js (\~v20.x)
  * npm/pnpm/yarn
  * Git

### Initial Setup

```bash
git clone <repository-url>
cd <repository-name>
npm install # or pnpm install / yarn install
```

### Development Commands

```bash
# Start Next.js dev server (includes FE and API routes)
npm run dev --workspace=web # or pnpm --filter web dev

# Run tests
npm test # or pnpm test
```

## Environment Configuration

### Required Environment Variables

See `.env.example`. Key variables:

```bash
# Example .env.example

# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=... # Backend only

# NextAuth.js
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000

# Image Storage
BLOB_READ_WRITE_TOKEN=... # Backend only

# Facebook Messenger API
FACEBOOK_APP_SECRET=... # Backend only
FACEBOOK_VERIFY_TOKEN=... # Backend only

# Ensure secrets are NOT prefixed with NEXT_PUBLIC_
```

-----
