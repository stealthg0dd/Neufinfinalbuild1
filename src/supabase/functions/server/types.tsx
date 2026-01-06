// ===== TYPE DEFINITIONS =====

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  provider?: string;
  createdAt?: string;
}

export interface Holding {
  symbol: string;
  shares: number;
  avgCost: number;
  purchaseDate?: string;
  notes?: string;
}

export interface Portfolio {
  holdings: Holding[];
  totalValue: number;
  method: 'manual' | 'plaid';
  setupCompletedAt?: string;
  userId: string;
  updatedAt: string;
  version?: number;
}

export interface PortfolioHistory {
  portfolioId: string;
  userId: string;
  holdings: Holding[];
  totalValue: number;
  snapshot: any;
  timestamp: string;
}

export interface BiasAnalysis {
  userId: string;
  biasType: string;
  severity: number; // 0-100
  description: string;
  affectedHoldings: string[];
  suggestion: string;
  detectedAt: string;
}

export interface AlphaScore {
  userId: string;
  score: number; // The alpha score
  currentPortfolioValue: number;
  optimizedPortfolioValue: number;
  potentialGain: number;
  biasImpact: number;
  calculatedAt: string;
  factors: {
    diversification: number;
    sectorBalance: number;
    riskAdjusted: number;
    emotionalBias: number;
  };
}

export interface UserSettings {
  userId: string;
  notifications: {
    email: boolean;
    push: boolean;
    portfolio: boolean;
    news: boolean;
    alphaUpdates: boolean;
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    currency: string;
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  };
  updatedAt: string;
}

export interface Watchlist {
  userId: string;
  symbols: string[];
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Alert {
  userId: string;
  symbol: string;
  type: 'price' | 'news' | 'sentiment' | 'bias';
  condition: string;
  threshold: number;
  active: boolean;
  triggeredAt?: string;
  createdAt: string;
}

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: string;
  volume: string;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  marketCap?: string;
  timestamp: string;
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
  sentiment?: {
    score: number;
    label: string;
  };
}

export interface SentimentData {
  symbol: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  newsCount: number;
  sources: string[];
  analyzedAt: string;
}

export interface CandlestickData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PortfolioPerformance {
  userId: string;
  period: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';
  startValue: number;
  endValue: number;
  change: number;
  changePercent: number;
  highestValue: number;
  lowestValue: number;
  dataPoints: {
    timestamp: string;
    value: number;
  }[];
  calculatedAt: string;
}

export interface BiasCorrection {
  userId: string;
  originalHoldings: Holding[];
  correctedHoldings: Holding[];
  biasesRemoved: string[];
  expectedImprovement: number;
  implementationSteps: string[];
  createdAt: string;
}

export interface Subscription {
  userId: string;
  plan: 'free' | 'professional' | 'institutional';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: string;
  endDate?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  features: string[];
}

export interface APICache {
  key: string;
  value: any;
  expiresAt: string;
}

export interface RateLimitEntry {
  userId: string;
  endpoint: string;
  count: number;
  resetAt: string;
}
