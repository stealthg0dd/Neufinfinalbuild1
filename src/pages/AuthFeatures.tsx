import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { SEO } from '../components/SEO';
import { 
  Lock, 
  Key, 
  Shield, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Chrome,
  Building2,
  TrendingUp,
  BarChart3,
  User,
  Database,
  Globe,
  Smartphone,
  Code,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { OAuthSetupChecker } from '../components/OAuthSetupChecker';
import { projectId } from '../utils/supabase/info';

const authFeatures = [
  {
    icon: Chrome,
    title: 'Google OAuth Login',
    description: 'Secure one-click authentication using your Google account',
    benefits: ['No password required', 'Bank-level encryption', 'Instant access']
  },
  {
    icon: Building2,
    title: 'Plaid Integration',
    description: 'Automatic portfolio sync with 10,000+ financial institutions',
    benefits: ['Real-time updates', 'Secure connection', 'Auto trade tracking']
  },
  {
    icon: TrendingUp,
    title: 'Manual Portfolio Entry',
    description: 'Full control with flexible manual stock entry options',
    benefits: ['Quick setup', 'No linking required', 'Privacy-focused']
  },
  {
    icon: BarChart3,
    title: 'Personalized Dashboard',
    description: 'Real-time bias analysis correlated with your holdings',
    benefits: ['Portfolio-specific insights', 'Live market data', 'AI recommendations']
  }
];

const securityFeatures = [
  { feature: 'JWT Authentication', enabled: true },
  { feature: 'OAuth 2.0 Protocol', enabled: true },
  { feature: 'Bank-Level Encryption', enabled: true },
  { feature: 'User Data Isolation', enabled: true },
  { feature: 'Secure Token Storage', enabled: true },
  { feature: 'HTTPS Only', enabled: true },
];

const userFlowSteps = [
  {
    step: 1,
    title: 'Sign In with Google',
    description: 'Click "Continue with Google" for instant secure authentication',
    icon: Lock
  },
  {
    step: 2,
    title: 'Connect Portfolio',
    description: 'Link via Plaid or manually enter your stock holdings',
    icon: Building2
  },
  {
    step: 3,
    title: 'View Dashboard',
    description: 'Access personalized bias analysis and AI recommendations',
    icon: TrendingUp
  },
  {
    step: 4,
    title: 'Optimize Returns',
    description: 'Follow AI-powered suggestions to maximize alpha',
    icon: Zap
  }
];

export function AuthFeatures() {
  const [copied, setCopied] = useState(false);
  const callbackUrl = `https://${projectId}.supabase.co/auth/v1/callback`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(callbackUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <>
      <SEO 
        title="Authentication Features | Neufin AI - Google OAuth & Portfolio Integration"
        description="Secure Google OAuth authentication, Plaid integration for 10,000+ banks, manual portfolio entry, and personalized AI-powered trading dashboard. Bank-level security with real-time portfolio sync."
        keywords="Google OAuth login, Plaid integration, portfolio authentication, secure trading platform, bank integration, AI trading dashboard, OAuth 2.0, JWT authentication"
        url="/auth-features"
        schemaType="SoftwareApplication"
      />
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-6 space-y-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <Badge className="mb-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400 border-purple-500/30 px-4 py-2">
            <Shield className="h-4 w-4 mr-2" />
            New Feature Launch
          </Badge>
          
          <h1 
            className="text-4xl lg:text-5xl font-bold mb-6"
            style={{ color: 'var(--heading-primary)' }}
          >
            Secure Authentication & Portfolio Integration
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            Sign in with Google OAuth, connect your portfolio via Plaid or manual entry, 
            and access a personalized AI-powered trading dashboard.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/login">
              <Button className="cta-button px-8 py-6 text-lg">
                <Lock className="h-5 w-5 mr-2" />
                Try Google Login
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" className="px-8 py-6 text-lg" asChild>
              <a href="#setup-guide">
                <Code className="h-5 w-5 mr-2" />
                View Setup Guide
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-purple-400 mb-2">100%</div>
                <p className="text-sm text-muted-foreground">Secure OAuth</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-400 mb-2">10,000+</div>
                <p className="text-sm text-muted-foreground">Banks Supported</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-400 mb-2">Real-time</div>
                <p className="text-sm text-muted-foreground">Portfolio Sync</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/20 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-orange-400 mb-2">Instant</div>
                <p className="text-sm text-muted-foreground">Setup Time</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 mb-8">
              <TabsTrigger value="features" className="touch-target">
                <Zap className="h-4 w-4 mr-2" />
                Features
              </TabsTrigger>
              <TabsTrigger value="how-it-works" className="touch-target">
                <TrendingUp className="h-4 w-4 mr-2" />
                How It Works
              </TabsTrigger>
              <TabsTrigger value="security" className="touch-target">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="setup" className="touch-target" id="setup-guide">
                <Code className="h-4 w-4 mr-2" />
                Setup Guide
              </TabsTrigger>
            </TabsList>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {authFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:border-purple-500/50 transition-all">
                      <CardHeader>
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="p-3 bg-purple-500/20 rounded-lg">
                            <feature.icon className="h-6 w-6 text-purple-400" />
                          </div>
                          <CardTitle>{feature.title}</CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {feature.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-center text-sm">
                              <CheckCircle2 className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Live Demo */}
              <Card className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Smartphone className="h-5 w-5 mr-2 text-purple-400" />
                    Interactive Demo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-background/50 rounded-lg">
                      <User className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-sm font-medium mb-1">User Profile</div>
                      <div className="text-xs text-muted-foreground">Name, email, avatar from Google</div>
                    </div>
                    <div className="text-center p-4 bg-background/50 rounded-lg">
                      <Database className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <div className="text-sm font-medium mb-1">Portfolio Data</div>
                      <div className="text-xs text-muted-foreground">Holdings, values, allocation</div>
                    </div>
                    <div className="text-center p-4 bg-background/50 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                      <div className="text-sm font-medium mb-1">AI Analysis</div>
                      <div className="text-xs text-muted-foreground">Bias detection, recommendations</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <Link to="/login">
                      <Button className="cta-button">
                        <Lock className="h-4 w-4 mr-2" />
                        Experience the Demo
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* How It Works Tab */}
            <TabsContent value="how-it-works" className="space-y-8">
              <div className="space-y-6">
                {userFlowSteps.map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="hover:border-purple-500/50 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                              {step.step}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <step.icon className="h-5 w-5 text-purple-400 mr-2" />
                              <h3 className="font-semibold">{step.title}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    {index < userFlowSteps.length - 1 && (
                      <div className="flex justify-center py-2">
                        <ArrowRight className="h-6 w-6 text-purple-400" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* User Journey Visualization */}
              <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
                <CardHeader>
                  <CardTitle>Complete User Journey</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <span className="text-sm">Visit Login Page</span>
                      <Badge variant="outline">→ /login</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <span className="text-sm">Google OAuth Authentication</span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Secure</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <span className="text-sm">Portfolio Setup</span>
                      <Badge variant="outline">→ /portfolio-setup</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <span className="text-sm">Personalized Dashboard</span>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Live Data</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-400" />
                    Security Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {securityFeatures.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <span className="text-sm">{item.feature}</span>
                        {item.enabled && (
                          <CheckCircle2 className="h-5 w-5 text-green-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Data Protection</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">User-scoped data access - only you can see your portfolio</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">Encrypted data storage using Supabase security</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">No sharing of portfolio data between users</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Authentication</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">OAuth 2.0 protocol with Google authentication</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">JWT tokens for secure API communication</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">Automatic session management and renewal</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Setup Guide Tab */}
            <TabsContent value="setup" className="space-y-8">
              <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Key className="h-5 w-5 mr-2 text-blue-400" />
                    OAuth Callback URL
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Use this URL in your Google Cloud Console OAuth configuration:
                  </p>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 text-sm bg-background p-3 rounded font-mono text-purple-400 break-all border border-border">
                      {callbackUrl}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyToClipboard}
                      className="flex-shrink-0"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <a
                        href="https://console.cloud.google.com/apis/credentials"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="h-3 w-3 mr-1" />
                        Google Console
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a
                        href={`https://supabase.com/dashboard/project/${projectId}/auth/providers`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Database className="h-3 w-3 mr-1" />
                        Supabase Dashboard
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <OAuthSetupChecker />

              <Card>
                <CardHeader>
                  <CardTitle>Documentation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Code className="h-4 w-4 text-purple-400" />
                      <span className="text-sm font-medium">Quick Reference</span>
                    </div>
                    <Badge variant="outline">/OAUTH_QUICK_REFERENCE.md</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Code className="h-4 w-4 text-blue-400" />
                      <span className="text-sm font-medium">Setup Verification</span>
                    </div>
                    <Badge variant="outline">/OAUTH_SETUP_VERIFICATION.md</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Code className="h-4 w-4 text-green-400" />
                      <span className="text-sm font-medium">Full Authentication Guide</span>
                    </div>
                    <Badge variant="outline">/AUTHENTICATION_SETUP.md</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-500/30 text-center">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--heading-primary)' }}>
                Ready to Get Started?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Sign in with your Google account and connect your portfolio to access 
                personalized AI-powered trading insights in minutes.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/login">
                  <Button className="cta-button px-8 py-6 text-lg">
                    <Lock className="h-5 w-5 mr-2" />
                    Sign In Now
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" className="px-8 py-6 text-lg">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    View Demo Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
    </>
  );
}
