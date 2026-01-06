# Fixing Google OAuth 403 Error

## Problem
When users try to sign in with Google, they see:
```
403. That's an error.
We're sorry, but you do not have access to this page. That's all we know.
```

## Root Cause
This happens because your Google OAuth app is in **Testing mode** (not published), and the user's email is not added as a test user.

---

## Solution Options

### Option 1: Add Test Users (Quick Fix - Development)

1. **Go to Google Cloud Console**
   - Navigate to: https://console.cloud.google.com/apis/credentials/consent

2. **OAuth Consent Screen**
   - Find your OAuth 2.0 consent screen configuration
   - Scroll down to "Test users" section

3. **Add Test Users**
   - Click "+ ADD USERS"
   - Enter the email addresses of users who should have access
   - Click "SAVE"

4. **Test Again**
   - Users should now be able to sign in with Google
   - Limited to 100 test users in Testing mode

---

### Option 2: Publish Your App (Production Solution)

1. **Go to OAuth Consent Screen**
   - https://console.cloud.google.com/apis/credentials/consent

2. **Complete All Required Fields**
   - App name: "Neufin AI"
   - User support email: info@neufin.ai
   - App logo: Upload your logo (120x120px PNG)
   - App domain: neufin.ai
   - Authorized domains: Add your domain
   - Developer contact email: info@neufin.ai

3. **Add Required Scopes**
   - `userinfo.email`
   - `userinfo.profile`
   - `openid`

4. **Publishing Status**
   - Click "PUBLISH APP" button
   - Change status from "Testing" to "In Production"
   - ⚠️ Note: This may require Google verification if you're requesting sensitive scopes

5. **Verification Process (if required)**
   - Complete the verification form
   - Provide privacy policy URL
   - Provide terms of service URL
   - Explain why you need the requested scopes
   - YouTube video demonstrating your app (optional but recommended)

---

## Current Configuration Checklist

### ✅ Supabase Configuration
- [x] Project ID: `gpczchjipalfgkfqamcu`
- [x] OAuth Callback URL: `https://gpczchjipalfgkfqamcu.supabase.co/auth/v1/callback`
- [ ] Google provider enabled in Supabase Dashboard
- [ ] Client ID and Secret configured

### ✅ Google Cloud Console
- [ ] OAuth 2.0 Client created
- [ ] **Authorized redirect URIs includes:**
  ```
  https://gpczchjipalfgkfqamcu.supabase.co/auth/v1/callback
  ```
- [ ] **Authorized JavaScript origins includes:**
  ```
  https://gpczchjipalfgkfqamcu.supabase.co
  http://localhost:5173
  ```
- [ ] Test users added (if in Testing mode)
- [ ] OR App published to Production

---

## Step-by-Step Fix

### 1. Verify Redirect URI Configuration

**In Google Cloud Console:**
```
Credentials → OAuth 2.0 Client IDs → Your Client ID → Edit

Authorized redirect URIs:
✓ https://gpczchjipalfgkfqamcu.supabase.co/auth/v1/callback

Authorized JavaScript origins:
✓ https://gpczchjipalfgkfqamcu.supabase.co
✓ http://localhost:5173 (for development)
```

**Important:** The URI must match EXACTLY (no trailing slashes, correct protocol)

---

### 2. Check OAuth Consent Screen Status

**In Google Cloud Console:**
```
APIs & Services → OAuth consent screen

Publishing status: 
- Testing → Only test users can access
- In production → Anyone can access
```

---

### 3. Add Test Users (Temporary Solution)

**In OAuth Consent Screen:**
```
Scroll to "Test users" section
Click "+ ADD USERS"
Add: your-email@gmail.com
Click "SAVE"
```

Limitations:
- Maximum 100 test users
- Users see a warning about the app not being verified
- Good for development, not for production

---

### 4. Publish App (Permanent Solution)

**To publish your app:**

1. **Complete OAuth Consent Screen**
   - Fill in all required fields
   - Add app logo
   - Add privacy policy URL
   - Add terms of service URL

2. **Click "PUBLISH APP"**
   - Review the information
   - Submit for verification (if required)
   - Wait for approval (can take 3-7 days)

3. **After Approval**
   - App status changes to "In production"
   - All users can sign in
   - No more 403 errors

---

## Testing the Fix

### After Adding Test Users:

1. **Open incognito/private browser window**
2. **Go to:** http://localhost:5173/login
3. **Click "Continue with Google"**
4. **Sign in with the email you added as test user**
5. **You should see:**
   - "This app hasn't been verified" warning (normal for Testing mode)
   - Option to continue to the app
   - Successful redirect to your app

### After Publishing:

1. **Any user can sign in**
2. **No warning message**
3. **Production-ready OAuth flow**

---

## Common Errors & Solutions

### Error: "Access blocked: This app's request is invalid"
**Solution:** 
- Check redirect URI matches exactly
- Verify OAuth client is enabled
- Ensure scopes are correctly configured

### Error: "redirect_uri_mismatch"
**Solution:**
- Copy the exact redirect URI from error message
- Add it to Google Cloud Console → Credentials
- Make sure there are no typos or extra characters

### Error: "This app isn't verified"
**Solution:**
- This is normal for Testing mode
- Users can click "Advanced" → "Go to Neufin AI (unsafe)"
- OR publish your app to remove this warning

---

## Production Readiness

Before launching to production:

- [ ] Publish OAuth app to Production status
- [ ] Complete Google verification (if required)
- [ ] Add privacy policy URL
- [ ] Add terms of service URL
- [ ] Add app logo (120x120px)
- [ ] Configure proper error handling
- [ ] Test with multiple users
- [ ] Monitor OAuth success rate

---

## Support Resources

- **Google OAuth 2.0 Docs:** https://developers.google.com/identity/protocols/oauth2
- **Supabase Auth Docs:** https://supabase.com/docs/guides/auth/social-login/auth-google
- **Google Cloud Console:** https://console.cloud.google.com/
- **Neufin Support:** info@neufin.ai

---

## Quick Command Reference

### Check Current OAuth Status:
```javascript
// In browser console
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google'
});
console.log('OAuth response:', { data, error });
```

### Test Supabase Connection:
```javascript
// In browser console
const { data } = await supabase.auth.getSession();
console.log('Current session:', data);
```

---

**Last Updated:** January 15, 2025  
**Status:** Development Mode - Test Users Required  
**Next Step:** Add test users OR publish app to production
