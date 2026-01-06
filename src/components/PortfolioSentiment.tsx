import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Brain, TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { projectId } from '../utils/supabase/info';

interface Sentiment {
  symbol: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  newsCount: number;
}

interface PortfolioSentimentProps {
  accessToken: string;
}

export function PortfolioSentiment({ accessToken }: PortfolioSentimentProps) {
  const [sentiments, setSentiments] = useState<Sentiment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [overallSentiment, setOverallSentiment] = useState<{
    label: string;
    score: number;
    color: string;
  }>({ label: 'Neutral', score: 0, color: 'text-gray-400' });

  const fetchSentiment = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-22c8dcd8/sentiment/portfolio`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSentiments(data.sentiments || []);
        
        // Calculate overall sentiment
        if (data.sentiments && data.sentiments.length > 0) {
          const avgScore = data.sentiments.reduce((sum: number, s: Sentiment) => 
            sum + s.score, 0
          ) / data.sentiments.length;
          
          const positiveCount = data.sentiments.filter((s: Sentiment) => 
            s.sentiment === 'positive'
          ).length;
          
          const negativeCount = data.sentiments.filter((s: Sentiment) => 
            s.sentiment === 'negative'
          ).length;
          
          let label = 'Neutral';
          let color = 'text-gray-400';
          
          if (positiveCount > negativeCount) {
            label = 'Bullish';
            color = 'text-green-400';
          } else if (negativeCount > positiveCount) {
            label = 'Bearish';
            color = 'text-red-400';
          }
          
          setOverallSentiment({ label, score: avgScore, color });
        }
      }
    } catch (error) {
      console.error('Error fetching sentiment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSentiment();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchSentiment, 300000);
    
    return () => clearInterval(interval);
  }, [accessToken]);

  const handleRefresh = () => {
    setIsLoading(true);
    fetchSentiment();
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'negative':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (isLoading && sentiments.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-green-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-green-400" />
            <span>AI Sentiment Analysis</span>
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
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Sentiment */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-green-500/10 rounded-lg border border-purple-500/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-2">Overall Market Sentiment</div>
              <div className={`text-3xl font-bold ${overallSentiment.color}`}>
                {overallSentiment.label}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Confidence: {(overallSentiment.score * 100).toFixed(0)}%
              </div>
            </div>
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
              <Brain className={`h-12 w-12 ${overallSentiment.color}`} />
            </div>
          </div>
        </motion.div>

        {/* Individual Stock Sentiments */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Stock Sentiment Breakdown</h4>
          {sentiments.map((sentiment, index) => (
            <motion.div
              key={sentiment.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-card/50 rounded-lg border border-border/50 hover:border-green-500/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="font-mono">
                    {sentiment.symbol}
                  </Badge>
                  {getSentimentIcon(sentiment.sentiment)}
                  <Badge className={getSentimentColor(sentiment.sentiment)}>
                    {sentiment.sentiment.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-right">
                    <div className="font-medium">
                      {(sentiment.score * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Confidence</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{sentiment.newsCount}</div>
                    <div className="text-xs text-muted-foreground">Articles</div>
                  </div>
                </div>
              </div>

              {/* Sentiment Bar */}
              <div className="mt-3 h-2 bg-background rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${sentiment.score * 100}%` }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                  className={`h-full ${
                    sentiment.sentiment === 'positive' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : sentiment.sentiment === 'negative'
                      ? 'bg-gradient-to-r from-red-500 to-rose-500'
                      : 'bg-gradient-to-r from-gray-500 to-slate-500'
                  }`}
                />
              </div>
            </motion.div>
          ))}
          
          {sentiments.length === 0 && !isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No sentiment data available for your portfolio</p>
            </div>
          )}
        </div>

        {/* Powered by Badge */}
        <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
          <Brain className="h-3 w-3" />
          <span>Powered by Hugging Face FinBERT</span>
        </div>
      </CardContent>
    </Card>
  );
}
