# OAuth Setup Verification Guide

## ✅ Your Supabase Configuration

**Project ID:** `gpczchjipalfgkfqamcu`  
**Project URL:** `https://gpczchjipalfgkfqamcu.supabase.co`  
**OAuth Callback URL:** `https://gpczchjipalfgkfqamcu.supabase.co/auth/v1/callback`

---

## 🔐 Google OAuth Configuration Checklist

### Step 1: Verify Google Cloud Console Settings

In your Google Cloud Console OAuth 2.0 Client:

#### ✅ Authorized JavaScript Origins:
Add these URLs to your Google OAuth client:
```
https://gpczchjipalfgkfqamcu.supabase.co
http://localhost:5173
http://localhost:3000
```

#### ✅ Authorized Redirect URIs:
Add this exact URL to your Google OAuth client:
```
https://gpczchjipalfgkfqamcu.supabase.co/auth/v1/callback
```

⚠️ **IMPORTANT:** The redirect URI must match EXACTLY. Any trailing slashes or typos will cause authentication to fail.

---

### Step 2: Verify Supabase Dashboard Settings

1. Go to: https://supabase.com/dashboard/project/gpczchjipalfgkfqamcu
2. Navigate to: **Authentication** → **Providers**
3. Find **Google** provider
4. Verify these settings:

#### Required Configuration:
- ✅ **Google enabled:** Toggle should be ON (green)
- ✅ **Client ID:** Paste from Google Cloud Console
- ✅ **Client Secret:** Paste from Google Cloud Console
- ✅ **Authorized Client IDs:** (optional, can leave empty)
- ✅ **Skip nonce check:** Leave unchecked (default)

#### Site URL Configuration:
- ✅ **Site URL:** Set to your app's production URL (or `http://localhost:5173` for development)
- ✅ **Redirect URLs:** Add both:
  - `http://localhost:5173/auth/callback` (development)
  - `https://your-production-domain.com/auth/callback` (production)

---

### Step 3: Test the OAuth Flow

1. **Start your application**
   ```bash
   npm run dev
   ```

2. **Navigate to login page**
   ```
   http://localhost:5173/login
   ```

3. **Click "Continue with Google"**
   - Should redirect to Google's consent screen
   - URL should include: `accounts.google.com/o/oauth2/auth`

4. **Select Google Account**
   - Choose your Google account
   - Grant permissions

5. **Verify Redirect**
   - After granting permissions, should redirect through Supabase
   - Should land on: `http://localhost:5173/auth/callback`
   - Should then redirect to either:
     - `/portfolio-setup` (new user)
     - `/user-dashboard` (returning user with portfolio)

---

## 🐛 Troubleshooting

### Error: "redirect_uri_mismatch"
**Problem:** The redirect URI doesn't match what's configured in Google Console

**Solution:**
1. Go to Google Cloud Console
2. Check Authorized redirect URIs
3. Ensure it exactly matches: `https://gpczchjipalfgkfqamcu.supabase.co/auth/v1/callback`
4. Save changes
5. Wait 5 minutes for changes to propagate
6. Try again

---

### Error: "Provider is not enabled"
**Problem:** Google OAuth is not enabled in Supabase

**Solution:**
1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/gpczchjipalfgkfqamcu/auth/providers
2. Find Google provider
3. Toggle it ON
4. Enter Client ID and Client Secret
5. Click Save

---

### Error: "Invalid client"
**Problem:** Client ID or Client Secret is incorrect

**Solution:**
1. Go to Google Cloud Console
2. Navigate to Credentials
3. Find your OAuth 2.0 Client ID
4. Verify the Client ID and generate a new Client Secret if needed
5. Update in Supabase Dashboard
6. Save changes

---

### Stuck on "Completing sign in..." screen
**Problem:** AuthCallback component not receiving session

**Solution:**
1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab for failed API calls
4. Common causes:
   - CORS issues (check Supabase project settings)
   - Invalid session token
   - Backend server not running

**Fix:**
```bash
# Clear browser cache and cookies
# Try in incognito mode
# Verify Supabase project is not paused
```

---

### User redirected to wrong page
**Problem:** Portfolio check failing or session not persisting

**Solution:**
1. Check browser console for API errors
2. Verify backend server is running
3. Check that `/supabase/functions/server/index.tsx` is deployed
4. Verify access token is being passed correctly

---

## 🔍 Testing Commands

### Check if Supabase client is working:
```javascript
// Open browser console on any page
const { createClient } = await import('./utils/supabase/client');
const supabase = createClient();
const { data } = await supabase.auth.getSession();
console.log('Session:', data);
```

### Check backend API:
```javascript
// Check health endpoint
fetch('https://gpczchjipalfgkfqamcu.supabase.co/functions/v1/make-server-22c8dcd8/health')
  .then(r => r.json())
  .then(console.log);
```

### Verify OAuth redirect URL:
```javascript
// This should show your app's origin + /auth/callback
console.log(`${window.location.origin}/auth/callback`);
```

---

## 📋 OAuth Flow Summary

```
User clicks "Continue with Google"
         ↓
App calls supabase.auth.signInWithOAuth()
         ↓
Redirect to Google OAuth
(accounts.google.com/o/oauth2/auth)
         ↓
User authorizes on Google
         ↓
Google redirects to Supabase callback
(https://gpczchjipalfgkfqamcu.supabase.co/auth/v1/callback)
         ↓
Supabase processes OAuth tokens
         ↓
Supabase redirects to app callback
(http://localhost:5173/auth/callback)
         ↓
AuthCallback component checks portfolio
         ↓
Redirect to /portfolio-setup OR /user-dashboard
```

---

## ✅ Current Implementation Status

Your application is already correctly configured with:

- ✅ Correct Supabase project ID: `gpczchjipalfgkfqamcu`
- ✅ OAuth callback handler at `/auth/callback`
- ✅ Proper redirect logic in `AuthCallback.tsx`
- ✅ Session management with Supabase client
- ✅ Backend API for portfolio and user data

**Next Steps:**
1. Complete Google OAuth setup in Google Cloud Console
2. Enable Google provider in Supabase Dashboard
3. Test the login flow
4. Create a test portfolio
5. Explore the personalized dashboard

---

## 📚 Additional Resources

- **Google OAuth Setup:** https://console.cloud.google.com/apis/credentials
- **Supabase Auth Dashboard:** https://supabase.com/dashboard/project/gpczchjipalfgkfqamcu/auth/providers
- **Supabase Auth Docs:** https://supabase.com/docs/guides/auth/social-login/auth-google
- **OAuth 2.0 Debugger:** https://oauthdebugger.com/

---

## 🎉 Success Indicators

You'll know OAuth is working correctly when:

1. ✅ Clicking "Continue with Google" opens Google's consent screen
2. ✅ After authorizing, you're redirected back to your app
3. ✅ You see the "Completing sign in..." screen briefly
4. ✅ You land on either Portfolio Setup or User Dashboard
5. ✅ Your profile picture and email appear in the dashboard
6. ✅ You can save and view your portfolio data

---

**Last Updated:** January 2025  
**Project:** Neufin AI - Neural Twin Dashboard  
**Environment:** Development & Production Ready
