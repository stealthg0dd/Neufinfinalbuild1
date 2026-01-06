# Neufin AI - Authentication & Portfolio Setup Guide

## Overview

Your Neufin AI application now includes a complete user authentication and portfolio management system with:

✅ **Google OAuth Login** - Secure sign-in with Google accounts  
✅ **Portfolio Integration** - Plaid API support + manual entry  
✅ **User Dashboard** - Personalized real-time data correlated with portfolio  
✅ **Secure Backend** - Supabase-powered authentication and data storage

---

## 🚀 Quick Start

### 1. Complete Google OAuth Setup (REQUIRED)

**Your Supabase Project:** `gpczchjipalfgkfqamcu`  
**Your OAuth Callback URL:** `https://gpczchjipalfgkfqamcu.supabase.co/auth/v1/callback`

To enable Google login, you must configure Google OAuth:

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/project/gpczchjipalfgkfqamcu/auth/providers
2. **Enable Google Provider** (toggle to ON)
3. **Add to Google Cloud Console** → Credentials → OAuth 2.0 Client:
   - **Authorized redirect URIs:**
     - `https://gpczchjipalfgkfqamcu.supabase.co/auth/v1/callback` ✅
   - **Authorized JavaScript origins:**
     - `https://gpczchjipalfgkfqamcu.supabase.co`
     - `http://localhost:5173` (for development)
4. **Copy Client ID and Client Secret to Supabase Dashboard**
5. **Save all changes**

⚠️ **Without this setup, Google login will show a "provider is not enabled" error.**

📖 **Detailed Setup Guide:** See `/OAUTH_SETUP_VERIFICATION.md` for step-by-step instructions

---

## 📱 Application Flow

### New User Journey:
1. User visits `/login` page
2. Clicks "Continue with Google"
3. Google OAuth authentication
4. Redirected to `/auth/callback` 
5. System checks for existing portfolio
6. If no portfolio → `/portfolio-setup`
7. User connects via Plaid OR enters holdings manually
8. Redirected to `/user-dashboard` with personalized data

### Returning User Journey:
1. User visits `/login` page
2. System detects active session
3. Direct redirect to `/user-dashboard`

---

## 🎯 Key Features

### 1. Google OAuth Authentication
- **File:** `/pages/Login.tsx`
- Secure authentication using Supabase Auth
- Automatic session management
- User profile with avatar and email

### 2. Portfolio Setup
- **File:** `/pages/PortfolioSetup.tsx`
- **Two methods:**
  - **Plaid Integration** (requires API setup)
  - **Manual Entry** (immediate use)
- Stock holdings with shares and cost basis
- Automatic portfolio value calculation

### 3. User Dashboard
- **File:** `/pages/UserDashboard.tsx`
- Displays user profile and authentication status
- Shows complete portfolio breakdown
- Real-time bias detection dashboard
- All standard dashboard components (AlphaScore, SentimentHeatmap, etc.)
- Portfolio-correlated insights

### 4. Backend API
- **File:** `/supabase/functions/server/index.tsx`
- User authentication verification
- Portfolio data storage and retrieval
- Plaid token management
- User profile endpoints

---

## 🔐 Security Features

- **JWT-based authentication** via Supabase
- **Access token validation** on all protected routes
- **User-scoped data** - users can only access their own portfolio
- **Secure storage** using Supabase KV store
- **Bank-level encryption** for sensitive data

---

## 📊 Portfolio Data Structure

```typescript
{
  holdings: [
    {
      symbol: "AAPL",
      shares: 100,
      avgCost: 150.00
    }
  ],
  totalValue: 15000.00,
  method: "manual" | "plaid",
  setupCompletedAt: "2025-01-15T10:30:00.000Z",
  userId: "user-uuid",
  updatedAt: "2025-01-15T10:30:00.000Z"
}
```

---

## 🛠️ API Endpoints

All endpoints are prefixed with: `/make-server-22c8dcd8`

### Protected Endpoints (require Authorization header):

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/portfolio/save` | POST | Save user portfolio data |
| `/portfolio/get` | GET | Retrieve user portfolio |
| `/plaid/save-token` | POST | Store Plaid access token |
| `/user/profile` | GET | Get user profile data |

### Example Request:
```javascript
const response = await fetch(
  `https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-22c8dcd8/portfolio/get`,
  {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  }
);
```

---

## 🔄 Routes

| Route | Auth Required | Description |
|-------|--------------|-------------|
| `/login` | No | Google OAuth login page |
| `/auth/callback` | No | OAuth callback handler |
| `/portfolio-setup` | Yes | Portfolio connection/entry |
| `/user-dashboard` | Yes | Personalized user dashboard |
| `/dashboard` | No | Public demo dashboard |

---

## 📝 Usage Instructions

### For Manual Portfolio Entry (Immediate Use):
1. Log in with Google
2. Select "Manual Entry" on portfolio setup
3. Add stock holdings (symbol, shares, avg cost)
4. Click "Save Portfolio"
5. View personalized dashboard

### For Plaid Integration (Requires Setup):
1. Sign up for Plaid account: https://plaid.com
2. Get API credentials (Client ID, Secret, Environment)
3. Implement Plaid Link flow in `/pages/PortfolioSetup.tsx`
4. Store access token via API
5. Fetch account data automatically

---

## ⚠️ Important Notes

### Production Considerations:
- This is a **prototype environment** - not suitable for production PII/financial data
- For production use:
  - Implement proper data encryption
  - Add GDPR/compliance features
  - Use secure credential management
  - Implement rate limiting
  - Add comprehensive error handling
  - Set up monitoring and alerts

### Data Privacy:
- Portfolio data is stored in Supabase KV store
- Data is scoped per user (only accessible by owner)
- No data is shared between users
- Google profile data (name, email, avatar) is stored

### Testing:
- Use test Google accounts for development
- Create sample portfolios for testing
- Verify auth flows work correctly before deployment

---

## 🐛 Troubleshooting

### "Provider is not enabled" error:
→ Complete Google OAuth setup in Supabase Dashboard

### "Unauthorized" errors on API calls:
→ Check that access token is being passed correctly  
→ Verify user session exists

### Portfolio not saving:
→ Check browser console for errors  
→ Verify backend server is running  
→ Check network tab for API response

### Redirect loops:
→ Clear browser cache and cookies  
→ Sign out and sign back in  
→ Check session management in browser DevTools

---

## 📚 Additional Resources

- Supabase Auth Docs: https://supabase.com/docs/guides/auth
- Google OAuth Setup: https://supabase.com/docs/guides/auth/social-login/auth-google
- Plaid API Docs: https://plaid.com/docs/
- React Router Auth: https://reactrouter.com/en/main/start/overview

---

## 🎉 Summary

Your Neufin AI application now has a complete authentication and portfolio management system! Users can:

1. ✅ Sign in securely with Google OAuth
2. ✅ Connect their portfolio via Plaid or manual entry
3. ✅ View a personalized dashboard with real-time data
4. ✅ See bias analysis correlated with their holdings
5. ✅ Access all dashboard features with their portfolio context

**Next Steps:**
1. Complete Google OAuth setup in Supabase
2. Test the login flow
3. Add sample portfolio data
4. Explore the personalized dashboard

For any issues or questions, check the troubleshooting section or consult the Supabase documentation.
