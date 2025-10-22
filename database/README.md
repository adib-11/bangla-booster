# Database Setup

## Supabase Setup Instructions

1. **Create a Supabase Project**
   - Go to https://supabase.com
   - Sign up or log in
   - Click "New Project"
   - Choose an organization and fill in project details
   - Wait for the project to be provisioned

2. **Get Your Connection Details**
   - Navigate to Project Settings > API
   - Copy the following values:
     - Project URL (NEXT_PUBLIC_SUPABASE_URL)
     - `anon` `public` key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
     - `service_role` key (SUPABASE_SERVICE_ROLE_KEY)

3. **Run the Initial Migration**
   - Navigate to SQL Editor in Supabase dashboard
   - Copy the contents of `migrations/001_initial_schema.sql`
   - Paste into the SQL editor and run

4. **Verify Schema**
   - Go to Table Editor in Supabase
   - Verify `owners` and `products` tables exist
   - Check indexes under Database > Indexes

5. **Update Environment Variables**
   - Copy `.env.example` to `.env.local` in `apps/web/`
   - Fill in the Supabase values you copied in step 2

## Database Schema

### Owners Table
- Stores business owner accounts
- Each owner has a unique subdomain and email
- Facebook integration fields for Messenger

### Products Table
- Stores products for each owner
- Linked to owners via foreign key
- Price validation via CHECK constraint
- Indexed for search performance

## Migrations

All database migrations are stored in the `migrations/` directory.
Run them sequentially in Supabase SQL Editor.
