import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Bell,
  User,
  TrendingUp,
  TrendingDown,
  Activity,
  Brain,
  Wallet,
  Settings,
  LogOut,
  RefreshCw,
  Plus,
  FileText,
  Zap,
  ChevronRight,
  BarChart3,
  Target,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { createClient } from '../utils/supabase/client';
import neufinLogo from 'figma:asset/1e05f334cab806cc0d5cb5a632565c93d01080cd.png';

interface Holding {
  ticker: string;
  quantity: number;
  avgCost: number;
}

interface CustomerDashboardProps {
  userName: string;
  holdings: Holding[];
  alphaScore: number;
  opportunityCost: number;
}

// Mock real-time stock data
const generateMockStockData = () => {
  return {
    AAPL: { price: 178.42, change: 2.34, changePercent: 1.33 },
    MSFT: { price: 378.91, change: 4.12, changePercent: 1.10 },
    GOOGL: { price: 141.80, change: -1.23, changePercent: -0.86 },
    NVDA: { price: 495.37, change: 12.54, changePercent: 2.60 },
    TSLA: { price: 248.98, change: -3.21, changePercent: -1.27 },
    AMZN: { price: 178.35, change: 2.15, changePercent: 1.22 },
    META: { price: 474.99, change: 5.67, changePercent: 1.21 },
  };
};

export function CustomerDashboard({
  userName,
  holdings,
  alphaScore,
  opportunityCost,
}: CustomerDashboardProps) {
  const [stockData, setStockData] = useState(generateMockStockData());
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [todayChange, setTodayChange] = useState(0);
  const [todayChangePercent, setTodayChangePercent] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  
  const navigate = useNavigate();
  const supabase = createClient();

  useEffect(() => {
    // Calculate portfolio value
    if (holdings.length > 0) {
      let totalValue = 0;
      let totalChange = 0;
      
      holdings.forEach(holding => {
        const stock = stockData[holding.ticker as keyof typeof stockData];
        if (stock) {
          const currentValue = stock.price * holding.quantity;
          const costBasis = holding.avgCost * holding.quantity;
          totalValue += currentValue;
          totalChange += (currentValue - costBasis);
        }
      });
      
      setPortfolioValue(totalValue);
      setTodayChange(totalChange);
      setTodayChangePercent((totalChange / (totalValue - totalChange)) * 100);
    }

    // Simulate real-time price updates every 5 seconds
    const interval = setInterval(() => {
      setStockData(generateMockStockData());
      setLastSyncTime(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, [holdings, stockData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('neufin_onboarding_complete');
    localStorage.removeItem('neufin_holdings');
    navigate('/');
  };

  const signals = [
    {
      id: 1,
      type: 'BUY',
      ticker: 'NVDA',
      confidence: 82,
      pattern: 'Bullish Hammer + Volume Surge',
      sentiment: 68,
      sentimentText: '15 positive articles today',
      price: 875.23,
      change: 2.4,
      reasoning: 'Strong earnings beat + analyst upgrades + technical breakout',
      color: 'green',
    },
    {
      id: 2,
      type: 'SELL',
      ticker: 'TSLA',
      confidence: 76,
      pattern: 'Bearish Engulfing',
      sentiment: -42,
      sentimentText: 'concerns about delivery miss',
      price: 242.18,
      change: -1.8,
      reasoning: 'Negative sentiment + overbought RSI + insider selling',
      color: 'red',
    },
    {
      id: 3,
      type: 'HOLD',
      ticker: 'AAPL',
      confidence: 65,
      pattern: 'Consolidation Pattern',
      sentiment: 12,
      sentimentText: 'neutral market sentiment',
      price: 178.42,
      change: 1.3,
      reasoning: 'Stable fundamentals + awaiting product announcements',
      color: 'yellow',
    },
  ];

  const biases = [
    { name: 'Loss Aversion', score: 68, color: 'red', description: 'You hold losers 2.3x longer than winners' },
    { name: 'Disposition Effect', score: 42, color: 'yellow', description: 'You realize gains too early' },
    { name: 'Overconfidence', score: 35, color: 'yellow', description: 'Portfolio concentration risk' },
    { name: 'Herding', score: 28, color: 'green', description: 'Good independence from market trends' },
  ];

  const activities = [
    { time: '2 hours ago', text: 'New SELL signal for TSLA (bearish sentiment)', type: 'signal' },
    { time: 'Yesterday', text: 'Portfolio value increased by 1.2%', type: 'performance' },
    { time: '2 days ago', text: 'Bias analysis updated (Loss Aversion decreased from 72% to 68%)', type: 'bias' },
    { time: '3 days ago', text: 'Added AMZN to holdings', type: 'portfolio' },
    { time: '5 days ago', text: 'Digital Twin simulation completed (Market Crash scenario)', type: 'simulation' },
  ];

  const marketData = {
    sp500: { value: 4785, change: 0.8 },
    vix: { value: 12.4, change: -2.1 },
    sentiment: { value: 'Bullish', score: 62 },
  };

  return (
    <div className="min-h-screen bg-background dark">
      {/* Top Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src={neufinLogo} alt="Neufin Logo" className="h-10 w-10 object-contain" />
            <div>
              <h1 className="text-xl font-semibold text-foreground">Neufin AI</h1>
              <p className="text-xs text-muted-foreground">Customer Pane</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-sm font-medium text-primary border-b-2 border-primary pb-1">
              Portfolio
            </button>
            <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Signals
            </button>
            <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Analysis
            </button>
            <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Settings
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
              Upgrade to Pro
            </Button>
            
            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 hover:bg-accent p-2 rounded-lg transition-colors"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-purple-500/20 text-purple-400">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <ChevronRight className={`h-4 w-4 transition-transform ${showUserMenu ? 'rotate-90' : ''}`} />
              </button>

              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="p-3 border-b border-border">
                    <p className="font-medium">{userName}</p>
                    <p className="text-sm text-muted-foreground">Free Plan</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors">
                      <User className="h-4 w-4" />
                      Profile
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors">
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                    <Separator className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-80 border-r border-border p-6 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
          {/* Quick Stats */}
          <Card className="p-6 mb-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
            <h3 className="text-sm text-muted-foreground mb-4">Quick Stats</h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Portfolio Value</div>
                <div className="text-3xl font-semibold">${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground mb-1">Today's Change</div>
                <div className={`text-xl flex items-center gap-2 ${todayChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {todayChange >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                  ${Math.abs(todayChange).toLocaleString(undefined, { maximumFractionDigits: 0 })} ({todayChangePercent >= 0 ? '+' : ''}{todayChangePercent.toFixed(2)}%)
                </div>
              </div>

              <Separator />

              <div>
                <div className="text-xs text-muted-foreground mb-2">Alpha Score</div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-semibold text-purple-400">{alphaScore.toFixed(1)}%</span>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    ${(opportunityCost / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo
                  </Badge>
                </div>
                <Progress value={alphaScore * 10} className="h-2" />
              </div>

              <div>
                <div className="text-xs text-muted-foreground mb-1">Active Signals</div>
                <div className="text-2xl font-semibold">3</div>
              </div>
            </div>
          </Card>

          {/* Menu */}
          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <BarChart3 className="h-5 w-5" />
              <span className="font-medium">Overview</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-muted-foreground">
              <Activity className="h-5 w-5" />
              <span className="font-medium">Sentiment Engine</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-muted-foreground">
              <Brain className="h-5 w-5" />
              <span className="font-medium">Bias Analyzer</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-muted-foreground">
              <Target className="h-5 w-5" />
              <span className="font-medium">Digital Twin</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-muted-foreground">
              <Wallet className="h-5 w-5" />
              <span className="font-medium">Holdings</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-muted-foreground">
              <Settings className="h-5 w-5" />
              <span className="font-medium">Settings</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 max-w-7xl">
          <div className="mb-6">
            <h2 className="text-3xl mb-1">Welcome back, {userName}!</h2>
            <p className="text-muted-foreground">Here's what's happening with your portfolio today</p>
          </div>

          {/* Portfolio Overview */}
          <section className="mb-8">
            <h3 className="text-xl mb-4">Portfolio Overview</h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Current Portfolio */}
              <Card className="p-6">
                <h4 className="text-lg mb-4 flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-blue-400" />
                  Your Portfolio
                </h4>
                <div className="space-y-3">
                  {holdings.slice(0, 5).map((holding) => {
                    const stock = stockData[holding.ticker as keyof typeof stockData];
                    const currentValue = stock ? stock.price * holding.quantity : 0;
                    const costBasis = holding.avgCost * holding.quantity;
                    const gainLoss = currentValue - costBasis;
                    const gainLossPercent = (gainLoss / costBasis) * 100;

                    return (
                      <div key={holding.ticker} className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50">
                        <div>
                          <div className="font-semibold">{holding.ticker}</div>
                          <div className="text-sm text-muted-foreground">
                            {holding.quantity} shares @ ${holding.avgCost.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${currentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                          <div className={`text-sm ${gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {gainLoss >= 0 ? '+' : ''}{gainLossPercent.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Neural Twin Portfolio */}
              <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-blue-500/5 border-purple-500/20">
                <h4 className="text-lg mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-400" />
                  Neural Twin Optimal
                </h4>
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Suggested rebalancing to minimize bias and maximize returns
                  </p>
                  <div className="flex items-center gap-2 text-sm text-green-400">
                    <TrendingUp className="h-4 w-4" />
                    <span>+{alphaScore.toFixed(1)}% potential improvement</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                  View Rebalancing Suggestions
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            </div>
          </section>

          {/* Active Signals */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl">Active Signals</h3>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {signals.map((signal) => (
                <Card key={signal.id} className="p-6 hover:border-purple-500/30 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Badge className={`${
                        signal.type === 'BUY' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        signal.type === 'SELL' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                        'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      }`}>
                        {signal.type} SIGNAL
                      </Badge>
                      <div>
                        <span className="text-xl font-semibold">{signal.ticker}</span>
                        <span className="text-muted-foreground ml-2">Confidence: {signal.confidence}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">${signal.price}</div>
                      <div className={signal.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {signal.change >= 0 ? '+' : ''}{signal.change}%
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Pattern</div>
                      <div className="text-sm">{signal.pattern}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Sentiment</div>
                      <div className="text-sm flex items-center gap-2">
                        <span className={signal.sentiment >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {signal.sentiment >= 0 ? '+' : ''}{signal.sentiment}%
                        </span>
                        <span className="text-muted-foreground">({signal.sentimentText})</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground mb-1">Reasoning</div>
                    <div className="text-sm">{signal.reasoning}</div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-purple-500/30 hover:bg-purple-500/10">
                      View Details
                    </Button>
                    <Button size="sm" variant="ghost">
                      Dismiss
                    </Button>
                    <Button size="sm" variant="ghost">
                      Already Acted
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Bias Snapshot */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl">Bias Snapshot</h3>
              <Button variant="ghost" size="sm" className="text-purple-400">
                Deep Dive into Biases
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              {biases.map((bias) => (
                <Card key={bias.name} className="p-6 text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <svg className="transform -rotate-90 w-24 h-24">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-muted/20"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${bias.score * 2.51} 251`}
                        className={`${
                          bias.color === 'red' ? 'text-red-400' :
                          bias.color === 'yellow' ? 'text-yellow-400' :
                          'text-green-400'
                        }`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-semibold">{bias.score}%</span>
                    </div>
                  </div>
                  <h4 className="font-semibold mb-2">{bias.name}</h4>
                  <p className="text-xs text-muted-foreground">{bias.description}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section>
            <h3 className="text-xl mb-4">Recent Activity Timeline</h3>
            <Card className="p-6">
              <div className="space-y-4">
                {activities.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground mb-1">{activity.time}</div>
                      <div className="text-sm">{activity.text}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-4 text-purple-400">
                View Full History
              </Button>
            </Card>
          </section>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 border-l border-border p-6 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
          {/* Market Pulse */}
          <Card className="p-6 mb-6">
            <h3 className="text-sm text-muted-foreground mb-4">Market Pulse (Today)</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">S&P 500</span>
                <div className="text-right">
                  <div className="font-semibold">{marketData.sp500.value}</div>
                  <div className="text-sm text-green-400">↑ {marketData.sp500.change}%</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">VIX</span>
                <div className="text-right">
                  <div className="font-semibold">{marketData.vix.value}</div>
                  <div className="text-sm text-green-400">↓ {Math.abs(marketData.vix.change)}%</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Market Sentiment</span>
                <div className="text-right">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    {marketData.sentiment.value} ({marketData.sentiment.score}%)
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Top Movers */}
          <Card className="p-6 mb-6">
            <h3 className="text-sm text-muted-foreground mb-4">Your Top Movers</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div>
                  <div className="font-semibold">↑ NVDA</div>
                  <div className="text-sm text-muted-foreground">+5.2%</div>
                </div>
                <div className="text-green-400 font-semibold">$1,240</div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div>
                  <div className="font-semibold">↑ MSFT</div>
                  <div className="text-sm text-muted-foreground">+2.1%</div>
                </div>
                <div className="text-green-400 font-semibold">$580</div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <div>
                  <div className="font-semibold">↓ TSLA</div>
                  <div className="text-sm text-muted-foreground">-1.8%</div>
                </div>
                <div className="text-red-400 font-semibold">-$320</div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 mb-6">
            <h3 className="text-sm text-muted-foreground mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Add Holding
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Portfolio
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Target className="mr-2 h-4 w-4" />
                Run Scenario
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              Last synced: {lastSyncTime.toLocaleTimeString()}
            </div>
          </Card>

          {/* Educational Tip */}
          <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <h3 className="text-sm font-semibold mb-2">💡 Tip of the Day</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Loss aversion causes investors to hold losing positions 50% longer than optimal. Your Neural Twin never makes this mistake.
            </p>
            <Button variant="ghost" size="sm" className="text-blue-400 p-0 h-auto">
              Learn More →
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  );
}