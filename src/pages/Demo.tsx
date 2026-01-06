import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { AlphaScoreHero } from '../components/AlphaScoreHero';
import { PortfolioGraph } from '../components/PortfolioGraph';
import { SentimentHeatmap } from '../components/SentimentHeatmap';
import { BiasBreakdown } from '../components/BiasBreakdown';
import { AlphaStrategies } from '../components/AlphaStrategies';
import { CommunitySignals } from '../components/CommunitySignals';
import { PerformanceSummary } from '../components/PerformanceSummary';
import { AlphaSuggestion } from '../components/AlphaSuggestion';
import { RealTimePortfolio } from '../components/RealTimePortfolio';
import { PortfolioNews } from '../components/PortfolioNews';
import { PortfolioSentiment } from '../components/PortfolioSentiment';
import { CandlestickChart } from '../components/CandlestickChart';
import { EnhancedAiChat } from '../components/EnhancedAiChat';
import { motion } from 'motion/react';
import { 
  User, 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Shield,
  Brain,
  Target,
  Eye,
  Activity,
  Zap,
  CreditCard,
  CheckCircle,
  PlayCircle,
  ArrowRight,
  AlertTriangle,
  Settings,
  Plus,
  Link2,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function Demo() {
  const [activeTab, setActiveTab] = useState('journey');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [journeyStep, setJourneyStep] = useState(0);
  const [isPlayingJourney, setIsPlayingJourney] = useState(false);
  const [selectedTicker, setSelectedTicker] = useState('AAPL');
  
  // Demo access token for real-time features (empty string for demo mode)
  const demoAccessToken = '';

  // Demo portfolio data
  const demoPortfolio = {
    holdings: [
      { symbol: 'AAPL', shares: 50, avgCost: 178.50 },
      { symbol: 'GOOGL', shares: 30, avgCost: 142.30 },
      { symbol: 'MSFT', shares: 40, avgCost: 412.80 },
      { symbol: 'TSLA', shares: 25, avgCost: 245.60 },
      { symbol: 'NVDA', shares: 35, avgCost: 495.20 },
    ],
    totalValue: 127450.00,
    method: 'demo',
    setupCompletedAt: new Date().toISOString(),
  };

  const journeySteps = [
    {
      id: 'oauth',
      title: 'Google OAuth Login',
      icon: <Shield className="w-5 h-5" />,
      description: 'Secure authentication with your Google account',
    },
    {
      id: 'portfolio-setup',
      title: 'Portfolio Setup',
      icon: <Settings className="w-5 h-5" />,
      description: 'Connect via Plaid or enter holdings manually',
    },
    {
      id: 'dashboard',
      title: 'Real-Time Dashboard',
      icon: <Activity className="w-5 h-5" />,
      description: 'Live market data and portfolio tracking',
    },
    {
      id: 'analysis',
      title: 'Advanced Analytics',
      icon: <Brain className="w-5 h-5" />,
      description: 'Candlestick charts and alpha breakout detection',
    },
    {
      id: 'ai-chat',
      title: 'AI Assistant',
      icon: <Sparkles className="w-5 h-5" />,
      description: 'Personalized investment advice and insights',
    },
    {
      id: 'upgrade',
      title: 'Upgrade Account',
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Unlock premium features with Stripe checkout',
    },
  ];

  const playJourney = () => {
    setIsPlayingJourney(true);
    setJourneyStep(0);
    
    const interval = setInterval(() => {
      setJourneyStep(prev => {
        if (prev >= journeySteps.length - 1) {
          setIsPlayingJourney(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 3500);
  };

  const OAuthStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="border-purple-500/30 bg-gradient-to-r from-purple-500/5 to-blue-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-400" />
            Secure Google OAuth Authentication
          </CardTitle>
          <CardDescription>
            One-click login with enterprise-grade security powered by Supabase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="font-medium text-green-400">No Password</div>
              <div className="text-xs text-muted-foreground mt-1">OAuth 2.0 secured</div>
            </div>
            <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Shield className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="font-medium text-blue-400">Encrypted</div>
              <div className="text-xs text-muted-foreground mt-1">End-to-end security</div>
            </div>
            <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <Zap className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="font-medium text-purple-400">Instant Access</div>
              <div className="text-xs text-muted-foreground mt-1">Login in seconds</div>
            </div>
          </div>

          <div className="flex items-center justify-center py-6">
            <Button 
              size="lg" 
              className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
              onClick={() => toast.success('Demo mode - Login feature shown')}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const PortfolioSetupStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="border-blue-500/30 bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-400" />
            Portfolio Setup
          </CardTitle>
          <CardDescription>
            Choose your preferred method to connect your investment portfolio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plaid Connection */}
            <Card className="border-green-500/30 hover:border-green-500/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-green-400" />
                    Plaid Integration
                  </CardTitle>
                  <Badge className="bg-green-500/20 text-green-400">Automatic</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Securely connect to your brokerage account for automatic portfolio syncing
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Real-time syncing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Bank-level security</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>300+ brokerages</span>
                  </li>
                </ul>
                <Button className="w-full" onClick={() => toast.success('Demo mode - Plaid integration shown')}>
                  <Link2 className="w-4 h-4 mr-2" />
                  Connect with Plaid
                </Button>
              </CardContent>
            </Card>

            {/* Manual Entry */}
            <Card className="border-purple-500/30 hover:border-purple-500/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Plus className="w-5 h-5 text-purple-400" />
                    Manual Entry
                  </CardTitle>
                  <Badge className="bg-purple-500/20 text-purple-400">Flexible</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Manually enter your holdings for complete control and privacy
                </p>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="ticker">Stock Ticker</Label>
                    <Input id="ticker" placeholder="e.g., AAPL" className="mt-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="shares">Shares</Label>
                      <Input id="shares" type="number" placeholder="50" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="avgcost">Avg Cost</Label>
                      <Input id="avgcost" type="number" placeholder="178.50" className="mt-1" />
                    </div>
                  </div>
                </div>
                <Button className="w-full" variant="outline" onClick={() => toast.success('Demo mode - Manual entry shown')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Holding
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Demo Portfolio Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Demo Portfolio Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {demoPortfolio.holdings.slice(0, 3).map((holding, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-background/50 rounded">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">{holding.symbol}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {holding.shares} shares @ ${holding.avgCost}
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      ${(holding.shares * holding.avgCost).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </motion.div>
  );

  const DashboardStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Portfolio Stats */}
      <Card className="border-green-500/30 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-green-400" />
            Live Portfolio Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-500/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-400">
                ${demoPortfolio.totalValue.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Total Value</div>
            </div>
            <div className="text-center p-4 bg-blue-500/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-400">
                {demoPortfolio.holdings.length}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Holdings</div>
            </div>
            <div className="text-center p-4 bg-green-500/10 rounded-lg">
              <Activity className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">+2.3%</div>
              <div className="text-xs text-muted-foreground mt-1">24h Change</div>
            </div>
            <div className="text-center p-4 bg-orange-500/10 rounded-lg">
              <Zap className="h-6 w-6 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-400">8.7</div>
              <div className="text-xs text-muted-foreground mt-1">Alpha Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Components */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PerformanceSummary />
        <AlphaSuggestion />
        <Card className="border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Get personalized investment advice powered by advanced AI models
              </p>
              <Button 
                className="w-full"
                onClick={() => {
                  setIsChatOpen(true);
                  toast.success('AI Chat opened - Ask me anything!');
                }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Open AI Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Graph */}
      <PortfolioGraph />
    </motion.div>
  );

  const AnalysisStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="border-orange-500/30 bg-gradient-to-r from-orange-500/5 to-red-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-orange-400" />
            Advanced Candlestick Analysis
          </CardTitle>
          <CardDescription>
            Real-time technical analysis with alpha breakout detection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Label>Select Ticker:</Label>
            <div className="flex gap-2">
              {demoPortfolio.holdings.map((holding) => (
                <Button
                  key={holding.symbol}
                  variant={selectedTicker === holding.symbol ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTicker(holding.symbol)}
                >
                  {holding.symbol}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candlestick Chart */}
      <CandlestickChart 
        accessToken={demoAccessToken} 
        defaultSymbol={selectedTicker}
      />

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SentimentHeatmap />
        <BiasBreakdown />
      </div>
    </motion.div>
  );

  const AiChatStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="border-cyan-500/30 bg-gradient-to-r from-cyan-500/5 to-blue-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            AI-Powered Investment Assistant
          </CardTitle>
          <CardDescription>
            Get personalized advice, market insights, and portfolio recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <Brain className="h-8 w-8 text-purple-400 mb-3" />
              <h4 className="font-medium mb-2">Portfolio Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Deep insights into your holdings and performance
              </p>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Target className="h-8 w-8 text-blue-400 mb-3" />
              <h4 className="font-medium mb-2">Strategy Suggestions</h4>
              <p className="text-sm text-muted-foreground">
                Personalized investment strategies based on your goals
              </p>
            </div>
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <Eye className="h-8 w-8 text-green-400 mb-3" />
              <h4 className="font-medium mb-2">Risk Assessment</h4>
              <p className="text-sm text-muted-foreground">
                Real-time risk analysis and mitigation advice
              </p>
            </div>
          </div>

          <div className="bg-background/50 rounded-lg p-6 border border-border">
            <h4 className="font-medium mb-3">Sample AI Conversation</h4>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                  <p className="text-sm">Should I be concerned about my TSLA position given recent market volatility?</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1 bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                  <p className="text-sm">
                    Based on your portfolio allocation, TSLA represents 19% of your holdings. Our analysis shows:
                    <br/><br/>
                    • Disposition effect detected: holding 23% longer than optimal
                    <br/>
                    • Recent sentiment shift: -15% in past 48h
                    <br/>
                    • Recommendation: Consider reducing position by 30% to manage risk
                    <br/><br/>
                    This aligns with your bias-corrected Neural Twin strategy which suggests rebalancing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button 
            className="w-full" 
            size="lg"
            onClick={() => {
              setIsChatOpen(true);
              toast.success('AI Chat activated!');
            }}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Start Chatting with AI
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  const UpgradeStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="border-gold-500/30 bg-gradient-to-r from-yellow-500/5 to-orange-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-yellow-400" />
            Upgrade Your Account
          </CardTitle>
          <CardDescription>
            Unlock advanced features with our premium plans (14-day free trial)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Plan */}
            <Card className="border-blue-500/30">
              <CardHeader>
                <Badge className="w-fit bg-blue-500/20 text-blue-400">Basic</Badge>
                <CardTitle className="text-2xl mt-2">$29/mo</CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Real-time portfolio tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Basic bias detection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>AI chat (50 queries/mo)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Email support</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline" onClick={() => window.location.href = '/user-dashboard'}>
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-purple-500/30 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-purple-500 text-white">Most Popular</Badge>
              </div>
              <CardHeader>
                <Badge className="w-fit bg-purple-500/20 text-purple-400">Pro</Badge>
                <CardTitle className="text-2xl mt-2">$79/mo</CardTitle>
                <CardDescription>For serious investors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Everything in Basic</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Unlimited AI chat</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Alpha strategies</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => window.location.href = '/user-dashboard'}>
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-orange-500/30">
              <CardHeader>
                <Badge className="w-fit bg-orange-500/20 text-orange-400">Enterprise</Badge>
                <CardTitle className="text-2xl mt-2">$199/mo</CardTitle>
                <CardDescription>For institutional investors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Custom integrations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>White-label options</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>24/7 phone support</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30 text-center">
            <p className="text-sm text-muted-foreground">
              All plans include a 14-day free trial. No credit card required to start.
              Cancel anytime with one click.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const stepComponents = [
    OAuthStep,
    PortfolioSetupStep,
    DashboardStep,
    AnalysisStep,
    AiChatStep,
    UpgradeStep,
  ];
  const CurrentStepComponent = stepComponents[journeyStep];

  return (
    <>
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Demo Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-purple-500/20">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-lg px-4 py-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
                    DEMO MODE
                  </Badge>
                </div>
                <h1 className="text-3xl lg:text-4xl">Complete User Journey</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Experience the full Neufin platform from authentication to advanced analytics with live market data
                </p>
                
                <div className="flex items-center justify-center gap-4 pt-4">
                  <Button 
                    onClick={playJourney} 
                    disabled={isPlayingJourney}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <PlayCircle className="w-5 h-5 mr-2" />
                    {isPlayingJourney ? 'Playing Auto Tour...' : 'Play Auto Tour'}
                  </Button>
                  
                  <Button 
                    onClick={() => window.location.href = '/login'}
                    size="lg"
                    variant="outline"
                  >
                    <User className="w-5 h-5 mr-2" />
                    Login for Real
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Journey Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 py-4">
          {journeySteps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <motion.div
                className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all duration-200 ${
                  journeyStep === index 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                    : 'text-muted-foreground hover:text-foreground border border-transparent'
                }`}
                onClick={() => setJourneyStep(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {step.icon}
                <span className="hidden sm:inline font-medium text-sm">{step.title}</span>
                <span className="sm:hidden font-medium text-sm">{index + 1}</span>
              </motion.div>
              {index < journeySteps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-muted-foreground mx-1 hidden lg:block" />
              )}
            </div>
          ))}
        </div>

        {/* Current Step Description */}
        <div className="text-center">
          <Badge variant="outline" className="mb-2">
            Step {journeyStep + 1} of {journeySteps.length}
          </Badge>
          <h2 className="text-xl font-semibold mb-1">{journeySteps[journeyStep].title}</h2>
          <p className="text-sm text-muted-foreground">{journeySteps[journeyStep].description}</p>
        </div>

        {/* Step Content */}
        <div className="min-h-[600px]">
          <CurrentStepComponent />
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <Button 
            variant="outline" 
            disabled={journeyStep === 0}
            onClick={() => setJourneyStep(prev => Math.max(0, prev - 1))}
          >
            Previous Step
          </Button>
          
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-500" />
            <span className="text-sm text-muted-foreground">
              Progress: {Math.round(((journeyStep + 1) / journeySteps.length) * 100)}%
            </span>
          </div>
          
          <Button 
            disabled={journeyStep === journeySteps.length - 1}
            onClick={() => setJourneyStep(prev => Math.min(journeySteps.length - 1, prev + 1))}
          >
            Next Step
          </Button>
        </div>

        {/* Additional Dashboard Components (Always visible for demo) */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-12">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="journey">
              <Eye className="h-4 w-4 mr-2" />
              Journey
            </TabsTrigger>
            <TabsTrigger value="realtime">
              <Zap className="h-4 w-4 mr-2" />
              Live Data
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <Brain className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="community">
              <Activity className="h-4 w-4 mr-2" />
              Community
            </TabsTrigger>
          </TabsList>

          <TabsContent value="journey" className="space-y-6 mt-6">
            <AlphaScoreHero />
          </TabsContent>

          <TabsContent value="realtime" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PortfolioNews accessToken={demoAccessToken} />
              <PortfolioSentiment accessToken={demoAccessToken} />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AlphaStrategies />
              <BiasBreakdown />
            </div>
          </TabsContent>

          <TabsContent value="community" className="space-y-6 mt-6">
            <CommunitySignals />
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of investors using Neufin to eliminate biases and maximize returns
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button 
                  size="lg"
                  onClick={() => window.location.href = '/login'}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Sign Up Now
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => window.location.href = 'mailto:info@neufin.ai'}
                >
                  Contact Sales
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* AI Chat Component */}
      <EnhancedAiChat
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        context="demo"
      />
    </>
  );
}