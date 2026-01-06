# Neufin Backend Setup Guide

Complete guide to setting up and deploying the Neufin backend.

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Environment Setup](#environment-setup)
3. [API Keys Required](#api-keys-required)
4. [Database Setup](#database-setup)
5. [Local Development](#local-development)
6. [Deployment](#deployment)
7. [Testing](#testing)
8. [Monitoring](#monitoring)
9. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

### Tech Stack

- **Runtime:** Deno (on Supabase Edge Functions)
- **Framework:** Hono.js (Fast, lightweight web framework)
- **Database:** Supabase PostgreSQL + KV Store
- **Authentication:** Supabase Auth (Google OAuth)
- **External APIs:**
  - AlphaVantage (Stock data)
  - NewsAPI (Financial news)
  - Anthropic Claude (AI chat)
  - Plaid (Bank/investment account linking)
  - Stripe (Payments)
  - Hugging Face (Sentiment analysis)

### Architecture Diagram

```
┌─────────────┐
│   Frontend  │ (React + Tailwind)
└──────┬──────┘
       │
       │ HTTPS + Bearer Auth
       │
┌──────▼───────────────────────────────┐
│  Supabase Edge Function (Deno)       │
│  ┌────────────────────────────────┐  │
│  │  Hono.js Application           │  │
│  │  ├─ Authentication             │  │
│  │  ├─ Rate Limiting              │  │
│  │  ├─ Caching Layer              │  │
│  │  └─ API Endpoints              │  │
│  └────────────────────────────────┘  │
└──────┬───────────────────┬───────────┘
       │                   │
       │                   │
┌──────▼────────┐   ┌──────▼───────────┐
│  KV Store     │   │  External APIs   │
│  (Postgres)   │   │  - AlphaVantage  │
│               │   │  - NewsAPI       │
│  Stores:      │   │  - Anthropic     │
│  - Portfolios │   │  - Plaid         │
│  - User Data  │   │  - Stripe        │
│  - Cache      │   └──────────────────┘
│  - Analytics  │
└───────────────┘
```

---

## Environment Setup

### Prerequisites

- Supabase account
- Node.js 18+ (for local development)
- Deno CLI (optional, for local testing)

### Required Environment Variables

Create these in Supabase Dashboard → Settings → Edge Functions → Environment Variables:

```bash
# Supabase (Auto-configured)
SUPABASE_URL=https://gpczchjipalfgkfqamcu.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
SUPABASE_ANON_KEY=<your-anon-key>

# Stock Market Data
ALPHAVANTAGE_API_KEY=<your-alpha-vantage-key>

# News API
NEWSAPI_KEY=<your-newsapi-key>

# AI Chat
ANTHROPIC_API_KEY=<your-anthropic-key>

# Sentiment Analysis
HUGGINGFACE_API_TOKEN=<your-huggingface-token>

# Plaid (Banking/Investment Linking)
PLAID_CLIENT_ID=<your-plaid-client-id>
PLAID_SECRET=<your-plaid-secret>
PLAID_ENV=sandbox  # or 'development' or 'production'

# Stripe Payments
STRIPE_SECRET_KEY=<your-stripe-secret-key>
STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>

# Optional
NODE_ENV=production
```

---

## API Keys Required

### 1. AlphaVantage (Stock Data) ✅ REQUIRED

**Get API Key:** https://www.alphavantage.co/support/#api-key

**Free Tier:**
- 25 requests/day
- Real-time stock quotes
- Intraday time series

**Cost:** Free tier available

**Setup:**
```bash
# Add to Supabase Edge Functions
ALPHAVANTAGE_API_KEY=YOUR_KEY_HERE
```

### 2. NewsAPI (Financial News) ⚠️ RECOMMENDED

**Get API Key:** https://newsapi.org/register

**Free Tier:**
- 100 requests/day
- Latest news headlines
- Search by topic/symbol

**Cost:** Free for development, $449/month for production

**Setup:**
```bash
NEWSAPI_KEY=YOUR_KEY_HERE
```

**Note:** Backend falls back to mock data if not configured.

### 3. Anthropic Claude (AI Chat) ⚠️ RECOMMENDED

**Get API Key:** https://console.anthropic.com/

**Pricing:**
- Claude 3.5 Sonnet: $3/million input tokens
- Approx $0.015 per AI chat message

**Setup:**
```bash
ANTHROPIC_API_KEY=YOUR_KEY_HERE
```

### 4. Hugging Face (Sentiment Analysis) ⚠️ OPTIONAL

**Get API Token:** https://huggingface.co/settings/tokens

**Free Tier:**
- 30,000 characters/month free
- FinBERT model for financial sentiment

**Cost:** Free tier available

**Setup:**
```bash
HUGGINGFACE_API_TOKEN=YOUR_TOKEN_HERE
```

### 5. Plaid (Bank/Investment Linking) ⚠️ OPTIONAL

**Get API Keys:** https://dashboard.plaid.com/signup

**Sandbox:**
- Free testing environment
- Mock bank accounts

**Cost:** Free sandbox, production pricing varies

**Setup:**
```bash
PLAID_CLIENT_ID=YOUR_CLIENT_ID
PLAID_SECRET=YOUR_SECRET
PLAID_ENV=sandbox
```

### 6. Stripe (Payments) ⚠️ OPTIONAL

**Get API Keys:** https://dashboard.stripe.com/register

**Test Mode:**
- Free testing with test cards
- Full payment flow testing

**Cost:** 2.9% + 30¢ per transaction

**Setup:**
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## Database Setup

### 1. Create KV Store Table

The KV store table is auto-created, but if you need to create it manually:

```sql
CREATE TABLE IF NOT EXISTS kv_store_22c8dcd8 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_kv_prefix ON kv_store_22c8dcd8 (key text_pattern_ops);
```

### 2. Verify Table Exists

Go to: Supabase Dashboard → Database → Tables

You should see: `kv_store_22c8dcd8`

---

## Local Development

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Link Project

```bash
supabase link --project-ref gpczchjipalfgkfqamcu
```

### 4. Set Environment Variables Locally

Create `.env` file:

```bash
SUPABASE_URL=https://gpczchjipalfgkfqamcu.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-key>
ALPHAVANTAGE_API_KEY=<your-key>
# ... other keys
```

### 5. Run Edge Functions Locally

```bash
supabase functions serve server --env-file .env
```

Backend will be available at: `http://localhost:54321/functions/v1/make-server-22c8dcd8`

### 6. Test Endpoints

```bash
# Health check
curl http://localhost:54321/functions/v1/make-server-22c8dcd8/health

# With authentication
curl http://localhost:54321/functions/v1/make-server-22c8dcd8/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Deployment

### Option 1: Deploy via Supabase CLI

```bash
# Deploy all functions
supabase functions deploy server

# Deploy with environment variables
supabase secrets set ALPHAVANTAGE_API_KEY=your_key
supabase secrets set NEWSAPI_KEY=your_key
# ... set all required secrets
```

### Option 2: Deploy via Supabase Dashboard

1. Go to: **Edge Functions** → **Deploy new function**
2. Upload `/supabase/functions/server/` directory
3. Set environment variables in **Settings** → **Environment Variables**
4. Click **Deploy**

### Verify Deployment

```bash
# Check health
curl https://gpczchjipalfgkfqamcu.supabase.co/functions/v1/make-server-22c8dcd8/health
```

Expected response:
```json
{
  "status": "ok"
}
```

---

## Testing

### 1. Unit Tests (Coming Soon)

```bash
deno test supabase/functions/server/
```

### 2. Integration Tests

Test all endpoints with Postman or Insomnia:

**Import Collection:** [Download Postman Collection](/postman_collection.json)

### 3. Load Testing

Use Apache Bench or K6:

```bash
# Test rate limiting
ab -n 1000 -c 10 -H "Authorization: Bearer TOKEN" \
  https://gpczchjipalfgkfqamcu.supabase.co/functions/v1/make-server-22c8dcd8/portfolio/get
```

---

## Monitoring

### 1. Supabase Logs

View real-time logs:

```bash
supabase functions logs server --tail
```

Or in Dashboard: **Edge Functions** → **server** → **Logs**

### 2. Error Tracking

All errors are logged with:
- Timestamp
- User ID
- Endpoint
- Error message
- Stack trace (in development)

### 3. Performance Monitoring

Check response times in logs:

```
[INFO] GET /portfolio/get - 45ms
[INFO] GET /stocks/quote/AAPL - 1200ms
```

### 4. Rate Limit Monitoring

Monitor rate limit hits:

```bash
# Check rate limit entries in KV store
SELECT key, value FROM kv_store_22c8dcd8 WHERE key LIKE 'ratelimit:%';
```

---

## Troubleshooting

### Issue 1: "Unauthorized" Error

**Symptom:**
```json
{"error": "Unauthorized - please log in"}
```

**Solutions:**
1. Check if Bearer token is included
2. Verify token hasn't expired
3. Test token with Supabase:
   ```javascript
   const { data: { user } } = await supabase.auth.getUser(token);
   console.log(user);
   ```

### Issue 2: "Rate limit exceeded"

**Symptom:**
```json
{"error": "Rate limit exceeded", "resetAt": "..."}
```

**Solutions:**
1. Wait until resetAt time
2. Implement exponential backoff
3. Clear rate limit in KV store (development only):
   ```sql
   DELETE FROM kv_store_22c8dcd8 WHERE key LIKE 'ratelimit:%';
   ```

### Issue 3: External API Errors

**Symptom:**
```json
{"error": "Failed to fetch stock data"}
```

**Solutions:**
1. Check API key is set: `/admin/health`
2. Verify API quota not exceeded
3. Check API status page
4. Enable fallback to mock data

### Issue 4: "Portfolio not found"

**Symptom:**
```json
{"portfolio": null, "message": "No portfolio found"}
```

**Solutions:**
1. User needs to set up portfolio
2. Check KV store:
   ```sql
   SELECT * FROM kv_store_22c8dcd8 WHERE key LIKE 'portfolio:%';
   ```
3. Verify userId matches

### Issue 5: CORS Errors

**Symptom:**
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**Solutions:**
1. CORS is enabled for all origins in backend
2. Check if using correct URL
3. Verify OPTIONS preflight request works

---

## Performance Optimization

### 1. Enable Caching

Caching is automatically enabled for:
- Alpha scores (10 min)
- Bias analysis (5 min)
- Portfolio performance (5 min)

### 2. Rate Limiting

Default limits:
- 100 req/min for general endpoints
- 30 req/min for stock data
- 10 req/min for AI chat

### 3. Database Indexes

Ensure indexes exist:

```sql
-- KV Store prefix search
CREATE INDEX IF NOT EXISTS idx_kv_prefix 
ON kv_store_22c8dcd8 (key text_pattern_ops);
```

### 4. Connection Pooling

Supabase automatically handles connection pooling.

---

## Security Best Practices

### 1. Never Expose Service Role Key

❌ **Don't:**
```typescript
const serviceKey = 'eyJ...' // Hardcoded in frontend
```

✅ **Do:**
Store in Supabase environment variables (server-side only).

### 2. Validate All Inputs

All endpoints validate input data:

```typescript
const validation = utils.validatePortfolioData(data);
if (!validation.valid) {
  return c.json({ error: validation.errors }, 400);
}
```

### 3. Rate Limiting

Prevents abuse:
- Per-user limits
- Per-endpoint limits
- Automatic reset

### 4. Authentication Required

All endpoints (except /health) require authentication.

---

## Scaling Considerations

### Current Limits

- **KV Store:** 100,000 entries (can be increased)
- **Edge Function:** 2GB memory, 150s timeout
- **Rate Limits:** Configurable per endpoint

### Scaling Strategies

1. **Horizontal Scaling:** Edge functions auto-scale
2. **Caching:** Reduce external API calls
3. **Database Indexing:** Faster queries
4. **CDN:** Cache static responses
5. **Background Jobs:** For heavy computations (coming soon)

---

## Backup & Recovery

### Database Backup

Supabase automatically backs up database daily.

Manual backup:

```bash
# Export KV store
supabase db dump -f backup.sql
```

### Restore

```bash
# Restore from backup
supabase db reset --db-url=<backup-url>
```

---

## Cost Estimation

### Supabase

- **Free Tier:** 500MB database, 2GB bandwidth/month
- **Pro:** $25/month (8GB database, 250GB bandwidth)

### External APIs (Monthly)

| API | Free Tier | Estimated Cost |
|-----|-----------|----------------|
| AlphaVantage | 25 req/day | Free - $50 |
| NewsAPI | 100 req/day | Free - $449 |
| Anthropic | - | $10 - $50 |
| Plaid | Sandbox free | $0 - $100 |
| Stripe | - | 2.9% + 30¢/txn |

**Total Estimated:** $25 - $700/month depending on usage

---

## Support

### Documentation
- API Docs: `/API_DOCUMENTATION.md`
- Setup Guide: This file
- Frontend Integration: `/API_INTEGRATION_GUIDE.md`

### Help
- Email: info@neufin.ai
- GitHub Issues: [Create Issue]
- Discord: [Join Server]

---

## Next Steps

1. ✅ Set up all environment variables
2. ✅ Deploy edge function
3. ✅ Test all endpoints
4. ⬜ Set up monitoring
5. ⬜ Configure custom domain
6. ⬜ Enable production APIs
7. ⬜ Set up error tracking (Sentry)
8. ⬜ Configure backups

---

**Last Updated:** January 15, 2024
**Backend Version:** 1.0.0
