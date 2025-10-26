# Database Migration: Messenger Connections

This migration creates the database schema for storing Facebook Messenger page connections.

## What This Migration Does

1. **Creates `messenger_connections` table** with the following fields:
   - `id`: Unique identifier for the connection
   - `owner_id`: References the business owner (profiles table)
   - `page_id`: Facebook Page ID (unique)
   - `page_name`: Name of the Facebook Page
   - `page_access_token`: Facebook Page Access Token (encrypted)
   - `connected_at`: When the connection was established
   - `updated_at`: Last update timestamp
   - `is_active`: Whether the connection is currently active

2. **Creates indexes** for faster lookups:
   - Index on `page_id` for webhook lookups
   - Index on `owner_id` for dashboard queries

3. **Sets up Row Level Security (RLS)**:
   - Owners can only view/modify their own connections
   - Service role can read all connections (for webhook processing)

4. **Creates helper functions**:
   - `get_owner_by_page_id()`: Lookup owner by Facebook Page ID
   - `deactivate_old_messenger_connections()`: Automatically deactivate old connections when adding new ones

5. **Creates triggers**:
   - Auto-update `updated_at` timestamp
   - Auto-deactivate old connections when a new one is added

## How to Apply This Migration

### Option 1: Using Supabase Dashboard (Recommended for Prototype)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the content of `20251026000001_create_messenger_connections.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute the migration

### Option 2: Using Supabase CLI (For Production)

```bash
# If you have Supabase CLI installed
supabase db push

# Or apply the specific migration
supabase migration up
```

### Option 3: Direct SQL Execution

If you're using a local Supabase instance or have direct database access:

```bash
psql -h <your-supabase-host> -d postgres -U postgres -f supabase/migrations/20251026000001_create_messenger_connections.sql
```

## Verification

After applying the migration, verify it worked by running this SQL query:

```sql
-- Check if the table was created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'messenger_connections';

-- Check if the RLS policies were created
SELECT policyname 
FROM pg_policies 
WHERE tablename = 'messenger_connections';
```

## Security Notes

⚠️ **Important**: The `page_access_token` field stores sensitive Facebook credentials. Ensure:
- Your Supabase instance uses encryption at rest
- RLS policies are properly configured (done by this migration)
- Access to service role keys is restricted
- Never expose page access tokens in client-side code

## Next Steps

After applying this migration:
1. The Chatbot page will start fetching real connection data
2. You can proceed to implement the Facebook OAuth flow
3. Then implement the webhook receiver for incoming messages
