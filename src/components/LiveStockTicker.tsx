import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { fetchMultipleQuotes, type StockQuote } from '../utils/stockService';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  source?: StockQuote['source'];
  reason?: string;
}

const STOCK_SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 'AMZN', 'META', 'NFLX'];

export function LiveStockTicker() {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        // Use the stock service to fetch quotes with automatic fallback
        const quotes = await fetchMultipleQuotes(STOCK_SYMBOLS);
        
        // Convert to StockData format
        const stockData: StockData[] = quotes.map(quote => ({
          symbol: quote.symbol,
          price: quote.price,
          change: quote.change,
          changePercent: quote.changePercent,
          source: quote.source,
          reason: quote.reason,
        }));

        setStocks(stockData.filter(stock => stock.price > 0));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setStocks([
          { symbol: 'AAPL', price: 185.25, change: 0, changePercent: 0, source: 'demo', reason: 'Live quotes unavailable' },
          { symbol: 'GOOGL', price: 142.80, change: 0, changePercent: 0, source: 'demo', reason: 'Live quotes unavailable' },
          { symbol: 'MSFT', price: 378.90, change: 0, changePercent: 0, source: 'demo', reason: 'Live quotes unavailable' },
          { symbol: 'TSLA', price: 245.67, change: 0, changePercent: 0, source: 'demo', reason: 'Live quotes unavailable' },
          { symbol: 'NVDA', price: 735.50, change: 0, changePercent: 0, source: 'demo', reason: 'Live quotes unavailable' },
          { symbol: 'AMZN', price: 155.20, change: 0, changePercent: 0, source: 'demo', reason: 'Live quotes unavailable' }
        ]);
        setIsLoading(false);
      }
    };

    fetchStockData();
    
    // Update every 30 seconds
    const interval = setInterval(fetchStockData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full bg-muted/30 border-y border-border py-3 overflow-hidden">
        <div className="flex animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3 mr-8">
              <div className="h-4 w-12 bg-muted rounded"></div>
              <div className="h-4 w-16 bg-muted rounded"></div>
              <div className="h-4 w-12 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isDemo = stocks.some(s => s.source === 'demo');

  return (
    <div className="w-full bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 border-y border-purple-500/20 py-3 overflow-hidden relative">
      {isDemo && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-yellow-400 border border-yellow-500/30 bg-yellow-500/10 px-2 py-1 rounded">
          DEMO
        </div>
      )}
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ['0%', '-100%'] }}
        transition={{
          duration: 60,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        {/* Duplicate the stocks array to create seamless loop */}
        {[...stocks, ...stocks].map((stock, index) => (
          <div
            key={`${stock.symbol}-${index}`}
            className="flex items-center space-x-2 mr-8 px-4"
          >
            <span className="font-semibold text-sm text-purple-400">
              {stock.symbol}
            </span>
            <span className="text-sm font-medium" style={{ color: 'var(--heading-secondary)' }}>
              ${stock.price.toFixed(2)}
            </span>
            <div className={`flex items-center space-x-1 text-xs ${
              stock.change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {stock.change >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>
                {stock.change >= 0 ? '+' : ''}
                {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        ))}
      </motion.div>
      
      {/* Gradient fade effects */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
    </div>
  );
}