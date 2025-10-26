# 🚀 Bangla Booster - Complete Setup Guide

**Your Supabase Project**: `ryvycczwsispkspsskfp`  
**Supabase URL**: `https://ryvycczwsispkspsskfp.supabase.co`

---

## 📋 What You'll Build

A complete e-commerce platform with AI-powered Facebook Messenger chatbot that:
- ✅ Answers product questions automatically
- ✅ Shows product images in Messenger
- ✅ Guides customers to your website
- ✅ Works 24/7 without human intervention

---

## ⚡ Quick Setup (60 minutes)

### Step 1: Access Supabase Dashboard (2 min)

1. Go to: **https://supabase.com/dashboard/project/ryvycczwsispkspsskfp**
2. Sign in with your Lovable/Supabase account
3. You should see your project dashboard

### Step 2: Apply Database Migration (5 min)

1. In Supabase Dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy ALL the SQL from: `supabase/migrations/20251026000001_create_messenger_connections.sql`
4. Paste it into the SQL Editor
5. Click **Run** (or Ctrl/Cmd + Enter)
6. Should see: "Success. No rows returned"

**✅ Verify**: Click **Table Editor** → You should see `messenger_connections` table

### Step 3: Install Supabase CLI (5 min)

```bash
# Navigate to project
cd /Users/adib/Desktop/Solvio/bangla-booster-main

# Install Supabase CLI
npm install -g supabase

# Verify
supabase --version
```

### Step 4: Get Facebook App Credentials (15 min)

1. Go to: **https://developers.facebook.com/apps**
2. Click **Create App** → Select **Business**
3. App Name: `Bangla Booster Chatbot`
4. Contact Email: Your email
5. Click **Create App**

**Save these values:**
```
Facebook App ID: ________________
Facebook App Secret: ________________ (Settings → Basic → Show)
```

6. Click **Add Product** → Find **Messenger** → Click **Set Up**
7. Keep this tab open (you'll configure webhook later)

### Step 5: Get Gemini API Key (5 min)

1. Go to: **https://makersuite.google.com/app/apikey**
2. Click **Create API Key**
3. Select or create a Google Cloud project
4. Copy the API key

**Save this:**
```
Gemini API Key: ________________
```

### Step 6: Configure Supabase Secrets (10 min)

Run the interactive script:

```bash
chmod +x set-secrets.sh
./set-secrets.sh
```

Or set manually in Supabase Dashboard (Settings → Edge Functions → Secrets):

```
FB_APP_ID = your_facebook_app_id
FB_APP_SECRET = your_facebook_app_secret  
FB_VERIFY_TOKEN = bangla_booster_verify_token_2025
FB_REDIRECT_URI = https://ryvycczwsispkspsskfp.supabase.co/functions/v1/facebook-oauth-callback
GEMINI_API_KEY = your_gemini_api_key
CLIENT_URL = http://localhost:5173
```

### Step 7: Deploy Edge Functions (5 min)

```bash
chmod +x deploy-functions.sh
./deploy-functions.sh
```

**✅ Verify**: Go to https://supabase.com/dashboard/project/ryvycczwsispkspsskfp/functions  
You should see 4 functions: `messenger-webhook`, `chatbot-processor`, `gemini-analyzer`, `facebook-oauth-callback`

### Step 8: Configure Facebook Webhook (10 min)

1. Go back to Facebook App → **Messenger** → **Settings** → **Webhooks**
2. Click **Add Callback URL**

Enter:
```
Callback URL: https://ryvycczwsispkspsskfp.supabase.co/functions/v1/messenger-webhook
Verify Token: bangla_booster_verify_token_2025
```

3. Click **Verify and Save** → Should show "Complete" ✅

4. Scroll down, click **Add or Remove Pages**
5. Select your Facebook Page
6. Subscribe with: ✅ `messages` ✅ `messaging_postbacks`

### Step 9: Update Frontend Config (2 min)

Edit `.env` file and replace with your Facebook App ID:

```env
VITE_FB_APP_ID=your_actual_facebook_app_id
```

### Step 10: Test! (10 min)

```bash
npm install
npm run dev
```

1. Open: http://localhost:5173
2. Sign up / Sign in
3. Go to **Dashboard** → Add a product
4. Go to **Chatbot** page
5. Click **Test Your Chatbot**
6. Try: "What's the price of [your product name]?"
7. Click **Connect to Messenger**
8. Send a real message to your Facebook Page → Bot responds! 🎉

---

## 🔧 Important URLs

| Resource | URL |
|----------|-----|
| Supabase Dashboard | https://supabase.com/dashboard/project/ryvycczwsispkspsskfp |
| Edge Functions | https://supabase.com/dashboard/project/ryvycczwsispkspsskfp/functions |
| Webhook URL | https://ryvycczwsispkspsskfp.supabase.co/functions/v1/messenger-webhook |
| Facebook Developers | https://developers.facebook.com/apps |
| Google AI Studio | https://makersuite.google.com/app/apikey |

---

## 🧪 Testing Checklist

### Before Connecting Facebook
- [ ] Database migration applied (messenger_connections table exists)
- [ ] 4 Edge functions deployed and active
- [ ] All secrets configured in Supabase
- [ ] Facebook webhook verified
- [ ] Products added in Dashboard

### Built-in Testing (/chatbot page)
- [ ] Test greeting: "Hello"
- [ ] Test direct question: "What's the price of [product]?"
- [ ] Test purchase: "I want to buy this"
- [ ] Test ambiguous: "Do you have shirts?"

### Live Testing
- [ ] Connected Facebook Page via OAuth
- [ ] Sent message to Facebook Page
- [ ] Bot responded with product info
- [ ] Images displayed in Messenger
- [ ] Buttons work and redirect to website

---

## 🐛 Troubleshooting

### "Webhook verification failed"
- Check `FB_VERIFY_TOKEN` matches: `bangla_booster_verify_token_2025`
- Verify webhook URL is exactly: `https://ryvycczwsispkspsskfp.supabase.co/functions/v1/messenger-webhook`

### "OAuth connection failed"
- Verify `FB_APP_ID` and `FB_APP_SECRET` in Supabase secrets
- Check `.env` has correct `VITE_FB_APP_ID`

### "Bot not responding"
- Check function logs: Supabase Dashboard → Functions → Select function → Logs
- Verify page is subscribed to webhook in Facebook App
- Ensure products exist in database

### "No products found"
- Add products: Go to `/dashboard` → Click "Add Product"
- Need at least 1 product for chatbot to work

---

## 📁 Project Structure

```
supabase/
  functions/
    messenger-webhook/       # Receives messages from Facebook
    chatbot-processor/       # Processes & responds to messages  
    gemini-analyzer/         # AI intent detection
    facebook-oauth-callback/ # Connects Facebook Pages
  migrations/
    20251026000001_*.sql    # Database schema for chatbot

src/
  pages/
    Chatbot.tsx             # Chatbot management & testing UI
    Dashboard.tsx           # Add products here
  integrations/supabase/    # Supabase client config
```

---

## 🎯 How the Chatbot Works

### 1. Direct Product Questions
**Customer**: "What's the price of Casual T-Shirt?"  
**Bot**: Shows product image + price + "View Product" button

### 2. Purchase Intent
**Customer**: "I want to buy this"  
**Bot**: "Visit our website to complete your order" + website button

### 3. Ambiguous Queries
**Customer**: "Do you have red shirts?"  
**Bot**: "Search our website" + browse button

### 4. AI Understanding
- Uses Google Gemini 2.5 Flash for natural language understanding
- Detects customer intent automatically
- Matches products from your database
- Fallback to keyword matching if AI unavailable

---

## 🔒 Security Notes

- ✅ All secrets stored in Supabase (never in code)
- ✅ Row Level Security (RLS) enabled on database
- ✅ HTTPS-only communication
- ✅ OAuth 2.0 for Facebook authentication
- ⚠️ Never commit `.env` file to Git

---

## 🚀 Going to Production

### Update for Production:

1. **Update CLIENT_URL secret**:
   ```
   CLIENT_URL = https://your-production-domain.com
   ```

2. **Add production domain to Facebook App**:
   - Settings → Basic → App Domains
   - Add your domain

3. **Facebook App Review** (if needed):
   - For public pages, submit for review
   - Request permissions: `pages_messaging`, `pages_show_list`

4. **Monitor logs**:
   - Check Supabase function logs daily
   - Set up error alerting

---

## 💡 Tips

- **Test locally first**: Use built-in testing interface before connecting Facebook
- **Add multiple products**: More products = better testing
- **Check logs often**: Function logs in Supabase help debug issues
- **Use descriptive product names**: Helps AI match products better
- **Start with test account**: Test with Facebook test account before going live

---

## ✅ Success Criteria

You'll know it's working when:
- ✅ Webhook shows "Complete" in Facebook
- ✅ Test interface shows correct intent detection  
- ✅ Facebook messages get instant responses
- ✅ Product images appear in Messenger
- ✅ Buttons redirect to your website

---

## 🎉 You're Done!

Once setup is complete, your chatbot will:
- Respond to customers 24/7
- Answer product questions instantly
- Show beautiful product cards with images
- Guide customers to your website
- Scale automatically with zero downtime

**Need help?** Check function logs in Supabase Dashboard.

---

**Setup Date**: _______________  
**Status**: _______________  
**Notes**: _______________
