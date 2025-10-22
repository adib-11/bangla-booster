# Security and Performance

## Security Requirements

  * **Frontend:** Use Next.js defaults, CSP headers, secure NextAuth.js cookie storage.
  * **Backend:** Server-side input validation (Zod/Yup), secure NextAuth.js session checks in API routes, secure secrets via Vercel Env Vars.
  * **Auth:** Secure password hashing (via NextAuth.js adapter), enforce basic password rules.

## Performance Optimization

  * **Frontend:** Leverage Next.js features (code splitting, `<Image>` opt.), Vercel CDN, keep bundles reasonable.
  * **Backend:** Ensure DB indexes, monitor function duration (cold starts), minimal server-side caching needed for prototype.

-----
