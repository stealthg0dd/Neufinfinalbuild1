# OAuth Quick Reference

## 🎯 Your Supabase Configuration

```
Project ID:      gpczchjipalfgkfqamcu
Project URL:     https://gpczchjipalfgkfqamcu.supabase.co
Callback URL:    https://gpczchjipalfgkfqamcu.supabase.co/auth/v1/callback
```

---

## ✅ Google Cloud Console Setup

### 1. Go to Google Cloud Console
https://console.cloud.google.com/apis/credentials

### 2. Add Authorized Redirect URI
```
https://gpczchjipalfgkfqamcu.supabase.co/auth/v1/callback
```

### 3. Add Authorized JavaScript Origins
```
https://gpczchjipalfgkfqamcu.supabase.co
http://localhost:5173
```

---

## ✅ Supabase Dashboard Setup

### 1. Go to Auth Providers
https://supabase.com/dashboard/project/gpczchjipalfgkfqamcu/auth/providers

### 2. Enable Google Provider
- Toggle Google to **ON**
- Paste your **Client ID** from Google Console
- Paste your **Client Secret** from Google Console
- Click **Save**

### 3. Configure Site URL
- Go to: https://supabase.com/dashboard/project/gpczchjipalfgkfqamcu/auth/url-configuration
- Set **Site URL** to: `http://localhost:5173` (development)
- Add **Redirect URLs:**
  - `http://localhost:5173/auth/callback`
  - `https://your-production-domain.com/auth/callback` (when deployed)

---

## 🧪 Testing

1. Start your app: `npm run dev`
2. Navigate to: `http://localhost:5173/login`
3. Click **"Continue with Google"**
4. You should see Google's login screen
5. After login, you'll be redirected to Portfolio Setup or Dashboard

---

## 🐛 Common Issues

### "redirect_uri_mismatch"
→ The callback URL in Google Console doesn't match exactly  
→ Double check: `https://gpczchjipalfgkfqamcu.supabase.co/auth/v1/callback`

### "Provider is not enabled"
→ Google provider is not enabled in Supabase Dashboard  
→ Go to Supabase → Auth → Providers → Enable Google

### "Invalid client"
→ Client ID or Secret is incorrect  
→ Re-copy from Google Console to Supabase

---

## 📚 Full Documentation

- **Setup Verification Guide:** `/OAUTH_SETUP_VERIFICATION.md`
- **Authentication Guide:** `/AUTHENTICATION_SETUP.md`
- **In-App Setup Checker:** Click "Show OAuth Setup Guide" on login page
