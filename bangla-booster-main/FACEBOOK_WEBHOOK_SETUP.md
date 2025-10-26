# Facebook Webhook Setup Guide

**After Lovable completes the Supabase configuration**, follow these steps to configure the Facebook webhook.

---

## Prerequisites ✅

You should have:
- ✅ Facebook Page ID: `594114677125845`
- ✅ Page Access Token: (your token)
- ✅ Verify Token: `my_super_secret_verify_token_abc123xyz789`
- ✅ Edge functions deployed (done by Lovable)

---

## Step 1: Access Facebook App Dashboard

1. Go to: **https://developers.facebook.com/apps**
2. Sign in with your Facebook account
3. Click on your app (the one with App ID `594114677125845`)

---

## Step 2: Configure Messenger Webhook

1. In the left sidebar, click **Messenger** → **Settings**

2. Scroll down to the **Webhooks** section

3. Click **Add Callback URL**

4. Enter the following details:

   **Callback URL:**
   ```
   https://ryvycczwsispkspsskfp.supabase.co/functions/v1/messenger-webhook
   ```

   **Verify Token:**
   ```
   my_super_secret_verify_token_abc123xyz789
   ```

5. Click **Verify and Save**

   ✅ You should see "Complete" status

---

## Step 3: Subscribe to Webhook Events

1. Still in the **Webhooks** section, find **Webhook Fields**

2. Check these boxes:
   - ✅ **messages**
   - ✅ **messaging_postbacks**

3. Click **Save**

---

## Step 4: Connect Your Facebook Page

1. Scroll down to **Access Tokens** section

2. Click **Add or Remove Pages**

3. Select your Facebook Page

4. Grant the necessary permissions:
   - ✅ Manage and access Page conversations in Messenger
   - ✅ Read content posted on the Page
   - ✅ Manage your Pages

5. Click **Done**

6. For your page, click **Subscribe to events**

7. Make sure these are checked:
   - ✅ **messages**
   - ✅ **messaging_postbacks**

---

## Step 5: Verify Webhook Connection

You can verify the webhook is working by checking the webhook status:

1. In **Messenger** → **Settings** → **Webhooks**
2. Your webhook should show:
   - ✅ Callback URL: Connected
   - ✅ Status: Complete

---

## Step 6: Test the Connection

### Option A: Use Facebook's Test Button (if available)
1. In the Webhooks section, there may be a "Test" button
2. Send a test message

### Option B: Send a Real Message
1. Go to your Facebook Page
2. From a different Facebook account (or your personal account), send a message to your page
3. The chatbot should respond automatically!

---

## Troubleshooting

### Webhook Verification Failed
- ✅ Verify token must exactly match: `my_super_secret_verify_token_abc123xyz789`
- ✅ Webhook URL must be: `https://ryvycczwsispkspsskfp.supabase.co/functions/v1/messenger-webhook`
- ✅ Check that the `messenger-webhook` function is deployed in Supabase

### Webhook Verified But No Response
- Check Supabase function logs:
  - Go to: https://supabase.com/dashboard/project/ryvycczwsispkspsskfp/functions
  - Click on `messenger-webhook` → **Logs** tab
  - Send a test message and watch for logs

### How to Check Logs
1. Go to Supabase Dashboard → Functions
2. Click on each function to see logs:
   - `messenger-webhook` - receives messages
   - `chatbot-processor` - processes responses
   - `gemini-analyzer` - AI analysis
   - `facebook-oauth-callback` - handles page connections

---

## What Happens Next?

Once configured:
1. ✅ Customers message your Facebook Page
2. ✅ Facebook sends message to your webhook
3. ✅ Webhook forwards to `chatbot-processor`
4. ✅ Gemini AI analyzes the message
5. ✅ Bot responds with product info/links
6. ✅ Customer sees response in Messenger!

---

## Testing the Full Flow

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Add some products:**
   - Go to http://localhost:5173
   - Sign in
   - Go to Dashboard
   - Add 2-3 products with clear names

3. **Test built-in simulator:**
   - Go to Chatbot page
   - Use "Test Your Chatbot" section
   - Try: "What's the price of [product name]?"

4. **Connect your Facebook Page:**
   - Click "Connect to Messenger"
   - Authorize your Facebook Page

5. **Send a real message:**
   - From another account, message your Facebook Page
   - Try: "Hello", "What products do you have?", "What's the price of [product]?"

---

## Success Criteria ✅

You'll know it's working when:
- ✅ Webhook shows "Complete" in Facebook
- ✅ Test messages get automatic responses
- ✅ Product details appear in Messenger
- ✅ Images and buttons work
- ✅ Links redirect to your website

---

## Next Steps After Setup

Once everything works:

1. **Monitor Performance:**
   - Check Supabase function logs regularly
   - Monitor response times

2. **Add More Products:**
   - More products = better AI matching
   - Use clear, descriptive product names

3. **Go to Production:**
   - Update `CLIENT_URL` secret to your production domain
   - Add production domain to Facebook App settings

---

**Setup Date:** _____________  
**Status:** _____________  
**Notes:** _____________
