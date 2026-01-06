# Neufin Backend API Documentation

## 🚀 Overview

Complete API reference for the Neufin financial platform backend. All endpoints require authentication unless specified otherwise.

**Base URL:** `https://gpczchjipalfgkfqamcu.supabase.co/functions/v1/make-server-22c8dcd8`

**Authentication:** Bearer token in `Authorization` header
```
Authorization: Bearer <your_supabase_access_token>
```

---

## 📑 Table of Contents

1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Portfolio Management](#portfolio-management)
4. [Bias Analysis](#bias-analysis)
5. [Alpha Score](#alpha-score)
6. [Stock Data](#stock-data)
7. [News & Sentiment](#news--sentiment)
8. [AI Chat](#ai-chat)
9. [Plaid Integration](#plaid-integration)
10. [Payments (Stripe)](#payments-stripe)
11. [User Settings](#user-settings)
12. [Watchlists](#watchlists)
13. [Alerts](#alerts)
14. [Performance Analytics](#performance-analytics)
15. [Admin Endpoints](#admin-endpoints)
16. [Rate Limits](#rate-limits)
17. [Error Codes](#error-codes)

---

## Authentication

Authentication is handled by Supabase Auth. Users authenticate via Google OAuth on the frontend.

### Get Session Token
```typescript
// Frontend code
const { data: { session } } = await supabase.auth.getSession();
const accessToken = session.access_token;
```

---

## User Management

### Get User Profile

```http
GET /user/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://...",
    "provider": "google"
  }
}
```

### Get User Settings

```http
GET /user/settings
```

**Response:**
```json
{
  "settings": {
    "userId": "uuid",
    "notifications": {
      "email": true,
      "push": false,
      "portfolio": true,
      "news": true,
      "alphaUpdates": true
    },
    "preferences": {
      "theme": "dark",
      "currency": "USD",
      "riskTolerance": "moderate"
    },
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Update User Settings

```http
PUT /user/settings
```

**Body:**
```json
{
  "notifications": {
    "email": false,
    "portfolio": true
  },
  "preferences": {
    "theme": "light",
    "riskTolerance": "aggressive"
  }
}
```

**Response:**
```json
{
  "success": true,
  "settings": { /* updated settings */ }
}
```

---

## Portfolio Management

### Save Portfolio

```http
POST /portfolio/save
```

**Body:**
```json
{
  "holdings": [
    {
      "symbol": "AAPL",
      "shares": 100,
      "avgCost": 150.50
    },
    {
      "symbol": "TSLA",
      "shares": 50,
      "avgCost": 200.00
    }
  ],
  "totalValue": 25050.00,
  "method": "manual"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Portfolio saved successfully"
}
```

### Get Portfolio

```http
GET /portfolio/get
```

**Response:**
```json
{
  "portfolio": {
    "holdings": [
      {
        "symbol": "AAPL",
        "shares": 100,
        "avgCost": 150.50
      }
    ],
    "totalValue": 25050.00,
    "method": "manual",
    "userId": "uuid",
    "updatedAt": "2024-01-15T10:30:00Z",
    "version": 1
  }
}
```

### Update Portfolio

```http
PATCH /portfolio/update
```

**Body:**
```json
{
  "holdings": [
    {
      "symbol": "AAPL",
      "shares": 150,
      "avgCost": 150.50
    }
  ],
  "totalValue": 37575.00
}
```

**Response:**
```json
{
  "success": true,
  "portfolio": { /* updated portfolio */ }
}
```

### Delete Portfolio

```http
DELETE /portfolio/delete
```

**Response:**
```json
{
  "success": true,
  "message": "Portfolio deleted"
}
```

### Get Portfolio History

```http
GET /portfolio/history
```

**Response:**
```json
{
  "history": [
    {
      "holdings": [...],
      "totalValue": 25050.00,
      "updatedAt": "2024-01-15T10:30:00Z",
      "version": 3
    }
  ]
}
```

### Get Real-Time Portfolio Data

```http
GET /portfolio/realtime
```

**Response:**
```json
{
  "holdings": [
    {
      "symbol": "AAPL",
      "shares": 100,
      "avgCost": 150.50,
      "currentPrice": 175.25,
      "change": 2.50,
      "changePercent": "1.45%",
      "volume": "85234567"
    }
  ]
}
```

---

## Bias Analysis

### Analyze Portfolio Biases

```http
GET /bias/analyze
```

**Response:**
```json
{
  "biases": [
    {
      "userId": "uuid",
      "biasType": "sector_concentration",
      "severity": 65,
      "description": "65% of your portfolio is concentrated in Technology",
      "affectedHoldings": ["AAPL", "MSFT", "GOOGL"],
      "suggestion": "Consider diversifying into other sectors to reduce risk",
      "detectedAt": "2024-01-15T10:30:00Z"
    },
    {
      "biasType": "concentration_risk",
      "severity": 40,
      "description": "AAPL represents 40% of your portfolio",
      "affectedHoldings": ["AAPL"],
      "suggestion": "Consider reducing AAPL position to manage risk"
    }
  ],
  "cached": false
}
```

**Bias Types:**
- `sector_concentration` - Over-concentrated in a single sector
- `home_bias` - Geographic concentration (e.g., US stocks)
- `recency_bias` - Recently hyped stocks
- `concentration_risk` - Single stock over-concentration

### Get Bias History

```http
GET /bias/history
```

**Response:**
```json
{
  "history": [
    {
      "biasType": "sector_concentration",
      "severity": 65,
      "detectedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## Alpha Score

### Calculate Alpha Score

```http
GET /alpha/calculate
```

**Response:**
```json
{
  "alphaScore": {
    "userId": "uuid",
    "score": 72,
    "currentPortfolioValue": 25050.00,
    "optimizedPortfolioValue": 32500.00,
    "potentialGain": 7450.00,
    "biasImpact": 15.5,
    "calculatedAt": "2024-01-15T10:30:00Z",
    "factors": {
      "diversification": 60,
      "sectorBalance": 70,
      "riskAdjusted": 80,
      "emotionalBias": 85
    }
  },
  "cached": false
}
```

**Score Explanation:**
- `score`: Overall Alpha Score (0-100)
- `currentPortfolioValue`: Current portfolio value
- `optimizedPortfolioValue`: Projected value after bias correction
- `potentialGain`: How much more you could earn
- `biasImpact`: Impact of biases on performance (%)
- `factors`: Breakdown of scoring factors

### Get Alpha Score History

```http
GET /alpha/history
```

**Response:**
```json
{
  "history": [
    {
      "score": 72,
      "potentialGain": 7450.00,
      "calculatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## Stock Data

### Get Stock Quote

```http
GET /stocks/quote/:symbol
```

**Example:**
```
GET /stocks/quote/AAPL
```

**Response:**
```json
{
  "Global Quote": {
    "01. symbol": "AAPL",
    "05. price": "175.25",
    "09. change": "2.50",
    "10. change percent": "1.45%",
    "06. volume": "85234567"
  }
}
```

### Get Intraday Time Series

```http
GET /stocks/intraday/:symbol
```

**Example:**
```
GET /stocks/intraday/AAPL
```

**Response:**
```json
{
  "Time Series (5min)": {
    "2024-01-15 16:00:00": {
      "1. open": "175.20",
      "2. high": "175.50",
      "3. low": "175.10",
      "4. close": "175.25",
      "5. volume": "1234567"
    }
  }
}
```

---

## News & Sentiment

### Get Latest News

```http
GET /news/latest?q=stock+market
```

**Query Parameters:**
- `q`: Search query (default: "stock market")

**Response:**
```json
{
  "articles": [
    {
      "title": "Markets Rally on Strong Economic Data",
      "description": "Major indices showed gains...",
      "url": "https://...",
      "publishedAt": "2024-01-15T10:30:00Z",
      "source": {
        "name": "Financial Times"
      }
    }
  ]
}
```

### Get Portfolio-Specific News

```http
GET /news/portfolio
```

**Response:**
```json
{
  "articles": [
    {
      "title": "Apple Announces New Product Line",
      "description": "Apple Inc. today announced...",
      "url": "https://...",
      "publishedAt": "2024-01-15T09:00:00Z",
      "source": {
        "name": "Bloomberg"
      }
    }
  ]
}
```

### Analyze Sentiment

```http
POST /sentiment/analyze
```

**Body:**
```json
{
  "text": "Apple stock soars to new highs on strong earnings"
}
```

**Response:**
```json
{
  "sentiment": "positive",
  "score": 0.92,
  "label": "POSITIVE"
}
```

### Get Portfolio Sentiment

```http
GET /sentiment/portfolio
```

**Response:**
```json
{
  "sentiments": [
    {
      "symbol": "AAPL",
      "sentiment": "positive",
      "score": 0.85,
      "newsCount": 15
    },
    {
      "symbol": "TSLA",
      "sentiment": "neutral",
      "score": 0.55,
      "newsCount": 8
    }
  ]
}
```

---

## AI Chat

### Chat with AI Assistant

```http
POST /ai/chat
```

**Body:**
```json
{
  "message": "Should I buy more Apple stock?",
  "context": "Looking for investment advice"
}
```

**Response:**
```json
{
  "response": "Based on your portfolio (3 holdings), I recommend...",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Plaid Integration

### Create Link Token

```http
POST /plaid/create-link-token
```

**Response:**
```json
{
  "link_token": "link-sandbox-xxx",
  "expiration": "2024-01-15T11:30:00Z"
}
```

### Exchange Public Token

```http
POST /plaid/exchange-token
```

**Body:**
```json
{
  "public_token": "public-sandbox-xxx"
}
```

**Response:**
```json
{
  "success": true,
  "holdings": [
    {
      "symbol": "AAPL",
      "shares": 100,
      "avgCost": 150.50
    }
  ],
  "totalValue": 25050.00
}
```

### Save Plaid Access Token

```http
POST /plaid/save-token
```

**Body:**
```json
{
  "accessToken": "access-sandbox-xxx",
  "itemId": "item-xxx",
  "accountIds": ["account-xxx"]
}
```

**Response:**
```json
{
  "success": true
}
```

---

## Payments (Stripe)

### Create Checkout Session

```http
POST /stripe/create-checkout
```

**Body:**
```json
{
  "priceId": "price_xxx",
  "plan": "professional"
}
```

**Response:**
```json
{
  "id": "cs_xxx",
  "url": "https://checkout.stripe.com/...",
  "success_url": "https://neufin.ai/user-dashboard?payment=success",
  "cancel_url": "https://neufin.ai/pricing?payment=cancelled"
}
```

### Get Subscription Status

```http
GET /stripe/subscription
```

**Response:**
```json
{
  "subscription": {
    "userId": "uuid",
    "plan": "professional",
    "status": "active",
    "startDate": "2024-01-01T00:00:00Z",
    "features": ["unlimited_portfolios", "ai_chat", "advanced_analytics"]
  },
  "active": true
}
```

---

## User Settings

### Get Settings
See [User Management](#user-management)

### Update Settings
See [User Management](#user-management)

---

## Watchlists

### Get All Watchlists

```http
GET /watchlist/all
```

**Response:**
```json
{
  "watchlists": [
    {
      "userId": "uuid",
      "name": "Tech Stocks",
      "symbols": ["AAPL", "MSFT", "GOOGL"],
      "createdAt": "2024-01-10T10:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Create Watchlist

```http
POST /watchlist/create
```

**Body:**
```json
{
  "name": "Growth Stocks",
  "symbols": ["NVDA", "AMD", "TSLA"]
}
```

**Response:**
```json
{
  "success": true,
  "watchlist": {
    "userId": "uuid",
    "name": "Growth Stocks",
    "symbols": ["NVDA", "AMD", "TSLA"],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## Alerts

### Get All Alerts

```http
GET /alerts/all
```

**Response:**
```json
{
  "alerts": [
    {
      "userId": "uuid",
      "symbol": "AAPL",
      "type": "price",
      "condition": "above",
      "threshold": 180,
      "active": true,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Create Alert

```http
POST /alerts/create
```

**Body:**
```json
{
  "symbol": "AAPL",
  "type": "price",
  "condition": "above",
  "threshold": 180
}
```

**Alert Types:**
- `price` - Price alerts
- `news` - News alerts
- `sentiment` - Sentiment change alerts
- `bias` - Bias detection alerts

**Response:**
```json
{
  "success": true,
  "alert": {
    "userId": "uuid",
    "symbol": "AAPL",
    "type": "price",
    "condition": "above",
    "threshold": 180,
    "active": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## Performance Analytics

### Get Portfolio Performance

```http
GET /portfolio/performance?period=1M
```

**Query Parameters:**
- `period`: `1D`, `1W`, `1M`, `3M`, `6M`, `1Y`, `ALL` (default: `1M`)

**Response:**
```json
{
  "performance": {
    "userId": "uuid",
    "period": "1M",
    "startValue": 24000.00,
    "endValue": 25050.00,
    "change": 1050.00,
    "changePercent": 4.375,
    "highestValue": 26000.00,
    "lowestValue": 23500.00,
    "dataPoints": [
      {
        "timestamp": "2024-01-01T00:00:00Z",
        "value": 24000.00
      },
      {
        "timestamp": "2024-01-15T00:00:00Z",
        "value": 25050.00
      }
    ],
    "calculatedAt": "2024-01-15T10:30:00Z"
  },
  "cached": false
}
```

---

## Admin Endpoints

### System Health Check

```http
GET /admin/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": {
    "rss": 50331648,
    "heapTotal": 20971520,
    "heapUsed": 10485760,
    "external": 1048576
  },
  "env": {
    "supabaseConfigured": true,
    "alphaVantageConfigured": true,
    "newsApiConfigured": false,
    "anthropicConfigured": true,
    "plaidConfigured": true,
    "stripeConfigured": true
  }
}
```

### System Statistics

```http
GET /admin/stats
```

**Response:**
```json
{
  "totalUsers": 150,
  "totalSubscriptions": 45,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Cache Management

### Clear User Cache

```http
POST /cache/clear
```

**Response:**
```json
{
  "success": true,
  "message": "Cache cleared"
}
```

---

## Rate Limits

### Rate Limit Rules

| Endpoint Category | Requests | Window |
|------------------|----------|--------|
| Default | 100 | 60s |
| Stocks API | 30 | 60s |
| AI Chat | 10 | 60s |
| News API | 50 | 60s |
| Portfolio | 50 | 60s |

### Rate Limit Headers

All responses include rate limit headers:

```
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 2024-01-15T10:31:00Z
```

### Rate Limit Exceeded Response

```json
{
  "error": "Rate limit exceeded",
  "resetAt": "2024-01-15T10:31:00Z"
}
```

**Status Code:** `429 Too Many Requests`

---

## Error Codes

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request - Invalid data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable - External API down |

### Error Response Format

```json
{
  "error": "Error message",
  "timestamp": "2024-01-15T10:30:00Z",
  "details": ["Additional error info"]
}
```

### Common Errors

**Unauthorized:**
```json
{
  "error": "Unauthorized - please log in",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Portfolio Not Found:**
```json
{
  "error": "No portfolio found",
  "message": "You haven't set up a portfolio yet"
}
```

**Invalid Data:**
```json
{
  "error": "Invalid portfolio data",
  "details": [
    "Holdings must be an array",
    "Holding 1: Invalid shares amount"
  ]
}
```

---

## API Usage Examples

### JavaScript/TypeScript

```typescript
// Get portfolio
const response = await fetch(
  'https://gpczchjipalfgkfqamcu.supabase.co/functions/v1/make-server-22c8dcd8/portfolio/get',
  {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  }
);

const { portfolio } = await response.json();
```

### Curl

```bash
curl -X GET \
  https://gpczchjipalfgkfqamcu.supabase.co/functions/v1/make-server-22c8dcd8/portfolio/get \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Python

```python
import requests

headers = {
    'Authorization': f'Bearer {access_token}'
}

response = requests.get(
    'https://gpczchjipalfgkfqamcu.supabase.co/functions/v1/make-server-22c8dcd8/portfolio/get',
    headers=headers
)

portfolio = response.json()['portfolio']
```

---

## Caching

### Cache Strategy

The API implements intelligent caching:

- **Alpha Score**: 10 minutes
- **Bias Analysis**: 5 minutes
- **Portfolio Performance**: 5 minutes
- **Stock Quotes**: Not cached (real-time)
- **News**: 15 minutes

### Cache Headers

Cached responses include:

```json
{
  "data": {},
  "cached": true
}
```

---

## Best Practices

### 1. Authentication
Always include the Bearer token in requests.

### 2. Error Handling
Check HTTP status codes and handle errors gracefully.

### 3. Rate Limiting
Implement exponential backoff when rate limited.

### 4. Caching
Cache responses on the frontend to reduce API calls.

### 5. Pagination
For large datasets, implement pagination (coming soon).

---

## Support

For API issues or questions:

- **Email:** info@neufin.ai
- **Documentation:** [https://neufin.ai/docs](https://neufin.ai/docs)
- **Status Page:** [https://status.neufin.ai](https://status.neufin.ai)

---

## Changelog

### v1.0.0 (2024-01-15)
- Initial API release
- Portfolio management
- Bias analysis
- Alpha score calculation
- Real-time stock data
- News and sentiment
- AI chat integration

---

**Last Updated:** January 15, 2024
**API Version:** 1.0.0
