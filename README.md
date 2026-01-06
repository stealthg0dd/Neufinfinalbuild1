# Financial Website Design

  This is a code bundle for Financial Website Design. The original project is available at https://www.figma.com/design/GRomAAJ6FTjIBEurpB8qaJ/Financial-Website-Design.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

## Environment Setup

To run Neufinfinalbuild1 in development or production, you must set the following environment variables in your `.env` file. See `.env.example` for a template. Never commit secrets to the repository.

### Supabase
- **VITE_SUPABASE_URL**: Your Supabase project URL.  
  _Find in Supabase Dashboard → Project Settings → Project URL._
- **VITE_SUPABASE_PROJECT_ID**: Your Supabase project ID (subdomain).  
  _Find in Supabase Dashboard → Project Settings → Project Reference ID._
- **VITE_SUPABASE_ANON_KEY**: Supabase public anon key.  
  _Find in Supabase Dashboard → Project Settings → API Keys → anon public._

### Finnhub
- **VITE_FINNHUB_API_KEY**: Finnhub API key for stock data.  
  _Sign up at https://finnhub.io/dashboard and copy your API key._

### Plaid
- **VITE_PLAID_CLIENT_ID**: Plaid client ID.  
  _Find in Plaid Dashboard → Team Settings → Keys._
- **VITE_PLAID_ENV**: Plaid environment (`sandbox`, `development`, or `production`).  
  _Set according to your Plaid account and usage._

### Google OAuth
- **VITE_GOOGLE_CLIENT_ID**: Google OAuth client ID.  
  _Find in Google Cloud Console → APIs & Services → Credentials._

### Web3Forms (Contact Forms)
- **VITE_WEB3FORMS_KEY**: Web3Forms API key.  
  _Find in Web3Forms Dashboard → API Keys._

### OpenAI (Optional, for AI features)
- **OPENAI_API_KEY**: OpenAI API key.  
  _Find in OpenAI Dashboard → API Keys._

### Anthropic (Optional, for AI features)
- **ANTHROPIC_API_KEY**: Anthropic API key.  
  _Find in Anthropic Console → API Keys._

### Backend Functions (Optional)
- **VITE_BACKEND_URL**: URL for your deployed backend functions (e.g., Supabase Edge Functions).  
  _Find in Supabase Dashboard → Edge Functions → Function URL._

---
**Note:**
- All variables prefixed with `VITE_` are exposed to the frontend and must be set in `.env` for Vite to use them.
- For production, set these variables in your deployment provider's dashboard (Vercel, Netlify, etc.) or CI/CD secrets.
- Rotate any keys that were previously committed and never share secrets publicly.

# Neufin AI - Neural Twin Trading Platform

AI-powered trading platform that eliminates cognitive biases from investment decisions.

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### Local Development
```bash
# Clone repo
git clone https://github.com/stealthg0dd/Neufinfinalbuild1
cd Neufinfinalbuild1

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Add your API keys to .env

# Run dev server
npm run dev
```

Visit http://localhost:5173

### Project Structure
```
src/
├── components/     # React components
├── pages/          # Route pages
├── services/       # Business logic (AI, market data)
├── hooks/          # Custom React hooks
├── api/            # API helpers
├── utils/          # Utility functions
└── styles/         # Global CSS (DO NOT MODIFY)
```

### Available Scripts
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript check

### Testing
See `TESTING_CHECKLIST.md` for full testing guide.

### Deployment
Push to `main` branch → Automatic deployment via GitHub Actions

### Documentation
- [Deployment Guide](DEPLOYMENT.md)
- [API Documentation](docs/API.md)
- [Architecture Overview](docs/ARCHITECTURE.md)

### License
Proprietary - Neufin AI Inc.
