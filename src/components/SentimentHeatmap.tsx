import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Info, Activity, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { projectId } from '../utils/supabase/info';

const PulsingIndicator = ({ intensity, color }: { intensity: 'low' | 'medium' | 'high'; color: string }) => {
  const duration = intensity === 'high' ? 1 : intensity === 'medium' ? 1.5 : 2;
  const scale = intensity === 'high' ? [1, 1.3, 1] : intensity === 'medium' ? [1, 1.2, 1] : [1, 1.1, 1];

  return (
    <motion.div
      className={`absolute -top-1 -right-1 w-3 h-3 ${color} rounded-full opacity-60`}
      animate={{ scale }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    />
  );
};

interface SentimentHeatmapProps {
  accessToken?: string;
}

export function SentimentHeatmap({ accessToken }: SentimentHeatmapProps) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showVolatility, setShowVolatility] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [sentimentData, setSentimentData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [marketPulse, setMarketPulse] = useState({ positive: 0, neutral: 0, negative: 0 });

  useEffect(() => {
    const fetchSentimentData = async () => {
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-22c8dcd8/sentiment/heatmap`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.stocks && data.stocks.length > 0) {
            setSentimentData(data.stocks);
            setMarketPulse(data.marketPulse || { positive: 0, neutral: 0, negative: 0 });
            setLastUpdate(new Date());
          }
        }
      } catch (error) {
        console.error('Error fetching sentiment data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSentimentData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchSentimentData, 30000);
    return () => clearInterval(interval);
  }, [accessToken]);

  const filteredData = sentimentData.filter(stock => {
    if (selectedFilter === 'all') return true;
    return stock.sector === selectedFilter;
  });

  if (isLoading) {
    return (
      <Card className="bg-card/50">
        <CardContent className="p-8 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low Risk': return 'risk-low';
      case 'Medium Risk': return 'risk-medium';
      case 'High Risk': return 'risk-high';
      default: return 'risk-medium';
    }
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 70) return 'bg-green-500';
    if (sentiment >= 50) return 'bg-green-400';
    if (sentiment >= 40) return 'bg-orange-500';
    return 'bg-red-600';
  };

  return (
    <Card className="bg-card/50" role="region" aria-label="Interactive market sentiment grid">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Activity className="h-5 w-5 text-blue-400" />
            </motion.div>
            <CardTitle style={{ color: 'var(--heading-secondary)' }}>
              Sentiment & Market Heatmap
            </CardTitle>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Info className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Real-Time Sentiment Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    AI-powered sentiment analysis combining social media, news sentiment, and trading volume. 
                    Pulsing indicators show volatility levels.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Live</span>
              </Badge>
            </motion.div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Filter by Sector</h4>
                    <Tabs value={selectedFilter} onValueChange={setSelectedFilter}>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="tech">Tech</TabsTrigger>
                        <TabsTrigger value="consumer">Consumer</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Show Volatility Indicators</label>
                    <Switch checked={showVolatility} onCheckedChange={setShowVolatility} />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredData.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {filteredData.map((stock, index) => (
                <motion.div
                  key={stock.symbol}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className={`p-3 rounded-lg ${getSentimentColor(stock.sentiment)} bg-opacity-20 border border-current border-opacity-30 hover:bg-opacity-30 transition-all cursor-pointer relative`}
                >
                  {showVolatility && stock.volatility && (
                    <PulsingIndicator intensity={stock.volatility as any} color={getSentimentColor(stock.sentiment)} />
                  )}
                  
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm" style={{ color: 'var(--heading-secondary)' }}>
                      {stock.symbol}
                    </span>
                    <div className="flex items-center space-x-1">
                      {(stock.change || 0) >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-400" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-400" />
                      )}
                      <span className="text-xs">{stock.changePercent || '0%'}</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground mb-2 flex items-center justify-between">
                    <span>{stock.volume || 'Medium'} Vol</span>
                    {stock.riskLevel && (
                      <Badge className={`text-xs px-1 py-0 ${getRiskColor(stock.riskLevel)}`}>
                        {stock.volatility || 'medium'}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Sentiment</span>
                    <motion.span 
                      className="text-sm font-semibold"
                      animate={{ 
                        color: stock.sentiment > 70 ? '#10B981' : stock.sentiment > 50 ? '#F59E0B' : '#EF4444' 
                      }}
                    >
                      {stock.sentiment}%
                    </motion.span>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="mt-6 p-4 bg-muted/30 rounded-lg"
              animate={{ backgroundColor: ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Market Pulse</span>
                <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                  {marketPulse.positive > 50 ? 'Bullish' : marketPulse.negative > 50 ? 'Bearish' : 'Neutral'} Momentum
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="cursor-pointer"
                >
                  <motion.p 
                    className="font-semibold text-green-400"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {marketPulse.positive}%
                  </motion.p>
                  <p className="text-muted-foreground">Positive</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="cursor-pointer"
                >
                  <p className="font-semibold text-yellow-400">{marketPulse.neutral}%</p>
                  <p className="text-muted-foreground">Neutral</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="cursor-pointer"
                >
                  <p className="font-semibold text-red-400">{marketPulse.negative}%</p>
                  <p className="text-muted-foreground">Negative</p>
                </motion.div>
              </div>
            </motion.div>
          </>
        ) : (
          <div className="h-48 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">No sentiment data available</p>
              <p className="text-xs text-muted-foreground mt-2">Data will appear shortly</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
