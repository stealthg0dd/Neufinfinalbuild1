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
}

export interface CandleData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const BACKEND_URL = 'https://gpczchjipalfgkfqamcu.supabase.co/functions/v1/make-server-22c8dcd8';
const FINNHUB_API_KEY = 'ctdc3s9r01qk0c1uo82gctdc3s9r01qk0c1uo830';

// Check if backend is available
export async function checkBackendHealth(): Promise<boolean> {
  try {
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

// Fetch stock quote from backend
async function fetchQuoteFromBackend(symbol: string, accessToken: string): Promise<StockQuote | null> {
  try {
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
    
    if (data['Global Quote']) {
      const quote = data['Global Quote'];
      return {
        symbol: quote['01. symbol'] || symbol,
        price: parseFloat(quote['05. price'] || '0'),
        change: parseFloat(quote['09. change'] || '0'),
        changePercent: parseFloat(quote['10. change percent']?.replace('%', '') || '0'),
        volume: quote['06. volume'],
        high: parseFloat(quote['03. high'] || '0'),
        low: parseFloat(quote['04. low'] || '0'),
        open: parseFloat(quote['02. open'] || '0'),
      };
    }

    return null;
  } catch (error) {
    console.warn(`Backend quote fetch failed for ${symbol}:`, error);
    return null;
  }
}

// Fetch stock quote from Finnhub (fallback)
async function fetchQuoteFromFinnhub(symbol: string): Promise<StockQuote | null> {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`,
      { signal: AbortSignal.timeout(5000) }
    );

    if (!response.ok) {
      throw new Error(`Finnhub returned ${response.status}`);
    }

    const data = await response.json();
    
    if (data.c && data.c > 0) {
      return {
        symbol,
        price: data.c, // current price
        change: data.d || 0, // change
        changePercent: data.dp || 0, // percent change
        high: data.h || 0,
        low: data.l || 0,
        open: data.o || 0,
      };
    }

    return null;
  } catch (error) {
    console.warn(`Finnhub quote fetch failed for ${symbol}:`, error);
    return null;
  }
}

// Generate mock stock quote
function generateMockQuote(symbol: string): StockQuote {
  const mockPrices: Record<string, number> = {
    'AAPL': 185.25,
    'GOOGL': 142.80,
    'MSFT': 378.90,
    'TSLA': 245.67,
    'NVDA': 735.50,
    'AMZN': 155.20,
    'META': 485.30,
    'AMD': 178.40,
    'NFLX': 625.90,
    'SPY': 485.20,
  };

  const basePrice = mockPrices[symbol] || 100 + Math.random() * 200;
  const change = (Math.random() - 0.5) * 10;
  const changePercent = (change / basePrice) * 100;

  return {
    symbol,
    price: parseFloat(basePrice.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    high: parseFloat((basePrice * 1.02).toFixed(2)),
    low: parseFloat((basePrice * 0.98).toFixed(2)),
    open: parseFloat((basePrice * 0.99).toFixed(2)),
  };
}

// Main function to fetch stock quote with automatic fallback
export async function fetchStockQuote(
  symbol: string,
  accessToken?: string
): Promise<StockQuote> {
  // Try backend first if we have an access token
  if (accessToken) {
    const backendQuote = await fetchQuoteFromBackend(symbol, accessToken);
    if (backendQuote && backendQuote.price > 0) {
      return backendQuote;
    }
  }

  // Try Finnhub as fallback
  const finnhubQuote = await fetchQuoteFromFinnhub(symbol);
  if (finnhubQuote && finnhubQuote.price > 0) {
    return finnhubQuote;
  }

  // Return mock data as last resort
  console.warn(`Using mock data for ${symbol}`);
  return generateMockQuote(symbol);
}

// Fetch multiple stock quotes
export async function fetchMultipleQuotes(
  symbols: string[],
  accessToken?: string
): Promise<StockQuote[]> {
  const promises = symbols.map(symbol => fetchStockQuote(symbol, accessToken));
  return Promise.all(promises);
}

// Fetch intraday data from backend
async function fetchIntradayFromBackend(
  symbol: string,
  accessToken: string
): Promise<CandleData[] | null> {
  try {
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
    
    if (data['Time Series (5min)']) {
      const timeSeries = data['Time Series (5min)'];
      const candleData: CandleData[] = Object.entries(timeSeries)
        .slice(0, 50)
        .map(([timestamp, values]: [string, any]) => ({
          timestamp,
          open: parseFloat(values['1. open']),
          high: parseFloat(values['2. high']),
          low: parseFloat(values['3. low']),
          close: parseFloat(values['4. close']),
          volume: parseInt(values['5. volume']),
        }))
        .reverse();

      return candleData;
    }

    return null;
  } catch (error) {
    console.warn(`Backend intraday fetch failed for ${symbol}:`, error);
    return null;
  }
}

// Generate mock intraday data
function generateMockIntraday(symbol: string): CandleData[] {
  const now = new Date();
  const mockCandles: CandleData[] = [];
  let basePrice = 150 + Math.random() * 50;

  for (let i = 0; i < 50; i++) {
    const timestamp = new Date(now.getTime() - (50 - i) * 5 * 60 * 1000);
    const volatility = 0.02;
    const open = basePrice;
    const change = (Math.random() - 0.5) * basePrice * volatility;
    const close = basePrice + change;
    const high = Math.max(open, close) * (1 + Math.random() * volatility);
    const low = Math.min(open, close) * (1 - Math.random() * volatility);

    mockCandles.push({
      timestamp: timestamp.toISOString(),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000) + 100000,
    });

    basePrice = close;
  }

  return mockCandles;
}

// Fetch intraday data with fallback
export async function fetchIntradayData(
  symbol: string,
  accessToken?: string
): Promise<CandleData[]> {
  // Try backend if we have an access token
  if (accessToken) {
    const backendData = await fetchIntradayFromBackend(symbol, accessToken);
    if (backendData && backendData.length > 0) {
      return backendData;
    }
  }

  // Return mock data
  console.warn(`Using mock intraday data for ${symbol}`);
  return generateMockIntraday(symbol);
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
