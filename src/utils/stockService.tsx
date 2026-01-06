// Stock data service with error handling and fallbacks

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: string;
  high?: number;
  low?: number;
  open?: number;
  source?: 'live' | 'demo';
  provider?: 'finnhub' | 'alphavantage' | 'demo';
  asOf?: string;
  reason?: string;
}

export interface CandleData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const SUPABASE_URL = (import.meta as any)?.env?.VITE_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY ?? '';
const BACKEND_URL = SUPABASE_URL ? `${SUPABASE_URL}/functions/v1/make-server-22c8dcd8` : '';

// Check if backend is available
export async function checkBackendHealth(): Promise<boolean> {
  try {
    if (!BACKEND_URL) return false;
    const response = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000), // 3 second timeout
    });
    return response.ok;
  } catch (error) {
    console.warn('Backend health check failed:', error);
    return false;
  }
}

function getPublicAuthHeader(): Record<string, string> {
  if (!SUPABASE_ANON_KEY) return {};
  return { Authorization: `Bearer ${SUPABASE_ANON_KEY}` };
}

// Fetch stock quote from backend (authenticated)
async function fetchQuoteFromBackend(symbol: string, accessToken: string): Promise<StockQuote | null> {
  try {
    if (!BACKEND_URL) return null;
    const response = await fetch(`${BACKEND_URL}/stocks/quote/${symbol}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();

    if (data && typeof data.price === 'number') {
      return {
        symbol: data.symbol || symbol,
        price: Number(data.price || 0),
        change: Number(data.change || 0),
        changePercent: Number(data.changePercent || 0),
        volume: data.volume,
        high: data.high,
        low: data.low,
        open: data.open,
        source: data.source,
        provider: data.provider,
        asOf: data.asOf,
        reason: data.reason,
      };
    }

    return null;
  } catch (error) {
    console.warn(`Backend quote fetch failed for ${symbol}:`, error);
    return null;
  }
}

// Fetch stock quote from backend (public)
async function fetchQuoteFromBackendPublic(symbol: string): Promise<StockQuote | null> {
  try {
    if (!BACKEND_URL) return null;

    const response = await fetch(`${BACKEND_URL}/public/stocks/quote/${symbol}`, {
      headers: {
        ...getPublicAuthHeader(),
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();

    if (data && typeof data.price === 'number') {
      return {
        symbol: data.symbol || symbol,
        price: Number(data.price || 0),
        change: Number(data.change || 0),
        changePercent: Number(data.changePercent || 0),
        volume: data.volume,
        high: data.high,
        low: data.low,
        open: data.open,
        source: data.source,
        provider: data.provider,
        asOf: data.asOf,
        reason: data.reason,
      };
    }

    return null;
  } catch (error) {
    console.warn(`Public backend quote fetch failed for ${symbol}:`, error);
    return null;
  }
}

function generateDemoQuote(symbol: string, reason: string): StockQuote {
  const demoPrices: Record<string, number> = {
    AAPL: 185.25,
    GOOGL: 142.80,
    MSFT: 378.90,
    TSLA: 245.67,
    NVDA: 735.50,
    AMZN: 155.20,
    META: 485.30,
    AMD: 178.40,
    NFLX: 625.90,
    SPY: 485.20,
  };

  const basePrice = demoPrices[symbol] ?? 100;

  return {
    symbol,
    price: basePrice,
    change: 0,
    changePercent: 0,
    high: basePrice,
    low: basePrice,
    open: basePrice,
    source: 'demo',
    provider: 'demo',
    asOf: new Date().toISOString(),
    reason,
  };
}

// Main function to fetch stock quote with automatic fallback
export async function fetchStockQuote(
  symbol: string,
  accessToken?: string
): Promise<StockQuote> {
  const normalizedSymbol = symbol.toUpperCase();

  // Try backend first if we have an access token
  if (accessToken) {
    const backendQuote = await fetchQuoteFromBackend(normalizedSymbol, accessToken);
    if (backendQuote && backendQuote.price > 0) {
      return backendQuote;
    }
  }

  // Public endpoint fallback (no user token required)
  const publicQuote = await fetchQuoteFromBackendPublic(normalizedSymbol);
  if (publicQuote && publicQuote.price > 0) {
    return publicQuote;
  }

  return generateDemoQuote(normalizedSymbol, 'Live quote unavailable');
}

// Fetch multiple stock quotes
export async function fetchMultipleQuotes(
  symbols: string[],
  accessToken?: string
): Promise<StockQuote[]> {
  const normalized = symbols.map(s => String(s || '').toUpperCase()).filter(Boolean);

  if (!accessToken) {
    try {
      if (!BACKEND_URL) {
        return normalized.map(s => generateDemoQuote(s, 'Backend URL not configured'));
      }

      const response = await fetch(`${BACKEND_URL}/public/stocks/quotes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getPublicAuthHeader(),
        },
        body: JSON.stringify({ symbols: normalized }),
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      const data = await response.json();
      if (!Array.isArray(data?.quotes)) {
        throw new Error('Invalid batch quote response');
      }

      return data.quotes.map((q: any) => ({
        symbol: q.symbol,
        price: Number(q.price || 0),
        change: Number(q.change || 0),
        changePercent: Number(q.changePercent || 0),
        volume: q.volume,
        high: q.high,
        low: q.low,
        open: q.open,
        source: q.source,
        provider: q.provider,
        asOf: q.asOf,
        reason: q.reason,
      })) as StockQuote[];
    } catch (error) {
      console.warn('Public batch quote fetch failed:', error);
      return normalized.map(s => generateDemoQuote(s, 'Live quotes unavailable'));
    }
  }

  const promises = normalized.map(s => fetchStockQuote(s, accessToken));
  return Promise.all(promises);
}

// Fetch intraday data from backend
async function fetchIntradayFromBackend(
  symbol: string,
  accessToken: string
): Promise<CandleData[] | null> {
  try {
    if (!BACKEND_URL) return null;
    const response = await fetch(`${BACKEND_URL}/stocks/intraday/${symbol}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();

    if (data?.candles && Array.isArray(data.candles)) {
      return data.candles.map((c: any) => ({
        timestamp: c.timestamp,
        open: Number(c.open || 0),
        high: Number(c.high || 0),
        low: Number(c.low || 0),
        close: Number(c.close || 0),
        volume: Number(c.volume || 0),
      }));
    }

    return null;
  } catch (error) {
    console.warn(`Backend intraday fetch failed for ${symbol}:`, error);
    return null;
  }
}

async function fetchIntradayFromBackendPublic(symbol: string): Promise<CandleData[] | null> {
  try {
    if (!BACKEND_URL) return null;

    const response = await fetch(`${BACKEND_URL}/public/stocks/intraday/${symbol}`, {
      headers: {
        ...getPublicAuthHeader(),
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();
    if (data?.candles && Array.isArray(data.candles)) {
      return data.candles.map((c: any) => ({
        timestamp: c.timestamp,
        open: Number(c.open || 0),
        high: Number(c.high || 0),
        low: Number(c.low || 0),
        close: Number(c.close || 0),
        volume: Number(c.volume || 0),
      }));
    }

    return null;
  } catch (error) {
    console.warn(`Public backend intraday fetch failed for ${symbol}:`, error);
    return null;
  }
}

function generateDemoIntraday(symbol: string): CandleData[] {
  const now = new Date();
  const candles: CandleData[] = [];

  const base = generateDemoQuote(symbol, 'Live intraday unavailable').price || 100;
  for (let i = 0; i < 50; i++) {
    const t = new Date(now.getTime() - (50 - i) * 5 * 60 * 1000);
    const drift = Math.sin(i / 6) * 0.6;
    const open = base + drift;
    const close = base + Math.sin((i + 1) / 6) * 0.6;
    const high = Math.max(open, close) + 0.25;
    const low = Math.min(open, close) - 0.25;

    candles.push({
      timestamp: t.toISOString(),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: 0,
    });
  }

  return candles;
}

// Fetch intraday data with fallback
export async function fetchIntradayData(
  symbol: string,
  accessToken?: string
): Promise<CandleData[]> {
  const normalizedSymbol = symbol.toUpperCase();

  // Try backend if we have an access token
  if (accessToken) {
    const backendData = await fetchIntradayFromBackend(normalizedSymbol, accessToken);
    if (backendData && backendData.length > 0) {
      return backendData;
    }
  }

  const publicData = await fetchIntradayFromBackendPublic(normalizedSymbol);
  if (publicData && publicData.length > 0) {
    return publicData;
  }

  return generateDemoIntraday(normalizedSymbol);
}

// Fetch portfolio real-time data
export async function fetchPortfolioRealtime(
  accessToken: string
): Promise<any> {
  try {
    const response = await fetch(`${BACKEND_URL}/portfolio/realtime`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch portfolio realtime data:', error);
    throw error;
  }
}

// Utility to check if stock market is open (US market hours)
export function isMarketOpen(): boolean {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  const hour = now.getHours();
  const minute = now.getMinutes();
  const time = hour * 60 + minute;

  // Weekend
  if (day === 0 || day === 6) {
    return false;
  }

  // Weekday: 9:30 AM - 4:00 PM ET (convert to local time)
  const marketOpen = 9 * 60 + 30; // 9:30 AM
  const marketClose = 16 * 60; // 4:00 PM

  return time >= marketOpen && time <= marketClose;
}

// Get market status message
export function getMarketStatus(): { open: boolean; message: string } {
  const isOpen = isMarketOpen();
  
  if (isOpen) {
    return {
      open: true,
      message: 'Market Open',
    };
  }

  const now = new Date();
  const day = now.getDay();

  if (day === 0 || day === 6) {
    return {
      open: false,
      message: 'Market Closed - Weekend',
    };
  }

  return {
    open: false,
    message: 'Market Closed',
  };
}
