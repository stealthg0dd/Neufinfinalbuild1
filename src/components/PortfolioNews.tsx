import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Newspaper, ExternalLink, RefreshCw, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { projectId } from '../utils/supabase/info';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

interface PortfolioNewsProps {
  accessToken: string;
}

export function PortfolioNews({ accessToken }: PortfolioNewsProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNews = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-22c8dcd8/news/portfolio`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setArticles(data.articles?.slice(0, 6) || []);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [accessToken]);

  const handleRefresh = () => {
    setIsLoading(true);
    fetchNews();
  };

  if (isLoading && articles.length === 0) {
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
    <Card className="border-blue-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Newspaper className="h-5 w-5 text-blue-400" />
            <span>Portfolio News Feed</span>
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
      <CardContent>
        <div className="space-y-4">
          {articles.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-card/50 rounded-lg border border-border/50 hover:border-blue-500/50 hover:bg-card/80 transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <h4 className="font-medium group-hover:text-blue-400 transition-colors line-clamp-2">
                      {article.title}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {article.description}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {article.source.name}
                      </Badge>
                      <span>
                        {new Date(article.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-blue-400 transition-colors flex-shrink-0" />
                </div>
              </a>
            </motion.div>
          ))}
          
          {articles.length === 0 && !isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              <Newspaper className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No news articles found for your portfolio</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
