# Neufin AI Project Map

## Project Overview
- **Repository**: https://github.com/stealthg0dd/Neufinfinalbuild1
- **Stack**: React 18 + TypeScript + Vite + Supabase + Tailwind
- **Current State**: Frontend design complete, needs backend integration

## Project Structure

### Root Files
- `package.json` - Dependencies and scripts
- `vite.config.ts` - Vite configuration
- `index.html` - Entry HTML
- `README.md` - Project documentation
- `.npmrc` - NPM configuration
- `.cascaderules` - Development rules
- `.windsurfignore` - Windsurf ignore file
- `supabase-schema-safe.sql` - Database schema

### Source Directory (`src/`)

#### Core Application Files
- `App.tsx` - Main application router with route definitions
- `main.tsx` - Application entry point
- `index.css` - Global styles (READ-ONLY - DO NOT MODIFY)

#### Pages (All have Figma styling - READ-ONLY)
- `Home.tsx` - Landing page
- `Login.tsx` - Login page
- `Signup.tsx` - Signup page
- `Dashboard.tsx` - Basic dashboard
- `UserDashboard.tsx` - User-specific dashboard (NEEDS BACKEND)
- `PortfolioSetup.tsx` - Portfolio configuration (NEEDS BACKEND)
- `Pricing.tsx` - Pricing plans
- `About.tsx` - About page
- `Demo.tsx` - Demo page
- `ApiLanding.tsx` - API documentation page
- `AuthFeatures.tsx` - Authentication features
- `AuthCallback.tsx` - OAuth callback handler (NEEDS BACKEND)
- `CustomerPortal.tsx` - Customer portal (NEEDS BACKEND)
- `CustomerPane.tsx` - Customer panel (NEEDS BACKEND)
- `CustomerAuthCallback.tsx` - Customer auth callback (NEEDS BACKEND)
- `UserJourney.tsx` - User journey page

#### Components (All have Figma styling - READ-ONLY)
**UI Components** (`components/ui/`) - Shadcn/ui components (READ-ONLY):
- All standard UI components (button, card, dialog, etc.)

**Feature Components** (NEEDS BACKEND INTEGRATION):
- `AiChat.tsx` - AI chat interface
- `ClaudeChat.tsx` - Claude integration
- `EnhancedAiChat.tsx` - Enhanced AI chat
- `CustomerDashboard.tsx` - Customer dashboard
- `PortfolioEntry.tsx` - Portfolio entry management
- `PortfolioGraph.tsx` - Portfolio visualization
- `RealTimePortfolio.tsx` - Real-time portfolio data
- `UserDashboard.tsx` - User dashboard functionality
- `LiveStockTicker.tsx` - Live stock data
- `CandlestickChart.tsx` - Stock charts
- `SentimentHeatmap.tsx` - Market sentiment visualization
- `CommunitySignals.tsx` - Community trading signals
- `PortfolioNews.tsx` - Portfolio news feed
- `PortfolioSentiment.tsx` - Portfolio sentiment analysis

**Landing Page Components** (READ-ONLY):
- `AlphaScoreHero.tsx` - Hero section
- `AlphaScoreReveal.tsx` - Alpha score reveal
- `AlphaStrategies.tsx` - Strategy showcase
- `AlphaSuggestion.tsx` - AI suggestions
- `BiasBreakdown.tsx` - Bias analysis
- `FinancialKnowledgeGraph.tsx` - Knowledge graph
- `StrategicSections.tsx` - Strategic content sections
- `TechnicalFooter.tsx` - Footer component
- `Header.tsx` - Navigation header
- `ExpandedFAQ.tsx` - FAQ section
- `KnowledgeHub.tsx` - Knowledge center
- `PerformanceSummary.tsx` - Performance metrics
- `UserJourney.tsx` - User journey flow
- `WelcomeModal.tsx` - Welcome modal
- `EarlyAccessForm.tsx` - Early access signup
- `WhatsAppWidget.tsx` - WhatsApp contact

**Utility Components** (READ-ONLY):
- `Layout.tsx` - Main layout wrapper
- `SEO.tsx` - SEO optimization
- `PerformanceOptimizer.tsx` - Performance optimization
- `SafeComponent.tsx` - Error boundary
- `StockDataErrorBoundary.tsx` - Stock data error handling
- `OAuthSetupChecker.tsx` - OAuth verification
- `ImageWithFallback.tsx` - Image fallback handling

#### Utils (NEEDS BACKEND INTEGRATION)
- `stockService.tsx` - Stock data service
- `supabase/client.tsx` - Supabase client configuration
- `supabase/info.tsx` - Supabase info

#### Styles (READ-ONLY)
- `styles/globals.css` - Global Tailwind styles (DO NOT MODIFY)

#### Assets
- Various PNG images for UI components

#### Documentation Files (READ-ONLY)
- Multiple markdown files with implementation guides and documentation

## Current Dependencies (package.json)

### Core Dependencies
- React 18.3.1 + React DOM
- TypeScript support
- Vite 6.3.5 (dev)
- React Router DOM
- Tailwind CSS (via tailwind-merge, clsx)

### UI/Design Dependencies
- @radix-ui/* (complete component library)
- Lucide React (icons)
- class-variance-authority
- tailwind-merge
- clsx

### Data/Charts
- Recharts 2.15.2
- embla-carousel-react

### Forms/Validation
- react-hook-form
- @hookform/resolvers

### Themes/Styling
- next-themes
- motion (animations)

### Existing Backend Dependencies
- @supabase/supabase-js v2
- @jsr/supabase__supabase-js

### Utilities
- sonner (toasts)
- cmdk (command palette)
- input-otp
- react-day-picker
- vaul (drawers)

## Files Needing Backend Integration

### High Priority
1. **Authentication System**
   - `AuthCallback.tsx` - OAuth callback handling
   - `CustomerAuthCallback.tsx` - Customer auth
   - `Login.tsx` - Add auth logic
   - `Signup.tsx` - Add auth logic

2. **User Dashboard & Portfolio**
   - `UserDashboard.tsx` - Connect to real data
   - `PortfolioSetup.tsx` - Save to database
   - `PortfolioEntry.tsx` - CRUD operations
   - `RealTimePortfolio.tsx` - Real-time data

3. **AI/Chat Features**
   - `AiChat.tsx` - Connect to AI APIs
   - `ClaudeChat.tsx` - Claude integration
   - `EnhancedAiChat.tsx` - Enhanced AI features

4. **Stock Data Services**
   - `stockService.tsx` - Connect to stock APIs
   - `LiveStockTicker.tsx` - Real-time data
   - `CandlestickChart.tsx` - Real-time charts

### Medium Priority
1. **Customer Portal**
   - `CustomerPortal.tsx`
   - `CustomerPane.tsx`

2. **Advanced Features**
   - `SentimentHeatmap.tsx`
   - `CommunitySignals.tsx`
   - `PortfolioNews.tsx`
   - `PortfolioSentiment.tsx`

## Environment Configuration Needed
- Supabase configuration (URL and keys)
- Google OAuth credentials
- Plaid integration
- Finnhub API key
- Web3Forms key
- OpenAI API key
- Anthropic API key

## Next Steps
1. Install additional dependencies (Plaid, React Query, etc.)
2. Configure environment variables
3. Set up Supabase client
4. Implement authentication flow
5. Connect stock data services
6. Integrate AI chat features
7. Implement portfolio management
8. Add real-time data updates
