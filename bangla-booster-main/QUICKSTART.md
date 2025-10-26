# 🚀 Quick Setup Instructions

## For You: 2 Simple Steps

### Step 1: Submit to Lovable (5 minutes)

1. Open **Lovable** project: https://lovable.dev/projects/24f22c1e-e053-414f-a5e9-de135140ccf0

2. Copy the ENTIRE content from **`LOVABLE_PROMPT.md`**

3. Paste it into Lovable's chat

4. Wait for Lovable to complete all tasks:
   - ✅ Apply database migration
   - ✅ Configure 6 Supabase secrets
   - ✅ Deploy 4 edge functions
   - ✅ Update .env file

### Step 2: Configure Facebook Webhook (10 minutes)

After Lovable confirms completion, follow **`FACEBOOK_WEBHOOK_SETUP.md`**

Quick summary:
1. Go to: https://developers.facebook.com/apps
2. Open your app (App ID: 594114677125845)
3. Messenger → Settings → Webhooks
4. Add callback URL:
   ```
   https://ryvycczwsispkspsskfp.supabase.co/functions/v1/messenger-webhook
   ```
5. Verify token:
   ```
   my_super_secret_verify_token_abc123xyz789
   ```
6. Subscribe to: `messages` and `messaging_postbacks`

---

## Test Your Chatbot (5 minutes)

```bash
npm run dev
```

1. Visit http://localhost:5173
2. Add products in Dashboard
3. Test in Chatbot page
4. Send message to your Facebook Page
5. **Bot responds automatically!** 🎉

---

## Your Credentials Reference

**Facebook:**
- App ID: `594114677125845`
- Page ID: `594114677125845`
- Verify Token: `my_super_secret_verify_token_abc123xyz789`

**Google:**
- Gemini API Key: `AIzaSyBRfw2A31W-In96Tciyxq8HW2Iz-Pw1Z8k`

**Supabase:**
- Project: `ryvycczwsispkspsskfp`
- Webhook URL: `https://ryvycczwsispkspsskfp.supabase.co/functions/v1/messenger-webhook`

---

## Files You Need

1. **`LOVABLE_PROMPT.md`** ← Copy this to Lovable
2. **`FACEBOOK_WEBHOOK_SETUP.md`** ← Follow this after Lovable completes

---

## Support

If anything doesn't work:
1. Check Supabase function logs
2. Check Facebook webhook status (should show "Complete")
3. Review `FACEBOOK_WEBHOOK_SETUP.md` troubleshooting section

**Total Time:** ~20 minutes  
**Difficulty:** Easy (just copy-paste and click!)
