# Neufin AI - Deployment Guide

## Architecture
- **Frontend**: React 18 + TypeScript + Vite (Vercel)
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **AI**: OpenAI GPT-4 + Claude 3.5 Sonnet
- **Market Data**: Finnhub API
- **Portfolio**: Plaid API

## Production URLs
- Website: https://neufin.ai
- Vercel Dashboard: https://vercel.com/dashboard
- Supabase Dashboard: https://supabase.com/dashboard/project/gpczchjipalfgkfqamcu
- GitHub Repo: https://github.com/stealthg0dd/Neufinfinalbuild1

## Environment Variables
All env vars stored in:
1. Vercel Project Settings
2. GitHub Actions Secrets
3. Local `.env` (gitignored)

## Deployment Process
1. Push to `main` branch
2. GitHub Actions runs tests
3. Builds production bundle
4. Deploys to Vercel automatically
5. Vercel runs on every commit

## Rollback Process
```bash
# Via Vercel CLI
vercel rollback

# Or via Vercel Dashboard
# Deployments → Previous deployment → Promote to Production
```

## Monitoring
- Vercel Analytics: https://vercel.com/neufin/analytics
- Supabase Logs: https://supabase.com/dashboard/project/gpczchjipalfgkfqamcu/logs
- Error Boundary: Catches React errors

## Cost Breakdown (Monthly)
- Vercel: $0 (Hobby) or $20 (Pro)
- Supabase: $0 (Free tier)
- Finnhub: $0 (60 calls/min free)
- OpenAI: ~$50 (estimated)
- Claude: ~$30 (fallback)
- **Total: ~$100-120/month**

## Support Contacts
- Email: info@neufin.ai
- WhatsApp: +65 9762 7734
