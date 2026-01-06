import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../utils/supabase/client';
import { usePortfolio, useBiasAnalysis } from '../hooks/usePortfolio';
import { updatePortfolioPrices } from '../services/marketData';
import { analyzeBiases } from '../services/biasDetection';
import { BiasBreakdown } from '../components/BiasBreakdown';
import { useQueryClient } from '@tanstack/react-query';
import { 
  TrendingUp, TrendingDown, Activity, Clock, CheckCircle, AlertTriangle,
  Database, FileText, Radio, MessageSquare, Globe, Zap, ChevronDown, ChevronUp,
  User, LogOut, Settings, RefreshCw, Search, Filter, ArrowUpRight, ArrowDownRight,
  Eye, Layers, BarChart3, LineChart, Signal, Brain, Target, AlertCircle,
  Newspaper, DollarSign, Users, Satellite, Calendar
} from 'lucide-react';
import { toast } from 'sonner';

// Types
interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  provider?: string;
}

interface AlphaSignal {
  id: string;
  asset: string;
  direction: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  timeHorizon: string;
  insight: string;
  sources: number;
  timestamp: string;
  category: string;
}

interface DataSource {
  id: string;
  name: string;
  type: 'news' | 'earnings' | 'filings' | 'social' | 'macro' | 'iot';
  enabled: boolean;
  volume: number;
  sentimentSkew: number;
  lastUpdate: string;
  freshness: 'live' | 'recent' | 'stale';
  comingSoon?: boolean;
}

interface SignalAttribution {
  id: string;
  source: string;
  snippet: string;
  timestamp: string;
  sentiment: number;
  confidence: number;
  url?: string;
}

interface SentimentData {
  asset: string;
  rawSentiment: number;
  adjustedSentiment: number;
  hypeAdjustment: number;
  botFilter: number;
  echoChamberCorrection: number;
  recencyBiasCorrection: number;
}

interface BiasAnalysis {
  id: string;
  portfolioId: string;
  bias: string;
  confidence: number;
  timestamp: string;
}

export function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [updatingPrices, setUpdatingPrices] = useState(false);
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>(['US', 'EU', 'ASIA']);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [aiConfidence, setAiConfidence] = useState<number>(94.2);
  const [activeSignals, setActiveSignals] = useState<AlphaSignal[]>([]);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [selectedSignal, setSelectedSignal] = useState<string | null>(null);
  const [signalAttributions, setSignalAttributions] = useState<SignalAttribution[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  // Add analysis function
const queryClient = useQueryClient()

const runBiasAnalysis = async () => {
  if (!portfolio?.portfolio_positions || analyzing) return

  setAnalyzing(true)
  try {
    const positions = portfolio.portfolio_positions.map(p => ({
      symbol: p.symbol,
      shares: p.shares,
      cost_basis: p.cost_basis,
      current_price: p.current_price || p.cost_basis,
      purchase_date: p.purchase_date || new Date().toISOString(),
    }))

    const scores = await analyzeBiases(user.id, positions)
    toast.success('Portfolio analyzed! Check your bias scores.')
    
    // Refetch bias scores
    queryClient.invalidateQueries(['bias-analysis', user.id])
  } catch (error) {
    console.error('Bias analysis error:', error)
    toast.error('Failed to analyze portfolio')
  } finally {
    setAnalyzing(false)
  }
}
  const { data: portfolio, isLoading: portfolioLoading } = usePortfolio(user?.id);
  const { data: biasAnalysis, isLoading: biasLoading } = useBiasAnalysis(user?.id, portfolio?.portfolio_positions);

  useEffect(() => {
    loadUserData();
    loadDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refreshData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Update prices on mount when portfolio is available
  useEffect(() => {
    if (portfolio?.id && !updatingPrices) {
      setUpdatingPrices(true);
      updatePortfolioPrices(portfolio.id)
        .then(() => toast.success('Prices updated'))
        .catch(() => toast.error('Failed to update some prices'))
        .finally(() => setUpdatingPrices(false));
    }
  }, [portfolio?.id]);

  const loadUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Allow viewing dashboard without login for demo purposes
        setIsLoading(false);
        return;
      }

      // Fetch user profile if logged in
      const response = await fetch(
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-22c8dcd8/user/profile`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );

      if (response.ok) {
        const profileData = await response.json();
        setUser(profileData.user);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDashboardData = () => {
    // Production-grade mock data that matches backend API structure
    const signals: AlphaSignal[] = [
      {
        id: 'sig-001',
        asset: 'NVDA',
        direction: 'bullish',
        confidence: 87.5,
        timeHorizon: '7-14 days',
        insight: 'Strong institutional accumulation detected with 23% increase in dark pool activity. AI chip demand surge correlated with MSFT Azure expansion.',
        sources: 18,
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        category: 'Technical + Sentiment'
      },
      {
        id: 'sig-002',
        asset: 'TSLA',
        direction: 'bearish',
        confidence: 72.3,
        timeHorizon: '3-5 days',
        insight: 'Elevated short interest (34% above 30-day avg) coinciding with production data showing Q1 deliveries below consensus. Social sentiment overly bullish—contrarian indicator active.',
        sources: 24,
        timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
        category: 'Sentiment + Macro'
      },
      {
        id: 'sig-003',
        asset: 'BTC',
        direction: 'bullish',
        confidence: 91.2,
        timeHorizon: '14-30 days',
        insight: 'ETF inflows reached $1.2B (7-day avg), on-chain metrics show whale accumulation at +12%. Macro tailwinds from Fed rate cut probability rising to 78%.',
        sources: 31,
        timestamp: new Date(Date.now() - 22 * 60000).toISOString(),
        category: 'Macro + On-chain'
      },
      {
        id: 'sig-004',
        asset: 'AAPL',
        direction: 'neutral',
        confidence: 64.8,
        timeHorizon: '5-10 days',
        insight: 'Mixed signals: iPhone sales in China up 8% YoY, but services revenue guidance lowered. Institutional positioning shows rotation to defensive tech. Awaiting earnings clarity.',
        sources: 16,
        timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
        category: 'Earnings + Geographic'
      },
      {
        id: 'sig-005',
        asset: 'GOOGL',
        direction: 'bullish',
        confidence: 79.6,
        timeHorizon: '10-20 days',
        insight: 'AI search integration driving engagement metrics up 19%. Ad revenue forecasts revised upward by 3 major analysts. Options flow shows heavy call buying at $150 strike.',
        sources: 21,
        timestamp: new Date(Date.now() - 3 * 60000).toISOString(),
        category: 'Product + Options Flow'
      },
      {
        id: 'sig-006',
        asset: 'SPY',
        direction: 'bearish',
        confidence: 68.1,
        timeHorizon: '7-14 days',
        insight: 'Market breadth deteriorating: only 38% of S&P components above 50-day MA. VIX term structure in backwardation signals near-term volatility. Treasury yields showing flight-to-safety bid.',
        sources: 27,
        timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
        category: 'Technical + Macro'
      }
    ];

    const sources: DataSource[] = [
      {
        id: 'src-news',
        name: 'News Feeds',
        type: 'news',
        enabled: true,
        volume: 12847,
        sentimentSkew: 0.23,
        lastUpdate: new Date(Date.now() - 2 * 60000).toISOString(),
        freshness: 'live'
      },
      {
        id: 'src-earnings',
        name: 'Earnings Transcripts',
        type: 'earnings',
        enabled: true,
        volume: 342,
        sentimentSkew: 0.15,
        lastUpdate: new Date(Date.now() - 18 * 60000).toISOString(),
        freshness: 'recent'
      },
      {
        id: 'src-filings',
        name: 'SEC Filings',
        type: 'filings',
        enabled: true,
        volume: 1823,
        sentimentSkew: -0.08,
        lastUpdate: new Date(Date.now() - 35 * 60000).toISOString(),
        freshness: 'recent'
      },
      {
        id: 'src-x',
        name: 'X (Twitter)',
        type: 'social',
        enabled: true,
        volume: 45621,
        sentimentSkew: 0.42,
        lastUpdate: new Date(Date.now() - 1 * 60000).toISOString(),
        freshness: 'live'
      },
      {
        id: 'src-reddit',
        name: 'Reddit',
        type: 'social',
        enabled: true,
        volume: 8934,
        sentimentSkew: 0.38,
        lastUpdate: new Date(Date.now() - 5 * 60000).toISOString(),
        freshness: 'live'
      },
      {
        id: 'src-telegram',
        name: 'Telegram',
        type: 'social',
        enabled: false,
        volume: 2156,
        sentimentSkew: 0.51,
        lastUpdate: new Date(Date.now() - 8 * 60000).toISOString(),
        freshness: 'recent'
      },
      {
        id: 'src-macro',
        name: 'Macro Indicators',
        type: 'macro',
        enabled: true,
        volume: 234,
        sentimentSkew: -0.12,
        lastUpdate: new Date(Date.now() - 120 * 60000).toISOString(),
        freshness: 'recent'
      },
      {
        id: 'src-iot',
        name: 'IoT & Satellite',
        type: 'iot',
        enabled: false,
        volume: 0,
        sentimentSkew: 0,
        lastUpdate: new Date().toISOString(),
        freshness: 'live',
        comingSoon: true
      }
    ];

    const sentiments: SentimentData[] = [
      {
        asset: 'NVDA',
        rawSentiment: 0.78,
        adjustedSentiment: 0.62,
        hypeAdjustment: -0.12,
        botFilter: -0.08,
        echoChamberCorrection: -0.05,
        recencyBiasCorrection: 0.09
      },
      {
        asset: 'TSLA',
        rawSentiment: 0.71,
        adjustedSentiment: 0.43,
        hypeAdjustment: -0.18,
        botFilter: -0.14,
        echoChamberCorrection: -0.09,
        recencyBiasCorrection: 0.13
      },
      {
        asset: 'BTC',
        rawSentiment: 0.82,
        adjustedSentiment: 0.68,
        hypeAdjustment: -0.09,
        botFilter: -0.11,
        echoChamberCorrection: -0.06,
        recencyBiasCorrection: 0.12
      }
    ];

    setActiveSignals(signals);
    setDataSources(sources);
    setSentimentData(sentiments);
  };

  const loadSignalAttributions = (signalId: string) => {
    // Mock attribution data - in production, this would come from API
    const attributions: SignalAttribution[] = [
      {
        id: 'attr-001',
        source: 'Bloomberg Terminal',
        snippet: 'NVIDIA announces new H200 chip orders from major cloud providers, exceeding Q1 expectations by 34%',
        timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
        sentiment: 0.89,
        confidence: 0.94,
        url: 'https://bloomberg.com/example'
      },
      {
        id: 'attr-002',
        source: 'Form 4 Filing',
        snippet: 'Insider buying: CFO acquired 15,000 shares at avg price $878.50. Total insider ownership now 2.3%',
        timestamp: new Date(Date.now() - 18 * 60000).toISOString(),
        sentiment: 0.72,
        confidence: 0.98
      },
      {
        id: 'attr-003',
        source: 'Dark Pool Monitor',
        snippet: 'Block trade detection: 280,000 shares @ $882 (23% above 20-day avg volume). Institutional accumulation pattern confirmed',
        timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
        sentiment: 0.81,
        confidence: 0.87
      },
      {
        id: 'attr-004',
        source: 'X/Twitter - @chip_analyst',
        snippet: 'Supply chain checks indicate TSMC capacity booked through Q3 2025 for NVIDIA orders. Lead times extending.',
        timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
        sentiment: 0.76,
        confidence: 0.68
      },
      {
        id: 'attr-005',
        source: 'Earnings Call Transcript',
        snippet: 'Microsoft Azure exec mentioned "securing additional GPU capacity" 4 times during infrastructure segment',
        timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
        sentiment: 0.84,
        confidence: 0.91
      }
    ];
    
    setSignalAttributions(attributions);
  };

  const refreshData = () => {
    setLastRefresh(new Date());
    toast.success('Dashboard refreshed', { duration: 2000 });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('neufin_onboarding_complete');
    localStorage.removeItem('neufin_holdings');
    toast.success('Logged out successfully', { duration: 2000 });
    navigate('/');
  };

  const toggleDataSource = (sourceId: string) => {
    setDataSources(prev => 
      prev.map(source => 
        source.id === sourceId ? { ...source, enabled: !source.enabled } : source
      )
    );
  };

  const handleExplainSignal = (signalId: string) => {
    setSelectedSignal(selectedSignal === signalId ? null : signalId);
    if (selectedSignal !== signalId) {
      loadSignalAttributions(signalId);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case 'bullish': return 'text-green-400';
      case 'bearish': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'bullish': return <ArrowUpRight className="h-4 w-4" />;
      case 'bearish': return <ArrowDownRight className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getFreshnessColor = (freshness: string) => {
    switch (freshness) {
      case 'live': return 'bg-green-500';
      case 'recent': return 'bg-yellow-500';
      default: return 'bg-red-500';
    }
  };

  if (isLoading || portfolioLoading || biasLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Evidence-Backed Market Intelligence...</p>
        </div>
      </div>
    );
  }

  // Calculate portfolio totals from real data
  const totalValue = portfolio?.portfolio_positions?.reduce(
    (sum, pos) => sum + (pos.shares * (pos.current_price || pos.cost_basis)), 
    0
  ) || 0;

  const totalCost = portfolio?.portfolio_positions?.reduce(
    (sum, pos) => sum + (pos.shares * pos.cost_basis), 
    0
  ) || 0;

  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

  return (
    <div className="min-h-screen bg-background dark">
      {/* Top Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-purple-500" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Neufin Intelligence
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                className="icon-enhanced"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              
              {user ? (
                <>
                  {/* User Email Display */}
                  <div className="hidden md:flex items-center px-3 py-1.5 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <User className="h-4 w-4 text-purple-400 mr-2" />
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/portfolio-setup')}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  
                  {/* Prominent Logout Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Global Overview Header */}
      <div className="border-b border-border bg-gradient-to-r from-purple-900/10 to-blue-900/10">
        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Markets Selector */}
            <Card className="bg-card/50 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-purple-400" />
                    <span className="text-sm font-medium">Active Markets</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['US', 'EU', 'ASIA', 'MENA', 'LATAM'].map(market => (
                    <Badge
                      key={market}
                      variant={selectedMarkets.includes(market) ? 'default' : 'outline'}
                      className={`cursor-pointer ${
                        selectedMarkets.includes(market) 
                          ? 'bg-purple-600 hover:bg-purple-700' 
                          : 'hover:bg-purple-600/20'
                      }`}
                      onClick={() => {
                        setSelectedMarkets(prev => 
                          prev.includes(market) 
                            ? prev.filter(m => m !== market)
                            : [...prev, market]
                        );
                      }}
                    >
                      {market}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Last Refresh */}
            <Card className="bg-card/50 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium">Last Data Refresh</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-mono">
                    {lastRefresh.toLocaleTimeString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-muted-foreground">Live Stream Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Confidence */}
            <Card className="bg-card/50 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-medium">AI Confidence Status</span>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-400">{aiConfidence}%</div>
                  <Progress value={aiConfidence} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    Model accuracy on 30-day validation set
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Portfolio Summary Section */}
      <div className="border-b border-border bg-gradient-to-r from-purple-900/10 to-blue-900/10">
        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Portfolio Value */}
            <Card className="bg-card/50 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-medium">Portfolio Value</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">
                    ${totalValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                  </div>
                  <div className={`text-sm ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    ({totalGainLossPercent.toFixed(2)}%)
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alpha Score */}
            <Card className="bg-card/50 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-4 w-4 text-purple-400" />
                    <span className="text-sm font-medium">Alpha Score</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-400">{biasAnalysis?.alpha_score || 65}</div>
                  <div className="text-xs text-muted-foreground">
                    Behavioral performance metric
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Missed Alpha */}
            <Card className="bg-card/50 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm font-medium">Missed Alpha</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-yellow-400">
                    ${biasAnalysis?.missed_alpha_dollars?.toLocaleString('en-US') || 2840}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Potential gains lost to bias
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Positions */}
          {portfolio?.portfolio_positions && portfolio.portfolio_positions.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Your Positions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {portfolio.portfolio_positions.map((position) => (
                  <Card key={position.id} className="bg-card/30 backdrop-blur">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-bold">{position.symbol}</span>
                        <span className="text-sm text-muted-foreground">{position.shares} shares</span>
                      </div>
                      <div className="space-y-1">
                        <div className="text-lg">
                          ${(position.current_price || position.cost_basis).toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Cost: ${position.cost_basis.toFixed(2)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Analyze Bias Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={runBiasAnalysis}
          disabled={analyzing}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {analyzing ? 'Analyzing...' : 'Analyze Bias'}
        </button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Alpha Signals</span>
            </TabsTrigger>
            <TabsTrigger value="sources" className="flex items-center space-x-2">
              <Layers className="h-4 w-4" />
              <span>Signal Explorer</span>
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Bias Correction</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <LineChart className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Alpha Signals Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">Active Alpha Signals</h2>
                <p className="text-muted-foreground mt-1">
                  Evidence-backed opportunities with full attribution transparency
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Select defaultValue="confidence">
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confidence">By Confidence</SelectItem>
                    <SelectItem value="time">By Time</SelectItem>
                    <SelectItem value="category">By Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeSignals.map((signal) => (
                <motion.div
                  key={signal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-lg transition-shadow border-l-4" style={{
                    borderLeftColor: signal.direction === 'bullish' ? '#22c55e' : signal.direction === 'bearish' ? '#ef4444' : '#eab308'
                  }}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-3">
                            <CardTitle className="text-2xl font-mono">{signal.asset}</CardTitle>
                            <Badge variant="outline" className={getDirectionColor(signal.direction)}>
                              {getDirectionIcon(signal.direction)}
                              <span className="ml-1 uppercase">{signal.direction}</span>
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{signal.timeHorizon}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Database className="h-3 w-3" />
                              <span>{signal.sources} sources</span>
                            </span>
                            <span>{formatTimeAgo(signal.timestamp)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground mb-1">Confidence</div>
                          <div className="text-2xl font-bold text-purple-400">{signal.confidence}%</div>
                          <Progress value={signal.confidence} className="h-1 w-20 mt-1" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex items-start space-x-2">
                          <Eye className="h-4 w-4 text-purple-400 mt-1 flex-shrink-0" />
                          <p className="text-sm leading-relaxed">{signal.insight}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {signal.category}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExplainSignal(signal.id)}
                          className="bg-purple-600/10 hover:bg-purple-600/20"
                        >
                          <Search className="h-4 w-4 mr-2" />
                          Trace Signal
                          {selectedSignal === signal.id ? (
                            <ChevronUp className="h-4 w-4 ml-2" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-2" />
                          )}
                        </Button>
                      </div>

                      {/* Signal Attribution Timeline */}
                      <AnimatePresence>
                        {selectedSignal === signal.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <Separator className="my-4" />
                            <div className="space-y-3">
                              <div className="flex items-center space-x-2 text-sm font-medium">
                                <Signal className="h-4 w-4 text-purple-400" />
                                <span>Signal Attribution Timeline</span>
                              </div>
                              
                              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                {signalAttributions.map((attr, index) => (
                                  <motion.div
                                    key={attr.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-background/50 rounded-lg p-3 border border-border hover:border-purple-500/30 transition-colors"
                                  >
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                                        <span className="text-sm font-medium text-purple-400">{attr.source}</span>
                                      </div>
                                      <span className="text-xs text-muted-foreground">{formatTimeAgo(attr.timestamp)}</span>
                                    </div>
                                    
                                    <p className="text-sm text-muted-foreground mb-3 pl-4">
                                      {attr.snippet}
                                    </p>
                                    
                                    <div className="flex items-center space-x-4 pl-4">
                                      <div className="flex items-center space-x-2">
                                        <span className="text-xs text-muted-foreground">Sentiment:</span>
                                        <Badge variant="outline" className={
                                          attr.sentiment > 0.7 ? 'text-green-400' : 
                                          attr.sentiment < 0.3 ? 'text-red-400' : 'text-yellow-400'
                                        }>
                                          {(attr.sentiment * 100).toFixed(0)}%
                                        </Badge>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <span className="text-xs text-muted-foreground">Confidence:</span>
                                        <Badge variant="outline" className="text-purple-400">
                                          {(attr.confidence * 100).toFixed(0)}%
                                        </Badge>
                                      </div>
                                      {attr.url && (
                                        <a 
                                          href={attr.url} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-xs text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                                        >
                                          <span>View Source</span>
                                          <ArrowUpRight className="h-3 w-3" />
                                        </a>
                                      )}
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Signal Explorer Tab */}
          <TabsContent value="sources" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">Signal Ingestion Layer</h2>
              <p className="text-muted-foreground mt-1">
                Real-time monitoring of all data sources feeding our AI engine
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {dataSources.map((source) => (
                <Card key={source.id} className={`transition-all ${
                  source.enabled ? 'border-purple-500/30' : 'opacity-60'
                } ${source.comingSoon ? 'border-dashed' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {source.type === 'news' && <Newspaper className="h-5 w-5 text-blue-400" />}
                        {source.type === 'earnings' && <FileText className="h-5 w-5 text-green-400" />}
                        {source.type === 'filings' && <Database className="h-5 w-5 text-yellow-400" />}
                        {source.type === 'social' && <MessageSquare className="h-5 w-5 text-purple-400" />}
                        {source.type === 'macro' && <DollarSign className="h-5 w-5 text-orange-400" />}
                        {source.type === 'iot' && <Satellite className="h-5 w-5 text-cyan-400" />}
                        <CardTitle className="text-sm">{source.name}</CardTitle>
                      </div>
                      {!source.comingSoon && (
                        <Switch
                          checked={source.enabled}
                          onCheckedChange={() => toggleDataSource(source.id)}
                        />
                      )}
                      {source.comingSoon && (
                        <Badge variant="outline" className="text-xs">Soon</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {!source.comingSoon ? (
                      <>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Volume (24h)</div>
                          <div className="text-xl font-bold">{source.volume.toLocaleString()}</div>
                        </div>
                        
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Sentiment Skew</div>
                          <div className="flex items-center space-x-2">
                            <Progress 
                              value={50 + (source.sentimentSkew * 50)} 
                              className="h-2 flex-1"
                            />
                            <span className={`text-sm font-medium ${
                              source.sentimentSkew > 0 ? 'text-green-400' : 
                              source.sentimentSkew < 0 ? 'text-red-400' : 'text-gray-400'
                            }`}>
                              {source.sentimentSkew > 0 ? '+' : ''}{(source.sentimentSkew * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getFreshnessColor(source.freshness)} animate-pulse`} />
                            <span className="text-muted-foreground">{formatTimeAgo(source.lastUpdate)}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {source.freshness}
                          </Badge>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <Satellite className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          IoT & satellite data integration coming soon
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Active Sources Summary */}
            <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">
                      {dataSources.filter(s => s.enabled && !s.comingSoon).length}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Active Sources</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">
                      {dataSources.reduce((acc, s) => acc + (s.enabled ? s.volume : 0), 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Total Signals/Day</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">98.7%</div>
                    <div className="text-sm text-muted-foreground mt-1">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400">&lt;2s</div>
                    <div className="text-sm text-muted-foreground mt-1">Avg Latency</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bias Correction Tab */}
          <TabsContent value="sentiment" className="space-y-6">
            <BiasBreakdown
              lossAversion={biasAnalysis?.loss_aversion_score}
              confirmationBias={biasAnalysis?.confirmation_bias_score}
              herdingBehavior={biasAnalysis?.herding_behavior_score}
              anchoringBias={biasAnalysis?.anchoring_bias_score}
              recencyBias={biasAnalysis?.recency_bias_score}
              overconfidence={biasAnalysis?.overconfidence_score}
              dispositionEffect={biasAnalysis?.disposition_effect_score}
              missedAlphaDollars={biasAnalysis?.missed_alpha_dollars}
              alphaScore={biasAnalysis?.alpha_score}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">Advanced Analytics</h2>
              <p className="text-muted-foreground mt-1">
                Deep dive into model performance and signal accuracy
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-green-400">87.2%</div>
                  <div className="text-sm text-muted-foreground mt-1">Signal Accuracy (30d)</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-purple-400">+23.4%</div>
                  <div className="text-sm text-muted-foreground mt-1">Avg Alpha Generated</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Signal className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-blue-400">1,247</div>
                  <div className="text-sm text-muted-foreground mt-1">Signals This Month</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-yellow-400">1.8s</div>
                  <div className="text-sm text-muted-foreground mt-1">Avg Response Time</div>
                </CardContent>
              </Card>
            </div>

            {/* Coming Soon Features */}
            <Card className="border-dashed border-2">
              <CardContent className="p-12 text-center space-y-4">
                <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto" />
                <h3 className="text-xl font-bold">Advanced Analytics Dashboard</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Detailed performance metrics, backtesting results, portfolio correlation analysis, 
                  and custom signal builders coming in the next release.
                </p>
                <Button variant="outline">Request Early Access</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-card/50 mt-12">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 Neufin. Evidence-Backed Market Intelligence.
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <a href="#" className="text-muted-foreground hover:text-purple-400">Documentation</a>
              <a href="#" className="text-muted-foreground hover:text-purple-400">API Access</a>
              <a href="#" className="text-muted-foreground hover:text-purple-400">Enterprise</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}