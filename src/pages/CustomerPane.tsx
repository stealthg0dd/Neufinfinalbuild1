import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '../utils/supabase/client';
import { WelcomeModal } from '../components/WelcomeModal';
import { PortfolioEntry } from '../components/PortfolioEntry';
import { AlphaScoreReveal } from '../components/AlphaScoreReveal';
import { CustomerDashboard } from '../components/CustomerDashboard';
import { Loader2 } from 'lucide-react';

interface Holding {
  ticker: string;
  quantity: number;
  avgCost: number;
}

type OnboardingStep = 'welcome' | 'portfolio' | 'reveal' | 'dashboard';

export function CustomerPane() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('welcome');
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [alphaScore, setAlphaScore] = useState(0);
  const [opportunityCost, setOpportunityCost] = useState(0);
  
  const navigate = useNavigate();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/customer-portal');
        return;
      }

      setIsAuthenticated(true);
      
      // Extract user name from email or metadata
      const email = session.user.email || '';
      const name = session.user.user_metadata?.full_name || 
                   email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
      setUserName(name);

      // Check if user has completed onboarding
      // In production, this would check a database flag
      const hasCompletedOnboarding = localStorage.getItem('neufin_onboarding_complete');
      
      if (hasCompletedOnboarding) {
        setIsFirstTimeUser(false);
        setOnboardingStep('dashboard');
        // Load user's portfolio data
        const savedHoldings = localStorage.getItem('neufin_holdings');
        if (savedHoldings) {
          setHoldings(JSON.parse(savedHoldings));
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate, supabase]);

  const handleWelcomeContinue = () => {
    setOnboardingStep('portfolio');
  };

  const handlePortfolioComplete = (userHoldings: Holding[]) => {
    setHoldings(userHoldings);
    
    // Calculate mock alpha score based on portfolio
    const mockAlphaScore = 3.5 + Math.random() * 3; // Between 3.5-6.5%
    const totalValue = userHoldings.reduce((sum, h) => sum + (h.quantity * h.avgCost), 0);
    const mockOpportunityCost = totalValue * (mockAlphaScore / 100);
    
    setAlphaScore(mockAlphaScore);
    setOpportunityCost(mockOpportunityCost);
    setOnboardingStep('reveal');
  };

  const handleRevealContinue = () => {
    // Save onboarding completion
    localStorage.setItem('neufin_onboarding_complete', 'true');
    localStorage.setItem('neufin_holdings', JSON.stringify(holdings));
    setOnboardingStep('dashboard');
    setIsFirstTimeUser(false);
  };

  const handleWelcomeSkip = () => {
    localStorage.setItem('neufin_onboarding_complete', 'true');
    setOnboardingStep('dashboard');
    setIsFirstTimeUser(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto mb-4" />
          <h2 className="text-2xl mb-2">Loading your dashboard...</h2>
          <p className="text-muted-foreground">Please wait</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Onboarding flow
  if (onboardingStep === 'welcome') {
    return (
      <WelcomeModal
        userName={userName}
        onClose={handleWelcomeSkip}
        onContinue={handleWelcomeContinue}
      />
    );
  }

  if (onboardingStep === 'portfolio') {
    return (
      <PortfolioEntry
        onComplete={handlePortfolioComplete}
        onBack={() => setOnboardingStep('welcome')}
      />
    );
  }

  if (onboardingStep === 'reveal') {
    return (
      <AlphaScoreReveal
        alphaScore={alphaScore}
        annualOpportunityCost={opportunityCost}
        onContinue={handleRevealContinue}
      />
    );
  }

  // Main dashboard
  return (
    <CustomerDashboard
      userName={userName}
      holdings={holdings}
      alphaScore={alphaScore || 4.2}
      opportunityCost={opportunityCost || 8400}
    />
  );
}
