# Quick Debug Guide - Blank Dashboard Fix

## 🔥 Emergency Checklist

If the dashboard is blank, check in this order:

### 1. Open Browser Console (F12)
Look for these logs:

```
✅ GOOD - Dashboard is loading:
=== UserDashboard: Starting loadUserData ===
Session check: Found
Portfolio data received: { portfolio: {...} }
✅ Portfolio check passed - rendering dashboard

❌ BAD - Portfolio issue:
❌ Portfolio check failed - showing error screen
OR
No portfolio found in response, redirecting to setup

❌ BAD - Component error:
Error in [ComponentName]: ...
```

### 2. Check What You See

**Blank White Page:**
- Check console for JavaScript errors
- Hard refresh (Ctrl+Shift+R)
- Clear cache and reload

**"Portfolio Data Issue" Screen:**
- Portfolio not saved properly
- Go to setup page and re-save

**Error Card "Component failed to load":**
- One component has an issue
- Other components should still work
- Check console for specific error

**Infinite Loading Spinner:**
- Session might be expired
- Log out and log in again

### 3. Quick Fixes

**Fix #1: Re-save Portfolio**
```
1. Go to /portfolio-setup
2. Enter your holdings again
3. Click "Save Portfolio"
4. Wait for success message
5. Dashboard should load
```

**Fix #2: Clear Session**
```
1. Click Logout
2. Clear browser cache
3. Log in again
4. Set up portfolio
```

**Fix #3: Check Console Logs**
```
1. Press F12
2. Go to Console tab
3. Look for red errors
4. Look for portfolio data logs
5. Check if portfolio.holdings exists
```

## 📊 Console Logs Explained

### Success Flow
```javascript
=== UserDashboard: Starting loadUserData ===
  → Dashboard component mounted

Session check: Found
  → User is logged in

Fetching user profile...
User profile fetched: { id: '...', email: '...' }
  → User data loaded

Fetching portfolio...
Portfolio response status: 200
  → API call successful

Portfolio data received: { portfolio: { holdings: [...], totalValue: 56250 } }
  → Portfolio exists in database

Portfolio structure: {
  hasPortfolio: true,
  hasHoldings: true,
  holdingsCount: 3,
  totalValue: 56250
}
  → Data structure is valid

=== UserDashboard: loadUserData complete ===
  → Data loading finished

=== UserDashboard: Pre-render safety check ===
isLoading: false
  → No longer loading

portfolio: { holdings: [...] }
  → Portfolio data exists

✅ Portfolio check passed - rendering dashboard
  → Dashboard will render
```

### Failure Scenarios

**Scenario 1: No Portfolio**
```javascript
Portfolio data received: { portfolio: null }
No portfolio found in response, redirecting to setup
  → Need to set up portfolio
```

**Scenario 2: Invalid Data**
```javascript
❌ Portfolio check failed - showing error screen
Debug: {"hasPortfolio":true,"hasHoldings":false,"count":0}
  → Portfolio exists but has no holdings
```

**Scenario 3: Component Error**
```javascript
Error in AlphaScoreHero: TypeError: Cannot read property...
  → One component failed
  → Other components should still work
```

## 🛠️ Advanced Debugging

### Check Portfolio in Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Find request: `make-server-22c8dcd8/portfolio/get`
5. Click on it
6. Check Response:

**Good Response:**
```json
{
  "portfolio": {
    "holdings": [
      {"symbol": "AAPL", "shares": 100, "avgCost": 150}
    ],
    "totalValue": 15000,
    "method": "manual"
  }
}
```

**Bad Response:**
```json
{
  "portfolio": null,
  "message": "No portfolio found"
}
```

### Check React State

1. Install React DevTools extension
2. Open DevTools
3. Go to React tab
4. Find `UserDashboard` component
5. Check state:
   - `portfolio`: should be object with holdings array
   - `isLoading`: should be false after loading
   - `accessToken`: should be string (not null)

### Check localStorage

1. Open DevTools
2. Go to Application tab
3. Click Storage > Local Storage
4. Look for Supabase auth tokens
5. If missing → Log in again

## 🎯 Common Error Messages

### "Portfolio Data Issue"
**What it means:** Portfolio data is missing or invalid

**How to fix:**
1. Click "Go to Portfolio Setup"
2. Re-enter your holdings
3. Click "Save Portfolio"

### "Component failed to load"
**What it means:** One specific component crashed

**How to fix:**
1. Check console for error details
2. Refresh page
3. If persists, check if API is down

### "No Portfolio Found"
**What it means:** You haven't set up a portfolio yet

**How to fix:**
1. Click "Set Up Portfolio"
2. Enter your holdings
3. Save

### Blank page (no message)
**What it means:** JavaScript error or network issue

**How to fix:**
1. Hard refresh (Ctrl+Shift+R)
2. Check console for errors
3. Check if edge functions are running
4. Log out and log in

## 📱 Mobile Debugging

### iOS Safari
1. Settings > Safari > Advanced > Web Inspector
2. Connect device to Mac
3. Safari > Develop > [Your Device] > [Page]
4. Check console logs

### Android Chrome
1. chrome://inspect on desktop
2. Connect device via USB
3. Click "Inspect" on your page
4. Check console logs

## 🔍 Data Validation Checklist

Before saving portfolio, ensure:

- [ ] Symbol is not empty (e.g., "AAPL")
- [ ] Shares is a number > 0
- [ ] Avg Cost is a number > 0
- [ ] At least 1 holding added
- [ ] No duplicate symbols (optional)

**Good Data:**
```json
{
  "holdings": [
    {"symbol": "AAPL", "shares": 100, "avgCost": 150.50}
  ],
  "totalValue": 15050,
  "method": "manual"
}
```

**Bad Data:**
```json
{
  "holdings": [],
  "totalValue": 0
}
```

## 🚨 Emergency Recovery

If nothing else works:

### Nuclear Option - Full Reset

```
1. Log out from dashboard
2. Clear all browser data:
   - Cache
   - Cookies
   - Local Storage
3. Close browser completely
4. Reopen browser
5. Go to https://neufin.ai
6. Click "Start Free Trial"
7. Complete Google OAuth
8. Set up portfolio again
9. Dashboard should work
```

### Contact Support

If issue persists after reset:

**Email:** info@neufin.ai

**Include:**
1. Screenshot of blank page
2. Console logs (F12 > Console > right-click > Save as)
3. Browser version (Chrome/Firefox/Safari)
4. Operating system
5. Steps to reproduce

## ✅ Success Indicators

Dashboard is working correctly when you see:

1. **Console:**
   - ✅ Portfolio check passed - rendering dashboard
   - No red errors

2. **Page:**
   - User header with your email
   - Portfolio value displayed
   - Tabs are clickable
   - Charts and graphs visible

3. **Network:**
   - All API calls return 200
   - Portfolio data received
   - No 404 or 500 errors

4. **React DevTools:**
   - UserDashboard component rendered
   - portfolio state contains data
   - isLoading is false

## 📖 Related Documentation

- Full fix details: `/BLANK_DASHBOARD_FIX.md`
- Portfolio setup: `/PORTFOLIO_FIXES.md`
- Authentication: `/AUTH_REDIRECT_FIX.md`
- API integration: `/API_INTEGRATION_GUIDE.md`

## 💡 Pro Tips

1. **Always check console first** - 90% of issues visible there
2. **Hard refresh before debugging** - Clears cached JS errors
3. **Check Network tab** - See exactly what API returns
4. **Use React DevTools** - Inspect component state
5. **Save console logs** - Right-click > Save as for later

---

**Remember:** The dashboard is now resilient with error boundaries. If you see a blank page, it's likely a data issue, not a code issue. Check the console logs! 🔍
