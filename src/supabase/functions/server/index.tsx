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

type NormalizedQuote = {
  source: 'live' | 'demo';
  provider: 'finnhub' | 'alphavantage' | 'demo';
  asOf: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high?: number;
  low?: number;
  open?: number;
  volume?: string;
  reason?: string;
};

type NormalizedIntraday = {
  source: 'live' | 'demo';
  provider: 'finnhub' | 'alphavantage' | 'demo';
  asOf: string;
  symbol: string;
  interval: string;
  candles: Array<{ timestamp: string; open: number; high: number; low: number; close: number; volume: number }>;
  reason?: string;
};

type AlphaSignalRecord = {
  id: string;
  user_id: string;
  asset: string;
  direction: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  time_horizon: string;
  insight: string;
  sources: number;
  category: string;
  source: 'live' | 'demo';
  provider: string;
  created_at: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

async function getAlphaSignalsFromDb(userId: string): Promise<AlphaSignalRecord[]> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data } = await supabase
    .from('alpha_signals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(25);
  return (data || []) as AlphaSignalRecord[];
}

async function getAlphaSignalAttributionsFromDb(signalId: string) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data } = await supabase
    .from('alpha_signal_attributions')
    .select('*')
    .eq('signal_id', signalId)
    .order('created_at', { ascending: false })
    .limit(50);
  return data || [];
}

async function fetchNewsApiArticles(query: string) {
  const apiKey = Deno.env.get('NEWSAPI_KEY') || '';
  if (!apiKey) {
    throw new Error('NEWSAPI_KEY not configured');
  }

  const response = await fetch(
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&pageSize=10&apiKey=${apiKey}`
  );

  if (!response.ok) {
    throw new Error(`NewsAPI returned ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data?.articles) ? data.articles : [];
}

async function generateAlphaSignals(userId: string) {
  const dbPortfolio = await getUserPortfolioFromDb(userId);
  const holdings = dbPortfolio?.holdings || [];

  if (!holdings.length) {
    return {
      signals: [],
      attributionsBySignalId: {},
      source: 'live' as const,
      provider: 'neufin' as const,
      reason: 'No portfolio holdings',
    };
  }

  const symbols = holdings.map((h: any) => String(h.symbol || '').toUpperCase()).filter(Boolean);
  const topSymbols = symbols.slice(0, 5);

  let articles: any[] = [];
  let signalsSource: 'live' | 'demo' = 'live';
  let reason: string | undefined;

  try {
    articles = await fetchNewsApiArticles(topSymbols.join(' OR '));
  } catch (e: any) {
    signalsSource = 'demo';
    reason = e?.message || 'News unavailable';
    articles = [];
  }

  const quotes = await Promise.all(topSymbols.map(async (s) => getQuoteWithFallback(s)));
  const now = new Date().toISOString();

  const signals = quotes.map((q) => {
    const direction: 'bullish' | 'bearish' | 'neutral' =
      q.changePercent > 0.4 ? 'bullish' : q.changePercent < -0.4 ? 'bearish' : 'neutral';

    const confidence = clamp(60 + Math.abs(q.changePercent) * 8 + (articles.length ? 10 : 0), 55, 95);
    const category = articles.length ? 'News + Price Action' : 'Price Action';
    const related = articles.filter((a) => {
      const title = String(a?.title || '').toUpperCase();
      const desc = String(a?.description || '').toUpperCase();
      return title.includes(q.symbol) || desc.includes(q.symbol);
    });

    const head = related[0] || articles[0];
    const insight = head?.title
      ? `${head.title}`
      : q.source === 'demo'
        ? `Live market/news feeds unavailable.`
        : `Market moved ${q.changePercent >= 0 ? '+' : ''}${q.changePercent.toFixed(2)}% recently.`;

    return {
      asset: q.symbol,
      direction,
      confidence: Number(confidence.toFixed(1)),
      timeHorizon: '3-7 days',
      insight,
      sources: Math.max(related.length, articles.length ? 1 : 0),
      category,
      timestamp: now,
      source: (q.source === 'demo' || signalsSource === 'demo') ? 'demo' : 'live',
      provider: q.provider || 'neufin',
      reason: reason || q.reason,
      attributions: related.slice(0, 5).map((a, idx) => ({
        id: `attr-${idx}`,
        source: a?.source?.name || 'NewsAPI',
        snippet: a?.description || a?.title || '',
        timestamp: a?.publishedAt || now,
        sentiment: 0.5,
        confidence: 0.6,
        url: a?.url,
      })),
    };
  });

  return {
    signals,
    source: signalsSource,
    provider: 'newsapi',
    reason,
  };
}

async function upsertAlphaSignals(userId: string, generated: any) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const inserted: any[] = [];

  for (const s of generated.signals) {
    const { data: signalRow, error: signalErr } = await supabase
      .from('alpha_signals')
      .insert({
        user_id: userId,
        asset: s.asset,
        direction: s.direction,
        confidence: s.confidence,
        time_horizon: s.timeHorizon,
        insight: s.insight,
        sources: s.sources,
        category: s.category,
        source: s.source,
        provider: s.provider,
      })
      .select('*')
      .single();

    if (signalErr || !signalRow?.id) {
      continue;
    }

    inserted.push(signalRow);

    if (Array.isArray(s.attributions) && s.attributions.length) {
      const rows = s.attributions.map((a: any) => ({
        signal_id: signalRow.id,
        source: a.source,
        snippet: a.snippet,
        url: a.url || null,
        sentiment: a.sentiment,
        confidence: a.confidence,
        created_at: new Date(a.timestamp || new Date().toISOString()).toISOString(),
      }));

      await supabase.from('alpha_signal_attributions').insert(rows);
    }
  }

  return inserted;
}

async function getUserPortfolioFromDb(userId: string) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data: portfolio, error } = await supabase
    .from('portfolios')
    .select('*, portfolio_positions (*)')
    .eq('user_id', userId)
    .single();

  if (error || !portfolio) {
    return null;
  }

  const holdings = (portfolio.portfolio_positions || []).map((p: any) => ({
    symbol: p.symbol,
    shares: p.shares,
    avgCost: p.cost_basis,
  }));

  return { portfolio, holdings };
}

function createDemoQuote(symbol: string, reason: string): NormalizedQuote {
  return {
    source: 'demo',
    provider: 'demo',
    asOf: new Date().toISOString(),
    symbol,
    price: 0,
    change: 0,
    changePercent: 0,
    reason,
  };
}

async function fetchFinnhubQuote(symbol: string): Promise<NormalizedQuote> {
  const apiKey = Deno.env.get('FINNHUB_API_KEY') || '';
  if (!apiKey) {
    throw new Error('FINNHUB_API_KEY not configured');
  }

  const response = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`,
    {
      headers: { 'Accept': 'application/json' },
    }
  );

  if (!response.ok) {
    throw new Error(`Finnhub returned ${response.status}`);
  }

  const data = await response.json();

  if (!data?.c || data.c === 0) {
    throw new Error('Finnhub returned invalid quote');
  }

  return {
    source: 'live',
    provider: 'finnhub',
    asOf: new Date().toISOString(),
    symbol,
    price: Number(data.c),
    change: Number(data.d || 0),
    changePercent: Number(data.dp || 0),
    high: Number(data.h || 0),
    low: Number(data.l || 0),
    open: Number(data.o || 0),
  };
}

async function fetchAlphaVantageQuote(symbol: string): Promise<NormalizedQuote> {
  const apiKey = Deno.env.get('ALPHAVANTAGE_API_KEY') || '';
  if (!apiKey || apiKey === 'demo') {
    throw new Error('ALPHAVANTAGE_API_KEY not configured');
  }

  const response = await fetch(
    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`
  );

  if (!response.ok) {
    throw new Error(`AlphaVantage returned ${response.status}`);
  }

  const data = await response.json();
  const quote = data?.['Global Quote'];
  if (!quote) {
    throw new Error('AlphaVantage returned invalid quote');
  }

  return {
    source: 'live',
    provider: 'alphavantage',
    asOf: new Date().toISOString(),
    symbol: quote['01. symbol'] || symbol,
    price: parseFloat(quote['05. price'] || '0'),
    change: parseFloat(quote['09. change'] || '0'),
    changePercent: parseFloat((quote['10. change percent'] || '0').replace('%', '')),
    volume: quote['06. volume'],
    high: parseFloat(quote['03. high'] || '0'),
    low: parseFloat(quote['04. low'] || '0'),
    open: parseFloat(quote['02. open'] || '0'),
  };
}

async function getQuoteWithFallback(symbol: string): Promise<NormalizedQuote> {
  const cacheKey = `stocks:quote:${symbol}`;
  const cached = await kv.get(`cache:${cacheKey}`);
  if (cached?.value && new Date(cached.expiresAt) > new Date()) {
    return cached.value as NormalizedQuote;
  }

  try {
    const live = await fetchFinnhubQuote(symbol);
    await kv.set(`cache:${cacheKey}`, {
      key: cacheKey,
      value: live,
      expiresAt: new Date(Date.now() + 15 * 1000).toISOString(),
    });
    return live;
  } catch (e1) {
    try {
      const live = await fetchAlphaVantageQuote(symbol);
      await kv.set(`cache:${cacheKey}`, {
        key: cacheKey,
        value: live,
        expiresAt: new Date(Date.now() + 30 * 1000).toISOString(),
      });
      return live;
    } catch (e2) {
      const demo = createDemoQuote(symbol, `Live quote unavailable (Finnhub/AlphaVantage)`);
      await kv.set(`cache:${cacheKey}`, {
        key: cacheKey,
        value: demo,
        expiresAt: new Date(Date.now() + 10 * 1000).toISOString(),
      });
      return demo;
    }
  }
}

async function fetchFinnhubIntraday(symbol: string): Promise<NormalizedIntraday> {
  const apiKey = Deno.env.get('FINNHUB_API_KEY') || '';
  if (!apiKey) {
    throw new Error('FINNHUB_API_KEY not configured');
  }

  const to = Math.floor(Date.now() / 1000);
  const from = to - 60 * 60 * 24;

  const response = await fetch(
    `https://finnhub.io/api/v1/stock/candle?symbol=${encodeURIComponent(symbol)}&resolution=5&from=${from}&to=${to}&token=${apiKey}`,
    { headers: { 'Accept': 'application/json' } }
  );

  if (!response.ok) {
    throw new Error(`Finnhub candle returned ${response.status}`);
  }

  const data = await response.json();
  if (!data || data.s !== 'ok' || !Array.isArray(data.t)) {
    throw new Error('Finnhub returned invalid candle data');
  }

  const candles = data.t.map((t: number, i: number) => ({
    timestamp: new Date(t * 1000).toISOString(),
    open: Number(data.o?.[i] || 0),
    high: Number(data.h?.[i] || 0),
    low: Number(data.l?.[i] || 0),
    close: Number(data.c?.[i] || 0),
    volume: Number(data.v?.[i] || 0),
  }));

  return {
    source: 'live',
    provider: 'finnhub',
    asOf: new Date().toISOString(),
    symbol,
    interval: '5min',
    candles,
  };
}

async function fetchAlphaVantageIntraday(symbol: string): Promise<NormalizedIntraday> {
  const apiKey = Deno.env.get('ALPHAVANTAGE_API_KEY') || '';
  if (!apiKey || apiKey === 'demo') {
    throw new Error('ALPHAVANTAGE_API_KEY not configured');
  }

  const response = await fetch(
    `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${encodeURIComponent(symbol)}&interval=5min&apikey=${apiKey}`
  );

  if (!response.ok) {
    throw new Error(`AlphaVantage returned ${response.status}`);
  }

  const data = await response.json();
  const timeSeries = data?.['Time Series (5min)'];
  if (!timeSeries) {
    throw new Error('AlphaVantage returned invalid intraday data');
  }

  const candles = Object.entries(timeSeries)
    .slice(0, 200)
    .map(([timestamp, values]: [string, any]) => ({
      timestamp: new Date(timestamp).toISOString(),
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume']),
    }))
    .reverse();

  return {
    source: 'live',
    provider: 'alphavantage',
    asOf: new Date().toISOString(),
    symbol,
    interval: '5min',
    candles,
  };
}

async function getIntradayWithFallback(symbol: string): Promise<NormalizedIntraday> {
  const cacheKey = `stocks:intraday:${symbol}`;
  const cached = await kv.get(`cache:${cacheKey}`);
  if (cached?.value && new Date(cached.expiresAt) > new Date()) {
    return cached.value as NormalizedIntraday;
  }

  try {
    const live = await fetchFinnhubIntraday(symbol);
    await kv.set(`cache:${cacheKey}`, {
      key: cacheKey,
      value: live,
      expiresAt: new Date(Date.now() + 60 * 1000).toISOString(),
    });
    return live;
  } catch (e1) {
    try {
      const live = await fetchAlphaVantageIntraday(symbol);
      await kv.set(`cache:${cacheKey}`, {
        key: cacheKey,
        value: live,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      });
      return live;
    } catch (e2) {
      const demo: NormalizedIntraday = {
        source: 'demo',
        provider: 'demo',
        asOf: new Date().toISOString(),
        symbol,
        interval: '5min',
        candles: [],
        reason: 'Live intraday unavailable (Finnhub/AlphaVantage)',
      };
      await kv.set(`cache:${cacheKey}`, {
        key: cacheKey,
        value: demo,
        expiresAt: new Date(Date.now() + 30 * 1000).toISOString(),
      });
      return demo;
    }
  }
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
    const holdings = Array.isArray(portfolioData?.holdings) ? portfolioData.holdings : [];

    if (!holdings.length) {
      return c.json({ error: 'No holdings provided' }, 400);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: existingPortfolio } = await supabase
      .from('portfolios')
      .select('id')
      .eq('user_id', user.id)
      .single();

    let portfolioId = existingPortfolio?.id;

    if (!portfolioId) {
      const { data: created, error: createError } = await supabase
        .from('portfolios')
        .insert({
          user_id: user.id,
          name: portfolioData?.name || 'Portfolio',
          is_synced: portfolioData?.method === 'plaid' || portfolioData?.is_synced === true,
        })
        .select('id')
        .single();

      if (createError || !created?.id) {
        throw createError || new Error('Failed to create portfolio');
      }

      portfolioId = created.id;
    } else {
      await supabase
        .from('portfolios')
        .update({
          name: portfolioData?.name || 'Portfolio',
          is_synced: portfolioData?.method === 'plaid' || portfolioData?.is_synced === true,
        })
        .eq('id', portfolioId);
    }

    await supabase
      .from('portfolio_positions')
      .delete()
      .eq('portfolio_id', portfolioId);

    const positions = holdings
      .map((h: any) => ({
        portfolio_id: portfolioId,
        symbol: String(h.symbol || h.ticker || '').toUpperCase(),
        shares: Number(h.shares ?? h.quantity ?? 0),
        cost_basis: Number(h.avgCost ?? h.costBasis ?? h.cost_basis ?? 0),
        purchase_date: h.purchaseDate || h.purchase_date || null,
        current_price: Number(h.currentPrice ?? h.current_price ?? h.avgCost ?? h.costBasis ?? 0),
      }))
      .filter((p: any) => p.symbol && p.shares > 0 && p.cost_basis > 0);

    if (!positions.length) {
      return c.json({ error: 'No valid holdings provided' }, 400);
    }

    const { error: insertError } = await supabase
      .from('portfolio_positions')
      .insert(positions);

    if (insertError) {
      throw insertError;
    }

    console.log(`Portfolio saved to DB for user ${user.id}`);
    return c.json({ success: true, portfolioId });
  } catch (error) {
    console.error('Error saving portfolio:', error);
    return c.json({ error: `Failed to save portfolio: ${error}` }, 500);
  }
});

app.get("/make-server-22c8dcd8/alpha/signals", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const cacheKey = `alpha:signals:${user.id}`;
    const cached = await kv.get(`cache:${cacheKey}`);
    if (cached?.value && new Date(cached.expiresAt) > new Date()) {
      return c.json(cached.value);
    }

    const existing = await getAlphaSignalsFromDb(user.id);
    const recent = existing.filter((s) => {
      const t = new Date((s as any).created_at || 0).getTime();
      return Date.now() - t < 5 * 60 * 1000;
    });

    if (recent.length) {
      const payload = { signals: recent, source: 'live', provider: 'neufin', cached: true };
      await kv.set(`cache:${cacheKey}`, {
        key: cacheKey,
        value: payload,
        expiresAt: new Date(Date.now() + 30 * 1000).toISOString(),
      });
      return c.json(payload);
    }

    const generated = await generateAlphaSignals(user.id);
    const inserted = await upsertAlphaSignals(user.id, generated);

    const payload = {
      signals: inserted,
      source: generated.source,
      provider: generated.provider,
      reason: generated.reason,
      cached: false,
    };

    await kv.set(`cache:${cacheKey}`, {
      key: cacheKey,
      value: payload,
      expiresAt: new Date(Date.now() + 30 * 1000).toISOString(),
    });

    return c.json(payload);
  } catch (error) {
    console.error('Alpha signals error:', error);
    return c.json({ error: 'Failed to fetch alpha signals' }, 500);
  }
});

app.get("/make-server-22c8dcd8/alpha/signals/:id/attributions", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const signalId = c.req.param('id');
    const attrs = await getAlphaSignalAttributionsFromDb(signalId);
    return c.json({ attributions: attrs, source: 'live' });
  } catch (error) {
    console.error('Alpha attributions error:', error);
    return c.json({ error: 'Failed to fetch attributions' }, 500);
  }
});

// Get user portfolio
app.get("/make-server-22c8dcd8/portfolio/get", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized - please log in' }, 401);
    }

    const dbPortfolio = await getUserPortfolioFromDb(user.id);
    if (dbPortfolio?.portfolio) {
      return c.json({
        portfolio: {
          id: dbPortfolio.portfolio.id,
          holdings: dbPortfolio.holdings,
          method: dbPortfolio.portfolio.is_synced ? 'plaid' : 'manual',
          updatedAt: dbPortfolio.portfolio.updated_at,
          source: 'live',
        }
      });
    }

    const key = `portfolio:${user.id}`;
    const kvPortfolio = await kv.get(key);
    if (!kvPortfolio) {
      return c.json({ portfolio: null, message: 'No portfolio found' });
    }

    return c.json({ portfolio: { ...kvPortfolio, source: 'demo', reason: 'Portfolio loaded from legacy KV store' } });
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

    const quote = await getQuoteWithFallback(symbol);
    return c.json(quote);
  } catch (error) {
    console.error('AlphaVantage error:', error);
    return c.json({ error: 'Failed to fetch stock data' }, 500);
  }
});

app.get("/make-server-22c8dcd8/public/stocks/quote/:symbol", async (c) => {
  try {
    const symbol = c.req.param('symbol');
    const quote = await getQuoteWithFallback(symbol);
    return c.json(quote);
  } catch (error) {
    console.error('Public quote error:', error);
    return c.json(createDemoQuote(c.req.param('symbol'), 'Public quote failed'));
  }
});

app.post("/make-server-22c8dcd8/public/stocks/quotes", async (c) => {
  try {
    const body = await c.req.json();
    const symbols = Array.isArray(body?.symbols) ? body.symbols : [];

    const quotes = await Promise.all(
      symbols.map(async (s: string) => getQuoteWithFallback(String(s || '').toUpperCase()))
    );

    return c.json({ quotes });
  } catch (error) {
    console.error('Public batch quote error:', error);
    return c.json({ quotes: [] });
  }
});

app.get("/make-server-22c8dcd8/public/stocks/intraday/:symbol", async (c) => {
  try {
    const symbol = c.req.param('symbol');
    const intraday = await getIntradayWithFallback(symbol);
    return c.json(intraday);
  } catch (error) {
    console.error('Public intraday error:', error);
    return c.json({
      source: 'demo',
      provider: 'demo',
      asOf: new Date().toISOString(),
      symbol: c.req.param('symbol'),
      interval: '5min',
      candles: [],
      reason: 'Public intraday failed',
    });
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

    const intraday = await getIntradayWithFallback(symbol);
    return c.json(intraday);
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

    const dbPortfolio = await getUserPortfolioFromDb(user.id);
    if (!dbPortfolio?.holdings?.length) {
      return c.json({ error: 'No portfolio found' }, 404);
    }

    const realtimeData = await Promise.all(
      dbPortfolio.holdings.map(async (holding: any) => {
        const quote = await getQuoteWithFallback(holding.symbol);
        return {
          symbol: holding.symbol,
          shares: holding.shares,
          avgCost: holding.avgCost,
          currentPrice: quote.price,
          change: quote.change,
          changePercent: `${quote.changePercent >= 0 ? '+' : ''}${quote.changePercent.toFixed(2)}%`,
          volume: quote.volume || '0',
          source: quote.source,
          provider: quote.provider,
          asOf: quote.asOf,
          reason: quote.reason,
        };
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
        source: 'demo',
        reason: 'NEWSAPI_KEY not configured',
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
    return c.json({ ...data, source: 'live' });
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
        source: 'demo',
        reason: 'NEWSAPI_KEY not configured',
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
    return c.json({ ...data, source: 'live' });
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