# OAuth Redirect URL Fix

## Problem
After Google OAuth login, the browser is redirecting to `http://localhost:5173/` which doesn't exist in your deployment environment, causing an `ERR_CONNECTION_REFUSED` error.

## Root Cause
Your Supabase Auth configuration has the wrong Site URL set. It's currently set to `http://localhost:5173/` instead of your actual deployment URL.

## Solution

### Step 1: Update Supabase Dashboard Settings

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/gpczchjipalfgkfqamcu

2. Navigate to **Authentication → URL Configuration**

3. Update the following settings:

   **Site URL:**
   - Current (wrong): `http://localhost:5173`
   - Change to: `https://YOUR-ACTUAL-DOMAIN.com` (or the URL where your app is deployed)
   
   For local development/testing:
   - You can use: `http://localhost:3000` (or whatever port your dev server uses)
   
   For Figma Make preview:
   - Use the preview URL provided by Figma Make

4. **Redirect URLs** - Add ALL of these:
   ```
   http://localhost:3000/auth/callback
   http://localhost:5173/auth/callback
   https://YOUR-ACTUAL-DOMAIN.com/auth/callback
   https://gpczchjipalfgkfqamcu.supabase.co/auth/v1/callback
   ```

5. Click **Save**

### Step 2: Verify Google Cloud Console Settings

1. Go to: https://console.cloud.google.com/apis/credentials

2. Find your OAuth 2.0 Client ID

3. Under **Authorized redirect URIs**, ensure you have:
   ```
   https://gpczchjipalfgkfqamcu.supabase.co/auth/v1/callback
   ```

4. Add your app's callback URL:
   ```
   https://YOUR-ACTUAL-DOMAIN.com/auth/callback
   ```

### Step 3: Clear Browser Cache & Test

1. Clear your browser cache and cookies for your app
2. Close all browser tabs
3. Open a new incognito/private window
4. Navigate to your app's login page
5. Try Google OAuth again

## Code Changes Made

I've updated the following files to better handle OAuth callbacks:

1. **`/utils/supabase/client.tsx`**
   - Added proper auth configuration
   - Enabled PKCE flow for better security
   - Enabled session detection in URL

2. **`/pages/AuthCallback.tsx`**
   - Enhanced error handling
   - Added console logging for debugging
   - Improved token extraction from URL hash
   - Better error messages

## Testing Steps

1. After updating Supabase settings, try logging in again
2. Check browser console (F12) for log messages
3. The callback page will now show detailed error messages if something goes wrong
4. Look for console logs starting with "Auth callback -" to debug issues

## Common Issues

### Issue: Still redirecting to localhost
**Solution:** Make sure you saved the Site URL change in Supabase Dashboard and wait 1-2 minutes for changes to propagate.

### Issue: "redirect_uri_mismatch" error
**Solution:** The redirect URI in Google Cloud Console doesn't match. Must be exactly:
`https://gpczchjipalfgkfqamcu.supabase.co/auth/v1/callback`

### Issue: 403 Access Denied
**Solution:** Add your email as a test user in Google Cloud Console (see GOOGLE_OAUTH_403_FIX.md)

## Important Notes

- The Site URL in Supabase determines where users are redirected after OAuth
- You can have multiple redirect URLs, but only ONE Site URL
- The Site URL should match your primary deployment URL
- For local development, use `http://localhost:PORT` (replace PORT with your dev server port)
- Changes to Supabase Auth settings may take 1-2 minutes to take effect

## Current Configuration Status

Your Supabase project: `gpczchjipalfgkfqamcu`
Currently configured redirect: `http://localhost:5173` ❌ (needs to be changed)
Required Google OAuth callback: `https://gpczchjipalfgkfqamcu.supabase.co/auth/v1/callback` ✅

## Need Help?

If you continue to have issues:
1. Check the browser console for detailed error messages
2. Verify all URLs in Supabase Dashboard are correct
3. Ensure Google OAuth app status (Testing vs Production)
4. Clear browser cache completely
5. Try in an incognito window

Contact: info@neufin.ai
