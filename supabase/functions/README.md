# Supabase Edge Functions - Chatbot Implementation

This directory contains the Supabase Edge Functions that power the Facebook Messenger chatbot integration.

## Functions Overview

### 1. `messenger-webhook`
**Purpose**: Receives incoming messages from Facebook Messenger

**Endpoints**:
- `GET` - Webhook verification (Facebook setup)
- `POST` - Receive incoming messages

**Environment Variables**:
- `FB_VERIFY_TOKEN` - Token for webhook verification
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for database access

**Flow**:
1. Facebook sends message to webhook
2. Function verifies it's a page subscription
3. Looks up page connection in database
4. Invokes `chatbot-processor` with message details

---

### 2. `chatbot-processor`
**Purpose**: Main chatbot logic - processes messages and sends responses

**Input**:
```json
{
  "ownerId": "uuid",
  "senderId": "facebook_user_id",
  "messageText": "customer message",
  "pageAccessToken": "page_token"
}
```

**Environment Variables**:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

**Flow**:
1. Fetches owner's profile and products
2. Invokes `gemini-analyzer` for intent detection
3. Handles response based on intent:
   - **Direct Question**: Shows product with image and buttons
   - **Purchase Intent**: Redirects to website
   - **Ambiguous Query**: Provides search link
   - **Greeting**: Sends welcome message
4. Sends response via Facebook Messenger API

---

### 3. `gemini-analyzer`
**Purpose**: AI-powered query understanding using Google Gemini 2.5 Flash

**Input**:
```json
{
  "messageText": "customer message",
  "products": [array of product objects]
}
```

**Output**:
```json
{
  "intent": "direct_question|purchase_intent|ambiguous_query|greeting",
  "productMatch": {product object or null},
  "searchTerm": "extracted search term",
  "confidence": 0.85
}
```

**Environment Variables**:
- `GEMINI_API_KEY` - Google Gemini API key

**Features**:
- Uses Gemini 2.5 Flash for natural language understanding
- Fallback to keyword matching if API unavailable
- Extracts product matches and search terms
- Returns confidence scores

---

### 4. `facebook-oauth-callback`
**Purpose**: Handles Facebook OAuth flow for connecting Pages

**Endpoint**: `GET` with query parameters

**Environment Variables**:
- `FB_APP_ID` - Facebook App ID
- `FB_APP_SECRET` - Facebook App Secret
- `FB_REDIRECT_URI` - OAuth redirect URI
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CLIENT_URL` - Frontend URL for redirects

**Flow**:
1. Receives OAuth code from Facebook
2. Exchanges code for access token
3. Fetches user's Facebook Pages
4. Subscribes page to webhook
5. Stores connection in `messenger_connections` table
6. Redirects user back to app

---

## Deployment

### Prerequisites
```bash
npm install -g supabase
```

### Deploy All Functions
```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy individual functions
supabase functions deploy messenger-webhook
supabase functions deploy chatbot-processor
supabase functions deploy gemini-analyzer
supabase functions deploy facebook-oauth-callback

# Or deploy all at once
supabase functions deploy
```

### Set Environment Variables

Via Supabase CLI:
```bash
supabase secrets set FB_APP_ID=your_app_id
supabase secrets set FB_APP_SECRET=your_app_secret
supabase secrets set FB_VERIFY_TOKEN=bangla_booster_verify_token_2025
supabase secrets set GEMINI_API_KEY=your_gemini_key
supabase secrets set CLIENT_URL=https://your-app.com
supabase secrets set FB_REDIRECT_URI=https://YOUR_SUPABASE_URL/functions/v1/facebook-oauth-callback
```

Via Supabase Dashboard:
1. Go to Project Settings → Edge Functions
2. Add secrets in the "Secrets" section

---

## Testing Functions Locally

### Start Supabase locally
```bash
supabase start
```

### Serve a function locally
```bash
supabase functions serve messenger-webhook --env-file .env.local
```

### Test with curl

**Test webhook verification:**
```bash
curl "http://localhost:54321/functions/v1/messenger-webhook?hub.mode=subscribe&hub.verify_token=bangla_booster_verify_token_2025&hub.challenge=test123"
```

**Test message processing:**
```bash
curl -X POST http://localhost:54321/functions/v1/messenger-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "object": "page",
    "entry": [{
      "id": "PAGE_ID",
      "messaging": [{
        "sender": {"id": "USER_ID"},
        "recipient": {"id": "PAGE_ID"},
        "message": {"text": "Hello"}
      }]
    }]
  }'
```

---

## Function Dependencies

### External APIs Used
- **Facebook Graph API v18.0**
  - Messenger Send API
  - OAuth endpoints
  - Page subscriptions
  
- **Google Gemini API**
  - Model: `gemini-2.0-flash-exp`
  - Temperature: 0.3 (for consistency)

### Database Tables
- `messenger_connections` - Stores Facebook Page connections
- `profiles` - Business owner profiles
- `products` - Product catalog

---

## Error Handling

All functions include:
- Try-catch blocks for error handling
- Console logging for debugging
- Graceful fallbacks (e.g., keyword matching if Gemini fails)
- Proper HTTP status codes

### Viewing Logs

Via CLI:
```bash
supabase functions logs messenger-webhook
```

Via Dashboard:
1. Go to Edge Functions
2. Select function
3. View "Logs" tab

---

## Security Considerations

1. **Environment Variables**
   - Never hardcode secrets
   - Use Supabase secrets management
   - Different secrets for dev/prod

2. **CORS Headers**
   - Configured for cross-origin requests
   - Customize `corsHeaders` for production

3. **RLS Policies**
   - Functions use service role key
   - Bypasses RLS when needed
   - Ensure service key is protected

4. **Webhook Verification**
   - Always verify Facebook signature in production
   - Use verify token for initial setup

---

## Performance Optimization

1. **Cold Starts**
   - Edge functions may have cold start delays
   - Facebook expects response within 20 seconds

2. **Async Processing**
   - Webhook always returns 200 immediately
   - Processing happens asynchronously

3. **Database Queries**
   - Indexed lookups on `page_id`
   - Single query for products

---

## Customization

### Modify Response Templates
Edit `chatbot-processor/index.ts`:
- `sendProductShowcase()` - Product display format
- `sendPurchaseResponse()` - Purchase flow message
- `sendSearchResponse()` - Search result message

### Enhance Intent Detection
Edit `gemini-analyzer/index.ts`:
- Adjust Gemini prompt
- Add new intent types
- Customize fallback logic

### Add New Features
Consider adding:
- Conversation history tracking
- Multi-language support
- Product recommendations
- Order tracking
- Customer support routing

---

## Troubleshooting

### Function Not Responding
- Check function deployment status
- Verify environment variables are set
- Review function logs for errors

### Webhook Errors
- Verify webhook URL in Facebook App
- Check verify token matches
- Ensure HTTPS is used

### Database Errors
- Verify RLS policies allow service role access
- Check table schemas match types
- Ensure foreign key relationships are valid

### API Rate Limits
- Facebook: 200 messages/hour per page
- Gemini: Check your project quota
- Implement rate limiting if needed

---

## Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Facebook Messenger Platform](https://developers.facebook.com/docs/messenger-platform)
- [Google Gemini API](https://ai.google.dev/docs)
- [Deno Deploy](https://deno.com/deploy/docs)
