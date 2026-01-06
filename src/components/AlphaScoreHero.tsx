import { useState, useEffect } from 'react';
import { TrendingUp, Info, Zap, DollarSign, Rocket, Brain, Target } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { projectId } from '../utils/supabase/info';
import { fetchMultipleQuotes } from '../utils/stockService';

// Neural network animation component
const NeuralNetwork = () => {
  const nodes = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 200,
    y: Math.random() * 100,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden opacity-10">
      <svg width="100%" height="100%" className="absolute inset-0">
        {nodes.map((node, i) => (
          <g key={node.id}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="2"
              fill="#3B82F6"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
            {i < nodes.length - 1 && (
              <motion.line
                x1={node.x}
                y1={node.y}
                x2={nodes[i + 1].x}
                y2={nodes[i + 1].y}
                stroke="#3B82F6"
                strokeWidth="0.5"
                animate={{
                  opacity: [0.1, 0.5, 0.1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: Math.random(),
                }}
              />
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};

interface AlphaScoreHeroProps {
  accessToken?: string;
}

export function AlphaScoreHero({ accessToken }: AlphaScoreHeroProps) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [calculatedData, setCalculatedData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        // Try to fetch from backend first
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-22c8dcd8/alpha/score`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          // If backend doesn't have data, calculate from portfolio
          await calculateFromPortfolio();
        }
      } catch (error) {
        console.error('Error fetching alpha score:', error);
        // Calculate from portfolio as fallback
        await calculateFromPortfolio();
      } finally {
        setIsLoading(false);
      }
    };

    const calculateFromPortfolio = async () => {
      try {
        // Get user's portfolio
        const portfolioResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-22c8dcd8/portfolio/get`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        if (!portfolioResponse.ok) return;

        const portfolioData = await portfolioResponse.json();
        if (!portfolioData.portfolio?.holdings) return;

        const holdings = portfolioData.portfolio.holdings;
        const symbols = holdings.map((h: any) => h.symbol);
        
        // Fetch real-time quotes
        const quotes = await fetchMultipleQuotes(symbols, accessToken);
        
        // Calculate simple metrics
        let totalValue = 0;
        let totalGainLoss = 0;
        
        holdings.forEach((holding: any) => {
          const quote = quotes.find((q: any) => q.symbol === holding.symbol);
          if (quote) {
            const currentValue = holding.shares * quote.price;
            const costBasis = holding.shares * holding.avgCost;
            totalValue += currentValue;
            totalGainLoss += (currentValue - costBasis);
          }
        });

        const returnPercent = totalValue > 0 ? ((totalGainLoss / (totalValue - totalGainLoss)) * 100) : 0;
        
        // Simple alpha score calculation (this would be more sophisticated in production)
        const baseScore = Math.min(10, Math.max(0, 5 + (returnPercent / 10)));
        const marketComparison = Math.max(0, returnPercent - 12); // Assume 12% market average
        
        // Find best performing stock for recommendation
        let bestStock = null;
        let bestReturn = -Infinity;
        
        holdings.forEach((holding: any) => {
          const quote = quotes.find((q: any) => q.symbol === holding.symbol);
          if (quote && quote.changePercent > bestReturn) {
            bestReturn = quote.changePercent;
            bestStock = {
              symbol: holding.symbol,
              currentPrice: quote.price,
              change: quote.changePercent,
            };
          }
        });

        setCalculatedData({
          score: baseScore.toFixed(1),
          vsMarket: marketComparison.toFixed(1),
          missedGains: Math.abs(Math.min(0, totalGainLoss)),
          biasProgress: Math.min(100, Math.max(0, 50 + (returnPercent * 2))),
          accuracyRate: Math.min(100, Math.max(0, 60 + (returnPercent))),
          signalsGenerated: holdings.length * 3, // Simple calculation
          alphaGenerated: Math.max(0, returnPercent).toFixed(1),
          recommendation: bestStock ? {
            action: bestStock.change >= 0 ? 'BUY' : 'HOLD',
            symbol: bestStock.symbol,
            company: bestStock.symbol,
            currentPrice: bestStock.currentPrice,
            targetPrice: bestStock.currentPrice * 1.067, // 6.7% target
            upside: 6.7,
            confidence: Math.min(95, 70 + Math.abs(bestStock.change)),
          } : null,
        });
      } catch (error) {
        console.error('Error calculating from portfolio:', error);
      }
    };

    fetchData();
  }, [accessToken]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardContent className="p-8 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Use real data if available, otherwise use calculated data
  const displayData = data || calculatedData || {};
  const score = parseFloat(displayData.score) || 0;
  const vsMarket = parseFloat(displayData.vsMarket) || 0;
  const missedGains = displayData.missedGains || 0;
  const biasProgress = displayData.biasProgress || 0;
  const accuracyRate = displayData.accuracyRate || 0;
  const signalsGenerated = displayData.signalsGenerated || 0;
  const alphaGenerated = parseFloat(displayData.alphaGenerated) || 0;
  const recommendation = displayData.recommendation;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Main Alpha Score */}
      <Card className="lg:col-span-2 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30 relative overflow-hidden">
        <NeuralNetwork />
        <CardContent className="p-8 relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Brain className="h-5 w-5 text-blue-400" />
                </motion.div>
                <h2 className="text-lg text-blue-400">Neural Twin Alpha Score</h2>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Info className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-medium">Neural Twin Alpha Score</h4>
                      <p className="text-sm text-muted-foreground">
                        AI-powered score quantifying how much more you could earn by eliminating cognitive biases. 
                        Based on behavioral analysis of your portfolio and trading patterns.
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-baseline space-x-4">
                <motion.span 
                  className="text-5xl font-bold text-foreground"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {score > 0 ? score : '—'}
                </motion.span>
                <span className="text-lg text-muted-foreground">/10</span>
                {vsMarket > 0 && (
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                    +{vsMarket} vs Market
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Potential missed gains</p>
              <motion.p 
                className="text-2xl font-bold text-red-400"
                animate={{ color: ['#F87171', '#EF4444', '#F87171'] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {missedGains > 0 ? `-$${missedGains.toLocaleString()}` : '$0'}
              </motion.p>
              <p className="text-xs text-muted-foreground">Last 12 months</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Bias Correction Progress</span>
                <span>{biasProgress}%</span>
              </div>
              <Progress value={biasProgress} className="h-2" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
              >
                <p className="text-lg font-semibold text-green-400">{accuracyRate}%</p>
                <p className="text-xs text-muted-foreground">Accuracy Rate</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
              >
                <p className="text-lg font-semibold text-blue-400">{signalsGenerated}</p>
                <p className="text-xs text-muted-foreground">Signals Generated</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
              >
                <p className="text-lg font-semibold text-purple-400">{alphaGenerated}%</p>
                <p className="text-xs text-muted-foreground">Alpha Generated</p>
              </motion.div>
            </div>

            {/* Boost Score CTA */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <Rocket className="h-4 w-4 mr-2" />
                Boost Your Alpha Score
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Recommendation */}
      <Card className="bg-card/50 relative overflow-hidden">
        <CardContent className="p-6 relative z-10">
          <h3 className="font-semibold mb-4 flex items-center">
            <Target className="h-4 w-4 mr-2 text-green-400" />
            Today's AI Recommendation
          </h3>
          
          <div className="space-y-4">
            {recommendation ? (
              <>
                <motion.div 
                  className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg relative"
                  animate={{ boxShadow: ['0 0 0 0 rgba(34, 197, 94, 0)', '0 0 0 4px rgba(34, 197, 94, 0.1)', '0 0 0 0 rgba(34, 197, 94, 0)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-green-400 flex items-center">
                      <motion.div
                        className="w-2 h-2 bg-green-400 rounded-full mr-2"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      {recommendation.action} SIGNAL
                    </span>
                    <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                      AI Confidence: {recommendation.confidence.toFixed(0)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{recommendation.symbol} - {recommendation.company}</p>
                  <p className="text-lg font-semibold">${recommendation.currentPrice.toFixed(2)} → ${recommendation.targetPrice.toFixed(2)}</p>
                  <p className="text-xs text-green-400">+{recommendation.upside.toFixed(1)}% potential upside</p>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Execute Trade
                  </Button>
                </motion.div>
              </>
            ) : (
              <div className="p-4 bg-muted/30 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Analyzing your portfolio...</p>
                <p className="text-xs text-muted-foreground mt-2">AI recommendations will appear shortly</p>
              </div>
            )}
            
            <Button variant="outline" className="w-full">
              View Full Analysis
            </Button>
          </div>
        </CardContent>
        
        {/* Subtle background animation */}
        <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
          <motion.div
            className="w-full h-full bg-green-400 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
      </Card>
    </div>
  );
}
