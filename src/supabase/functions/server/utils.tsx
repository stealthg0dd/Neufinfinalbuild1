import * as kv from "./kv_store.tsx";
import type { RateLimitEntry, APICache } from "./types.tsx";

// ===== CACHING UTILITIES =====

export async function getCachedData(key: string): Promise<any | null> {
  try {
    const cached: APICache = await kv.get(`cache:${key}`);
    if (!cached) return null;
    
    // Check if expired
    if (new Date(cached.expiresAt) < new Date()) {
      await kv.del(`cache:${key}`);
      return null;
    }
    
    return cached.value;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

export async function setCachedData(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
  try {
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
    await kv.set(`cache:${key}`, {
      key,
      value,
      expiresAt,
    });
  } catch (error) {
    console.error('Cache set error:', error);
  }
}

export async function clearCache(pattern?: string): Promise<void> {
  try {
    if (pattern) {
      const entries = await kv.getByPrefix(`cache:${pattern}`);
      const keys = entries.map((_, i) => `cache:${pattern}${i}`);
      if (keys.length > 0) {
        await kv.mdel(keys);
      }
    }
  } catch (error) {
    console.error('Cache clear error:', error);
  }
}

// ===== RATE LIMITING =====

const RATE_LIMITS = {
  default: { requests: 100, windowSeconds: 60 },
  stocks: { requests: 30, windowSeconds: 60 },
  ai: { requests: 10, windowSeconds: 60 },
  news: { requests: 50, windowSeconds: 60 },
  portfolio: { requests: 50, windowSeconds: 60 },
};

export async function checkRateLimit(
  userId: string, 
  endpoint: string
): Promise<{ allowed: boolean; remaining: number; resetAt: string }> {
  try {
    const key = `ratelimit:${userId}:${endpoint}`;
    const limit = RATE_LIMITS[endpoint as keyof typeof RATE_LIMITS] || RATE_LIMITS.default;
    
    const entry: RateLimitEntry | null = await kv.get(key);
    const now = new Date();
    
    if (!entry) {
      // First request
      const resetAt = new Date(now.getTime() + limit.windowSeconds * 1000).toISOString();
      await kv.set(key, {
        userId,
        endpoint,
        count: 1,
        resetAt,
      });
      return { allowed: true, remaining: limit.requests - 1, resetAt };
    }
    
    // Check if window has reset
    if (new Date(entry.resetAt) < now) {
      const resetAt = new Date(now.getTime() + limit.windowSeconds * 1000).toISOString();
      await kv.set(key, {
        userId,
        endpoint,
        count: 1,
        resetAt,
      });
      return { allowed: true, remaining: limit.requests - 1, resetAt };
    }
    
    // Check if limit exceeded
    if (entry.count >= limit.requests) {
      return { allowed: false, remaining: 0, resetAt: entry.resetAt };
    }
    
    // Increment counter
    await kv.set(key, {
      ...entry,
      count: entry.count + 1,
    });
    
    return { 
      allowed: true, 
      remaining: limit.requests - entry.count - 1, 
      resetAt: entry.resetAt 
    };
  } catch (error) {
    console.error('Rate limit check error:', error);
    // Fail open - allow request if rate limit check fails
    return { allowed: true, remaining: -1, resetAt: new Date().toISOString() };
  }
}

// ===== DATA VALIDATION =====

export function validatePortfolioData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.holdings || !Array.isArray(data.holdings)) {
    errors.push('Holdings must be an array');
  }
  
  if (data.holdings && data.holdings.length === 0) {
    errors.push('Portfolio must have at least one holding');
  }
  
  if (data.holdings) {
    data.holdings.forEach((holding: any, index: number) => {
      if (!holding.symbol || typeof holding.symbol !== 'string') {
        errors.push(`Holding ${index + 1}: Invalid symbol`);
      }
      if (!holding.shares || typeof holding.shares !== 'number' || holding.shares <= 0) {
        errors.push(`Holding ${index + 1}: Invalid shares amount`);
      }
      if (!holding.avgCost || typeof holding.avgCost !== 'number' || holding.avgCost <= 0) {
        errors.push(`Holding ${index + 1}: Invalid average cost`);
      }
    });
  }
  
  if (data.totalValue !== undefined && (typeof data.totalValue !== 'number' || data.totalValue < 0)) {
    errors.push('Invalid total value');
  }
  
  if (data.method && !['manual', 'plaid'].includes(data.method)) {
    errors.push('Invalid portfolio method');
  }
  
  return { valid: errors.length === 0, errors };
}

export function validateStockSymbol(symbol: string): boolean {
  return /^[A-Z]{1,5}$/.test(symbol);
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ===== BIAS DETECTION =====

export function detectPortfolioBiases(holdings: any[]): any[] {
  const biases: any[] = [];
  
  // Sector concentration bias
  const sectorMap = new Map<string, number>();
  holdings.forEach(h => {
    const sector = getSectorForSymbol(h.symbol);
    sectorMap.set(sector, (sectorMap.get(sector) || 0) + 1);
  });
  
  sectorMap.forEach((count, sector) => {
    const percentage = (count / holdings.length) * 100;
    if (percentage > 40) {
      biases.push({
        type: 'sector_concentration',
        severity: Math.min(percentage, 100),
        description: `${percentage.toFixed(1)}% of your portfolio is concentrated in ${sector}`,
        affectedHoldings: holdings.filter(h => getSectorForSymbol(h.symbol) === sector).map(h => h.symbol),
        suggestion: `Consider diversifying into other sectors to reduce risk`,
      });
    }
  });
  
  // Home bias (US stocks)
  const usStocks = holdings.filter(h => isUSStock(h.symbol)).length;
  const usPercentage = (usStocks / holdings.length) * 100;
  if (usPercentage > 80) {
    biases.push({
      type: 'home_bias',
      severity: usPercentage,
      description: `${usPercentage.toFixed(1)}% of your holdings are US stocks`,
      affectedHoldings: holdings.filter(h => isUSStock(h.symbol)).map(h => h.symbol),
      suggestion: 'Consider international diversification to reduce geographic risk',
    });
  }
  
  // Recency bias (check if recent popular stocks dominate)
  const recentPopular = ['TSLA', 'GME', 'AMC', 'NVDA'];
  const recentHoldings = holdings.filter(h => recentPopular.includes(h.symbol));
  if (recentHoldings.length > 0) {
    biases.push({
      type: 'recency_bias',
      severity: (recentHoldings.length / holdings.length) * 100,
      description: 'Portfolio includes recently hyped stocks',
      affectedHoldings: recentHoldings.map(h => h.symbol),
      suggestion: 'Ensure investment decisions are based on fundamentals, not hype',
    });
  }
  
  // Overconcentration in single stock
  holdings.forEach(holding => {
    const value = holding.shares * holding.avgCost;
    const totalValue = holdings.reduce((sum, h) => sum + (h.shares * h.avgCost), 0);
    const percentage = (value / totalValue) * 100;
    
    if (percentage > 25) {
      biases.push({
        type: 'concentration_risk',
        severity: percentage,
        description: `${holding.symbol} represents ${percentage.toFixed(1)}% of your portfolio`,
        affectedHoldings: [holding.symbol],
        suggestion: `Consider reducing ${holding.symbol} position to manage risk`,
      });
    }
  });
  
  return biases;
}

// Helper functions for bias detection
function getSectorForSymbol(symbol: string): string {
  // Simplified sector mapping - in production, use real data
  const sectorMap: Record<string, string> = {
    'AAPL': 'Technology',
    'MSFT': 'Technology',
    'GOOGL': 'Technology',
    'AMZN': 'Technology',
    'TSLA': 'Automotive',
    'NVDA': 'Technology',
    'META': 'Technology',
    'JPM': 'Financial',
    'BAC': 'Financial',
    'WFC': 'Financial',
    'JNJ': 'Healthcare',
    'PFE': 'Healthcare',
    'UNH': 'Healthcare',
    'XOM': 'Energy',
    'CVX': 'Energy',
  };
  return sectorMap[symbol] || 'Other';
}

function isUSStock(symbol: string): boolean {
  // Simplified - in production, check against actual database
  return true; // Most symbols in the demo are US
}

// ===== ALPHA SCORE CALCULATION =====

export function calculateAlphaScore(portfolio: any, biases: any[]): any {
  const totalValue = portfolio.totalValue || 0;
  
  // Calculate bias impact (each bias reduces potential by percentage)
  const totalBiasImpact = biases.reduce((sum, bias) => sum + (bias.severity / 100) * 0.1, 0);
  
  // Calculate optimization potential
  const diversificationScore = calculateDiversification(portfolio.holdings);
  const sectorBalanceScore = calculateSectorBalance(portfolio.holdings);
  const riskScore = calculateRiskScore(portfolio.holdings);
  
  const averageScore = (diversificationScore + sectorBalanceScore + riskScore) / 3;
  const optimizedValue = totalValue * (1 + totalBiasImpact + ((100 - averageScore) / 100) * 0.2);
  
  return {
    score: Math.round(100 - (totalBiasImpact * 100 + (100 - averageScore))),
    currentPortfolioValue: totalValue,
    optimizedPortfolioValue: optimizedValue,
    potentialGain: optimizedValue - totalValue,
    biasImpact: totalBiasImpact * 100,
    factors: {
      diversification: diversificationScore,
      sectorBalance: sectorBalanceScore,
      riskAdjusted: riskScore,
      emotionalBias: 100 - (totalBiasImpact * 100),
    },
  };
}

function calculateDiversification(holdings: any[]): number {
  if (holdings.length >= 15) return 100;
  if (holdings.length >= 10) return 80;
  if (holdings.length >= 5) return 60;
  return 40;
}

function calculateSectorBalance(holdings: any[]): number {
  const sectors = new Map<string, number>();
  holdings.forEach(h => {
    const sector = getSectorForSymbol(h.symbol);
    sectors.set(sector, (sectors.get(sector) || 0) + 1);
  });
  
  const sectorCount = sectors.size;
  if (sectorCount >= 5) return 100;
  if (sectorCount >= 3) return 70;
  return 50;
}

function calculateRiskScore(holdings: any[]): number {
  // Simplified risk calculation
  const volatileStocks = ['TSLA', 'GME', 'AMC', 'NVDA'];
  const volatileCount = holdings.filter(h => volatileStocks.includes(h.symbol)).length;
  const volatilePercentage = (volatileCount / holdings.length) * 100;
  
  return Math.max(0, 100 - volatilePercentage);
}

// ===== ERROR HANDLING =====

export function createErrorResponse(error: any, defaultMessage: string = 'An error occurred') {
  return {
    error: error.message || defaultMessage,
    timestamp: new Date().toISOString(),
    ...(Deno.env.get('NODE_ENV') === 'development' && { stack: error.stack }),
  };
}

// ===== DATE UTILITIES =====

export function getDateRange(period: string): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();
  
  switch (period) {
    case '1D':
      start.setDate(start.getDate() - 1);
      break;
    case '1W':
      start.setDate(start.getDate() - 7);
      break;
    case '1M':
      start.setMonth(start.getMonth() - 1);
      break;
    case '3M':
      start.setMonth(start.getMonth() - 3);
      break;
    case '6M':
      start.setMonth(start.getMonth() - 6);
      break;
    case '1Y':
      start.setFullYear(start.getFullYear() - 1);
      break;
    default:
      start.setFullYear(start.getFullYear() - 5);
  }
  
  return { start, end };
}

// ===== MOCK DATA GENERATORS =====

export function generateMockPortfolioPerformance(period: string, currentValue: number) {
  const { start, end } = getDateRange(period);
  const dataPoints: any[] = [];
  const daysDiff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const pointCount = Math.min(daysDiff, 100);
  
  let value = currentValue * 0.9;
  for (let i = 0; i < pointCount; i++) {
    const timestamp = new Date(start.getTime() + (i / pointCount) * (end.getTime() - start.getTime()));
    value += (Math.random() - 0.48) * (currentValue * 0.01);
    
    dataPoints.push({
      timestamp: timestamp.toISOString(),
      value: Math.round(value * 100) / 100,
    });
  }
  
  const startValue = dataPoints[0]?.value || currentValue;
  const endValue = dataPoints[dataPoints.length - 1]?.value || currentValue;
  const change = endValue - startValue;
  const changePercent = (change / startValue) * 100;
  
  return {
    period,
    startValue,
    endValue,
    change,
    changePercent,
    highestValue: Math.max(...dataPoints.map(d => d.value)),
    lowestValue: Math.min(...dataPoints.map(d => d.value)),
    dataPoints,
    calculatedAt: new Date().toISOString(),
  };
}

export function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '');
}
