import { Hono } from "npm:hono";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import * as utils from "./utils.tsx";
import type { 
  Portfolio, 
  UserSettings, 
  Watchlist, 
  Alert, 
  BiasAnalysis,
  AlphaScore,
  PortfolioPerformance
} from "./types.tsx";

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

export function registerEnhancedEndpoints(app: Hono) {
  
  // ===== PORTFOLIO MANAGEMENT (ENHANCED) =====
  
  // Update portfolio (partial update)
  app.patch("/make-server-22c8dcd8/portfolio/update", async (c) => {
    try {
      const user = await verifyUser(c.req.header('Authorization'));
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const rateLimit = await utils.checkRateLimit(user.id, 'portfolio');
      if (!rateLimit.allowed) {
        return c.json({ error: 'Rate limit exceeded', resetAt: rateLimit.resetAt }, 429);
      }

      const updates = await c.req.json();
      const key = `portfolio:${user.id}`;
      const currentPortfolio = await kv.get(key);

      if (!currentPortfolio) {
        return c.json({ error: 'Portfolio not found' }, 404);
      }

      const updatedPortfolio = {
        ...currentPortfolio,
        ...updates,
        userId: user.id,
        updatedAt: new Date().toISOString(),
        version: (currentPortfolio.version || 0) + 1,
      };

      // Validate updated portfolio
      const validation = utils.validatePortfolioData(updatedPortfolio);
      if (!validation.valid) {
        return c.json({ error: 'Invalid portfolio data', details: validation.errors }, 400);
      }

      // Save to history before updating
      await kv.set(`portfolio_history:${user.id}:${Date.now()}`, currentPortfolio);

      // Update portfolio
      await kv.set(key, updatedPortfolio);

      console.log(`Portfolio updated for user ${user.id}`);
      return c.json({ success: true, portfolio: updatedPortfolio });
    } catch (error) {
      console.error('Error updating portfolio:', error);
      return c.json(utils.createErrorResponse(error, 'Failed to update portfolio'), 500);
    }
  });

  // Delete portfolio
  app.delete("/make-server-22c8dcd8/portfolio/delete", async (c) => {
    try {
      const user = await verifyUser(c.req.header('Authorization'));
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const key = `portfolio:${user.id}`;
      const portfolio = await kv.get(key);

      if (!portfolio) {
        return c.json({ error: 'Portfolio not found' }, 404);
      }

      // Archive before deleting
      await kv.set(`portfolio_archive:${user.id}:${Date.now()}`, portfolio);
      await kv.del(key);

      console.log(`Portfolio deleted for user ${user.id}`);
      return c.json({ success: true, message: 'Portfolio deleted' });
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      return c.json(utils.createErrorResponse(error, 'Failed to delete portfolio'), 500);
    }
  });

  // Get portfolio history
  app.get("/make-server-22c8dcd8/portfolio/history", async (c) => {
    try {
      const user = await verifyUser(c.req.header('Authorization'));
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const history = await kv.getByPrefix(`portfolio_history:${user.id}:`);
      
      return c.json({ 
        history: history.sort((a: any, b: any) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ).slice(0, 10) // Last 10 versions
      });
    } catch (error) {
      console.error('Error fetching portfolio history:', error);
      return c.json(utils.createErrorResponse(error, 'Failed to fetch history'), 500);
    }
  });

  // ===== BIAS ANALYSIS =====

  // Analyze portfolio biases
  app.get("/make-server-22c8dcd8/bias/analyze", async (c) => {
    try {
      const user = await verifyUser(c.req.header('Authorization'));
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const rateLimit = await utils.checkRateLimit(user.id, 'default');
      if (!rateLimit.allowed) {
        return c.json({ error: 'Rate limit exceeded' }, 429);
      }

      // Check cache first
      const cacheKey = `bias_analysis:${user.id}`;
      const cached = await utils.getCachedData(cacheKey);
      if (cached) {
        return c.json({ biases: cached, cached: true });
      }

      const portfolio = await kv.get(`portfolio:${user.id}`);
      if (!portfolio || !portfolio.holdings) {
        return c.json({ biases: [] });
      }

      const biases = utils.detectPortfolioBiases(portfolio.holdings);
      
      // Save bias analysis
      const biasAnalyses: BiasAnalysis[] = biases.map(bias => ({
        userId: user.id,
        biasType: bias.type,
        severity: bias.severity,
        description: bias.description,
        affectedHoldings: bias.affectedHoldings,
        suggestion: bias.suggestion,
        detectedAt: new Date().toISOString(),
      }));

      // Cache for 5 minutes
      await utils.setCachedData(cacheKey, biasAnalyses, 300);

      return c.json({ biases: biasAnalyses });
    } catch (error) {
      console.error('Error analyzing biases:', error);
      return c.json(utils.createErrorResponse(error, 'Failed to analyze biases'), 500);
    }
  });

  // Get bias history
  app.get("/make-server-22c8dcd8/bias/history", async (c) => {
    try {
      const user = await verifyUser(c.req.header('Authorization'));
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const history = await kv.getByPrefix(`bias_history:${user.id}:`);
      
      return c.json({ 
        history: history.slice(0, 20) // Last 20 analyses
      });
    } catch (error) {
      console.error('Error fetching bias history:', error);
      return c.json(utils.createErrorResponse(error, 'Failed to fetch bias history'), 500);
    }
  });

  // ===== ALPHA SCORE =====

  // Calculate Alpha Score
  app.get("/make-server-22c8dcd8/alpha/calculate", async (c) => {
    try {
      const user = await verifyUser(c.req.header('Authorization'));
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const rateLimit = await utils.checkRateLimit(user.id, 'default');
      if (!rateLimit.allowed) {
        return c.json({ error: 'Rate limit exceeded' }, 429);
      }

      // Check cache
      const cacheKey = `alpha_score:${user.id}`;
      const cached = await utils.getCachedData(cacheKey);
      if (cached) {
        return c.json({ alphaScore: cached, cached: true });
      }

      const portfolio = await kv.get(`portfolio:${user.id}`);
      if (!portfolio || !portfolio.holdings) {
        return c.json({ error: 'No portfolio found' }, 404);
      }

      // Get biases
      const biases = utils.detectPortfolioBiases(portfolio.holdings);
      
      // Calculate alpha score
      const alphaData = utils.calculateAlphaScore(portfolio, biases);
      
      const alphaScore: AlphaScore = {
        userId: user.id,
        ...alphaData,
        calculatedAt: new Date().toISOString(),
      };

      // Save alpha score history
      await kv.set(`alpha_history:${user.id}:${Date.now()}`, alphaScore);

      // Cache for 10 minutes
      await utils.setCachedData(cacheKey, alphaScore, 600);

      return c.json({ alphaScore });
    } catch (error) {
      console.error('Error calculating alpha score:', error);
      return c.json(utils.createErrorResponse(error, 'Failed to calculate alpha score'), 500);
    }
  });

  // Get alpha score history
  app.get("/make-server-22c8dcd8/alpha/history", async (c) => {
    try {
      const user = await verifyUser(c.req.header('Authorization'));
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const history = await kv.getByPrefix(`alpha_history:${user.id}:`);
      
      return c.json({ 
        history: history.slice(0, 30).map((h: any) => ({
          score: h.score,
          potentialGain: h.potentialGain,
          calculatedAt: h.calculatedAt,
        }))
      });
    } catch (error) {
      console.error('Error fetching alpha history:', error);
      return c.json(utils.createErrorResponse(error, 'Failed to fetch alpha history'), 500);
    }
  });

  // ===== USER SETTINGS =====

  // Get user settings
  app.get("/make-server-22c8dcd8/user/settings", async (c) => {
    try {
      const user = await verifyUser(c.req.header('Authorization'));
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const key = `settings:${user.id}`;
      let settings = await kv.get(key);

      if (!settings) {
        // Create default settings
        settings = {
          userId: user.id,
          notifications: {
            email: true,
            push: false,
            portfolio: true,
            news: true,
            alphaUpdates: true,
          },
          preferences: {
            theme: 'dark',
            currency: 'USD',
            riskTolerance: 'moderate',
          },
          updatedAt: new Date().toISOString(),
        };
        await kv.set(key, settings);
      }

      return c.json({ settings });
    } catch (error) {
      console.error('Error fetching settings:', error);
      return c.json(utils.createErrorResponse(error, 'Failed to fetch settings'), 500);
    }
  });

  // Update user settings
  app.put("/make-server-22c8dcd8/user/settings", async (c) => {
    try {
      const user = await verifyUser(c.req.header('Authorization'));
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const updates = await c.req.json();
      const key = `settings:${user.id}`;
      const currentSettings = await kv.get(key);

      const updatedSettings = {
        ...currentSettings,
        ...updates,
        userId: user.id,
        updatedAt: new Date().toISOString(),
      };

      await kv.set(key, updatedSettings);

      return c.json({ success: true, settings: updatedSettings });
    } catch (error) {
      console.error('Error updating settings:', error);
      return c.json(utils.createErrorResponse(error, 'Failed to update settings'), 500);
    }
  });

  // ===== WATCHLISTS =====

  // Get watchlists
  app.get("/make-server-22c8dcd8/watchlist/all", async (c) => {
    try {
      const user = await verifyUser(c.req.header('Authorization'));
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const watchlists = await kv.getByPrefix(`watchlist:${user.id}:`);
      
      return c.json({ watchlists });
    } catch (error) {
      console.error('Error fetching watchlists:', error);
      return c.json(utils.createErrorResponse(error, 'Failed to fetch watchlists'), 500);
    }
  });

  // Create watchlist
  app.post("/make-server-22c8dcd8/watchlist/create", async (c) => {
    try {
      const user = await verifyUser(c.req.header('Authorization'));
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const { name, symbols } = await c.req.json();

      if (!name || !symbols || !Array.isArray(symbols)) {
        return c.json({ error: 'Invalid watchlist data' }, 400);
      }

      const watchlist: Watchlist = {
        userId: user.id,
        name,
        symbols,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const key = `watchlist:${user.id}:${Date.now()}`;
      await kv.set(key, watchlist);

      return c.json({ success: true, watchlist });
    } catch (error) {
      console.error('Error creating watchlist:', error);
      return c.json(utils.createErrorResponse(error, 'Failed to create watchlist'), 500);
    }
  });

  // ===== ALERTS =====

  // Get alerts
  app.get("/make-server-22c8dcd8/alerts/all", async (c) => {
    try {
      const user = await verifyUser(c.req.header('Authorization'));
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const alerts = await kv.getByPrefix(`alert:${user.id}:`);
      
      return c.json({ alerts });
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return c.json(utils.createErrorResponse(error, 'Failed to fetch alerts'), 500);
    }
  });

  // Create alert
  app.post("/make-server-22c8dcd8/alerts/create", async (c) => {
    try {
      const user = await verifyUser(c.req.header('Authorization'));
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const { symbol, type, condition, threshold } = await c.req.json();

      if (!symbol || !type || !condition || threshold === undefined) {
        return c.json({ error: 'Invalid alert data' }, 400);
      }

      const alert: Alert = {
        userId: user.id,
        symbol,
        type,
        condition,
        threshold,
        active: true,
        createdAt: new Date().toISOString(),
      };

      const key = `alert:${user.id}:${Date.now()}`;
      await kv.set(key, alert);

      return c.json({ success: true, alert });
    } catch (error) {
      console.error('Error creating alert:', error);
      return c.json(utils.createErrorResponse(error, 'Failed to create alert'), 500);
    }
  });

  // ===== PORTFOLIO PERFORMANCE =====

  // Get portfolio performance
  app.get("/make-server-22c8dcd8/portfolio/performance", async (c) => {
    try {
      const user = await verifyUser(c.req.header('Authorization'));
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const period = c.req.query('period') || '1M';
      
      // Check cache
      const cacheKey = `performance:${user.id}:${period}`;
      const cached = await utils.getCachedData(cacheKey);
      if (cached) {
        return c.json({ performance: cached, cached: true });
      }

      const portfolio = await kv.get(`portfolio:${user.id}`);
      if (!portfolio) {
        return c.json({ error: 'No portfolio found' }, 404);
      }

      // Generate performance data
      const performance = utils.generateMockPortfolioPerformance(period, portfolio.totalValue);
      const performanceData: PortfolioPerformance = {
        userId: user.id,
        ...performance,
      };

      // Cache for 5 minutes
      await utils.setCachedData(cacheKey, performanceData, 300);

      return c.json({ performance: performanceData });
    } catch (error) {
      console.error('Error fetching performance:', error);
      return c.json(utils.createErrorResponse(error, 'Failed to fetch performance'), 500);
    }
  });

  // ===== ADMIN ENDPOINTS =====

  // Get system health
  app.get("/make-server-22c8dcd8/admin/health", async (c) => {
    try {
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: Deno.memoryUsage(),
        env: {
          supabaseConfigured: !!Deno.env.get('SUPABASE_URL'),
          alphaVantageConfigured: !!Deno.env.get('ALPHAVANTAGE_API_KEY'),
          newsApiConfigured: !!Deno.env.get('NEWSAPI_KEY'),
          anthropicConfigured: !!Deno.env.get('ANTHROPIC_API_KEY'),
          plaidConfigured: !!Deno.env.get('PLAID_CLIENT_ID'),
          stripeConfigured: !!Deno.env.get('STRIPE_SECRET_KEY'),
        },
      };

      return c.json(health);
    } catch (error) {
      return c.json({ status: 'unhealthy', error: error.message }, 500);
    }
  });

  // Get user count (admin only)
  app.get("/make-server-22c8dcd8/admin/stats", async (c) => {
    try {
      const user = await verifyUser(c.req.header('Authorization'));
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      // In production, add admin role check
      const portfolios = await kv.getByPrefix('portfolio:');
      const subscriptions = await kv.getByPrefix('subscription:');

      return c.json({
        totalUsers: portfolios.length,
        totalSubscriptions: subscriptions.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      return c.json(utils.createErrorResponse(error, 'Failed to fetch stats'), 500);
    }
  });

  // ===== CACHE MANAGEMENT =====

  // Clear user cache
  app.post("/make-server-22c8dcd8/cache/clear", async (c) => {
    try {
      const user = await verifyUser(c.req.header('Authorization'));
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      await utils.clearCache(user.id);

      return c.json({ success: true, message: 'Cache cleared' });
    } catch (error) {
      console.error('Error clearing cache:', error);
      return c.json(utils.createErrorResponse(error, 'Failed to clear cache'), 500);
    }
  });

  return app;
}
