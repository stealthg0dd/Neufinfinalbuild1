import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { 
  BookOpen, 
  TrendingUp, 
  Brain, 
  Shield, 
  Lightbulb,
  BarChart3,
  Target,
  Zap,
  FileText
} from 'lucide-react';

const knowledgeArticles = [
  {
    category: 'AI & Machine Learning',
    icon: Brain,
    color: 'purple',
    articles: [
      {
        title: 'How Neural Twin AI Eliminates Cognitive Biases in Trading',
        description: 'Discover how our proprietary Neural Twin Technology™ uses deep learning to create a bias-free digital representation of your investment strategy, analyzing millions of market scenarios to identify optimal decision paths.',
        keywords: ['Neural Twin AI', 'Cognitive Bias Detection', 'Machine Learning Trading', 'AI Portfolio Management']
      },
      {
        title: 'Understanding Loss Aversion: The $8,400 Annual Cost',
        description: 'Loss aversion causes investors to hold losing positions 40% longer than optimal. Learn how Neufin quantifies this bias and provides actionable interventions to recover an average of $8,400 annually.',
        keywords: ['Loss Aversion', 'Behavioral Finance', 'Trading Psychology', 'Portfolio Optimization']
      }
    ]
  },
  {
    category: 'Risk Management',
    icon: Shield,
    color: 'blue',
    articles: [
      {
        title: 'Real-Time Portfolio Risk Assessment with AI',
        description: 'Neufin analyzes 50,000+ news sources, market indicators, and sentiment data to provide real-time risk scores. Our system detects portfolio vulnerabilities 2.4 hours before market moves, enabling proactive risk mitigation.',
        keywords: ['Risk Management', 'Portfolio Risk', 'Real-Time Analysis', 'Market Risk Assessment']
      },
      {
        title: 'Stress Testing: How Your Twin Performs in Market Crashes',
        description: 'We simulate 10,000 market scenarios including crashes, stagflation, and liquidity crises. Historical data shows Neural Twins outperform baseline portfolios by 18% during market downturns.',
        keywords: ['Stress Testing', 'Market Crash', 'Portfolio Simulation', 'Risk Modeling']
      }
    ]
  },
  {
    category: 'Sentiment Analysis',
    icon: TrendingUp,
    color: 'green',
    articles: [
      {
        title: 'Predictive Sentiment Analysis: 73% Accuracy Rate',
        description: 'Our sentiment engine processes financial news, social media, and analyst reports from 50,000 sources. With 73% accuracy over 6 months and 0.12% false positive rate, our signals provide actionable trading insights.',
        keywords: ['Sentiment Analysis', 'Market Sentiment', 'Trading Signals', 'Predictive Analytics']
      },
      {
        title: 'From Sentiment to Action: Automated Signal Generation',
        description: 'Learn how Neufin converts raw sentiment data into actionable buy/sell/hold signals. Our multi-factor model combines sentiment, technical indicators, and bias-corrected analysis for institutional-grade recommendations.',
        keywords: ['Trading Signals', 'Automated Trading', 'Signal Generation', 'Algorithmic Trading']
      }
    ]
  },
  {
    category: 'Performance Metrics',
    icon: BarChart3,
    color: 'orange',
    articles: [
      {
        title: 'Alpha Score Methodology: Quantifying Missed Opportunities',
        description: 'Your Alpha Score represents the annualized return difference between your actual performance and your Neural Twin\'s optimal strategy. We track 47 cognitive biases and quantify their dollar impact on your portfolio.',
        keywords: ['Alpha Score', 'Performance Metrics', 'Portfolio Performance', 'Investment Returns']
      },
      {
        title: 'Sharpe Ratio Improvement: +0.34 Average Gain',
        description: 'A/B testing with 500+ users shows an average Sharpe ratio improvement of 0.34 for investors following our debiasing protocol. This translates to better risk-adjusted returns and more consistent performance.',
        keywords: ['Sharpe Ratio', 'Risk-Adjusted Returns', 'Portfolio Optimization', 'Investment Performance']
      }
    ]
  }
];

export function KnowledgeHub() {
  return (
    <section className="py-20 bg-gradient-to-br from-muted/50 to-background" id="knowledge-hub">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400 border-purple-500/30 px-4 py-2">
            <BookOpen className="h-4 w-4 mr-2" />
            Knowledge Hub
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: 'var(--heading-primary)' }}>
            Deep Dive into
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent block">
              AI-Powered Investment Intelligence
            </span>
          </h2>
          <p className="text-xl max-w-3xl mx-auto testimonial-text">
            Comprehensive guides, research, and technical documentation on how Neufin transforms investment decision-making through artificial intelligence and behavioral finance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {knowledgeArticles.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={`h-full border-${category.color}-500/20 hover:border-${category.color}-500/40 transition-all bg-gradient-to-br from-${category.color}-500/5 to-background`}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-3 rounded-lg bg-${category.color}-500/20`}>
                      <category.icon className={`h-6 w-6 text-${category.color}-400`} />
                    </div>
                    <CardTitle className="text-xl">{category.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {category.articles.map((article, articleIndex) => (
                    <article key={articleIndex} className="space-y-3">
                      <h3 className="text-lg font-semibold" style={{ color: 'var(--heading-secondary)' }}>
                        {article.title}
                      </h3>
                      <p className="text-sm testimonial-text leading-relaxed">
                        {article.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {article.keywords.map((keyword, keywordIndex) => (
                          <Badge 
                            key={keywordIndex} 
                            variant="outline" 
                            className={`text-xs text-${category.color}-400 border-${category.color}-500/30`}
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </article>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats Section for SEO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 p-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20"
        >
          <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--heading-secondary)' }}>
            Platform Performance Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">50,000+</div>
              <div className="text-sm text-muted-foreground">News Sources Analyzed Daily</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">73%</div>
              <div className="text-sm text-muted-foreground">Signal Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">47</div>
              <div className="text-sm text-muted-foreground">Cognitive Biases Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">+18%</div>
              <div className="text-sm text-muted-foreground">Crash Scenario Outperformance</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
