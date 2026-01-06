import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Zap, Star, TrendingUp, Shield, Rocket, Crown, CreditCard, Users, CheckCircle, X } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';

const strategies = [
  {
    id: 'momentum-pro',
    name: 'Momentum Breakout Pro',
    returns: '+34.7%',
    winRate: '73%',
    risk: 'Medium',
    price: '$49',
    originalPrice: '$69',
    icon: Rocket,
    featured: true,
    subscribers: 2847,
    description: 'Identifies high-momentum stocks breaking key resistance levels using AI-powered pattern recognition',
    detailedDescription: 'Our most popular strategy combines technical analysis with machine learning to identify breakout patterns before they happen. Features bias-reduced algorithms that filter out emotional trading patterns.',
    features: [
      'Real-time breakout alerts',
      'AI-powered pattern recognition',
      'Risk-adjusted position sizing',
      'Automated stop-loss suggestions',
      'Performance tracking dashboard'
    ],
    performance: {
      '1M': '+8.2%',
      '3M': '+18.7%',
      '6M': '+28.4%',
      '1Y': '+34.7%'
    },
    sharpeRatio: 1.84,
    maxDrawdown: '-12.3%'
  },
  {
    id: 'mean-reversion',
    name: 'Mean Reversion Elite',
    returns: '+28.2%',
    winRate: '68%',
    risk: 'Low',
    price: '$39',
    originalPrice: '$49',
    icon: TrendingUp,
    featured: false,
    subscribers: 1923,
    description: 'Profits from temporary price dislocations in quality stocks with statistical edge',
    detailedDescription: 'Sophisticated mean reversion strategy that identifies oversold quality stocks with high probability of bounce-back. Uses fundamental screening combined with technical timing.',
    features: [
      'Quality stock screening',
      'Statistical arbitrage signals',
      'Fundamental analysis integration',
      'Low volatility targeting',
      'Conservative risk management'
    ],
    performance: {
      '1M': '+4.1%',
      '3M': '+12.8%',
      '6M': '+21.5%',
      '1Y': '+28.2%'
    },
    sharpeRatio: 2.12,
    maxDrawdown: '-8.7%'
  },
  {
    id: 'sector-rotation',
    name: 'Sector Rotation Alpha',
    returns: '+41.3%',
    winRate: '71%',
    risk: 'Medium',
    price: '$59',
    originalPrice: '$79',
    icon: Crown,
    featured: true,
    subscribers: 3241,
    description: 'Rotates capital across sectors based on economic cycles and market sentiment',
    detailedDescription: 'Advanced macro strategy that identifies sector rotation opportunities using economic indicators, earnings trends, and sentiment analysis. Maximizes alpha through tactical asset allocation.',
    features: [
      'Economic cycle analysis',
      'Sector momentum tracking',
      'ETF rotation signals',
      'Macro trend integration',
      'Dynamic rebalancing alerts'
    ],
    performance: {
      '1M': '+9.8%',
      '3M': '+22.1%',
      '6M': '+31.7%',
      '1Y': '+41.3%'
    },
    sharpeRatio: 1.67,
    maxDrawdown: '-15.2%'
  },
  {
    id: 'risk-parity',
    name: 'Risk Parity Shield',
    returns: '+19.8%',
    winRate: '82%',
    risk: 'Very Low',
    price: '$29',
    originalPrice: '$39',
    icon: Shield,
    featured: false,
    subscribers: 4156,
    description: 'Balanced exposure across asset classes for steady, risk-adjusted returns',
    detailedDescription: 'Conservative approach focusing on risk-adjusted returns through diversified asset allocation. Perfect for steady wealth building with minimal drawdowns.',
    features: [
      'Multi-asset diversification',
      'Risk parity weighting',
      'Volatility targeting',
      'Drawdown protection',
      'Steady income generation'
    ],
    performance: {
      '1M': '+2.3%',
      '3M': '+7.8%',
      '6M': '+14.2%',
      '1Y': '+19.8%'
    },
    sharpeRatio: 2.45,
    maxDrawdown: '-5.1%'
  }
];

const SubscriptionModal = ({ strategy, isOpen, onClose }: { strategy: any; isOpen: boolean; onClose: () => void }) => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <strategy.icon className="h-5 w-5 text-purple-400" />
            <span>{strategy.name}</span>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="subscribe">Subscribe</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="space-y-4">
              <p className="text-muted-foreground">{strategy.detailedDescription}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Key Features</h4>
                  <ul className="space-y-1">
                    {strategy.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-400" />
                    <span className="text-sm">{strategy.subscribers.toLocaleString()} subscribers</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Sharpe Ratio: </span>
                    <span className="font-medium text-green-400">{strategy.sharpeRatio}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Max Drawdown: </span>
                    <span className="font-medium text-red-400">{strategy.maxDrawdown}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              {Object.entries(strategy.performance).map(([period, return_]) => (
                <div key={period} className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">{period}</p>
                  <p className="font-semibold text-green-400">{return_}</p>
                </div>
              ))}
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Strategy Performance vs Market</span>
                  <span className="text-green-400">+{(parseFloat(strategy.returns.slice(1, -1)) - 12.5).toFixed(1)}%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Risk-Adjusted Returns</span>
                  <span className="text-blue-400">{strategy.sharpeRatio}</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="subscribe" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedPlan === 'monthly' ? 'border-purple-500 bg-purple-500/10' : 'border-border'
                  }`}
                  onClick={() => setSelectedPlan('monthly')}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Monthly</span>
                    <span className="text-lg font-bold">{strategy.price}/mo</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Perfect for testing</p>
                </motion.div>
                
                <motion.div
                  className={`p-4 border rounded-lg cursor-pointer transition-all relative ${
                    selectedPlan === 'annual' ? 'border-purple-500 bg-purple-500/10' : 'border-border'
                  }`}
                  onClick={() => setSelectedPlan('annual')}
                  whileHover={{ scale: 1.02 }}
                >
                  <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs">
                    Save 20%
                  </Badge>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Annual</span>
                    <div className="text-right">
                      <span className="text-lg font-bold">${(parseInt(strategy.price.slice(1)) * 0.8).toFixed(0)}/mo</span>
                      <p className="text-xs text-muted-foreground line-through">{strategy.price}/mo</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Best value option</p>
                </motion.div>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span>Total</span>
                  <span className="font-bold text-lg">
                    {selectedPlan === 'monthly' 
                      ? `${strategy.price}/month`
                      : `${(parseInt(strategy.price.slice(1)) * 0.8 * 12).toFixed(0)}/year`
                    }
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedPlan === 'annual' && `Save ${(parseInt(strategy.price.slice(1)) * 2.4).toFixed(0)} per year`}
                </p>
              </div>
              
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <CreditCard className="h-4 w-4 mr-2" />
                Subscribe Now - 7 Day Free Trial
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                Cancel anytime. No commitment required.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export function AlphaStrategies() {
  const [selectedStrategy, setSelectedStrategy] = useState<any>(null);

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="h-5 w-5 text-purple-400" />
            </motion.div>
            <CardTitle>Alpha Strategies Marketplace</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              12K+ Active Subscribers
            </Badge>
            <Button variant="outline" size="sm">
              View All Strategies
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strategies.map((strategy, index) => {
            const IconComponent = strategy.icon;
            return (
              <motion.div
                key={strategy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className={`p-4 rounded-lg border transition-all cursor-pointer relative ${
                  strategy.featured
                    ? 'bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-500/30'
                    : 'bg-muted/30 border-border'
                }`}
              >
                {strategy.featured && (
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Hot
                    </Badge>
                  </motion.div>
                )}
                
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      strategy.featured ? 'bg-purple-500/20' : 'bg-muted/50'
                    }`}>
                      <IconComponent className={`h-4 w-4 ${
                        strategy.featured ? 'text-purple-400' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{strategy.name}</h4>
                      <div className="flex items-center space-x-1 mt-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {strategy.subscribers.toLocaleString()} subscribers
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-semibold text-purple-400">{strategy.price}/mo</span>
                      {strategy.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          {strategy.originalPrice}
                        </span>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 mt-1">
                      Bias-Reduced
                    </Badge>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {strategy.description}
                </p>
                
                <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
                  <div>
                    <p className="font-semibold text-green-400">{strategy.returns}</p>
                    <p className="text-muted-foreground">1Y Return</p>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-400">{strategy.winRate}</p>
                    <p className="text-muted-foreground">Win Rate</p>
                  </div>
                  <div>
                    <p className={`font-semibold ${
                      strategy.risk === 'Very Low' ? 'text-green-400' :
                      strategy.risk === 'Low' ? 'text-yellow-400' :
                      strategy.risk === 'Medium' ? 'text-orange-400' : 'text-red-400'
                    }`}>
                      {strategy.risk}
                    </p>
                    <p className="text-muted-foreground">Risk</p>
                  </div>
                </div>
                
                <Button 
                  className={`w-full text-xs ${
                    strategy.featured 
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                  size="sm"
                  onClick={() => setSelectedStrategy(strategy)}
                >
                  {strategy.featured ? 'Subscribe Now' : 'View Details'}
                </Button>
              </motion.div>
            );
          })}
        </div>
        
        <motion.div 
          className="mt-6 p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg"
          animate={{ 
            boxShadow: ['0 0 0 0 rgba(168, 85, 247, 0)', '0 0 0 4px rgba(168, 85, 247, 0.1)', '0 0 0 0 rgba(168, 85, 247, 0)']
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Crown className="h-5 w-5 text-yellow-400" />
                <h4 className="font-medium text-purple-400">Neural Twin Premium Bundle</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Access all strategies + AI optimization + bias coaching for 40% more alpha
              </p>
              <div className="flex items-center space-x-4 mt-2 text-xs">
                <span className="text-green-400">✓ All 12 strategies included</span>
                <span className="text-blue-400">✓ Personal AI coach</span>
                <span className="text-purple-400">✓ Priority support</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-purple-400">$149/mo</p>
              <p className="text-xs text-muted-foreground line-through">$248/mo</p>
              <Button size="sm" className="mt-2 bg-gradient-to-r from-purple-600 to-blue-600">
                Upgrade Now
              </Button>
            </div>
          </div>
        </motion.div>
      </CardContent>
      
      {selectedStrategy && (
        <SubscriptionModal
          strategy={selectedStrategy}
          isOpen={!!selectedStrategy}
          onClose={() => setSelectedStrategy(null)}
        />
      )}
    </Card>
  );
}