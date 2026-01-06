# Neufin API Quick Reference Card

Quick reference for the most commonly used API endpoints.

---

## 🔑 Base URL

```
https://gpczchjipalfgkfqamcu.supabase.co/functions/v1/make-server-22c8dcd8
```

## 🔐 Authentication

All requests (except /health) require:

```javascript
headers: {
  'Authorization': `Bearer ${accessToken}`
}
```

---

## 📊 Most Used Endpoints

### 1. User Profile

```javascript
// Get user profile
GET /user/profile

// Response
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://..."
  }
}
```

### 2. Portfolio - Save

```javascript
// Save portfolio
POST /portfolio/save

// Body
{
  "holdings": [
    {"symbol": "AAPL", "shares": 100, "avgCost": 150.50},
    {"symbol": "TSLA", "shares": 50, "avgCost": 200.00}
  ],
  "totalValue": 25050.00,
  "method": "manual"
}

// Response
{"success": true, "message": "Portfolio saved successfully"}
```

### 3. Portfolio - Get

```javascript
// Get portfolio
GET /portfolio/get

// Response
{
  "portfolio": {
    "holdings": [...],
    "totalValue": 25050.00,
    "method": "manual",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### 4. Real-Time Portfolio Data

```javascript
// Get real-time prices
GET /portfolio/realtime

// Response
{
  "holdings": [
    {
      "symbol": "AAPL",
      "shares": 100,
      "avgCost": 150.50,
      "currentPrice": 175.25,
      "change": 2.50,
      "changePercent": "1.45%"
    }
  ]
}
```

### 5. Bias Analysis

```javascript
// Analyze biases
GET /bias/analyze

// Response
{
  "biases": [
    {
      "biasType": "sector_concentration",
      "severity": 65,
      "description": "65% of your portfolio is concentrated in Technology",
      "affectedHoldings": ["AAPL", "MSFT", "GOOGL"],
      "suggestion": "Consider diversifying into other sectors"
    }
  ]
}
```

### 6. Alpha Score

```javascript
// Calculate alpha score
GET /alpha/calculate

// Response
{
  "alphaScore": {
    "score": 72,
    "currentPortfolioValue": 25050.00,
    "optimizedPortfolioValue": 32500.00,
    "potentialGain": 7450.00,
    "biasImpact": 15.5,
    "factors": {
      "diversification": 60,
      "sectorBalance": 70,
      "riskAdjusted": 80,
      "emotionalBias": 85
    }
  }
}
```

### 7. Stock Quote

```javascript
// Get stock quote
GET /stocks/quote/AAPL

// Response
{
  "Global Quote": {
    "01. symbol": "AAPL",
    "05. price": "175.25",
    "09. change": "2.50",
    "10. change percent": "1.45%"
  }
}
```

### 8. Portfolio News

```javascript
// Get portfolio-specific news
GET /news/portfolio

// Response
{
  "articles": [
    {
      "title": "Apple Announces New Product",
      "description": "...",
      "url": "https://...",
      "publishedAt": "2024-01-15T09:00:00Z",
      "source": {"name": "Bloomberg"}
    }
  ]
}
```

### 9. AI Chat

```javascript
// Chat with AI
POST /ai/chat

// Body
{
  "message": "Should I buy more Apple stock?"
}

// Response
{
  "response": "Based on your portfolio...",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 10. Performance Analytics

```javascript
// Get performance
GET /portfolio/performance?period=1M

// Response
{
  "performance": {
    "period": "1M",
    "startValue": 24000.00,
    "endValue": 25050.00,
    "change": 1050.00,
    "changePercent": 4.375,
    "dataPoints": [...]
  }
}
```

---

## ⚡ Error Responses

### 401 Unauthorized
```json
{"error": "Unauthorized - please log in"}
```

### 404 Not Found
```json
{"error": "No portfolio found"}
```

### 429 Rate Limited
```json
{"error": "Rate limit exceeded", "resetAt": "2024-01-15T10:31:00Z"}
```

### 500 Server Error
```json
{"error": "Internal server error", "timestamp": "..."}
```

---

## 🔄 Rate Limits

| Endpoint | Limit |
|----------|-------|
| Default | 100/min |
| Stock Data | 30/min |
| AI Chat | 10/min |
| News | 50/min |

---

## 💡 Quick Tips

### Get Access Token
```javascript
const { data: { session } } = await supabase.auth.getSession();
const accessToken = session.access_token;
```

### Error Handling
```javascript
try {
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error('API Error:', error);
  }
  
  const data = await response.json();
} catch (error) {
  console.error('Network Error:', error);
}
```

### Retry on Rate Limit
```javascript
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url, options);
    
    if (response.status === 429) {
      const { resetAt } = await response.json();
      const waitTime = new Date(resetAt) - new Date();
      await new Promise(resolve => setTimeout(resolve, waitTime));
      continue;
    }
    
    return response;
  }
}
```

---

## 📚 Full Documentation

- **Complete API Docs:** `/API_DOCUMENTATION.md`
- **Setup Guide:** `/BACKEND_SETUP_GUIDE.md`
- **Deployment:** `/BACKEND_DEPLOYMENT_CHECKLIST.md`

---

## 🆘 Support

**Email:** info@neufin.ai  
**Health Check:** `GET /make-server-22c8dcd8/health`
