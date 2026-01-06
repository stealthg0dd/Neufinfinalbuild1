import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Progress } from '../components/ui/progress';
import { Brain, Mail, Lock, User, Eye, EyeOff, ArrowRight, Shield, Zap, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase/client';
import neufinLogo from 'figma:asset/1e05f334cab806cc0d5cb5a632565c93d01080cd.png';

const benefits = [
  { icon: Brain, text: 'Neural Twin AI Analysis', color: 'text-purple-400' },
  { icon: Zap, text: '14-day Free Trial', color: 'text-blue-400' },
  { icon: Shield, text: 'Bank-level Security', color: 'text-green-400' }
];

export function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const getStrengthColor = () => {
    if (passwordStrength < 50) return 'bg-red-500';
    if (passwordStrength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength < 50) return 'Weak';
    if (passwordStrength < 75) return 'Medium';
    return 'Strong';
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        // Handle error (you might want to add error state to show to user)
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // User signed up successfully, redirect to portfolio setup
        navigate('/portfolio-setup');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
            
            <Badge className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400 border-purple-500/30 mb-4">
              <Brain className="h-3 w-3 mr-1" />
              Start Your Free Trial
            </Badge>
            
            <h2 className="text-xl font-semibold mb-2">Create your account</h2>
            <p className="text-muted-foreground text-sm">
              Begin eliminating cognitive biases from your trading
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="text-center p-3 bg-card/30 rounded-lg border border-border/30"
              >
                <benefit.icon className={`h-4 w-4 mx-auto mb-1 ${benefit.color}`} />
                <p className="text-xs text-muted-foreground">{benefit.text}</p>
              </motion.div>
            ))}
          </div>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First name
                    </Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        className="pl-10 bg-background/50"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last name
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        className="bg-background/50"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email address
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="pl-10 bg-background/50"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      className="pl-10 pr-10 bg-background/50"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  {formData.password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Password strength</span>
                        <span className={`font-medium ${
                          passwordStrength < 50 ? 'text-red-400' :
                          passwordStrength < 75 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {getStrengthText()}
                        </span>
                      </div>
                      <Progress 
                        value={passwordStrength} 
                        className="h-1"
                      />
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-muted-foreground space-y-2">
                  <label className="flex items-start space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded border-border mt-0.5" 
                      required 
                    />
                    <span>
                      I agree to the{' '}
                      <a href="#" className="text-purple-400 hover:text-purple-300">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="text-purple-400 hover:text-purple-300">Privacy Policy</a>
                    </span>
                  </label>
                  
                  <label className="flex items-start space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded border-border mt-0.5" 
                    />
                    <span>
                      I want to receive updates about new features and trading insights
                    </span>
                  </label>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Start Free Trial</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>
              
              <div className="mt-6">
                <Separator className="my-4" />
                
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="bg-background/50">
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  
                  <Button variant="outline" className="bg-background/50">
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Twitter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                Sign in
              </Link>
            </p>
          </div>
          
          {/* Trial Features */}
          <div className="mt-8 space-y-2">
            <p className="text-xs text-center text-muted-foreground mb-3">
              Your 14-day free trial includes:
            </p>
            <div className="grid grid-cols-1 gap-2 text-xs">
              {[
                'Full Neural Twin AI Analysis',
                'Advanced Bias Detection (47 types)',
                'Real-time Portfolio Optimization',
                'Community Signals & Insights'
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-muted-foreground">
                  <CheckCircle className="h-3 w-3 text-green-400" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}