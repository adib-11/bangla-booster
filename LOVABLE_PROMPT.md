# Prompt for Lovable - Chatbot Supabase Configuration

Copy and paste this entire prompt into Lovable:

---

I need you to complete the Supabase configuration for the AI chatbot functionality that's already coded in this project. Here's what needs to be done:

## 1. Apply Database Migration

Run the migration file `supabase/migrations/20251026000001_create_messenger_connections.sql` to create the `messenger_connections` table. This table stores Facebook Page connections for the chatbot.

## 2. Configure Supabase Edge Function Secrets

Add the following secrets to the Supabase project (Settings → Edge Functions → Secrets):

**FB_APP_ID**
```
594114677125845
```

**FB_APP_SECRET**
```
EAAK0v5ZAOmREBPZB0OgYaY5KchyXA4cEA4mTYCLNJLje36ZBRfnzs1djhSOtnubnSmYS9dLO7k0ECDgKZBQkzbqbRkHDepIHU7qK6JzqH9ZAWvwDZBAz9nU1m7zGXBZBDU3t1nZC0lXrgmWLZAkZCMOVR6ZA1Ok4FOzdd2CHpSawBAqKlmDvMfelpinxUP90gaZBAhynhY6d5bqm
```

**FB_VERIFY_TOKEN**
```
my_super_secret_verify_token_abc123xyz789
```

**FB_REDIRECT_URI**
```
https://ryvycczwsispkspsskfp.supabase.co/functions/v1/facebook-oauth-callback
```

**GEMINI_API_KEY**
```
AIzaSyBRfw2A31W-In96Tciyxq8HW2Iz-Pw1Z8k
```

**CLIENT_URL**
```
http://localhost:5173
```

## 3. Deploy Edge Functions

Deploy all 4 edge functions to Supabase:
- `messenger-webhook`
- `chatbot-processor`
- `gemini-analyzer`
- `facebook-oauth-callback`

These are already coded in the `supabase/functions/` directory.

## 4. Update Frontend Environment Variable

Update the `.env` file to include:
```
VITE_FB_APP_ID=594114677125845
```

## Summary

After you complete these tasks:
- ✅ Database will have the `messenger_connections` table
- ✅ All 6 secrets will be configured in Supabase
- ✅ All 4 edge functions will be deployed
- ✅ Frontend will have the Facebook App ID configured

I will handle the Facebook webhook configuration separately.

Please confirm when all these tasks are completed so I can proceed with the webhook setup.

---

**End of prompt for Lovable**
