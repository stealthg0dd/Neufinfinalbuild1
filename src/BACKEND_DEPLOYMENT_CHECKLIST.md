# Backend Deployment Checklist

Complete checklist for deploying the Neufin backend to production.

---

## 📋 Pre-Deployment Checklist

### Environment Setup

- [ ] **Supabase Project Created**
  - Project ID: `gpczchjipalfgkfqamcu`
  - Region: Closest to users
  - Plan: Pro ($25/month minimum for production)

- [ ] **KV Store Table Created**
  ```sql
  -- Verify table exists
  SELECT * FROM information_schema.tables 
  WHERE table_name = 'kv_store_22c8dcd8';
  ```

- [ ] **Database Indexes Created**
  ```sql
  CREATE INDEX IF NOT EXISTS idx_kv_prefix 
  ON kv_store_22c8dcd8 (key text_pattern_ops);
  ```

### API Keys Configured

- [ ] **Required APIs**
  - [ ] SUPABASE_URL
  - [ ] SUPABASE_SERVICE_ROLE_KEY
  - [ ] ALPHAVANTAGE_API_KEY (Required for stock data)

- [ ] **Recommended APIs**
  - [ ] NEWSAPI_KEY (Financial news)
  - [ ] ANTHROPIC_API_KEY (AI chat)
  - [ ] HUGGINGFACE_API_TOKEN (Sentiment analysis)

- [ ] **Optional APIs**
  - [ ] PLAID_CLIENT_ID (Bank linking)
  - [ ] PLAID_SECRET
  - [ ] PLAID_ENV (sandbox/production)
  - [ ] STRIPE_SECRET_KEY (Payments)
  - [ ] STRIPE_PUBLISHABLE_KEY

### Security

- [ ] **Service Role Key Secure**
  - Not exposed in frontend code
  - Only used in Edge Functions
  - Stored in Supabase environment variables

- [ ] **CORS Configuration**
  - Origins configured (currently `*` for all)
  - Consider restricting to `https://neufin.ai` in production

- [ ] **Rate Limiting Enabled**
  - Default limits configured
  - Per-endpoint limits set
  - Rate limit database entries can be cleared

- [ ] **Authentication Required**
  - All endpoints (except /health) require auth
  - JWT validation working
  - User verification implemented

### Code Quality

- [ ] **No Hardcoded Secrets**
  ```bash
  # Search for potential secrets
  grep -r "sk_" supabase/
  grep -r "api_key" supabase/
  ```

- [ ] **Error Handling**
  - All endpoints have try-catch blocks
  - Errors logged with context
  - User-friendly error messages

- [ ] **Input Validation**
  - Portfolio data validated
  - Stock symbols validated
  - User inputs sanitized

- [ ] **TypeScript Types**
  - All types defined in `types.tsx`
  - No `any` types in production code
  - Proper type checking

---

## 🚀 Deployment Steps

### Step 1: Test Locally

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref gpczchjipalfgkfqamcu

# Set environment variables
cat > .env <<EOF
SUPABASE_URL=https://gpczchjipalfgkfqamcu.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_key
ALPHAVANTAGE_API_KEY=your_key
# ... other keys
EOF

# Run locally
supabase functions serve server --env-file .env
```

- [ ] **Local server starts successfully**
- [ ] **Health endpoint responds**
  ```bash
  curl http://localhost:54321/functions/v1/make-server-22c8dcd8/health
  # Expected: {"status":"ok"}
  ```

### Step 2: Set Production Environment Variables

```bash
# Set all required secrets
supabase secrets set SUPABASE_URL=https://gpczchjipalfgkfqamcu.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_key
supabase secrets set ALPHAVANTAGE_API_KEY=your_key
supabase secrets set NEWSAPI_KEY=your_key
supabase secrets set ANTHROPIC_API_KEY=your_key
supabase secrets set HUGGINGFACE_API_TOKEN=your_token
supabase secrets set PLAID_CLIENT_ID=your_client_id
supabase secrets set PLAID_SECRET=your_secret
supabase secrets set PLAID_ENV=production
supabase secrets set STRIPE_SECRET_KEY=your_key
supabase secrets set NODE_ENV=production
```

- [ ] **All secrets set successfully**
- [ ] **Verify secrets in Supabase Dashboard**
  - Go to: Settings → Edge Functions → Environment Variables

### Step 3: Deploy Edge Function

```bash
# Deploy
supabase functions deploy server

# Or deploy with fresh build
supabase functions deploy server --no-verify-jwt
```

- [ ] **Deployment successful**
- [ ] **No deployment errors in logs**

### Step 4: Verify Deployment

```bash
# Test health endpoint
curl https://gpczchjipalfgkfqamcu.supabase.co/functions/v1/make-server-22c8dcd8/health

# Expected response:
# {"status":"ok"}
```

- [ ] **Health check passes**
- [ ] **Correct status code (200)**
- [ ] **Response time < 500ms**

### Step 5: Test All Endpoints

Use the provided test script or Postman collection.

#### Authentication Endpoints

- [ ] **GET /user/profile**
  ```bash
  curl -H "Authorization: Bearer $TOKEN" \
    https://gpczchjipalfgkfqamcu.supabase.co/functions/v1/make-server-22c8dcd8/user/profile
  ```

- [ ] **GET /user/settings**
- [ ] **PUT /user/settings**

#### Portfolio Endpoints

- [ ] **POST /portfolio/save**
  ```bash
  curl -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"holdings":[{"symbol":"AAPL","shares":100,"avgCost":150}],"totalValue":15000,"method":"manual"}' \
    https://gpczchjipalfgkfqamcu.supabase.co/functions/v1/make-server-22c8dcd8/portfolio/save
  ```

- [ ] **GET /portfolio/get**
- [ ] **PATCH /portfolio/update**
- [ ] **DELETE /portfolio/delete**
- [ ] **GET /portfolio/history**
- [ ] **GET /portfolio/realtime**
- [ ] **GET /portfolio/performance**

#### Bias & Alpha Endpoints

- [ ] **GET /bias/analyze**
- [ ] **GET /bias/history**
- [ ] **GET /alpha/calculate**
- [ ] **GET /alpha/history**

#### Stock Data Endpoints

- [ ] **GET /stocks/quote/AAPL**
- [ ] **GET /stocks/intraday/AAPL**

#### News & Sentiment Endpoints

- [ ] **GET /news/latest**
- [ ] **GET /news/portfolio**
- [ ] **POST /sentiment/analyze**
- [ ] **GET /sentiment/portfolio**

#### AI Chat Endpoint

- [ ] **POST /ai/chat**

#### Payment Endpoints

- [ ] **POST /stripe/create-checkout**
- [ ] **GET /stripe/subscription**

#### Admin Endpoints

- [ ] **GET /admin/health**
- [ ] **GET /admin/stats**

---

## 🧪 Testing Checklist

### Functional Tests

- [ ] **Create Portfolio**
  - Manual entry works
  - Plaid integration works (if enabled)
  - Data persists correctly

- [ ] **Retrieve Portfolio**
  - Returns correct data
  - Handles missing portfolio
  - Returns 404 for non-existent portfolio

- [ ] **Update Portfolio**
  - Partial updates work
  - Full updates work
  - Version increments correctly

- [ ] **Delete Portfolio**
  - Deletes successfully
  - Archives before deleting
  - Returns 404 on subsequent gets

- [ ] **Real-Time Data**
  - Fetches live stock prices
  - Handles API failures gracefully
  - Falls back to avgCost when API unavailable

- [ ] **Bias Analysis**
  - Detects sector concentration
  - Identifies home bias
  - Calculates severity correctly
  - Provides actionable suggestions

- [ ] **Alpha Score**
  - Calculates score accurately
  - Shows potential gain
  - Breaks down factors
  - Caches results

- [ ] **News Integration**
  - Fetches latest news
  - Filters by portfolio holdings
  - Falls back to mock data when API unavailable

- [ ] **Sentiment Analysis**
  - Analyzes text correctly
  - Returns sentiment scores
  - Handles errors gracefully

- [ ] **AI Chat**
  - Responds to user queries
  - Includes portfolio context
  - Falls back to mock responses

### Performance Tests

- [ ] **Response Times**
  - Health check: < 100ms
  - Portfolio get: < 200ms
  - Real-time data: < 2s
  - Alpha calculation: < 500ms
  - AI chat: < 5s

- [ ] **Concurrent Requests**
  ```bash
  # Test with Apache Bench
  ab -n 100 -c 10 -H "Authorization: Bearer $TOKEN" \
    https://gpczchjipalfgkfqamcu.supabase.co/functions/v1/make-server-22c8dcd8/portfolio/get
  ```
  - [ ] No failed requests
  - [ ] Average response time acceptable
  - [ ] No memory leaks

- [ ] **Rate Limiting**
  ```bash
  # Send 101 requests in 60 seconds
  for i in {1..101}; do
    curl -H "Authorization: Bearer $TOKEN" \
      https://gpczchjipalfgkfqamcu.supabase.co/functions/v1/make-server-22c8dcd8/portfolio/get
  done
  ```
  - [ ] 101st request returns 429
  - [ ] Rate limit resets after window
  - [ ] Different endpoints have separate limits

### Security Tests

- [ ] **Authentication Required**
  ```bash
  # Request without auth should fail
  curl https://gpczchjipalfgkfqamcu.supabase.co/functions/v1/make-server-22c8dcd8/portfolio/get
  # Expected: 401 Unauthorized
  ```

- [ ] **Invalid Token Rejected**
  ```bash
  curl -H "Authorization: Bearer invalid_token" \
    https://gpczchjipalfgkfqamcu.supabase.co/functions/v1/make-server-22c8dcd8/portfolio/get
  # Expected: 401 Unauthorized
  ```

- [ ] **User Isolation**
  - User A cannot access User B's portfolio
  - User-specific data properly scoped
  - No data leakage between users

- [ ] **Input Validation**
  ```bash
  # Invalid portfolio data
  curl -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"holdings":[{"symbol":"","shares":-10,"avgCost":0}]}' \
    https://gpczchjipalfgkfqamcu.supabase.co/functions/v1/make-server-22c8dcd8/portfolio/save
  # Expected: 400 Bad Request with validation errors
  ```

- [ ] **SQL Injection Prevention**
  - KV store uses parameterized queries
  - No direct SQL execution from user input

- [ ] **XSS Prevention**
  - User inputs sanitized
  - No script tags in responses

### Error Handling Tests

- [ ] **Missing Required Data**
  - Returns 400 with clear error message
  - Specifies which fields are missing/invalid

- [ ] **External API Failures**
  - AlphaVantage down → Falls back to avgCost
  - NewsAPI down → Returns mock data
  - Anthropic down → Returns mock AI response

- [ ] **Database Errors**
  - KV store unavailable → Returns 500
  - Connection errors handled gracefully

- [ ] **Timeout Handling**
  - Long-running requests timeout properly
  - User gets clear timeout message

---

## 📊 Monitoring Setup

### Logs

- [ ] **Enable Edge Function Logs**
  ```bash
  supabase functions logs server --tail
  ```

- [ ] **Set Up Log Alerts**
  - Critical errors → Email notification
  - High error rate → Alert

### Metrics to Monitor

- [ ] **Request Volume**
  - Requests per minute
  - Requests per endpoint
  - Unique users

- [ ] **Response Times**
  - Average response time
  - 95th percentile
  - 99th percentile

- [ ] **Error Rates**
  - 4xx errors (client errors)
  - 5xx errors (server errors)
  - Error types breakdown

- [ ] **External API Usage**
  - AlphaVantage calls/day
  - NewsAPI calls/day
  - Anthropic tokens used
  - Plaid API calls

- [ ] **Database Performance**
  - KV store query time
  - Database size
  - Number of entries

### Alerts

- [ ] **Error Rate > 5%**
  - Email to: info@neufin.ai
  - Check logs immediately

- [ ] **Response Time > 5s**
  - Investigate performance issue
  - Check external APIs

- [ ] **API Quota Exceeded**
  - AlphaVantage daily limit
  - NewsAPI daily limit
  - Upgrade plan if needed

---

## 🔄 Rollback Plan

### If Deployment Fails

1. **Check Logs**
   ```bash
   supabase functions logs server --tail
   ```

2. **Redeploy Previous Version**
   ```bash
   # Deploy from specific commit
   git checkout <previous-commit>
   supabase functions deploy server
   ```

3. **Verify Health**
   ```bash
   curl https://gpczchjipalfgkfqamcu.supabase.co/functions/v1/make-server-22c8dcd8/health
   ```

### If Production Issues Occur

1. **Switch to Maintenance Mode**
   - Update frontend to show maintenance message
   - Disable non-critical endpoints

2. **Identify Issue**
   - Check error logs
   - Check external API status
   - Check database health

3. **Apply Fix**
   - Fix code locally
   - Test locally
   - Deploy fix
   - Verify fix in production

4. **Resume Normal Operation**
   - Remove maintenance message
   - Enable all endpoints
   - Monitor closely

---

## 📈 Post-Deployment

### Day 1

- [ ] **Monitor Logs Continuously**
  - Watch for errors
  - Check response times
  - Verify external API calls

- [ ] **Test All User Flows**
  - Sign up → Portfolio setup → Dashboard
  - Manual entry flow
  - Plaid integration flow (if enabled)
  - AI chat interaction

- [ ] **Check Database**
  ```sql
  -- Verify data is being stored
  SELECT COUNT(*) FROM kv_store_22c8dcd8;
  
  -- Check for any errors
  SELECT key FROM kv_store_22c8dcd8 WHERE key LIKE 'error:%';
  ```

### Week 1

- [ ] **Review Metrics**
  - Total users
  - Total portfolios created
  - API usage patterns
  - Error rates

- [ ] **Optimize Performance**
  - Identify slow endpoints
  - Add caching where needed
  - Optimize database queries

- [ ] **Gather User Feedback**
  - Any issues reported?
  - Feature requests?
  - Performance complaints?

### Month 1

- [ ] **Cost Analysis**
  - Supabase usage
  - External API costs
  - Projected monthly cost

- [ ] **Scale Planning**
  - Current user count
  - Projected growth
  - Infrastructure needs

- [ ] **Feature Roadmap**
  - Based on user feedback
  - Based on analytics
  - Based on business goals

---

## 🎯 Success Criteria

### Technical

- [ ] **Uptime > 99.5%**
- [ ] **Average response time < 500ms**
- [ ] **Error rate < 1%**
- [ ] **All critical endpoints working**

### User Experience

- [ ] **Portfolio setup works smoothly**
- [ ] **Real-time data updates reliably**
- [ ] **AI chat responds within 5 seconds**
- [ ] **No data loss incidents**

### Business

- [ ] **Users can sign up and create portfolios**
- [ ] **Payment flow works (if Stripe enabled)**
- [ ] **Analytics tracking user behavior**
- [ ] **Support tickets < 5% of users**

---

## 🆘 Emergency Contacts

### Technical Issues

- **Supabase Support:** support@supabase.io
- **AlphaVantage Support:** support@alphavantage.co
- **Anthropic Support:** support@anthropic.com

### Internal Team

- **Backend Developer:** [Your Email]
- **DevOps:** [DevOps Email]
- **On-Call:** [On-Call Number]

---

## 📝 Deployment Log

| Date | Version | Changes | Deployed By | Status |
|------|---------|---------|-------------|--------|
| 2024-01-15 | 1.0.0 | Initial deployment | [Name] | ✅ Success |
| | | | | |

---

## ✅ Final Checklist

Before marking deployment as complete:

- [ ] All endpoints tested and working
- [ ] Monitoring and alerts set up
- [ ] Documentation updated
- [ ] Team notified of deployment
- [ ] Rollback plan documented
- [ ] Success metrics defined
- [ ] Emergency contacts updated
- [ ] Post-deployment review scheduled

---

**Deployment Completed:** [ ] Yes [ ] No

**Deployed By:** ___________________

**Date:** ___________________

**Notes:** ___________________

---

**Last Updated:** January 15, 2024
