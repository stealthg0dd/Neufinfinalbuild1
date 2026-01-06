import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Shield, 
  TrendingUp, 
  Brain, 
  Target, 
  Eye,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Activity,
  Zap,
  Users,
  PlayCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import neufinDashboardImage from 'figma:asset/ee3e0970c3bf4d58e7a445b175b3f23c4b8de039.png';

const journeyStages = [
  {
    id: 'login',
    title: 'Portfolio Dashboard',
    icon: <Shield className="w-5 h-5" />,
    content: {
      portfolioHealth: 'Neutral',
      alert: 'Fed Rate Decision Tomorrow - High Impact Expected',
      sentimentValue: '72% Bullish',
      biasValue: 'Medium Risk',
      twinValue: '8.7 Alpha Score',
      recommendation: 'Consider defensive hedges for tech positions ahead of Fed announcement'
    }
  },
  {
    id: 'context',
    title: 'Market Context',
    icon: <Eye className="w-5 h-5" />,
    content: {
      timeline: [
        { time: '2 hours ago', event: 'AAPL sentiment spike (+15%)', impact: 'Your holdings up 2.1%' },
        { time: '4 hours ago', event: 'Disposition effect detected', impact: 'Holding TSLA 23% too long' },
        { time: '6 hours ago', event: 'Fed rate simulation', impact: 'Projected -12% downside risk' }
      ],
      recommendation: 'Your bias-adjusted twin suggests reducing growth exposure by 15%'
    }
  },
  {
    id: 'sentiment',
    title: 'Sentiment Intelligence',
    icon: <TrendingUp className="w-5 h-5" />,
    content: {
      topSentiments: [
        { ticker: 'AAPL', score: 8.4, confidence: 87, rationale: 'AI partnership rumors driving optimism' },
        { ticker: 'TSLA', score: 6.1, confidence: 74, rationale: 'Production concerns weighing on sentiment' },
        { ticker: 'NVDA', score: 9.2, confidence: 91, rationale: 'Datacenter demand exceeding expectations' }
      ],
      recommendation: 'High confidence bullish signal on NVDA - consider increasing position'
    }
  },
  {
    id: 'bias',
    title: 'Bias Detection',
    icon: <Brain className="w-5 h-5" />,
    content: {
      activeBiases: [
        { name: 'Disposition Effect', score: 8.1, cost: '-2.3% annual return', intervention: 'Enable 24h cooling period' },
        { name: 'Confirmation Bias', score: 6.7, cost: '-1.1% annual return', intervention: 'Diversify news sources' },
        { name: 'Anchoring Bias', score: 5.9, cost: '-0.8% annual return', intervention: 'Auto-update price targets' }
      ],
      recommendation: 'Implementing bias controls could improve returns by 4.2% annually'
    }
  },
  {
    id: 'twin',
    title: 'Digital Twin Simulation',
    icon: <Target className="w-5 h-5" />,
    content: {
      scenarios: [
        { name: 'Rate Shock', probability: 'Low 15%', impact: '-8.2%', action: 'Increase bond allocation' },
        { name: 'Tech Rotation', probability: 'Medium 45%', impact: '-4.1%', action: 'Add defensive positions' },
        { name: 'Growth Rally', probability: 'High 60%', impact: '+12.3%', action: 'Maintain current allocation' }
      ],
      recommendation: 'Deploy protective puts on tech holdings - 73% probability of outperformance'
    }
  },
  {
    id: 'action',
    title: 'Execute & Monitor',
    icon: <CheckCircle className="w-5 h-5" />,
    content: {
      pendingActions: [
        { action: 'Reduce TSLA position by 30%', confidence: '89%', rationale: 'Bias correction + sentiment shift' },
        { action: 'Add QQQ puts (2% allocation)', confidence: '73%', rationale: 'Fed risk hedge' },
        { action: 'Increase cash to 8%', confidence: '65%', rationale: 'Opportunity positioning' }
      ],
      recommendation: 'Execute top-confidence trade first - TSLA reduction has highest expected value'
    }
  }
];

export function UserJourney() {
  const [activeStage, setActiveStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const playJourney = () => {
    setIsPlaying(true);
    setActiveStage(0);
    
    const interval = setInterval(() => {
      setActiveStage(prev => {
        if (prev >= journeyStages.length - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 3000);
  };

  const LoginStage = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Portfolio Health Overview */}
      <Card className="border-green-500/30 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              Portfolio Health
            </CardTitle>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400">
              {journeyStages[0].content.portfolioHealth}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-green-500">$127,450</div>
              <div className="text-sm text-muted-foreground">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-blue-500">+2.3%</div>
              <div className="text-sm text-muted-foreground">24h Change</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-purple-500">8.7</div>
              <div className="text-sm text-muted-foreground">Alpha Score</div>
            </div>
          </div>
          
          {/* Alert */}
          <div className="flex items-center gap-2 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg mb-4">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-orange-500">
              {journeyStages[0].content.alert}
            </span>
          </div>
          
          {/* Action Buttons with Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <Button variant="outline" className="h-auto p-4 flex-col items-start">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="font-medium">Sentiment Feed</span>
              </div>
              <span className="text-sm text-muted-foreground">{journeyStages[0].content.sentimentValue}</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col items-start">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-4 h-4 text-purple-500" />
                <span className="font-medium">Bias Snapshot</span>
              </div>
              <span className="text-sm text-muted-foreground">{journeyStages[0].content.biasValue}</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col items-start">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-green-500" />
                <span className="font-medium">Digital Twin</span>
              </div>
              <span className="text-sm text-muted-foreground">{journeyStages[0].content.twinValue}</span>
            </Button>
          </div>
          
          {/* Recommendation */}
          <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <Zap className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <div className="font-medium text-blue-500 mb-1">Recommended Action</div>
              <div className="text-sm text-muted-foreground">{journeyStages[0].content.recommendation}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const ContextStage = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-500" />
            Why You Should Care Right Now
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {journeyStages[1].content.timeline.map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-3 border border-border rounded-lg">
                <div className="text-xs text-muted-foreground mt-1 min-w-[80px]">{item.time}</div>
                <div className="flex-1">
                  <div className="font-medium mb-1">{item.event}</div>
                  <div className="text-sm text-muted-foreground">{item.impact}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground mt-1" />
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <Target className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <div className="font-medium text-green-500 mb-1">AI Recommendation</div>
              <div className="text-sm text-muted-foreground">{journeyStages[1].content.recommendation}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const SentimentStage = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Real-Time Market Sentiment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {journeyStages[2].content.topSentiments.map((sentiment, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="font-mono">{sentiment.ticker}</Badge>
                  <div>
                    <div className="font-medium">Score: {sentiment.score}/10</div>
                    <div className="text-sm text-muted-foreground">{sentiment.rationale}</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`${sentiment.score > 7 ? 'bg-green-500/20 text-green-400' : sentiment.score > 5 ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'}`}>
                    {sentiment.confidence}% confidence
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <div className="font-medium text-green-500 mb-1">High Confidence Signal</div>
              <div className="text-sm text-muted-foreground">{journeyStages[2].content.recommendation}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const BiasStage = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            Behavioral Bias Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {journeyStages[3].content.activeBiases.map((bias, index) => (
              <div key={index} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{bias.name}</div>
                  <Badge variant="destructive">Risk Score: {bias.score}/10</Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  Annual cost: {bias.cost}
                </div>
                <div className="text-sm bg-blue-500/10 p-2 rounded border border-blue-500/30">
                  <strong>Intervention:</strong> {bias.intervention}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex items-start gap-3 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <Brain className="w-5 h-5 text-purple-500 mt-0.5" />
            <div>
              <div className="font-medium text-purple-500 mb-1">Optimization Opportunity</div>
              <div className="text-sm text-muted-foreground">{journeyStages[3].content.recommendation}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const TwinStage = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-500" />
            Scenario Simulation Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {journeyStages[4].content.scenarios.map((scenario, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <div className="font-medium">{scenario.name}</div>
                  <div className="text-sm text-muted-foreground">{scenario.action}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium mb-1">{scenario.impact}</div>
                  <Badge variant="outline">{scenario.probability}</Badge>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <Target className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <div className="font-medium text-green-500 mb-1">Optimal Strategy</div>
              <div className="text-sm text-muted-foreground">{journeyStages[4].content.recommendation}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const ActionStage = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Ready to Execute
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {journeyStages[5].content.pendingActions.map((action, index) => (
              <div key={index} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{action.action}</div>
                  <Badge className="bg-green-500/20 text-green-400">
                    {action.confidence} confidence
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-3">{action.rationale}</div>
                <Button size="sm" className="w-full">
                  Execute Trade
                </Button>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <div className="font-medium text-blue-500 mb-1">Priority Action</div>
              <div className="text-sm text-muted-foreground">{journeyStages[5].content.recommendation}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const stages = [LoginStage, ContextStage, SentimentStage, BiasStage, TwinStage, ActionStage];
  const CurrentStage = stages[activeStage];

  return (
    <div className="space-y-6">
      {/* Dashboard Visual Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative mb-8"
      >
        <div className="relative h-32 lg:h-40 rounded-xl overflow-hidden border border-purple-500/20">
          <img
            src={neufinDashboardImage}
            alt="Interactive Neufin AI Dashboard Journey"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/60 via-transparent to-blue-600/60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl lg:text-2xl font-bold text-white mb-1">
                Interactive Dashboard Demo
              </h2>
              <p className="text-sm text-white/90">
                See how Neural Twin AI guides your trading decisions
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="text-center space-y-4">
        <h1>Your Intelligent Investment Journey</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Experience the complete flow from portfolio analysis to actionable recommendations
        </p>
        
        <div className="flex items-center justify-center gap-4">
          <Button 
            onClick={playJourney} 
            disabled={isPlaying}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            {isPlaying ? 'Playing Journey...' : 'Play Full Journey'}
          </Button>
          
          <div className="flex items-center gap-2">
            {journeyStages.map((_, index) => (
              <Button
                key={index}
                variant={activeStage === index ? "default" : "outline"}
                size="sm"
                className="w-10 h-10 p-0"
                onClick={() => setActiveStage(index)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Stage Navigation */}
      <div className="flex items-center justify-center space-x-2 py-4">
        {journeyStages.map((stage, index) => (
          <div key={stage.id} className="flex items-center">
            <motion.div
              className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all duration-200 ${
                activeStage === index 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveStage(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {stage.icon}
              <span className="hidden sm:inline font-medium">{stage.title}</span>
            </motion.div>
            {index < journeyStages.length - 1 && (
              <ArrowRight className="w-4 h-4 text-muted-foreground mx-2" />
            )}
          </div>
        ))}
      </div>

      {/* Current Stage Content */}
      <div className="min-h-[400px]">
        <CurrentStage />
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          disabled={activeStage === 0}
          onClick={() => setActiveStage(prev => Math.max(0, prev - 1))}
        >
          Previous
        </Button>
        
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-500" />
          <span className="text-sm text-muted-foreground">
            {activeStage + 1} of {journeyStages.length} stages
          </span>
        </div>
        
        <Button 
          disabled={activeStage === journeyStages.length - 1}
          onClick={() => setActiveStage(prev => Math.min(journeyStages.length - 1, prev + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
}