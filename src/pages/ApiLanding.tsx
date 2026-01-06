import { ArrowRight, Check, Lock, Shield, Code2, Database, GitBranch, Layers, Zap, Clock, FileCode, Activity } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export function ApiLanding() {
  return (
    <>
      <SEO 
        title="Neufin Bias Intelligence API - Enterprise Market Intelligence Infrastructure"
        description="Programmatic detection, attribution, and correction of behavioral bias across financial data streams. Built for production systems."
      />
      
      <div className="min-h-screen bg-background dark">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background to-card/30">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="container mx-auto px-6 py-24 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="mb-6 bg-purple-500/10 text-purple-400 border-purple-500/30 px-4 py-1">
                  Enterprise Infrastructure
                </Badge>
                <h1 className="text-5xl md:text-6xl mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Bias-Aware Market Intelligence, Delivered as Infrastructure.
                </h1>
                <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
                  Programmatic detection, attribution, and correction of behavioral bias across financial data streams — built for production systems.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    <FileCode className="mr-2 h-5 w-5" />
                    View API Docs
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-purple-500/30 hover:bg-purple-500/10"
                  >
                    Request API Access
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>

                {/* Architecture Diagram */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative"
                >
                  <Card className="p-8 bg-card/50 backdrop-blur border-purple-500/20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                      {/* Input Sources */}
                      <div className="space-y-3">
                        <div className="text-sm text-purple-400 mb-4 uppercase tracking-wider">Input Sources</div>
                        {[
                          { icon: Activity, label: 'Market Data' },
                          { icon: Database, label: 'News Feeds' },
                          { icon: Layers, label: 'Social Signals' },
                          { icon: FileCode, label: 'SEC Filings' }
                        ].map((input, idx) => (
                          <motion.div
                            key={input.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            className="flex items-center gap-3 p-3 rounded-lg bg-background/80 border border-border/50"
                          >
                            <input.icon className="h-4 w-4 text-blue-400" />
                            <span className="text-sm text-foreground/80">{input.label}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Engine */}
                      <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg blur-xl" />
                        <div className="relative bg-gradient-to-br from-purple-900/40 to-blue-900/40 p-6 rounded-lg border border-purple-500/30">
                          <Zap className="h-12 w-12 text-purple-400 mb-4 mx-auto" />
                          <div className="text-center">
                            <div className="text-sm text-purple-400 mb-2 uppercase tracking-wider">Processing Layer</div>
                            <div className="font-semibold text-foreground">Neufin Bias Engine</div>
                            <div className="text-xs text-muted-foreground mt-2">Real-time Analysis</div>
                          </div>
                        </div>
                      </div>

                      {/* Outputs */}
                      <div className="space-y-3">
                        <div className="text-sm text-blue-400 mb-4 uppercase tracking-wider">API Outputs</div>
                        {[
                          { icon: GitBranch, label: 'Bias Scores' },
                          { icon: Activity, label: 'Confidence Bands' },
                          { icon: Code2, label: 'Explainable Signals' },
                          { icon: Clock, label: 'Timestamped Attribution' }
                        ].map((output, idx) => (
                          <motion.div
                            key={output.label}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            className="flex items-center gap-3 p-3 rounded-lg bg-background/80 border border-border/50"
                          >
                            <output.icon className="h-4 w-4 text-purple-400" />
                            <span className="text-sm text-foreground/80">{output.label}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Core Capabilities */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl mb-4">Core Capabilities</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Enterprise-grade bias intelligence designed for institutional accuracy and auditability.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    icon: GitBranch,
                    title: 'Bias Detection Engine',
                    description: 'Identifies cognitive and market-driven biases including recency, hype, herd behavior, and narrative dominance with quantified confidence scores.',
                    color: 'purple'
                  },
                  {
                    icon: Clock,
                    title: 'Bias Attribution & Traceability',
                    description: 'Every bias score is traceable to underlying sources with precise timestamps, data weights, and full lineage documentation.',
                    color: 'blue'
                  },
                  {
                    icon: Activity,
                    title: 'Confidence-Weighted Outputs',
                    description: 'All outputs include statistical confidence intervals with decay logic based on data recency and source reliability.',
                    color: 'green'
                  },
                  {
                    icon: FileCode,
                    title: 'Explainability by Design',
                    description: 'No black-box outputs. Every signal is auditable with full reasoning chains, contributing factors, and methodology transparency.',
                    color: 'orange'
                  }
                ].map((capability, idx) => (
                  <motion.div
                    key={capability.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <Card className="p-6 h-full border-border/50 hover:border-purple-500/30 transition-all duration-300 bg-card/30">
                      <div className={`inline-flex p-3 rounded-lg bg-${capability.color}-500/10 border border-${capability.color}-500/20 mb-4`}>
                        <capability.icon className={`h-6 w-6 text-${capability.color}-400`} />
                      </div>
                      <h3 className="text-xl mb-3">{capability.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {capability.description}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* API Usage & Sample Workflow */}
        <section className="py-24 bg-card/20 border-y border-border">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl mb-4">API Usage</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Clean, RESTful endpoints designed for seamless integration into your existing infrastructure.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Request Example */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="p-6 bg-slate-950 border-purple-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
                        REQUEST
                      </Badge>
                      <Code2 className="h-4 w-4 text-purple-400" />
                    </div>
                    <pre className="text-sm text-green-400/90 overflow-x-auto">
{`POST /api/v1/bias/analyze

{
  "asset": "AAPL",
  "timeframe": "30d",
  "sources": [
    "news",
    "social",
    "filings"
  ],
  "bias_types": [
    "recency",
    "herd",
    "narrative"
  ]
}`}
                    </pre>
                  </Card>
                </motion.div>

                {/* Response Example */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="p-6 bg-slate-950 border-blue-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                        RESPONSE
                      </Badge>
                      <Database className="h-4 w-4 text-blue-400" />
                    </div>
                    <pre className="text-sm text-blue-400/90 overflow-x-auto">
{`{
  "asset": "AAPL",
  "bias_score": 0.73,
  "confidence": 0.89,
  "adjusted_sentiment": 0.52,
  "detected_biases": {
    "recency": 0.68,
    "herd": 0.81,
    "narrative": 0.59
  },
  "explanation": {
    "summary": "High herd...",
    "sources": [...],
    "timestamp": "2025-12-22..."
  }
}`}
                    </pre>
                  </Card>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-8 text-center"
              >
                <p className="text-sm text-muted-foreground mb-4">
                  Authentication via API key. All requests are rate-limited and logged for compliance.
                </p>
                <Button variant="outline" className="border-purple-500/30 hover:bg-purple-500/10">
                  <FileCode className="mr-2 h-4 w-4" />
                  View Complete Documentation
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pricing & Access Model */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl mb-4">Pricing & Access</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Transparent, usage-based economics designed for institutional scale.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: Zap,
                    title: 'Usage-Based Pricing',
                    description: 'Pay per bias analysis call. Predictable costs that scale with your needs.',
                    highlight: false
                  },
                  {
                    icon: Layers,
                    title: 'Designed for Scale',
                    description: 'Built for high-volume fintech and institutional use. No throttling on enterprise plans.',
                    highlight: true
                  },
                  {
                    icon: Shield,
                    title: 'Enterprise Plans',
                    description: 'Custom SLAs, dedicated support, compliance-friendly audit logs, and priority processing.',
                    highlight: false
                  }
                ].map((plan, idx) => (
                  <motion.div
                    key={plan.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <Card className={`p-6 h-full ${plan.highlight ? 'border-purple-500/30 bg-purple-500/5' : 'border-border/50'}`}>
                      <div className="inline-flex p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 mb-4">
                        <plan.icon className="h-6 w-6 text-purple-400" />
                      </div>
                      <h3 className="text-lg mb-3">{plan.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {plan.description}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-12 text-center"
              >
                <p className="text-sm text-muted-foreground mb-6">
                  Contact our team for custom volume pricing and integration support.
                </p>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  Request Enterprise Pricing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trust, Security & Compliance */}
        <section className="py-24 bg-card/20 border-y border-border">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl mb-4">Enterprise Security & Compliance</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Built with institutional-grade security and regulatory compliance from the ground up.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    icon: Lock,
                    title: 'Secure API Authentication',
                    points: [
                      'API key rotation and management',
                      'OAuth 2.0 support for team access',
                      'IP whitelisting for added security'
                    ]
                  },
                  {
                    icon: Shield,
                    title: 'User-Scoped Access',
                    points: [
                      'Complete data isolation per client',
                      'Role-based access controls',
                      'Multi-tenant architecture'
                    ]
                  },
                  {
                    icon: FileCode,
                    title: 'Full Audit Logs',
                    points: [
                      'Request/response logging',
                      'Compliance-ready documentation',
                      'Exportable audit trails'
                    ]
                  },
                  {
                    icon: Check,
                    title: 'Regulatory Safe',
                    points: [
                      'Non-advisory, educational output',
                      'Explainable methodology',
                      'No black-box recommendations'
                    ]
                  }
                ].map((feature, idx) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <Card className="p-6 h-full border-border/50 bg-card/30">
                      <div className="flex items-start gap-4">
                        <div className="inline-flex p-2 rounded-lg bg-green-500/10 border border-green-500/20 shrink-0">
                          <feature.icon className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-lg mb-3">{feature.title}</h3>
                          <ul className="space-y-2">
                            {feature.points.map((point, pidx) => (
                              <li key={pidx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Integration with Existing Platform */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="p-12 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-blue-500/5 text-center">
                  <Layers className="h-12 w-12 text-purple-400 mx-auto mb-6" />
                  <h2 className="text-3xl mb-6">
                    Same Intelligence. Different Interface.
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    The same Bias Intelligence that powers Neufin's internal signals and dashboards is available via API. 
                    This is not experimental—it's the production-grade engine we use ourselves.
                  </p>
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {[
                      { label: 'Proven Technology', value: 'Battle-tested in production' },
                      { label: 'Shared Intelligence', value: 'Platform & API use same core' },
                      { label: 'Hybrid Approach', value: 'Start with API, add dashboards later' }
                    ].map((item) => (
                      <div key={item.label} className="text-center">
                        <div className="text-sm text-purple-400 mb-2">{item.label}</div>
                        <div className="text-xs text-muted-foreground">{item.value}</div>
                      </div>
                    ))}
                  </div>
                  <Button 
                    asChild
                    variant="outline" 
                    className="border-purple-500/30 hover:bg-purple-500/10"
                  >
                    <Link to="/user-dashboard">
                      Explore Neufin Platform
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-gradient-to-b from-background to-card/30 border-t border-border">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl mb-6">
                  Ready to Integrate Bias Intelligence?
                </h2>
                <p className="text-lg text-muted-foreground mb-12">
                  Join institutional investors and fintech builders leveraging bias-aware market intelligence.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    Request API Access
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-purple-500/30 hover:bg-purple-500/10"
                  >
                    Talk to the Neufin Team
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-8">
                  Enterprise support available • Custom SLAs • Dedicated integration assistance
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
