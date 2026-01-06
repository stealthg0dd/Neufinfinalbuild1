# Neufin API Integration Guide

## Overview

This guide explains how to set up and configure all external API integrations for the Neufin platform's real-time data features.

## Required API Keys

To enable all features, you need to configure the following API keys in your Supabase Dashboard:

### 1. AlphaVantage (Stock Market Data)
- **Purpose**: Real-time stock quotes, intraday data, and historical prices
- **Get API Key**: https://www.alphavantage.co/support/#api-key
- **Free Tier**: 5 API calls per minute, 500 calls per day
- **Environment Variable**: `ALPHAVANTAGE_API_KEY`

### 2. News API (Financial News)
- **Purpose**: Real-time financial news for portfolio holdings
- **Get API Key**: https://newsapi.org/register
- **Free Tier**: 100 requests per day
- **Environment Variable**: `NEWSAPI_KEY`

### 3. Hugging Face (Sentiment Analysis)
- **Purpose**: AI-powered sentiment analysis of news and market data
- **Get API Key**: https://huggingface.co/settings/tokens
- **Model Used**: ProsusAI/finbert (Financial Sentiment Analysis)
- **Free Tier**: Rate-limited inference API
- **Environment Variable**: `HUGGINGFACE_API_TOKEN`

### 4. Anthropic Claude (AI Chat)
- **Purpose**: Portfolio-specific AI advisor powered by Claude
- **Get API Key**: https://console.anthropic.com/
- **Model**: claude-3-5-sonnet-20241022
- **Environment Variable**: `ANTHROPIC_API_KEY`

### 5. Plaid (Portfolio Sync)
- **Purpose**: Connect brokerage accounts and sync portfolios automatically
- **Get API Key**: https://dashboard.plaid.com/signup
- **Environment**: sandbox, development, or production
- **Environment Variables**:
  - `PLAID_CLIENT_ID`
  - `PLAID_SECRET`
  - `PLAID_ENV` (sandbox/development/production)

### 6. Stripe (Payments)
- **Purpose**: Subscription management and payment processing
- **Get API Key**: https://dashboard.stripe.com/register
- **Environment Variable**: `STRIPE_SECRET_KEY`

## Setup Instructions

### Step 1: Create API Accounts

1. Visit each service's website and create an account
2. Generate API keys/tokens for each service
3. Save all keys in a secure location

### Step 2: Configure Supabase Environment Variables

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/gpczchjipalfgkfqamcu
2. Navigate to **Settings** → **Edge Functions** → **Environment Variables**
3. Add each environment variable:

```
ALPHAVANTAGE_API_KEY=your_alphavantage_key_here
NEWSAPI_KEY=your_newsapi_key_here
HUGGINGFACE_API_TOKEN=your_huggingface_token_here
ANTHROPIC_API_KEY=your_anthropic_key_here
PLAID_CLIENT_ID=your_plaid_client_id_here
PLAID_SECRET=your_plaid_secret_here
PLAID_ENV=sandbox
STRIPE_SECRET_KEY=your_stripe_secret_key_here
```

### Step 3: Set Up Plaid Integration

1. **Create Plaid Account**: https://dashboard.plaid.com/signup
2. **Get Credentials**:
   - Client ID
   - Secret (sandbox, development, or production)
3. **Configure Redirect URIs** in Plaid Dashboard:
   - Add your app's domain (e.g., https://yourdomain.com)
4. **Select Products**: Enable "Investments" product
5. **Test with Sandbox**: Use test credentials to verify integration

#### Plaid Test Credentials (Sandbox)
- Username: `user_good`
- Password: `pass_good`
- MFA: `1234`

### Step 4: Set Up Stripe Payment Integration

1. **Create Stripe Account**: https://dashboard.stripe.com/register
2. **Create Products and Prices**:
   - Go to **Products** in Stripe Dashboard
   - Create three products: Starter, Professional, Enterprise
   - For each product, create two prices (monthly and yearly)
   - Copy the Price IDs (format: `price_xxx`)

3. **Update Price IDs** in `/pages/Pricing.tsx`:
   ```typescript
   stripePriceIdMonthly: "price_your_actual_price_id",
   stripePriceIdYearly: "price_your_actual_price_id",
   ```

4. **Configure Webhooks** (Optional but recommended):
   - Go to **Developers** → **Webhooks** in Stripe Dashboard
   - Add endpoint: `https://${projectId}.supabase.co/functions/v1/make-server-22c8dcd8/stripe/webhook`
   - Select events: `checkout.session.completed`, `customer.subscription.updated`

### Step 5: Test Each Integration

#### Test AlphaVantage
```bash
curl "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=YOUR_KEY"
```

#### Test News API
```bash
curl "https://newsapi.org/v2/everything?q=stock%20market&apiKey=YOUR_KEY"
```

#### Test Hugging Face
```bash
curl https://api-inference.huggingface.co/models/ProsusAI/finbert \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"inputs":"Apple stock is performing well today"}'
```

#### Test Anthropic Claude
```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: YOUR_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-3-5-sonnet-20241022","max_tokens":1024,"messages":[{"role":"user","content":"Hello"}]}'
```

## Features by Integration

### AlphaVantage Powers:
- ✅ Real-time portfolio valuations
- ✅ Live stock price updates
- ✅ Intraday performance charts
- ✅ Historical price data
- ✅ Gain/loss calculations

### News API Powers:
- ✅ Portfolio-specific news feed
- ✅ Latest market news
- ✅ Symbol-specific news filtering
- ✅ Real-time news updates

### Hugging Face Powers:
- ✅ Sentiment analysis of news articles
- ✅ Market sentiment scoring
- ✅ Portfolio sentiment breakdown
- ✅ Bullish/Bearish indicators

### Claude AI Powers:
- ✅ Portfolio-specific advice
- ✅ Natural language queries
- ✅ Personalized insights
- ✅ Strategy recommendations
- ✅ Risk analysis

### Plaid Powers:
- ✅ Automatic portfolio sync
- ✅ Real-time holdings import
- ✅ Brokerage account linking
- ✅ Multi-account aggregation

### Stripe Powers:
- ✅ Subscription management
- ✅ Payment processing
- ✅ Free trial handling
- ✅ Plan upgrades/downgrades

## Fallback Behavior

If an API key is not configured, the system will:

1. **AlphaVantage**: Return user's cost basis prices (no real-time data)
2. **News API**: Return mock news articles
3. **Hugging Face**: Return mock sentiment scores
4. **Claude AI**: Return templated responses
5. **Plaid**: Show "requires setup" message, fallback to manual entry
6. **Stripe**: Show "not configured" message, redirect to contact email

This allows the app to function in demo mode without requiring all API keys.

## Rate Limits

### Free Tier Limits:
- **AlphaVantage**: 5 calls/minute, 500/day
- **News API**: 100 requests/day
- **Hugging Face**: Rate limited (varies by model)
- **Anthropic**: Pay-as-you-go (no free tier)
- **Plaid**: 100 items/month (sandbox unlimited)
- **Stripe**: No limit

### Recommendations:
1. Implement caching for AlphaVantage data (60 second refresh)
2. Cache news articles (5 minute refresh)
3. Cache sentiment scores (15 minute refresh)
4. Rate limit Claude AI requests per user
5. Use webhooks instead of polling for Stripe events

## Cost Estimates

### Monthly Costs (for 1000 active users):

- **AlphaVantage**: Free → $50/month (Premium)
- **News API**: Free → $449/month (Business)
- **Hugging Face**: Free (self-hosted: $0)
- **Anthropic Claude**: ~$50-200/month (usage-based)
- **Plaid**: $0 (sandbox) → $0.30/connected account
- **Stripe**: 2.9% + $0.30 per transaction

**Total**: $0-1000/month depending on scale and tier selection

## Security Best Practices

1. **Never commit API keys to version control**
2. **Use Supabase environment variables** for all secrets
3. **Rotate API keys** every 90 days
4. **Monitor API usage** for unusual patterns
5. **Implement rate limiting** on client side
6. **Use HTTPS only** for all API calls
7. **Validate webhook signatures** (Stripe, Plaid)

## Support and Troubleshooting

### Common Issues:

**"Rate limit exceeded" errors**
- Solution: Implement caching and reduce refresh frequency

**"Invalid API key" errors**
- Solution: Verify environment variables are correctly set in Supabase

**Plaid Link not opening**
- Solution: Check browser console for errors, verify redirect URIs

**Stripe checkout failing**
- Solution: Verify Price IDs match actual Stripe prices

### Get Help:
- Email: info@neufin.ai
- AlphaVantage Support: support@alphavantage.co
- Plaid Support: https://dashboard.plaid.com/support
- Stripe Support: https://support.stripe.com/

## Next Steps

1. ✅ Configure all API keys in Supabase Dashboard
2. ✅ Test each integration individually
3. ✅ Update Stripe Price IDs in Pricing.tsx
4. ✅ Test full user journey (signup → portfolio → payment)
5. ✅ Monitor API usage and costs
6. ✅ Set up production API keys when ready to launch

## Production Checklist

Before launching:

- [ ] All API keys configured and tested
- [ ] Plaid moved from sandbox to production
- [ ] Stripe moved from test to live mode
- [ ] Webhook endpoints secured and verified
- [ ] Rate limiting implemented
- [ ] Error handling tested
- [ ] API usage monitoring set up
- [ ] Backup/fallback strategies tested
- [ ] Security audit completed
- [ ] Cost projections validated

---

**Last Updated**: November 7, 2025
**Neufin Platform Version**: 1.0.0
