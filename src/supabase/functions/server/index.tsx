import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import { registerEnhancedEndpoints } from "./enhanced_endpoints.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Helper to verify user
async function verifyUser(authHeader: string | null) {
  if (!authHeader) return null;
  
  const token = authHeader.split(' ')[1];
  if (!token) return null;
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    console.log('User verification error:', error);
    return null;
  }
  
  return user;
}

// Health check endpoint
app.get("/make-server-22c8dcd8/health", (c) => {
  return c.json({ status: "ok" });
});

// Save portfolio data (manual or Plaid)
app.post("/make-server-22c8dcd8/portfolio/save", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized - please log in' }, 401);
    }

    const portfolioData = await c.req.json();
    const key = `portfolio:${user.id}`;
    
    await kv.set(key, {
      ...portfolioData,
      userId: user.id,
      updatedAt: new Date().toISOString(),
    });

    console.log(`Portfolio saved for user ${user.id}`);
    return c.json({ success: true, message: 'Portfolio saved successfully' });
  } catch (error) {
    console.error('Error saving portfolio:', error);
    return c.json({ error: `Failed to save portfolio: ${error}` }, 500);
  }
});

// Get user portfolio
app.get("/make-server-22c8dcd8/portfolio/get", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized - please log in' }, 401);
    }

    const key = `portfolio:${user.id}`;
    const portfolio = await kv.get(key);

    if (!portfolio) {
      return c.json({ portfolio: null, message: 'No portfolio found' });
    }

    return c.json({ portfolio });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return c.json({ error: `Failed to fetch portfolio: ${error}` }, 500);
  }
});

// Save Plaid access token
app.post("/make-server-22c8dcd8/plaid/save-token", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized - please log in' }, 401);
    }

    const { accessToken, itemId, accountIds } = await c.req.json();
    const key = `plaid:${user.id}`;
    
    await kv.set(key, {
      accessToken,
      itemId,
      accountIds,
      userId: user.id,
      connectedAt: new Date().toISOString(),
    });

    console.log(`Plaid token saved for user ${user.id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error saving Plaid token:', error);
    return c.json({ error: `Failed to save Plaid token: ${error}` }, 500);
  }
});

// Get user profile
app.get("/make-server-22c8dcd8/user/profile", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized - please log in' }, 401);
    }

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.user_metadata?.full_name,
        avatar: user.user_metadata?.avatar_url,
        provider: user.app_metadata?.provider,
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return c.json({ error: `Failed to fetch profile: ${error}` }, 500);
  }
});

// ===== ALPHAVANTAGE API =====
// Get real-time stock quote
app.get("/make-server-22c8dcd8/stocks/quote/:symbol", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const symbol = c.req.param('symbol');
    const apiKey = Deno.env.get('ALPHAVANTAGE_API_KEY') || 'demo';
    
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
    );
    
    const data = await response.json();
    
    return c.json(data);
  } catch (error) {
    console.error('AlphaVantage error:', error);
    return c.json({ error: 'Failed to fetch stock data' }, 500);
  }
});

// Get intraday time series
app.get("/make-server-22c8dcd8/stocks/intraday/:symbol", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const symbol = c.req.param('symbol');
    const apiKey = Deno.env.get('ALPHAVANTAGE_API_KEY') || 'demo';
    
    const response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`
    );
    
    const data = await response.json();
    
    return c.json(data);
  } catch (error) {
    console.error('AlphaVantage error:', error);
    return c.json({ error: 'Failed to fetch intraday data' }, 500);
  }
});

// Get portfolio real-time data
app.get("/make-server-22c8dcd8/portfolio/realtime", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get user's portfolio
    const key = `portfolio:${user.id}`;
    const portfolio = await kv.get(key);
    
    if (!portfolio || !portfolio.holdings) {
      return c.json({ error: 'No portfolio found' }, 404);
    }

    const apiKey = Deno.env.get('ALPHAVANTAGE_API_KEY') || 'demo';
    
    // Fetch real-time data for each holding
    const realtimeData = await Promise.all(
      portfolio.holdings.map(async (holding: any) => {
        try {
          const response = await fetch(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${holding.symbol}&apikey=${apiKey}`
          );
          const data = await response.json();
          
          if (data['Global Quote']) {
            const quote = data['Global Quote'];
            return {
              symbol: holding.symbol,
              shares: holding.shares,
              avgCost: holding.avgCost,
              currentPrice: parseFloat(quote['05. price'] || '0'),
              change: parseFloat(quote['09. change'] || '0'),
              changePercent: quote['10. change percent'] || '0%',
              volume: quote['06. volume'] || '0',
            };
          }
          
          // Fallback if API fails
          return {
            symbol: holding.symbol,
            shares: holding.shares,
            avgCost: holding.avgCost,
            currentPrice: holding.avgCost,
            change: 0,
            changePercent: '0%',
            volume: '0',
          };
        } catch (error) {
          console.error(`Error fetching ${holding.symbol}:`, error);
          return {
            symbol: holding.symbol,
            shares: holding.shares,
            avgCost: holding.avgCost,
            currentPrice: holding.avgCost,
            change: 0,
            changePercent: '0%',
            volume: '0',
          };
        }
      })
    );

    return c.json({ holdings: realtimeData });
  } catch (error) {
    console.error('Portfolio realtime error:', error);
    return c.json({ error: 'Failed to fetch realtime data' }, 500);
  }
});

// ===== NEWS API =====
// Get financial news
app.get("/make-server-22c8dcd8/news/latest", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const query = c.req.query('q') || 'stock market';
    const apiKey = Deno.env.get('NEWSAPI_KEY') || '';
    
    if (!apiKey) {
      // Return mock data if no API key
      return c.json({
        articles: [
          {
            title: 'Markets Rally on Strong Economic Data',
            description: 'Major indices showed gains as investors reacted positively to economic indicators.',
            url: 'https://example.com',
            publishedAt: new Date().toISOString(),
            source: { name: 'Financial Times' }
          }
        ]
      });
    }
    
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&pageSize=10&apiKey=${apiKey}`
    );
    
    const data = await response.json();
    
    return c.json(data);
  } catch (error) {
    console.error('NewsAPI error:', error);
    return c.json({ error: 'Failed to fetch news' }, 500);
  }
});

// Get portfolio-specific news
app.get("/make-server-22c8dcd8/news/portfolio", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get user's portfolio
    const key = `portfolio:${user.id}`;
    const portfolio = await kv.get(key);
    
    if (!portfolio || !portfolio.holdings) {
      return c.json({ articles: [] });
    }

    const apiKey = Deno.env.get('NEWSAPI_KEY') || '';
    const symbols = portfolio.holdings.map((h: any) => h.symbol).join(' OR ');
    
    if (!apiKey) {
      // Mock data
      return c.json({
        articles: portfolio.holdings.map((h: any) => ({
          title: `${h.symbol} Shows Strong Performance`,
          description: `Latest updates on ${h.symbol} stock performance and market outlook.`,
          url: 'https://example.com',
          publishedAt: new Date().toISOString(),
          source: { name: 'Market Watch' }
        }))
      });
    }
    
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(symbols)}&sortBy=publishedAt&language=en&pageSize=20&apiKey=${apiKey}`
    );
    
    const data = await response.json();
    
    return c.json(data);
  } catch (error) {
    console.error('Portfolio news error:', error);
    return c.json({ error: 'Failed to fetch portfolio news' }, 500);
  }
});

// ===== HUGGING FACE SENTIMENT ANALYSIS =====
app.post("/make-server-22c8dcd8/sentiment/analyze", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { text } = await c.req.json();
    const hfToken = Deno.env.get('HUGGINGFACE_API_TOKEN') || '';
    
    if (!hfToken) {
      // Return mock sentiment
      return c.json({
        sentiment: 'positive',
        score: 0.85,
        label: 'POSITIVE'
      });
    }
    
    const response = await fetch(
      'https://api-inference.huggingface.co/models/ProsusAI/finbert',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: text }),
      }
    );
    
    const data = await response.json();
    
    return c.json(data);
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return c.json({ error: 'Failed to analyze sentiment' }, 500);
  }
});

// Analyze portfolio sentiment from news
app.get("/make-server-22c8dcd8/sentiment/portfolio", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get portfolio news first
    const key = `portfolio:${user.id}`;
    const portfolio = await kv.get(key);
    
    if (!portfolio || !portfolio.holdings) {
      return c.json({ sentiments: [] });
    }

    // Mock sentiment data for each stock
    const sentiments = portfolio.holdings.map((holding: any) => ({
      symbol: holding.symbol,
      sentiment: Math.random() > 0.5 ? 'positive' : 'neutral',
      score: 0.6 + Math.random() * 0.3,
      newsCount: Math.floor(Math.random() * 10) + 5,
    }));

    return c.json({ sentiments });
  } catch (error) {
    console.error('Portfolio sentiment error:', error);
    return c.json({ error: 'Failed to analyze portfolio sentiment' }, 500);
  }
});

// ===== CLAUDE AI CHAT =====
app.post("/make-server-22c8dcd8/ai/chat", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { message, context } = await c.req.json();
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY') || '';
    
    // Get user portfolio for context
    const portfolioKey = `portfolio:${user.id}`;
    const portfolio = await kv.get(portfolioKey);
    
    const portfolioContext = portfolio 
      ? `User's portfolio includes: ${portfolio.holdings.map((h: any) => `${h.symbol} (${h.shares} shares at $${h.avgCost})`).join(', ')}. Total value: $${portfolio.totalValue.toLocaleString()}.`
      : 'User has not set up a portfolio yet.';
    
    if (!anthropicKey) {
      // Return mock response
      return c.json({
        response: `Based on your portfolio (${portfolio?.holdings?.length || 0} holdings), I recommend diversifying across different sectors. Your current allocation shows potential for optimization. Would you like specific suggestions for ${portfolio?.holdings?.[0]?.symbol || 'your holdings'}?`,
        timestamp: new Date().toISOString()
      });
    }
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `You are a financial advisor AI assistant for Neufin. ${portfolioContext}\n\nUser question: ${message}\n\nProvide personalized, actionable advice based on their portfolio.`
        }]
      }),
    });
    
    const data = await response.json();
    
    return c.json({
      response: data.content?.[0]?.text || 'I apologize, but I encountered an error processing your request.',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Claude AI error:', error);
    return c.json({ error: 'Failed to process AI chat' }, 500);
  }
});

// ===== PLAID INTEGRATION =====
// Create Plaid Link token
app.post("/make-server-22c8dcd8/plaid/create-link-token", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const plaidClientId = Deno.env.get('PLAID_CLIENT_ID') || '';
    const plaidSecret = Deno.env.get('PLAID_SECRET') || '';
    const plaidEnv = Deno.env.get('PLAID_ENV') || 'sandbox';
    
    if (!plaidClientId || !plaidSecret) {
      return c.json({ 
        error: 'Plaid not configured',
        message: 'Please configure PLAID_CLIENT_ID and PLAID_SECRET environment variables'
      }, 503);
    }
    
    const response = await fetch(`https://${plaidEnv}.plaid.com/link/token/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: plaidClientId,
        secret: plaidSecret,
        user: {
          client_user_id: user.id,
        },
        client_name: 'Neufin',
        products: ['investments'],
        country_codes: ['US'],
        language: 'en',
      }),
    });
    
    const data = await response.json();
    
    return c.json(data);
  } catch (error) {
    console.error('Plaid link token error:', error);
    return c.json({ error: 'Failed to create link token' }, 500);
  }
});

// Exchange Plaid public token
app.post("/make-server-22c8dcd8/plaid/exchange-token", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { public_token } = await c.req.json();
    const plaidClientId = Deno.env.get('PLAID_CLIENT_ID') || '';
    const plaidSecret = Deno.env.get('PLAID_SECRET') || '';
    const plaidEnv = Deno.env.get('PLAID_ENV') || 'sandbox';
    
    // Exchange public token for access token
    const exchangeResponse = await fetch(`https://${plaidEnv}.plaid.com/item/public_token/exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: plaidClientId,
        secret: plaidSecret,
        public_token,
      }),
    });
    
    const exchangeData = await exchangeResponse.json();
    
    if (!exchangeData.access_token) {
      throw new Error('Failed to exchange token');
    }
    
    // Save access token
    await kv.set(`plaid:${user.id}`, {
      accessToken: exchangeData.access_token,
      itemId: exchangeData.item_id,
      userId: user.id,
      connectedAt: new Date().toISOString(),
    });
    
    // Fetch investment holdings
    const holdingsResponse = await fetch(`https://${plaidEnv}.plaid.com/investments/holdings/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: plaidClientId,
        secret: plaidSecret,
        access_token: exchangeData.access_token,
      }),
    });
    
    const holdingsData = await holdingsResponse.json();
    
    // Convert Plaid holdings to our format
    const holdings = holdingsData.holdings?.map((h: any) => ({
      symbol: h.security.ticker_symbol || h.security.name,
      shares: h.quantity,
      avgCost: h.cost_basis || h.institution_price,
    })) || [];
    
    const totalValue = holdings.reduce((sum: number, h: any) => 
      sum + (h.shares * h.avgCost), 0
    );
    
    // Save portfolio
    await kv.set(`portfolio:${user.id}`, {
      holdings,
      totalValue,
      method: 'plaid',
      setupCompletedAt: new Date().toISOString(),
      userId: user.id,
      updatedAt: new Date().toISOString(),
    });
    
    return c.json({ 
      success: true,
      holdings,
      totalValue 
    });
  } catch (error) {
    console.error('Plaid exchange error:', error);
    return c.json({ error: 'Failed to exchange token and fetch holdings' }, 500);
  }
});

// ===== STRIPE PAYMENT =====
// Create checkout session
app.post("/make-server-22c8dcd8/stripe/create-checkout", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { priceId, plan } = await c.req.json();
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY') || '';
    
    if (!stripeKey) {
      return c.json({ 
        error: 'Stripe not configured',
        message: 'Please configure STRIPE_SECRET_KEY environment variable'
      }, 503);
    }
    
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'success_url': `${c.req.header('origin') || 'http://localhost:3000'}/user-dashboard?payment=success`,
        'cancel_url': `${c.req.header('origin') || 'http://localhost:3000'}/pricing?payment=cancelled`,
        'mode': 'subscription',
        'line_items[0][price]': priceId,
        'line_items[0][quantity]': '1',
        'client_reference_id': user.id,
        'customer_email': user.email || '',
      }).toString(),
    });
    
    const data = await response.json();
    
    return c.json(data);
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return c.json({ error: 'Failed to create checkout session' }, 500);
  }
});

// Get subscription status
app.get("/make-server-22c8dcd8/stripe/subscription", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user has active subscription
    const key = `subscription:${user.id}`;
    const subscription = await kv.get(key);
    
    return c.json({ 
      subscription: subscription || null,
      active: subscription?.status === 'active'
    });
  } catch (error) {
    console.error('Subscription check error:', error);
    return c.json({ error: 'Failed to check subscription' }, 500);
  }
});

// Register all enhanced endpoints
registerEnhancedEndpoints(app);

// 404 handler
app.notFound((c) => {
  return c.json({ 
    error: 'Endpoint not found',
    path: c.req.path,
    method: c.req.method
  }, 404);
});

// Global error handler
app.onError((err, c) => {
  console.error('Global error:', err);
  return c.json({ 
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  }, 500);
});

Deno.serve(app.fetch);