#!/bin/bash

# Supabase Edge Functions Deployment Script
# This script deploys all chatbot edge functions to your Supabase project

echo "🚀 Deploying Bangla Booster Chatbot Functions..."
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null
then
    echo "❌ Supabase CLI is not installed."
    echo "📦 Installing Supabase CLI..."
    npm install -g supabase
fi

echo "✅ Supabase CLI found"
echo ""

# Login to Supabase (if not already logged in)
echo "🔐 Checking Supabase login status..."
supabase login

# Link to your project
echo ""
echo "🔗 Linking to your Supabase project..."
supabase link --project-ref ryvycczwsispkspsskfp

# Deploy all functions
echo ""
echo "📤 Deploying Edge Functions..."
echo ""

echo "1/4 Deploying messenger-webhook..."
supabase functions deploy messenger-webhook --no-verify-jwt

echo ""
echo "2/4 Deploying chatbot-processor..."
supabase functions deploy chatbot-processor --no-verify-jwt

echo ""
echo "3/4 Deploying gemini-analyzer..."
supabase functions deploy gemini-analyzer --no-verify-jwt

echo ""
echo "4/4 Deploying facebook-oauth-callback..."
supabase functions deploy facebook-oauth-callback --no-verify-jwt

echo ""
echo "✅ All functions deployed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Set environment secrets (see CHATBOT_SETUP_GUIDE.md)"
echo "2. Configure Facebook App webhook"
echo "3. Test the chatbot!"
echo ""
