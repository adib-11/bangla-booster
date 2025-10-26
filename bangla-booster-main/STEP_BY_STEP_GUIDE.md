# 🚀 Chatbot Setup - Step by Step Guide

**Last Updated:** October 26, 2025  
**Estimated Time:** 60 minutes

---

## 📋 Progress Tracker

- [ ] Step 1: Database Migration
- [ ] Step 2: Facebook App Setup
- [ ] Step 3: Gemini API Key
- [ ] Step 4: Supabase Secrets
- [ ] Step 5: Deploy Functions
- [ ] Step 6: Facebook Webhook
- [ ] Step 7: Frontend Config
- [ ] Step 8: Testing

---

## Step 1: Verify Database Migration ✅

**Goal:** Ensure the `messenger_connections` table exists in your database.

### Instructions:

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/ryvycczwsispkspsskfp
   - Sign in with your account

2. **Check if table exists:**
   - Click **"Table Editor"** in the left sidebar
   - Look for `messenger_connections` table in the list
   
3. **If table DOES NOT exist, create it:**
   - Click **"SQL Editor"** in left sidebar
   - Click **"New Query"**
   - Copy the ENTIRE contents of this file:
     ```
     supabase/migrations/20251026000001_create_messenger_connections.sql
     ```
   - Paste into the SQL editor
   - Click **"Run"** (or press Ctrl/Cmd + Enter)
   - Should see: ✅ "Success. No rows returned"

4. **Verify:**
   - Go back to **Table Editor**
   - You should now see `messenger_connections` table with columns:
     - id
     - owner_id
     - page_id
     - page_name
     - page_access_token
     - connected_at
     - updated_at
     - is_active

**✅ When complete, check the box above and move to Step 2**

---

## Step 2: Get Facebook App Credentials 📱

**Goal:** Create a Facebook App and get your App ID and App Secret.

### Instructions:

1. **Go to Facebook Developers**
   - Visit: https://developers.facebook.com/apps
   - Sign in with your Facebook account

2. **Create New App**
   - Click **"Create App"** button
   - Select **"Business"** as the app type
   - Click **"Next"**

3. **Fill in App Details:**
   - **App Name:** `Bangla Booster Chatbot` (or your business name)
   - **Contact Email:** Your email address
   - Click **"Create App"**

4. **Get Your App ID:**
   - After creation, you'll see your **App ID** at the top of the dashboard
   - **COPY THIS** → Write it down:
     ```
     Facebook App ID: _____________________
     ```

5. **Get Your App Secret:**
   - Click **"Settings"** → **"Basic"** in left sidebar
   - Find **"App Secret"**
   - Click **"Show"** button
   - You may need to re-enter your Facebook password
   - **COPY THIS** → Write it down:
     ```
     Facebook App Secret: _____________________
     ```

6. **Add Messenger Product:**
   - On the dashboard home page, find **"Add Product"** section
   - Find **"Messenger"** in the list
   - Click **"Set Up"** button
   - Keep this tab open - we'll use it in Step 6!

**✅ When complete, check the box above and move to Step 3**

---

## Step 3: Get Google Gemini API Key 🤖

**Goal:** Get an API key for Google's Gemini AI.

### Instructions:

1. **Visit Google AI Studio**
   - Go to: https://makersuite.google.com/app/apikey
   - Sign in with your Google account

2. **Create API Key**
   - Click **"Create API Key"** button
   - If prompted, select or create a Google Cloud project
   - Copy the API key shown

3. **Save Your Key:**
   - **COPY THIS** → Write it down:
     ```
     Gemini API Key: _____________________
     ```

**✅ When complete, check the box above and move to Step 4**

---

## Step 4: Configure Supabase Secrets 🔐

**Goal:** Add all environment variables to Supabase.

### Instructions:

1. **Open Supabase Settings**
   - Go to: https://supabase.com/dashboard/project/ryvycczwsispkspsskfp/settings/functions
   - This is: Settings → Edge Functions

2. **Add Each Secret:**
   - Scroll to the **"Secrets"** section
   - Click **"Add New Secret"**
   - Add the following 6 secrets one by one:

   **Secret 1:**
   ```
   Name: FB_APP_ID
   Value: [Paste your Facebook App ID from Step 2]
   ```

   **Secret 2:**
   ```
   Name: FB_APP_SECRET
   Value: [Paste your Facebook App Secret from Step 2]
   ```

   **Secret 3:**
   ```
   Name: FB_VERIFY_TOKEN
   Value: bangla_booster_verify_token_2025
   ```

   **Secret 4:**
   ```
   Name: FB_REDIRECT_URI
   Value: https://ryvycczwsispkspsskfp.supabase.co/functions/v1/facebook-oauth-callback
   ```

   **Secret 5:**
   ```
   Name: GEMINI_API_KEY
   Value: [Paste your Gemini API Key from Step 3]
   ```

   **Secret 6:**
   ```
   Name: CLIENT_URL
   Value: http://localhost:5173
   ```
   (Later change to your production URL when deploying)

3. **Verify All Secrets:**
   - You should see all 6 secrets listed:
     - FB_APP_ID
     - FB_APP_SECRET
     - FB_VERIFY_TOKEN
     - FB_REDIRECT_URI
     - GEMINI_API_KEY
     - CLIENT_URL

**✅ When complete, check the box above and move to Step 5**

---

## Step 5: Deploy Edge Functions 🚀

**Goal:** Upload your chatbot functions to Supabase.

### Instructions:

1. **Open Terminal in Project Directory**
   - In VS Code, open a new terminal (Terminal → New Terminal)
   - Make sure you're in the project root:
     ```bash
     pwd
     # Should show: /Users/adib/Desktop/Solvio/bangla-booster-main
     ```

2. **Login to Supabase CLI**
   ```bash
   npx supabase login
   ```
   - This will open a browser window
   - Authorize the CLI

3. **Link Your Project**
   ```bash
   npx supabase link --project-ref ryvycczwsispkspsskfp
   ```
   - When prompted for database password, enter your Supabase database password
   - If you don't know it, you can reset it in Supabase Dashboard → Settings → Database

4. **Deploy All Functions**
   ```bash
   chmod +x deploy-functions.sh
   ./deploy-functions.sh
   ```
   - Wait for deployment to complete
   - Should see success messages for all 4 functions

5. **Verify Deployment:**
   - Go to: https://supabase.com/dashboard/project/ryvycczwsispkspsskfp/functions
   - You should see 4 deployed functions:
     - ✅ `messenger-webhook`
     - ✅ `chatbot-processor`
     - ✅ `gemini-analyzer`
     - ✅ `facebook-oauth-callback`

**✅ When complete, check the box above and move to Step 6**

---

## Step 6: Configure Facebook Messenger Webhook 🔗

**Goal:** Connect Facebook to your Supabase webhook.

### Instructions:

1. **Go Back to Facebook App Dashboard**
   - Visit: https://developers.facebook.com/apps
   - Click on your app created in Step 2

2. **Navigate to Messenger Settings**
   - Click **"Messenger"** → **"Settings"** in left sidebar
   - Scroll to **"Webhooks"** section
   - Click **"Add Callback URL"**

3. **Configure Webhook:**
   
   **Callback URL:**
   ```
   https://ryvycczwsispkspsskfp.supabase.co/functions/v1/messenger-webhook
   ```

   **Verify Token:**
   ```
   bangla_booster_verify_token_2025
   ```

4. **Verify and Save**
   - Click **"Verify and Save"**
   - Should see ✅ "Complete" status

5. **Subscribe to Webhook Fields:**
   - Still in the Webhooks section
   - Find **"Webhook Fields"**
   - Check these boxes:
     - ✅ `messages`
     - ✅ `messaging_postbacks`
   - Click **"Save"**

6. **Add a Facebook Page (if you have one):**
   - Scroll down to **"Access Tokens"**
   - Click **"Add or Remove Pages"**
   - Select a Facebook Page you manage
   - Subscribe to: `messages` and `messaging_postbacks`

**✅ When complete, check the box above and move to Step 7**

---

## Step 7: Update Frontend Configuration 🎨

**Goal:** Add your Facebook App ID to the frontend.

### Instructions:

1. **Open .env file**
   - In VS Code, open the file: `.env`

2. **Update Facebook App ID:**
   - Find the line:
     ```
     VITE_FB_APP_ID=YOUR_FACEBOOK_APP_ID
     ```
   - Replace `YOUR_FACEBOOK_APP_ID` with your actual App ID from Step 2

   Example:
   ```
   VITE_FB_APP_ID=123456789012345
   ```

3. **Save the file**
   - Press Ctrl+S (or Cmd+S on Mac)

**✅ When complete, check the box above and move to Step 8**

---

## Step 8: Test the Chatbot! 🎉

**Goal:** Verify everything works end-to-end.

### Instructions:

1. **Start Development Server**
   ```bash
   npm install
   npm run dev
   ```
   - Wait for server to start
   - Should see: "Local: http://localhost:5173"

2. **Open the App**
   - Visit: http://localhost:5173
   - Sign up or sign in

3. **Add Test Products:**
   - Go to **Dashboard**
   - Click **"Add Product"**
   - Add at least 2-3 products with:
     - Clear product titles (e.g., "Red T-Shirt", "Blue Jeans")
     - Prices
     - Images

4. **Test the Built-in Chatbot Simulator:**
   - Go to **Chatbot** page
   - In the "Test Your Chatbot" section
   - Try these test messages:
     
     **Test 1 - Greeting:**
     ```
     Hello
     ```
     Expected: ✅ Greeting Detected
     
     **Test 2 - Direct Question:**
     ```
     What's the price of Red T-Shirt?
     ```
     Expected: ✅ Direct Question Detected + Product details
     
     **Test 3 - Purchase Intent:**
     ```
     I want to buy this
     ```
     Expected: ✅ Purchase Intent Detected
     
     **Test 4 - Ambiguous:**
     ```
     Do you have shirts?
     ```
     Expected: ✅ Ambiguous Query Detected

5. **Connect Facebook Page (Optional but Recommended):**
   - On the Chatbot page
   - Click **"Connect to Messenger"** button
   - Sign in with Facebook
   - Select a Facebook Page you manage
   - Authorize the app

6. **Test Live on Facebook:**
   - Go to your Facebook Page
   - Send a message to your page (from a different Facebook account or your personal account)
   - Try: "What products do you have?"
   - **The bot should respond automatically!** 🎉

### ✅ Success Criteria:

- [ ] Built-in tests show correct intent detection
- [ ] Product information displays correctly
- [ ] Facebook Page connected successfully
- [ ] Live message to Facebook Page gets automated response
- [ ] Product images and buttons appear in Messenger

---

## 🎊 Congratulations!

Your AI chatbot is now live and working! 

### What's Next?

- **Add More Products:** The more products you have, the better the chatbot works
- **Monitor Conversations:** Check Supabase Function logs to see how customers interact
- **Go to Production:** When ready, update `CLIENT_URL` secret to your production domain

### Troubleshooting

If something doesn't work:

1. **Check Supabase Function Logs:**
   - Dashboard → Functions → Select a function → Logs tab

2. **Verify Secrets:**
   - Dashboard → Settings → Edge Functions → Make sure all 6 secrets are set

3. **Check Facebook Webhook:**
   - Should show "Complete" status in Facebook App

4. **Browser Console:**
   - Open browser DevTools (F12) and check for errors

---

## 📞 Need Help?

- Check the full setup guide: `SETUP.md`
- Review function code in: `supabase/functions/`
- Check database schema: `supabase/migrations/`

**Setup completed on:** _______________  
**Notes:** _______________
