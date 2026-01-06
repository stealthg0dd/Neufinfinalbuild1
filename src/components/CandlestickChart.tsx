import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { RefreshCw, TrendingUp, TrendingDown, AlertCircle, Search, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { fetchIntradayData } from '../utils/stockService';

interface CandleData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface AlphaBreakout {
  type: 'bullish' | 'bearish';
  price: number;
  timestamp: string;
  strength: number;
  signal: string;
}

interface CandlestickChartProps {
  accessToken: string;
  defaultSymbol?: string;
}

export function CandlestickChart({ accessToken, defaultSymbol = 'AAPL' }: CandlestickChartProps) {
  const [symbol, setSymbol] = useState(defaultSymbol);
  const [inputSymbol, setInputSymbol] = useState(defaultSymbol);
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [alphaBreakouts, setAlphaBreakouts] = useState<AlphaBreakout[]>([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStockData = async (stockSymbol: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch intraday data using the stock service
      const candleData: CandleData[] = await fetchIntradayData(stockSymbol, accessToken);

      if (candleData && candleData.length > 0) {
        setCandles(candleData);
        
        // Calculate price change
        if (candleData.length > 1) {
          const latest = candleData[candleData.length - 1].close;
          const previous = candleData[0].close;
          setCurrentPrice(latest);
          setPriceChange(((latest - previous) / previous) * 100);
        }

        // Detect alpha breakouts
        detectAlphaBreakouts(candleData);
      } else {
        // Fallback to mock data
        generateMockData(stockSymbol);
      }
    } catch (err: any) {
      console.error('Error fetching stock data:', err);
      setError('Unable to fetch real-time data. Showing sample data.');
      generateMockData(stockSymbol);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockData = (stockSymbol: string) => {
    const now = new Date();
    const mockCandles: CandleData[] = [];
    let basePrice = 150 + Math.random() * 50;

    for (let i = 0; i < 50; i++) {
      const timestamp = new Date(now.getTime() - (49 - i) * 5 * 60000).toISOString();
      const volatility = 2;
      const change = (Math.random() - 0.5) * volatility;
      
      const open = basePrice;
      const close = basePrice + change;
      const high = Math.max(open, close) + Math.random() * volatility;
      const low = Math.min(open, close) - Math.random() * volatility;
      
      mockCandles.push({
        timestamp,
        open,
        high,
        low,
        close,
        volume: Math.floor(1000000 + Math.random() * 5000000),
      });
      
      basePrice = close;
    }

    setCandles(mockCandles);
    setCurrentPrice(basePrice);
    setPriceChange((Math.random() - 0.5) * 5);
    detectAlphaBreakouts(mockCandles);
  };

  const detectAlphaBreakouts = (candleData: CandleData[]) => {
    const breakouts: AlphaBreakout[] = [];
    
    // Simple breakout detection algorithm
    for (let i = 20; i < candleData.length; i++) {
      const current = candleData[i];
      const prevCandles = candleData.slice(i - 20, i);
      const avgHigh = prevCandles.reduce((sum, c) => sum + c.high, 0) / 20;
      const avgLow = prevCandles.reduce((sum, c) => sum + c.low, 0) / 20;
      
      // Bullish breakout: close above 20-period high
      if (current.close > avgHigh * 1.02) {
        const strength = ((current.close - avgHigh) / avgHigh) * 100;
        breakouts.push({
          type: 'bullish',
          price: current.close,
          timestamp: current.timestamp,
          strength,
          signal: 'Strong upward momentum detected',
        });
      }
      
      // Bearish breakout: close below 20-period low
      if (current.close < avgLow * 0.98) {
        const strength = ((avgLow - current.close) / avgLow) * 100;
        breakouts.push({
          type: 'bearish',
          price: current.close,
          timestamp: current.timestamp,
          strength,
          signal: 'Strong downward momentum detected',
        });
      }
    }
    
    setAlphaBreakouts(breakouts.slice(-3)); // Keep last 3 breakouts
  };

  useEffect(() => {
    if (accessToken) {
      fetchStockData(symbol);
    }
  }, [symbol, accessToken]);

  const handleSearch = () => {
    if (inputSymbol && inputSymbol !== symbol) {
      setSymbol(inputSymbol.toUpperCase());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Calculate chart dimensions
  const maxPrice = Math.max(...candles.map(c => c.high));
  const minPrice = Math.min(...candles.map(c => c.low));
  const priceRange = maxPrice - minPrice;
  const chartHeight = 300;
  const chartWidth = 800;
  const candleWidth = chartWidth / candles.length;

  const getYPosition = (price: number) => {
    return chartHeight - ((price - minPrice) / priceRange) * chartHeight;
  };

  return (
    <Card className="border-purple-500/20">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex-1">
            <CardTitle className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              <span>Candlestick Analysis with Alpha Breakouts</span>
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-lg font-mono px-3 py-1">
                {symbol}
              </Badge>
              {!isLoading && currentPrice > 0 && (
                <>
                  <div className="text-2xl font-bold">
                    ${currentPrice.toFixed(2)}
                  </div>
                  <Badge className={priceChange >= 0 ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}>
                    {priceChange >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                  </Badge>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Input
              value={inputSymbol}
              onChange={(e) => setInputSymbol(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="Enter ticker..."
              className="w-32"
            />
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              size="sm"
              variant="outline"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => fetchStockData(symbol)}
              disabled={isLoading}
              size="sm"
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {error && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <p className="text-sm text-yellow-400">Using demo data. {error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Alpha Breakouts */}
            {alphaBreakouts.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span>Recent Alpha Breakouts</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {alphaBreakouts.map((breakout, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 rounded-lg border ${
                        breakout.type === 'bullish'
                          ? 'bg-green-500/10 border-green-500/30'
                          : 'bg-red-500/10 border-red-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={breakout.type === 'bullish' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}>
                          {breakout.type === 'bullish' ? '↑ Bullish' : '↓ Bearish'}
                        </Badge>
                        <span className="text-sm font-bold">
                          ${breakout.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {breakout.signal}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Strength: {breakout.strength.toFixed(1)}%
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Candlestick Chart */}
            <div className="bg-background/50 rounded-lg p-4 overflow-x-auto">
              <svg width={chartWidth} height={chartHeight} className="w-full">
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                  <g key={i}>
                    <line
                      x1={0}
                      y1={chartHeight * ratio}
                      x2={chartWidth}
                      y2={chartHeight * ratio}
                      stroke="currentColor"
                      strokeOpacity="0.1"
                      strokeDasharray="4"
                    />
                    <text
                      x={5}
                      y={chartHeight * ratio - 5}
                      fill="currentColor"
                      fontSize="10"
                      opacity="0.5"
                    >
                      ${(maxPrice - priceRange * ratio).toFixed(2)}
                    </text>
                  </g>
                ))}

                {/* Candlesticks */}
                {candles.map((candle, index) => {
                  const x = index * candleWidth;
                  const isGreen = candle.close > candle.open;
                  const yHigh = getYPosition(candle.high);
                  const yLow = getYPosition(candle.low);
                  const yOpen = getYPosition(candle.open);
                  const yClose = getYPosition(candle.close);
                  const bodyHeight = Math.abs(yClose - yOpen);

                  return (
                    <g key={index}>
                      {/* Wick */}
                      <line
                        x1={x + candleWidth / 2}
                        y1={yHigh}
                        x2={x + candleWidth / 2}
                        y2={yLow}
                        stroke={isGreen ? '#22c55e' : '#ef4444'}
                        strokeWidth="1"
                      />
                      {/* Body */}
                      <rect
                        x={x + candleWidth * 0.2}
                        y={Math.min(yOpen, yClose)}
                        width={candleWidth * 0.6}
                        height={bodyHeight || 1}
                        fill={isGreen ? '#22c55e' : '#ef4444'}
                        opacity="0.8"
                      />
                    </g>
                  );
                })}

                {/* Breakout markers */}
                {alphaBreakouts.map((breakout, index) => {
                  const candleIndex = candles.findIndex(c => c.timestamp === breakout.timestamp);
                  if (candleIndex === -1) return null;
                  
                  const x = candleIndex * candleWidth + candleWidth / 2;
                  const y = getYPosition(breakout.price);
                  
                  return (
                    <g key={`breakout-${index}`}>
                      <circle
                        cx={x}
                        cy={y}
                        r="4"
                        fill={breakout.type === 'bullish' ? '#22c55e' : '#ef4444'}
                        stroke="white"
                        strokeWidth="2"
                      />
                      <text
                        x={x}
                        y={y - 10}
                        fill={breakout.type === 'bullish' ? '#22c55e' : '#ef4444'}
                        fontSize="12"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {breakout.type === 'bullish' ? '↑' : '↓'}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Chart Legend */}
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded" />
                <span className="text-muted-foreground">Bullish (Close &gt; Open)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded" />
                <span className="text-muted-foreground">Bearish (Close &lt; Open)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="text-muted-foreground">Alpha Breakout</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-background/50 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Open</div>
                <div className="font-medium">${candles[candles.length - 1]?.open.toFixed(2) || '-'}</div>
              </div>
              <div className="p-3 bg-background/50 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">High</div>
                <div className="font-medium text-green-400">${maxPrice.toFixed(2)}</div>
              </div>
              <div className="p-3 bg-background/50 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Low</div>
                <div className="font-medium text-red-400">${minPrice.toFixed(2)}</div>
              </div>
              <div className="p-3 bg-background/50 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Volume</div>
                <div className="font-medium">{(candles[candles.length - 1]?.volume / 1000000).toFixed(2)}M</div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
