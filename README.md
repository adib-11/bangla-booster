# AI Chat Web Prototype

A monorepo-based web application featuring an intelligent chatbot for e-commerce product browsing.

## Project Structure

```
ai-chat-web-prototype/
├── apps/web/                    # Next.js Frontend + API Routes
├── packages/
│   ├── shared/                  # Shared types and utilities
│   └── config/                  # Shared configurations
├── docs/                        # Project documentation
├── .env.example                 # Environment variables template
└── README.md
```

## Tech Stack

- **Frontend:** Next.js 14.x with TypeScript, Tailwind CSS
- **UI Library:** MUI or Chakra UI
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **Authentication:** NextAuth.js 5.x
- **File Storage:** Vercel Blob
- **Testing:** Jest + React Testing Library

## Prerequisites

- Node.js ~v20.x
- npm/pnpm/yarn
- Git

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-chat-web-prototype
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase database:
   - Follow instructions in `database/README.md` to:
     - Create a Supabase project
     - Run the initial migration
     - Get your connection credentials

4. Set up environment variables:
```bash
cp .env.example apps/web/.env.local
# Edit apps/web/.env.local with your actual Supabase values
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm test         # Run tests
npm run lint     # Run linting
```

## Environment Variables

See `.env.example` for required environment variables including:
- Supabase connection details
- NextAuth.js configuration
- Vercel Blob storage token
- Facebook Messenger API credentials

## Documentation

Detailed documentation is available in the `docs/` directory:
- Architecture specifications
- PRD and epic definitions
- Story implementations

## License

Proprietary - All rights reserved
