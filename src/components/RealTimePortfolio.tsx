import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { TrendingUp, TrendingDown, RefreshCw, DollarSign, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { fetchMultipleQuotes } from '../utils/stockService';
import { projectId } from '../utils/supabase/info';

interface RealtimeHolding {
  symbol: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  change: number;
  changePercent: string;
  volume?: string;
}

interface RealTimePortfolioProps {
  accessToken: string;
}

export function RealTimePortfolio({ accessToken }: RealTimePortfolioProps) {
  const [holdings, setHoldings] = useState<RealtimeHolding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [totalValue, setTotalValue] = useState(0);
  const [totalGainLoss, setTotalGainLoss] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchRealtimeData = async () => {
    try {
      setError(null);
      
      // First, get the user's portfolio holdings from backend
      const portfolioResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-22c8dcd8/portfolio/get`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!portfolioResponse.ok) {
        throw new Error('Failed to fetch portfolio');
      }

      const portfolioData = await portfolioResponse.json();
      console.log('Portfolio data:', portfolioData);

      if (!portfolioData.portfolio || !portfolioData.portfolio.holdings) {
        throw new Error('No portfolio holdings found');
      }

      const userHoldings = portfolioData.portfolio.holdings;
      console.log('User holdings:', userHoldings);

      // Extract symbols and fetch real-time quotes
      const symbols = userHoldings.map((h: any) => h.symbol);
      console.log('Fetching quotes for symbols:', symbols);
      
      const quotes = await fetchMultipleQuotes(symbols, accessToken);
      console.log('Real-time quotes:', quotes);

      // Combine holdings with real-time prices
      const enrichedHoldings: RealtimeHolding[] = userHoldings.map((holding: any) => {
        const quote = quotes.find(q => q.symbol === holding.symbol);
        
        return {
          symbol: holding.symbol,
          shares: holding.shares || 0,
          avgCost: holding.avgCost || 0,
          currentPrice: quote?.price || 0,
          change: quote?.change || 0,
          changePercent: quote?.changePercent 
            ? `${quote.changePercent >= 0 ? '+' : ''}${quote.changePercent.toFixed(2)}%`
            : '0.00%',
          volume: quote?.volume,
        };
      });

      console.log('Enriched holdings:', enrichedHoldings);

      setHoldings(enrichedHoldings);
      
      // Calculate totals
      const total = enrichedHoldings.reduce((sum, h) => 
        sum + (h.shares * h.currentPrice), 0
      );
      const gainLoss = enrichedHoldings.reduce((sum, h) => 
        sum + (h.shares * (h.currentPrice - h.avgCost)), 0
      );
      
      console.log('Total value:', total, 'Gain/Loss:', gainLoss);
      
      setTotalValue(total);
      setTotalGainLoss(gainLoss);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching realtime data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load portfolio data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRealtimeData();
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchRealtimeData, 60000);
    
    return () => clearInterval(interval);
  }, [accessToken]);

  const handleRefresh = () => {
    setIsLoading(true);
    fetchRealtimeData();
  };

  if (isLoading && holdings.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4" />
            <p className="text-sm text-muted-foreground">Loading your portfolio...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && holdings.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-sm text-red-400 mb-2">Error: {error}</p>
            <Button onClick={handleRefresh} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const gainLossPercent = totalValue > 0 ? ((totalGainLoss / (totalValue - totalGainLoss)) * 100) : 0;

  return (
    <Card className="border-purple-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-purple-400" />
            <span>Live Portfolio Performance</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="icon-enhanced"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
          <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400' : 'bg-green-400 animate-pulse'}`} />
          <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20"
          >
            <DollarSign className="h-5 w-5 text-purple-400 mb-2" />
            <div className="text-2xl font-bold text-purple-400">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Total Market Value</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`p-4 rounded-lg border ${
              totalGainLoss >= 0 
                ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20' 
                : 'bg-gradient-to-br from-red-500/10 to-rose-500/10 border-red-500/20'
            }`}
          >
            {totalGainLoss >= 0 ? (
              <TrendingUp className="h-5 w-5 text-green-400 mb-2" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-400 mb-2" />
            )}
            <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalGainLoss >= 0 ? '+' : ''}${Math.abs(totalGainLoss).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Total Gain/Loss</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`p-4 rounded-lg border ${
              gainLossPercent >= 0 
                ? 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20' 
                : 'bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20'
            }`}
          >
            <Activity className={`h-5 w-5 mb-2 ${gainLossPercent >= 0 ? 'text-blue-400' : 'text-orange-400'}`} />
            <div className={`text-2xl font-bold ${gainLossPercent >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
              {gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">Overall Return</div>
          </motion.div>
        </div>

        {/* Holdings List */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Live Holdings</h4>
          {holdings.length > 0 ? (
            holdings.map((holding, index) => {
              const positionValue = holding.shares * holding.currentPrice;
              const costBasis = holding.shares * holding.avgCost;
              const gainLoss = positionValue - costBasis;
              const gainLossPercent = costBasis > 0 ? ((gainLoss / costBasis) * 100) : 0;
              
              return (
                <motion.div
                  key={holding.symbol}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 bg-card/50 rounded-lg border border-border/50 hover:border-purple-500/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="font-mono text-base px-3 py-1">
                        {holding.symbol}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {holding.shares} shares
                      </div>
                    </div>
                    <div className={`flex items-center space-x-2 ${
                      holding.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {holding.change >= 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span className="font-medium">{holding.changePercent}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">Current Price</div>
                      <div className="font-medium">${holding.currentPrice.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">Avg Cost</div>
                      <div className="font-medium">${holding.avgCost.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">Position Value</div>
                      <div className="font-medium">${positionValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">Gain/Loss</div>
                      <div className={`font-medium ${gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {gainLoss >= 0 ? '+' : ''}${Math.abs(gainLoss).toFixed(2)} ({gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No holdings found in your portfolio</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
