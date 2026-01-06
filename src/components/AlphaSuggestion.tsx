import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Star, TrendingUp, Brain, Target, Zap, Info, ArrowRight, Clock, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const todaysSuggestion = {
  ticker: 'AMD',
  company: 'Advanced Micro Devices',
  action: 'LONG',
  entryPrice: '$142.50',
  targetPrice: '$158.00',
  stopLoss: '$135.00',
  confidence: 95,
  timeframe: '2-3 weeks',
  potentialReturn: '+10.9%',
  riskReward: '1:2.1',
  
  analysis: {
    sentiment: {
      score: 78,
      trend: 'Bullish',
      sources: ['Social Media: +12%', 'News Sentiment: +8%', 'Options Flow: Bullish'],
      description: 'Strong positive sentiment driven by AI chip demand and data center growth'
    },
    technical: {
      score: 85,
      signals: ['Breakout above $140 resistance', 'Volume surge (+40%)', 'RSI oversold recovery'],
      description: 'Technical breakout with strong momentum and volume confirmation'
    },
    fundamental: {
      score: 82,
      factors: ['Q4 earnings beat expectations', 'Data center revenue +38%', 'AI chip pipeline strong'],
      description: 'Strong fundamentals with accelerating growth in high-margin segments'
    },
    biasReduction: {
      score: 92,
      mitigatedBiases: ['Confirmation Bias', 'Recency Bias', 'Anchoring'],
      description: 'AI removed emotional decision-making and historical anchoring effects'
    }
  },
  
  catalysts: [
    { event: 'CES 2024 Keynote', date: 'Tomorrow', impact: 'High', description: 'Expected AI chip announcements' },
    { event: 'Data Center Conference', date: 'Next Week', impact: 'Medium', description: 'Partnership announcements likely' },
    { event: 'Q1 Guidance Update', date: '2 weeks', impact: 'High', description: 'Potential upward revision' }
  ],
  
  risks: [
    { factor: 'Market Volatility', probability: 'Medium', impact: 'Moderate' },
    { factor: 'Sector Rotation', probability: 'Low', impact: 'High' },
    { factor: 'Earnings Disappointment', probability: 'Low', impact: 'High' }
  ]
};

const AnalysisCard = ({ title, score, children }: { title: string; score: number; children: React.ReactNode }) => (
  <div className="p-4 bg-muted/30 rounded-lg space-y-3">
    <div className="flex items-center justify-between">
      <h4 className="font-medium">{title}</h4>
      <div className="flex items-center space-x-2">
        <Progress value={score} className="w-16 h-2" />
        <span className={`text-sm font-medium ${
          score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400'
        }`}>
          {score}%
        </span>
      </div>
    </div>
    {children}
  </div>
);

export function AlphaSuggestion() {
  const overallScore = Object.values(todaysSuggestion.analysis).reduce((sum, item) => sum + item.score, 0) / 4;

  return (
    <Card className="bg-card/50 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5" />
      <motion.div
        className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3] 
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
            >
              <Brain className="h-5 w-5 text-purple-400" />
            </motion.div>
            <CardTitle>Today's Alpha Suggestion</CardTitle>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Info className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">AI-Powered Alpha Discovery</h4>
                  <p className="text-sm text-muted-foreground">
                    Daily recommendation combining sentiment analysis, technical patterns, 
                    and bias-reduced decision making for maximum alpha potential.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Badge className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400 border-purple-500/30">
                <Star className="h-3 w-3 mr-1" />
                AI Confidence: {todaysSuggestion.confidence}%
              </Badge>
            </motion.div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 relative z-10">
        {/* Main Suggestion */}
        <motion.div 
          className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg"
          animate={{ 
            boxShadow: ['0 0 0 0 rgba(34, 197, 94, 0)', '0 0 0 4px rgba(34, 197, 94, 0.1)', '0 0 0 0 rgba(34, 197, 94, 0)']
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold">{todaysSuggestion.action} {todaysSuggestion.ticker}</h3>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    {todaysSuggestion.action}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{todaysSuggestion.company}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-2xl font-bold text-green-400">{todaysSuggestion.potentialReturn}</p>
              <p className="text-xs text-muted-foreground">{todaysSuggestion.timeframe}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 text-center text-sm">
            <div>
              <p className="text-muted-foreground">Entry</p>
              <p className="font-medium">{todaysSuggestion.entryPrice}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Target</p>
              <p className="font-medium text-green-400">{todaysSuggestion.targetPrice}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Stop Loss</p>
              <p className="font-medium text-red-400">{todaysSuggestion.stopLoss}</p>
            </div>
            <div>
              <p className="text-muted-foreground">R:R</p>
              <p className="font-medium text-blue-400">{todaysSuggestion.riskReward}</p>
            </div>
          </div>
        </motion.div>

        {/* Analysis Tabs */}
        <Tabs defaultValue="sentiment" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="fundamental">Fundamental</TabsTrigger>
            <TabsTrigger value="bias">AI Bias Check</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sentiment">
            <AnalysisCard title="Sentiment Analysis" score={todaysSuggestion.analysis.sentiment.score}>
              <p className="text-sm text-muted-foreground mb-2">
                {todaysSuggestion.analysis.sentiment.description}
              </p>
              <div className="space-y-1">
                {todaysSuggestion.analysis.sentiment.sources.map((source, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    <span>{source}</span>
                  </div>
                ))}
              </div>
            </AnalysisCard>
          </TabsContent>
          
          <TabsContent value="technical">
            <AnalysisCard title="Technical Analysis" score={todaysSuggestion.analysis.technical.score}>
              <p className="text-sm text-muted-foreground mb-2">
                {todaysSuggestion.analysis.technical.description}
              </p>
              <div className="space-y-1">
                {todaysSuggestion.analysis.technical.signals.map((signal, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    <span>{signal}</span>
                  </div>
                ))}
              </div>
            </AnalysisCard>
          </TabsContent>
          
          <TabsContent value="fundamental">
            <AnalysisCard title="Fundamental Analysis" score={todaysSuggestion.analysis.fundamental.score}>
              <p className="text-sm text-muted-foreground mb-2">
                {todaysSuggestion.analysis.fundamental.description}
              </p>
              <div className="space-y-1">
                {todaysSuggestion.analysis.fundamental.factors.map((factor, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </AnalysisCard>
          </TabsContent>
          
          <TabsContent value="bias">
            <AnalysisCard title="Bias Reduction Score" score={todaysSuggestion.analysis.biasReduction.score}>
              <p className="text-sm text-muted-foreground mb-2">
                {todaysSuggestion.analysis.biasReduction.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {todaysSuggestion.analysis.biasReduction.mitigatedBiases.map((bias, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                    ✓ {bias}
                  </Badge>
                ))}
              </div>
            </AnalysisCard>
          </TabsContent>
        </Tabs>

        {/* Catalysts */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center space-x-2">
            <Clock className="h-4 w-4 text-yellow-400" />
            <span>Upcoming Catalysts</span>
          </h4>
          
          <div className="space-y-2">
            {todaysSuggestion.catalysts.map((catalyst, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted/20 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{catalyst.event}</p>
                  <p className="text-xs text-muted-foreground">{catalyst.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      catalyst.impact === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {catalyst.impact}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{catalyst.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <Target className="h-4 w-4 mr-2" />
              Execute Trade
            </Button>
          </motion.div>
          
          <Button variant="outline" className="w-full">
            <Shield className="h-4 w-4 mr-2" />
            Set Alert Only
          </Button>
        </div>

        {/* Overall Score */}
        <motion.div 
          className="p-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg text-center"
          animate={{ scale: [1, 1.01, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="flex items-center justify-center space-x-2 mb-1">
            <Zap className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-400">Overall Alpha Score</span>
          </div>
          <p className="text-2xl font-bold text-purple-400">{overallScore.toFixed(0)}/100</p>
          <p className="text-xs text-muted-foreground">AI-computed probability of alpha generation</p>
        </motion.div>
      </CardContent>
    </Card>
  );
}