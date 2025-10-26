#!/bin/bash

# Quick Test Script for Chatbot Setup
# Run this after completing all setup steps

echo "🧪 Bangla Booster Chatbot - Quick Test Script"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check .env file
echo "📝 Test 1: Checking .env file..."
if [ -f ".env" ]; then
    if grep -q "VITE_FB_APP_ID=YOUR_FACEBOOK_APP_ID" .env; then
        echo -e "${RED}❌ .env file not configured. Please update VITE_FB_APP_ID${NC}"
    else
        echo -e "${GREEN}✅ .env file configured${NC}"
    fi
else
    echo -e "${RED}❌ .env file not found${NC}"
fi
echo ""

# Test 2: Check if Supabase CLI is installed
echo "📝 Test 2: Checking Supabase CLI..."
if command -v supabase &> /dev/null; then
    echo -e "${GREEN}✅ Supabase CLI installed${NC}"
    supabase --version
else
    echo -e "${YELLOW}⚠️  Supabase CLI not found. Installing...${NC}"
    npm install -g supabase
fi
echo ""

# Test 3: Check project structure
echo "📝 Test 3: Checking project structure..."
required_files=(
    "supabase/functions/messenger-webhook/index.ts"
    "supabase/functions/chatbot-processor/index.ts"
    "supabase/functions/gemini-analyzer/index.ts"
    "supabase/functions/facebook-oauth-callback/index.ts"
    "supabase/migrations/20251026000001_create_messenger_connections.sql"
)

all_files_exist=true
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file not found${NC}"
        all_files_exist=false
    fi
done
echo ""

# Test 4: Check if migration SQL is ready
echo "📝 Test 4: Migration SQL check..."
if [ -f "supabase/migrations/20251026000001_create_messenger_connections.sql" ]; then
    lines=$(wc -l < "supabase/migrations/20251026000001_create_messenger_connections.sql")
    echo -e "${GREEN}✅ Migration file ready ($lines lines)${NC}"
else
    echo -e "${RED}❌ Migration file not found${NC}"
fi
echo ""

# Test 5: Check if node_modules exists
echo "📝 Test 5: Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  Dependencies not installed. Run: npm install${NC}"
fi
echo ""

# Summary
echo "=============================================="
echo "📊 Test Summary"
echo "=============================================="
echo ""
echo "Next steps:"
echo "1. Apply database migration in Supabase Dashboard"
echo "2. Get Facebook App credentials"
echo "3. Get Gemini API key"
echo "4. Configure Supabase secrets"
echo "5. Run: ./deploy-functions.sh"
echo "6. Configure Facebook webhook"
echo "7. Run: npm run dev"
echo ""
echo "For detailed instructions, see: STEP_BY_STEP_GUIDE.md"
echo ""
