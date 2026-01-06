import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Brain,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Gauge,
  Activity,
  TrendingUp,
} from 'lucide-react';

interface StrategicSectionsProps {
  onOpenEarlyAccess: () => void;
}

export function StrategicSections({ onOpenEarlyAccess }: StrategicSectionsProps) {
  return (
    <>
      {/* The Problem Section - Emotional Hook */}
      <section className="py-20 bg-gradient-to-br from-red-500/5 via-orange-500/5 to-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img
            src="https://images.unsplash.com/photo-1762279389020-eeeb69c25813?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9jayUyMG1hcmtldCUyMGxvc3MlMjBjaGFydHxlbnwxfHx8fDE3NjcwODc4MzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Stock market loss chart"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: 'var(--heading-primary)' }}>
              You're a Disciplined Investor.
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent block">
                But Your Brain Isn't.
              </span>
            </h2>
            <p className="text-xl max-w-3xl mx-auto testimonial-text">
              Even the smartest investors fall victim to predictable cognitive biases. Here's what it's costing you:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: 'Loss Aversion',
                example: 'You held TSLA down 40% for 8 months',
                cost: '$4,200',
                color: 'red',
                icon: '📉',
                description: 'Fear of realizing losses kept you in a declining position',
              },
              {
                title: 'Disposition Effect',
                example: "You sold NVDA at +15%, it's now +180%",
                cost: '$12,400',
                color: 'orange',
                icon: '💸',
                description: 'You took profits too early while winners kept running',
              },
              {
                title: 'Herding Bias',
                example: 'You bought META at peak with everyone else',
                cost: '$2,800',
                color: 'yellow',
                icon: '👥',
                description: 'FOMO drove you to buy at the worst possible time',
              },
            ].map((bias, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/30 hover:border-red-500/50 transition-all group">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4 text-center">{bias.icon}</div>
                    <h3 className="text-xl font-bold mb-3 text-center" style={{ color: 'var(--heading-secondary)' }}>
                      {bias.title}
                    </h3>
                    <div className="bg-background/50 rounded-lg p-4 mb-4 border border-border">
                      <p className="text-sm italic testimonial-text mb-2">"{bias.example}"</p>
                      <div className="text-2xl font-bold text-red-400 text-center">Cost: {bias.cost}</div>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">{bias.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Badge className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400 border-purple-500/30 px-6 py-3 text-lg">
              <Brain className="h-5 w-5 mr-2" />
              These aren't mistakes. They're predictable cognitive biases.
            </Badge>
          </motion.div>
        </div>
      </section>

      {/* The Solution - Interactive Demo Preview */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-background" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400 border-purple-500/30 px-4 py-2">
              <Brain className="h-4 w-4 mr-2" />
              The Solution
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: 'var(--heading-primary)' }}>
              Meet Your Neural Twin:
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent block">
                The Rational Version of You
              </span>
            </h2>
            <p className="text-xl max-w-3xl mx-auto testimonial-text">
              Watch how our AI analyzes a sample portfolio in real-time
            </p>
          </motion.div>

          {/* Interactive Demo Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30 overflow-hidden">
              <CardContent className="p-8">
                {/* Sample Portfolio Display */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-400" />
                    Sample Portfolio Analysis
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                    {['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA'].map((ticker, index) => (
                      <motion.div
                        key={ticker}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="bg-background/50 rounded-lg p-3 text-center border border-purple-500/20"
                      >
                        <div className="font-bold text-purple-400">{ticker}</div>
                        <div className="text-xs text-muted-foreground mt-1">Analyzing...</div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Alpha Score Reveal */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-6 mb-6"
                >
                  <div className="text-center">
                    <div className="text-sm text-green-400 mb-2">Neural Twin Analysis Complete</div>
                    <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-2">
                      Your Twin Would Earn 4.2% More Annually
                    </div>
                    <div className="text-sm text-muted-foreground">
                      That's $8,400 extra per year on a $200k portfolio
                    </div>
                  </div>
                </motion.div>

                {/* Bias Breakdown */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="mb-6"
                >
                  <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Detected Biases:</h4>
                  <div className="space-y-2">
                    {[
                      { name: 'Loss Aversion', score: 68, color: 'red' },
                      { name: 'Disposition Effect', score: 42, color: 'orange' },
                      { name: 'Confirmation Bias', score: 35, color: 'yellow' },
                    ].map((bias, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{bias.name}</span>
                            <span className="text-red-400 font-medium">{bias.score}%</span>
                          </div>
                          <div className="w-full bg-muted/50 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${bias.score}%` }}
                              transition={{ duration: 1, delay: 1.2 + index * 0.2 }}
                              className="bg-red-500 h-2 rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* First Signal */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.5 }}
                  className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-blue-400 mb-1">Signal Alert: TSLA</div>
                      <div className="text-sm testimonial-text mb-2">
                        Bearish engulfing pattern + negative sentiment spike
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Sell Signal</Badge>
                        <Badge variant="outline" className="text-xs">
                          Confidence: 87%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.8 }}
                  className="mt-8 text-center"
                >
                  <Button onClick={onOpenEarlyAccess} size="lg" className="cta-button px-8 py-4">
                    <Gauge className="h-5 w-5 mr-2" />
                    Analyze My Real Portfolio
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Three Core Modules Section */}
      <section className="py-20 bg-gradient-to-br from-muted/30 to-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: 'var(--heading-primary)' }}>
              Three Core
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent block">
                Intelligence Modules
              </span>
            </h2>
            <p className="text-xl max-w-3xl mx-auto testimonial-text">
              Institutional-grade trading intelligence powered by advanced AI
            </p>
          </motion.div>

          <div className="space-y-20">
            {/* Module 1: Sentiment Analysis Engine */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                    <Activity className="h-8 w-8 text-blue-400" />
                  </div>
                  <div>
                    <Badge className="mb-2 bg-blue-500/20 text-blue-400 border-blue-500/30">Module 1</Badge>
                    <h3 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--heading-secondary)' }}>
                      Sentiment Analysis Engine
                    </h3>
                  </div>
                </div>
                <p className="text-lg testimonial-text mb-6 leading-relaxed">
                  We analyze 50,000 news sources daily. You get actionable signals 2.4 hours before price moves.
                </p>
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-6 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-400">73%</div>
                      <div className="text-sm text-muted-foreground">Accuracy over 6 months</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-cyan-400">0.12%</div>
                      <div className="text-sm text-muted-foreground">False positive rate</div>
                    </div>
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    'Real-time sentiment heatmaps',
                    'Multi-source data aggregation',
                    'Predictive signal generation',
                    'Custom alert thresholds',
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-400" />
                      <span className="testimonial-text">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }} className="relative group">
                  <img
                    src="https://images.unsplash.com/photo-1766218326892-4b261b02a03f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBkYXRhJTIwYW5hbHlzaXN8ZW58MXx8fHwxNzY3MDg3ODMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Sentiment analysis dashboard with real-time data"
                    className="w-full h-auto rounded-xl shadow-2xl border border-blue-500/20"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/30 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-background/90 backdrop-blur-sm rounded-lg p-4 border border-blue-500/50">
                      <p className="text-sm font-medium text-blue-400">🔍 Candlestick + Sentiment Overlay</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Module 2: Bias Detection & Mitigation */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <div className="order-2 lg:order-1">
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }} className="relative group">
                  <img
                    src="https://images.unsplash.com/photo-1673255745677-e36f618550d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMHRlY2hub2xvZ3klMjBicmFpbnxlbnwxfHx8fDE3NjcwODc4MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="AI brain analyzing cognitive biases"
                    className="w-full h-auto rounded-xl shadow-2xl border border-purple-500/20"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-600/30 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-background/90 backdrop-blur-sm rounded-lg p-4 border border-purple-500/50">
                      <p className="text-sm font-medium text-purple-400">💡 Intervention Suggestions</p>
                    </div>
                  </div>
                </motion.div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    <Brain className="h-8 w-8 text-purple-400" />
                  </div>
                  <div>
                    <Badge className="mb-2 bg-purple-500/20 text-purple-400 border-purple-500/30">Module 2</Badge>
                    <h3 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--heading-secondary)' }}>
                      Bias Detection & Mitigation
                    </h3>
                  </div>
                </div>
                <p className="text-lg testimonial-text mb-6 leading-relaxed">
                  Your biases cost you 2-4% annually. We quantify every dollar and show you how to fix it.
                </p>
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-2">+0.34 Sharpe Ratio</div>
                    <div className="text-sm text-muted-foreground">
                      A/B test: Users who followed our debiasing protocol
                    </div>
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    '47 cognitive biases tracked',
                    'Real-time behavioral analysis',
                    'Personalized interventions',
                    'Dollar-cost quantification',
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-purple-400" />
                      <span className="testimonial-text">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Module 3: Digital Twin Simulator */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                    <TrendingUp className="h-8 w-8 text-green-400" />
                  </div>
                  <div>
                    <Badge className="mb-2 bg-green-500/20 text-green-400 border-green-500/30">Module 3</Badge>
                    <h3 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--heading-secondary)' }}>
                      Digital Twin Simulator
                    </h3>
                  </div>
                </div>
                <p className="text-lg testimonial-text mb-6 leading-relaxed">
                  Your twin makes rational decisions you can't. See what you should do before emotions take over.
                </p>
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 mb-2">+18% Outperformance</div>
                    <div className="text-sm text-muted-foreground">
                      Simulated 10,000 scenarios | Twin vs baseline in market crashes
                    </div>
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    'Stress test: Crash scenarios',
                    'Stagflation simulations',
                    'Liquidity crisis modeling',
                    'Real-time decision comparison',
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="testimonial-text">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }} className="relative group">
                  <img
                    src="https://images.unsplash.com/photo-1548967136-609936a3088b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0Zm9saW8lMjBjb21wYXJpc29uJTIwY2hhcnR8ZW58MXx8fHwxNjcwODc4MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Split-screen portfolio comparison showing twin performance"
                    className="w-full h-auto rounded-xl shadow-2xl border border-green-500/20"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-600/30 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-background/90 backdrop-blur-sm rounded-lg p-4 border border-green-500/50 max-w-xs">
                      <p className="text-sm font-medium text-green-400 mb-2">📊 Stress Test Results</p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div>• Market Crash: +22% vs baseline</div>
                        <div>• Stagflation: +15% vs baseline</div>
                        <div>• Liquidity Crisis: +18% vs baseline</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
