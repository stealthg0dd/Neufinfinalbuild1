# Neufin AI - Production Testing Checklist

## Authentication
- [ ] Google OAuth login works
- [ ] Email/password login works
- [ ] Magic link login works
- [ ] Logout works
- [ ] Session persists on refresh
- [ ] Protected routes redirect to login

## Portfolio Management
- [ ] Manual portfolio entry works
- [ ] Positions save to database
- [ ] Portfolio displays on dashboard
- [ ] Can add multiple positions
- [ ] Can delete positions
- [ ] Total value calculates correctly

## Market Data
- [ ] Stock prices update
- [ ] No rate limit errors
- [ ] Fallback works if API fails
- [ ] Prices display correctly
- [ ] Loading states work

## Bias Analysis
- [ ] "Analyze Bias" button works
- [ ] Bias scores calculate correctly
- [ ] Scores save to database
- [ ] Dashboard shows updated scores
- [ ] No infinite loops

## UI/UX
- [ ] All pages load without errors
- [ ] Mobile responsive design works
- [ ] Dark theme preserved
- [ ] Purple/blue gradients correct
- [ ] No console errors
- [ ] Loading spinners work
- [ ] Toast notifications work

## Performance
- [ ] Lighthouse Performance >90
- [ ] Page load time <3s
- [ ] Images optimized
- [ ] No layout shift

## Security
- [ ] HTTPS enabled
- [ ] API keys not exposed
- [ ] RLS policies active
- [ ] XSS protection headers
- [ ] Content Security Policy

## SEO
- [ ] Meta tags present
- [ ] sitemap.xml accessible
- [ ] robots.txt accessible
- [ ] Structured data valid

## Monitoring
- [ ] Vercel Analytics enabled
- [ ] Error tracking works
- [ ] API logs visible in Supabase
