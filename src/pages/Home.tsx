import { Brain, TrendingUp, Shield, Zap, ArrowRight, Star, Users, Target, BarChart3, Award, CheckCircle, Play, Activity, Gauge, AlertTriangle, MapPin, Mail, Globe, Building2, User, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { LiveStockTicker } from '../components/LiveStockTicker';
import { SEO } from '../components/SEO';
import { EarlyAccessForm } from '../components/EarlyAccessForm';
import { StrategicSections } from '../components/StrategicSections';
import { KnowledgeHub } from '../components/KnowledgeHub';
import { ExpandedFAQ } from '../components/ExpandedFAQ';
import { TechnicalFooter } from '../components/TechnicalFooter';
import neufinLogo from 'figma:asset/1e05f334cab806cc0d5cb5a632565c93d01080cd.png';
import aiTraderImage from 'figma:asset/56b1e8218e4eecf5ebadf5ff37335bf543223e96.png';
import neufinDashboardImage from 'figma:asset/ee3e0970c3bf4d58e7a445b175b3f23c4b8de039.png';
import digitalTwinImage from 'figma:asset/49e11e5194190d81d802d8e6a9aff9934a5adec5.png';

const features = [
  {
    icon: Brain,
    title: 'Neural Twin AI',
    description: 'Your bias-free trading twin that learns from millions of market decisions to optimize your portfolio.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20'
  },
  {
    icon: TrendingUp,
    title: 'Alpha Score Tracking',
    description: 'Real-time quantification of missed opportunities and bias-driven losses with actionable insights.',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20'
  },
  {
    icon: Shield,
    title: 'Bias Detection',
    description: 'Advanced algorithms identify and correct 47 different cognitive biases affecting your trading decisions.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20'
  },
  {
    icon: Zap,
    title: 'Real-time Insights',
    description: 'Live sentiment analysis and market signals processed from 10,000+ sources in real-time.',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20'
  }
];

const stats = [
  { label: 'Average Alpha Improvement', value: '+18.7%', desc: 'in the first 3 months' },
  { label: 'Bias Reduction Rate', value: '94%', desc: 'of major biases corrected' },
  { label: 'Active Traders', value: '15,000+', desc: 'using Neufin daily' },
  { label: 'Market Coverage', value: '99.9%', desc: 'uptime and reliability' }
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Quantitative Analyst',
    content: 'Neufin\'s Neural Twin helped me identify confirmation bias in my tech stock picks. My portfolio is up 23% since implementing their recommendations.',
    rating: 5
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Portfolio Manager',
    content: 'The real-time bias detection is game-changing. I can see exactly when emotions are affecting my decisions and get unbiased alternatives.',
    rating: 5
  },
  {
    name: 'Dr. Emily Watson',
    role: 'Investment Director',
    content: 'Finally, a platform that combines behavioral finance with AI. The alpha generation is measurable and consistent.',
    rating: 5
  }
];

// Live Demo Widget Component
function LiveDemoWidget() {
  const [alphaScore, setAlphaScore] = useState(8.7);
  const [potentialGains, setPotentialGains] = useState(18.7);
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = () => {
    setIsSimulating(true);
    
    // Animate alpha score improvement
    const interval = setInterval(() => {
      setAlphaScore(prev => {
        const newScore = prev + (Math.random() * 0.3);
        if (newScore >= 12.5) {
          clearInterval(interval);
          setIsSimulating(false);
          return 12.5;
        }
        return newScore;
      });
      
      setPotentialGains(prev => {
        const newGains = prev + (Math.random() * 2);
        return Math.min(newGains, 35.2);
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setIsSimulating(false);
    }, 3000);
  };

  return (
    <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30 p-6">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-lg">
          <Activity className="w-5 h-5 text-green-500" />
          Live Bias Correction Demo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">
              {alphaScore.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Alpha Score</div>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-green-400">
              +{potentialGains.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">Potential Gains</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Bias Correction Progress</span>
            <span>{Math.round((alphaScore / 12.5) * 100)}%</span>
          </div>
          <div className="w-full bg-muted/50 rounded-full h-2 progress-animated">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
              style={{ width: `${(alphaScore / 12.5) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <Button
          onClick={runSimulation}
          disabled={isSimulating}
          className="cta-button w-full"
          role="button"
          aria-label="Run bias correction simulation"
        >
          {isSimulating ? (
            <>
              <Activity className="w-4 h-4 mr-2 animate-spin" />
              Correcting Biases...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Run Simulation
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export function Home() {
  const navigate = useNavigate();
  const supabase = createClient();
  const [showEarlyAccessForm, setShowEarlyAccessForm] = useState(false);

  useEffect(() => {
    // Check if user is authenticated and redirect to dashboard
    const checkAuthAndRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // User is logged in, redirect to user dashboard
        navigate('/user-dashboard');
      }
    };
    
    checkAuthAndRedirect();
  }, [navigate, supabase]);

  return (
    <>
      <SEO 
        title="Neufin AI - Neural Twin Trading Platform | Eliminate Cognitive Bias"
        description="Trade without cognitive bias. Neufin AI's Neural Twin technology analyzes millions of market decisions to eliminate emotional trading and maximize your alpha. Google OAuth login, Plaid integration, and personalized AI insights."
        keywords="AI trading, neural twin, cognitive bias detection, algorithmic trading, portfolio optimization, bias-free trading, Google OAuth, Plaid integration, real-time market analysis, AI financial advisor"
        url="/"
        schemaType="WebSite"
      />
      <div className="min-h-screen">
      {/* New Feature Announcement Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 sticky top-0 z-50"
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center space-x-3 text-sm">
            <Badge className="bg-white/20 text-white border-white/30">
              🎉 NEW
            </Badge>
            <span className="font-medium">Google OAuth Login & Portfolio Integration Now Live!</span>
            <Link to="/auth-features">
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 ml-2">
                Learn More <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden" role="banner">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10" />
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3] 
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4] 
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-6 bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 border-red-500/30 px-4 py-2">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Critical Portfolio Alert
              </Badge>
              
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                <span style={{ color: 'var(--heading-primary)' }}>
                  Stop Losing
                </span>
                <br />
                <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  3.2% Annual Returns
                </span>
                <br />
                <span style={{ color: 'var(--heading-primary)' }}>
                  to Cognitive Biases
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed testimonial-text">
                Neufin's Neural Twin AI identifies the exact amount you're leaving on the table—and shows you how to capture it
              </p>
              
              {/* Animated Alpha Score Counter */}
              <motion.div 
                className="mb-8 p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/30 max-w-2xl mx-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <motion.div 
                      className="text-3xl font-bold text-red-400 mb-1"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      -$8,400
                    </motion.div>
                    <div className="text-sm text-muted-foreground">Lost This Year</div>
                  </div>
                  <div>
                    <motion.div 
                      className="text-3xl font-bold text-green-400 mb-1"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                    >
                      +$12,600
                    </motion.div>
                    <div className="text-sm text-muted-foreground">Potential With AI</div>
                  </div>
                  <div>
                    <motion.div 
                      className="text-3xl font-bold text-purple-400 mb-1"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                    >
                      3.2%
                    </motion.div>
                    <div className="text-sm text-muted-foreground">Alpha Gain</div>
                  </div>
                </div>
              </motion.div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={() => setShowEarlyAccessForm(true)}
                    size="lg" 
                    className="px-8 py-6 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 touch-target"
                    role="button"
                    aria-label="Calculate your alpha score"
                  >
                    <Gauge className="mr-2 h-5 w-5" />
                    Calculate My Alpha Score
                  </Button>
                </motion.div>
                
                <Button 
                  asChild
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-6 text-lg group touch-target border-purple-500/30 hover:bg-purple-500/10"
                  role="button"
                  aria-label="Watch 60 second demo video"
                >
                  <a href="https://youtu.be/iD8PcJVSWk4" target="_blank" rel="noopener noreferrer">
                    <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Watch 60s Demo
                  </a>
                </Button>
              </div>

              {/* Trust Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-400" />
                  <span>Trusted by 500+ investors</span>
                </div>
                <span className="hidden sm:inline">•</span>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-400" />
                  <span>SOC 2 Certified</span>
                </div>
                <span className="hidden sm:inline">•</span>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-400" />
                  <span>Real-time data from Bloomberg</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live Stock Ticker */}
      <LiveStockTicker />

      {/* Strategic Sections: Problem, Solution, Core Modules */}
      <StrategicSections onOpenEarlyAccess={() => setShowEarlyAccessForm(true)} />

      {/* Features Section with Enhanced Visuals */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: 'var(--heading-primary)' }}>
              AI-Powered Trading
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent block">
                Intelligence
              </span>
            </h2>
            <p className="text-xl max-w-3xl mx-auto testimonial-text">
              Advanced neural networks and behavioral finance research combined to create 
              your bias-free trading companion.
            </p>
          </motion.div>
          
          {/* Bias Detection Feature with Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 rounded-lg bg-blue-500/20">
                    <Shield className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-3xl font-bold" style={{ color: 'var(--heading-secondary)' }}>
                    Advanced Bias Detection
                  </h3>
                </div>
                <p className="text-lg testimonial-text mb-6 leading-relaxed">
                  Our AI identifies and corrects 47 different cognitive biases affecting your trading decisions. 
                  Real-time analysis prevents emotional trading and anchoring bias from costing you returns.
                </p>
                <ul className="space-y-3">
                  {[
                    '94% bias reduction rate',
                    'Real-time emotion detection',
                    '24/7 decision monitoring',
                    'Personalized intervention strategies'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="testimonial-text">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-1 lg:order-2">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <img
                    src={aiTraderImage}
                    alt="AI-powered trading dashboard showing bias detection and market analysis"
                    className="w-full h-auto rounded-xl shadow-2xl border border-purple-500/20"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent rounded-xl" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Sentiment Intelligence Feature with Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <img
                    src={neufinDashboardImage}
                    alt="Neufin AI dashboard showing real-time sentiment analysis and market data"
                    className="w-full h-auto rounded-xl shadow-2xl border border-green-500/20"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-600/20 to-transparent rounded-xl" />
                </motion.div>
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 rounded-lg bg-green-500/20">
                    <TrendingUp className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="text-3xl font-bold" style={{ color: 'var(--heading-secondary)' }}>
                    Real-Time Sentiment Intelligence
                  </h3>
                </div>
                <p className="text-lg testimonial-text mb-6 leading-relaxed">
                  Process sentiment from 10,000+ sources including news, social media, and institutional data. 
                  Get actionable insights before market moves happen.
                </p>
                <ul className="space-y-3">
                  {[
                    'Live sentiment heatmaps',
                    'Social media trend analysis',
                    'Institutional flow tracking',
                    'News impact prediction'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="testimonial-text">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Digital Twin Feature with Holographic Visual */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 rounded-lg bg-purple-500/20">
                    <Brain className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="text-3xl font-bold" style={{ color: 'var(--heading-secondary)' }}>
                    Neural Twin Simulation
                  </h3>
                </div>
                <p className="text-lg testimonial-text mb-6 leading-relaxed">
                  Your bias-free digital twin simulates millions of trading scenarios to optimize portfolio performance. 
                  See exactly how much more you could earn without emotional interference.
                </p>
                <ul className="space-y-3">
                  {[
                    '+18.7% average alpha improvement',
                    'Million+ scenario simulations',
                    'Continuous learning adaptation',
                    'Risk-optimized recommendations'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-purple-400" />
                      <span className="testimonial-text">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-1 lg:order-2">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <img
                    src={digitalTwinImage}
                    alt="Digital twin AI hologram analyzing financial data and market patterns"
                    className="w-full h-auto rounded-xl shadow-2xl border border-blue-500/20"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-xl" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Additional Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.slice(0, 2).map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card 
                  className="h-full bg-card/50 hover:bg-card/70 transition-all duration-300 border-border/50 hover:border-purple-500/30 group cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label={`Learn more about ${feature.title}`}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${feature.bgColor} group-hover:scale-110 transition-transform icon-enhanced`}>
                        <feature.icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <CardTitle className="text-xl" style={{ color: 'var(--heading-secondary)' }}>
                        {feature.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed testimonial-text">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Authentication & Portfolio Integration Section - NEW */}
      <section className="py-20 bg-gradient-to-br from-purple-600/5 via-blue-600/5 to-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(160,32,240,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400 border-purple-500/30 px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              New Feature Launch
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: 'var(--heading-primary)' }}>
              Secure Authentication &
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent block">
                Portfolio Integration
              </span>
            </h2>
            <p className="text-xl max-w-3xl mx-auto testimonial-text">
              Sign in with Google OAuth, connect your portfolio via Plaid or manual entry, 
              and access personalized AI-powered insights in minutes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: Shield,
                title: 'Google OAuth',
                description: 'Secure one-click login with your Google account',
                color: 'text-blue-400',
                bgColor: 'bg-blue-500/20'
              },
              {
                icon: Building2,
                title: 'Plaid Integration',
                description: 'Connect 10,000+ financial institutions automatically',
                color: 'text-green-400',
                bgColor: 'bg-green-500/20'
              },
              {
                icon: TrendingUp,
                title: 'Manual Entry',
                description: 'Quick portfolio setup with full privacy control',
                color: 'text-purple-400',
                bgColor: 'bg-purple-500/20'
              },
              {
                icon: BarChart3,
                title: 'Live Dashboard',
                description: 'Real-time bias analysis correlated with your holdings',
                color: 'text-orange-400',
                bgColor: 'bg-orange-500/20'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:border-purple-500/50 transition-all group">
                  <CardContent className="p-6 text-center">
                    <div className={`p-4 rounded-lg ${feature.bgColor} inline-block mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <h3 className="font-semibold mb-2" style={{ color: 'var(--heading-secondary)' }}>
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/auth-features">
                <Button className="cta-button px-8 py-6 text-lg">
                  <Shield className="h-5 w-5 mr-2" />
                  Explore Auth Features
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="px-8 py-6 text-lg border-purple-500/30 hover:bg-purple-500/10">
                  <User className="h-5 w-5 mr-2" />
                  Try Login Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
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
              How Neural Twin
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent block">
                Works
              </span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Connect Portfolio',
                description: 'Securely link your trading accounts and let our AI analyze your historical decisions and patterns.',
                icon: Target
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Neural Twin processes millions of data points to identify cognitive biases affecting your trades.',
                icon: Brain
              },
              {
                step: '03',
                title: 'Get Alpha',
                description: 'Receive real-time bias-corrected recommendations and track your Alpha Score improvement.',
                icon: TrendingUp
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                <div className="mb-6 relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                    <item.icon className="h-8 w-8 text-purple-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--heading-secondary)' }}>
                  {item.title}
                </h3>
                <p className="testimonial-text">{item.description}</p>
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-full w-full">
                    <ArrowRight className="h-6 w-6 text-purple-400 mx-auto" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 relative">
        {/* Background Visual */}
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1746037870491-b2e415517d0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWxsJTIwc3RyZWV0JTIwdHJhZGluZyUyMGZsb29yfGVufDF8fHx8MTc1OTcyOTk2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Wall Street trading floor background"
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
              Trusted by
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent block">
                Professional Traders
              </span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card 
                  className="h-full bg-card/50 border-border/50"
                  role="article"
                  aria-label={`Testimonial from ${testimonial.name}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4" aria-label={`${testimonial.rating} star rating`}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="mb-6 italic testimonial-text">"{testimonial.content}"</p>
                    <div>
                      <div className="font-semibold" style={{ color: 'var(--heading-secondary)' }}>
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Knowledge Hub Section - SEO Optimized */}
      <KnowledgeHub />

      {/* Expanded FAQ Section - SEO Optimized */}
      <ExpandedFAQ />

      {/* Technical Footer with Specifications */}
      <TechnicalFooter />
    </div>
    
    {/* Early Access Form Modal */}
    <EarlyAccessForm 
      isOpen={showEarlyAccessForm} 
      onClose={() => setShowEarlyAccessForm(false)} 
    />

    {/* Floating WhatsApp Button */}
    <motion.a
      href="https://wa.me/6597627734"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 group"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Chat with us on WhatsApp
      </span>
    </motion.a>
    </>
  );
}