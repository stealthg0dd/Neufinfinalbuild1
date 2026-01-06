import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Brain, Shield, Zap, AlertCircle, ChevronDown, ChevronUp, TrendingUp, Target, CheckCircle, Mail, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../utils/supabase/client';
import { OAuthSetupChecker } from '../components/OAuthSetupChecker';
import neufinLogo from 'figma:asset/1e05f334cab806cc0d5cb5a632565c93d01080cd.png';

export function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user came from "Start Free Trial" button
  const fromFreeTrial = location.state?.from === 'free-trial';

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Redirect to customer pane if already logged in
        navigate('/customer-pane');
      }
    };
    checkSession();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          skipBrowserRedirect: false,
        },
      });

      if (error) {
        console.error('OAuth error:', error);
        
        // Provide specific error messages
        if (error.message?.includes('provider')) {
          throw new Error('Google OAuth is not enabled in Supabase. Please complete the setup in the Supabase Dashboard.');
        } else if (error.message?.includes('redirect')) {
          throw new Error('OAuth redirect URL mismatch. Please verify your Google Cloud Console settings.');
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      
      let errorMessage = error.message || 'Failed to sign in with Google.';
      
      // Add helpful context for common errors
      if (errorMessage.includes('403') || errorMessage.includes('access') || errorMessage.includes('not have access')) {
        errorMessage = '⚠️ OAuth Setup Required: This app is currently in development mode. You need to:\n\n' +
          '1. Add your email as a test user in Google Cloud Console\n' +
          '2. OR publish the OAuth app (move from Testing to Production)\n' +
          '3. Verify the redirect URI: https://gpczchjipalfgkfqamcu.supabase.co/auth/v1/callback\n\n' +
          'Click "Show OAuth Setup Guide" below for detailed instructions.';
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else if (data.user) {
      // Check if portfolio exists
      const { data: portfolios } = await supabase
        .from('portfolios')
        .select('id')
        .eq('user_id', data.user.id)

      navigate(portfolios?.length ? '/user-dashboard' : '/portfolio-setup')
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
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
      
      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img 
                src={neufinLogo} 
                alt="Neufin Logo" 
                className="h-12 w-12 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold">Neufin AI</h1>
                <p className="text-xs text-muted-foreground">Neural Twin Technology™</p>
              </div>
            </div>
            
            {fromFreeTrial && (
              <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30 mb-4">
                <CheckCircle className="h-3 w-3 mr-1" />
                🎉 Start Your 14-Day Free Trial
              </Badge>
            )}
            
            {!fromFreeTrial && (
              <Badge className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400 border-purple-500/30 mb-4">
                <Brain className="h-3 w-3 mr-1" />
                Welcome to Your Neural Twin
              </Badge>
            )}
            
            <h2 className="text-xl font-semibold mb-2">
              {fromFreeTrial ? 'Start Your Free Trial' : 'Sign in to continue'}
            </h2>
            <p className="text-muted-foreground text-sm">
              {fromFreeTrial 
                ? 'Get instant access to your personalized AI trading dashboard' 
                : 'Access your personalized bias-free trading dashboard'
              }
            </p>
          </div>
          
          {/* What You Get - Only show when coming from free trial */}
          {fromFreeTrial && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-400" />
                    What You'll Get Instantly
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span>Real-time portfolio tracking with live market data</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span>Advanced sentiment analytics & market insights</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span>Digital Twin AI for bias-free decision making</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span>Comprehensive bias detection & correction tools</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span>Candlestick charts with alpha breakout detection</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span>AI-powered personalized investment advice</span>
                  </div>
                  
                  <div className="pt-2 mt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground text-center">
                      ✨ No credit card required • Cancel anytime
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 py-6"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-gray-400/30 border-t-gray-900 rounded-full animate-spin" />
                        <span>Connecting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span className="font-medium">Continue with Google</span>
                      </div>
                    )}
                  </Button>
                </motion.div>

                <div className="relative my-4">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                    OR
                  </span>
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-6"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <span>Sign in with Email</span>
                    )}
                  </Button>
                </form>

                <Button
                  onClick={() => navigate('/demo')}
                  variant="outline"
                  className="w-full py-6 border-blue-500/30 hover:bg-blue-500/10 hover:border-blue-500/50"
                >
                  <div className="flex items-center space-x-3">
                    <Zap className="h-5 w-5 text-blue-400" />
                    <span>Try Demo (No Login Required)</span>
                  </div>
                </Button>

                <Separator className="my-4" />

                <div className="text-center text-xs text-muted-foreground space-y-2">
                  <p>
                    By continuing, you agree to Neufin's Terms of Service and Privacy Policy
                  </p>
                  <p className="text-purple-400">
                    ⚠️ Note: Please complete Google OAuth setup in Supabase Dashboard
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Security Features */}
          <div className="mt-8 grid grid-cols-2 gap-4 text-center">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3 text-green-400" />
              <span>Bank-level security</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Zap className="h-3 w-3 text-blue-400" />
              <span>Instant portfolio sync</span>
            </div>
          </div>

          {/* Setup Guide Toggle */}
          <div className="mt-6">
            <Button
              variant="outline"
              onClick={() => setShowSetupGuide(!showSetupGuide)}
              className="w-full flex items-center justify-between"
            >
              <span className="text-sm">
                {showSetupGuide ? '🔒 Hide' : '⚙️ Show'} OAuth Setup Guide
              </span>
              {showSetupGuide ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          {/* Setup Guide Panel */}
          {showSetupGuide && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <OAuthSetupChecker />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}