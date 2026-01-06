import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

// Enable CORS for all routes
app.use('/*', cors());

const FINNHUB_API_KEY = Deno.env.get('FINNHUB_API_KEY') || '';

// Mock data fallback
const mockStockData = {
  'AAPL': { c: 185.25, d: 2.15, dp: 1.17 },
  'GOOGL': { c: 142.80, d: -0.95, dp: -0.66 },
  'MSFT': { c: 378.90, d: 4.20, dp: 1.12 },
  'TSLA': { c: 245.67, d: -3.45, dp: -1.38 },
  'NVDA': { c: 735.50, d: 12.80, dp: 1.77 },
  'AMZN': { c: 155.20, d: 1.85, dp: 1.21 },
  'META': { c: 475.30, d: 4.05, dp: 0.85 },
  'NFLX': { c: 485.90, d: -2.05, dp: -0.42 }
};

// Generate realistic mock data with variations
function generateMockData(symbol: string) {
  const base = mockStockData[symbol as keyof typeof mockStockData];
  if (!base) {
    return { c: 100, d: 0, dp: 0, source: 'demo', reason: 'Live quote unavailable' };
  }

  // Add small random variation
  const variation = (Math.random() - 0.5) * 0.5;
  return {
    c: Number((base.c + (Math.random() - 0.5) * 2).toFixed(2)),
    d: Number((base.d + variation).toFixed(2)),
    dp: Number((base.dp + variation * 0.1).toFixed(2)),
    source: 'demo',
    reason: 'Live quote unavailable'
  };
}

// Proxy endpoint for stock quotes
app.get('/quote/:symbol', async (c) => {
  const symbol = c.req.param('symbol');
  
  try {
    if (!FINNHUB_API_KEY) {
      return c.json(generateMockData(symbol));
    }
    // Try to fetch from Finnhub API
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    
    // Check if data is valid
    if (!data.c || data.c === 0) {
      console.log(`Invalid data for ${symbol}, using mock data`);
      return c.json(generateMockData(symbol));
    }

    return c.json(data);
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    // Return mock data as fallback
    return c.json(generateMockData(symbol));
  }
});

// Batch quote endpoint
app.post('/quotes', async (c) => {
  const body = await c.req.json();
  const symbols = body.symbols || [];

  try {
    const quotes = await Promise.all(
      symbols.map(async (symbol: string) => {
        try {
          if (!FINNHUB_API_KEY) {
            return { symbol, ...generateMockData(symbol) };
          }
          const response = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`,
            {
              headers: {
                'Accept': 'application/json'
              }
            }
          );

          if (!response.ok) {
            return { symbol, ...generateMockData(symbol) };
          }

          const data = await response.json();
          
          if (!data.c || data.c === 0) {
            return { symbol, ...generateMockData(symbol) };
          }

          return { symbol, ...data };
        } catch {
          return { symbol, ...generateMockData(symbol) };
        }
      })
    );

    return c.json({ quotes });
  } catch (error) {
    console.error('Batch quote error:', error);
    // Return all mock data
    const mockQuotes = symbols.map((symbol: string) => ({
      symbol,
      ...generateMockData(symbol)
    }));
    return c.json({ quotes: mockQuotes });
  }
});

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ 
    status: 'healthy',
    service: 'stock-proxy',
    timestamp: new Date().toISOString()
  });
});

export default app;
