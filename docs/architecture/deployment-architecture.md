# Deployment Architecture

## Deployment Strategy

  * **Frontend:** Vercel Hosting via Next.js build.
  * **Backend:** Vercel Functions via Next.js API routes build.

## CI/CD Pipeline

  * **Platform:** Vercel CI/CD.
  * **Trigger:** Git push.
  * **Pipeline:** Install -\> Build (`apps/web`) -\> Test -\> Deploy.

## Environments

| Environment   | Frontend URL                      | Backend URL (API Routes) | Purpose                |
| :------------ | :-------------------------------- | :----------------------- | :--------------------- |
| Development   | `http://localhost:3000`           | Included                 | Local development      |
| Preview       | `[branch]-xyz.vercel.app`         | Included                 | Vercel Preview Deploys |
| Production    | `[main-domain]/[subdomain]`       | Included                 | Live environment       |
*Note: Dynamic subdomains need Vercel config.*

-----
