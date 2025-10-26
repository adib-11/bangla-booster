# 🔐 Credentials Tracker

**Date:** October 26, 2025  
**Project:** Bangla Booster Chatbot

---

## 📝 Save Your Credentials Here

### Step 2: Facebook App Credentials

**Facebook App ID:**
```
_____________________________________
```

**Facebook App Secret:**
```
_____________________________________
```

**Facebook App Dashboard URL:**
```
https://developers.facebook.com/apps/[YOUR_APP_ID]
```

---

### Step 3: Google Gemini API Key

**Gemini API Key:**
```
_____________________________________
```

**Google AI Studio URL:**
```
https://makersuite.google.com/app/apikey
```

---

### Important URLs (Already Configured)

**Supabase Project:**
- Dashboard: https://supabase.com/dashboard/project/ryvycczwsispkspsskfp
- Functions: https://supabase.com/dashboard/project/ryvycczwsispkspsskfp/functions
- Database: https://supabase.com/dashboard/project/ryvycczwsispkspsskfp/editor

**Webhook URL (for Facebook):**
```
https://ryvycczwsispkspsskfp.supabase.co/functions/v1/messenger-webhook
```

**Verify Token (for Facebook):**
```
bangla_booster_verify_token_2025
```

**Redirect URI (for Facebook OAuth):**
```
https://ryvycczwsispkspsskfp.supabase.co/functions/v1/facebook-oauth-callback
```

---

## ✅ Checklist

- [ ] Facebook App created
- [ ] Facebook App ID obtained
- [ ] Facebook App Secret obtained
- [ ] Gemini API Key obtained
- [ ] All credentials saved in Supabase Secrets
- [ ] .env file updated with Facebook App ID

---

## 🚨 Security Notes

1. **Never commit this file to Git!** (Already in .gitignore)
2. **Keep these credentials private**
3. **Don't share your App Secret** with anyone
4. **Reset keys if compromised**

---

## 📋 Supabase Secrets Configuration

Copy these exact values when setting up secrets in Supabase Dashboard:

**Secret 1:**
```
Name: FB_APP_ID
Value: [Your Facebook App ID from above]
```

**Secret 2:**
```
Name: FB_APP_SECRET
Value: [Your Facebook App Secret from above]
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
Value: [Your Gemini API Key from above]
```

**Secret 6:**
```
Name: CLIENT_URL
Value: http://localhost:5173
```

---

**Last Updated:** _______________  
**Status:** _______________
