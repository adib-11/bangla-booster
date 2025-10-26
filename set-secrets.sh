#!/bin/bash

# Set Supabase Secrets for Chatbot
# This script sets all required environment variables for the chatbot edge functions

echo "🔐 Setting Supabase Secrets for Bangla Booster Chatbot..."
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null
then
    echo "❌ Supabase CLI is not installed."
    echo "Please install it first: npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Link to project
echo "🔗 Linking to your Supabase project..."
supabase link --project-ref ryvycczwsispkspsskfp

echo ""
echo "📝 You will be prompted to enter your credentials."
echo "   Leave blank and press Enter to skip any you want to set later."
echo ""

# Facebook App Credentials
read -p "Enter your Facebook App ID: " FB_APP_ID
if [ ! -z "$FB_APP_ID" ]; then
    supabase secrets set FB_APP_ID="$FB_APP_ID"
    echo "✅ FB_APP_ID set"
fi

read -p "Enter your Facebook App Secret: " FB_APP_SECRET
if [ ! -z "$FB_APP_SECRET" ]; then
    supabase secrets set FB_APP_SECRET="$FB_APP_SECRET"
    echo "✅ FB_APP_SECRET set"
fi

# Webhook Verify Token
read -p "Enter Facebook Webhook Verify Token (default: bangla_booster_verify_token_2025): " FB_VERIFY_TOKEN
FB_VERIFY_TOKEN=${FB_VERIFY_TOKEN:-bangla_booster_verify_token_2025}
supabase secrets set FB_VERIFY_TOKEN="$FB_VERIFY_TOKEN"
echo "✅ FB_VERIFY_TOKEN set"

# Redirect URI
FB_REDIRECT_URI="https://ryvycczwsispkspsskfp.supabase.co/functions/v1/facebook-oauth-callback"
supabase secrets set FB_REDIRECT_URI="$FB_REDIRECT_URI"
echo "✅ FB_REDIRECT_URI set to: $FB_REDIRECT_URI"

# Gemini API Key
read -p "Enter your Google Gemini API Key: " GEMINI_API_KEY
if [ ! -z "$GEMINI_API_KEY" ]; then
    supabase secrets set GEMINI_API_KEY="$GEMINI_API_KEY"
    echo "✅ GEMINI_API_KEY set"
fi

# Client URL
read -p "Enter your frontend URL (e.g., https://your-app.com or http://localhost:5173): " CLIENT_URL
if [ ! -z "$CLIENT_URL" ]; then
    supabase secrets set CLIENT_URL="$CLIENT_URL"
    echo "✅ CLIENT_URL set"
fi

echo ""
echo "🎉 Secrets configuration complete!"
echo ""
echo "📝 Your webhook URL is:"
echo "   https://ryvycczwsispkspsskfp.supabase.co/functions/v1/messenger-webhook"
echo ""
echo "📝 Your OAuth callback URL is:"
echo "   https://ryvycczwsispkspsskfp.supabase.co/functions/v1/facebook-oauth-callback"
echo ""
echo "Next steps:"
echo "1. Use these URLs in your Facebook App configuration"
echo "2. Deploy edge functions: ./deploy-functions.sh"
echo "3. Test the chatbot!"
echo ""
