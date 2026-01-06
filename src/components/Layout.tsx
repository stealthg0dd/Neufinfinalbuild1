import { Header } from './Header';
import { Outlet } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { WhatsAppWidget } from './WhatsAppWidget';
import { useState } from 'react';
import { Contrast, Lock, Shield, Eye, EyeOff } from 'lucide-react';
import neufinLogo from 'figma:asset/1e05f334cab806cc0d5cb5a632565c93d01080cd.png';

export function Layout() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  const toggleContrast = () => {
    setIsHighContrast(!isHighContrast);
    document.documentElement.classList.toggle('high-contrast');
  };

  return (
    <div className="min-h-screen bg-background dark">
      {/* High Contrast Toggle */}
      <Button
        onClick={toggleContrast}
        className="contrast-toggle"
        variant="outline"
        size="sm"
        aria-label={isHighContrast ? "Disable high contrast mode" : "Enable high contrast mode"}
        role="button"
      >
        {isHighContrast ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </Button>

      <Header />
      <Outlet />
      
      {/* WhatsApp Widget */}
      <WhatsAppWidget />
      
      {/* Enhanced Footer with Trust Elements */}
      <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-16" role="contentinfo">
        <div className="container mx-auto px-6 py-8">
          {/* Trust Badges Section */}
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 mb-8 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                SOC2 Compliant
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-blue-500" />
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                256-bit Encryption
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-500" />
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                GDPR & SEC Aligned
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={neufinLogo} 
                  alt="Neufin AI Logo - Neural Twin Technology Platform" 
                  className="h-8 w-8 object-contain"
                />
                <div>
                  <h3 className="font-semibold">Neufin AI</h3>
                  <p className="text-xs text-muted-foreground">A Unit of CTECH Ventures</p>
                </div>
              </div>
              <p className="text-sm testimonial-text">
                Advanced neural finance platform helping traders overcome behavioral biases for quantifiably better returns.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground" role="list">
                <li className="hover:text-foreground cursor-pointer transition-colors touch-target" role="listitem" tabIndex={0}>Alpha Strategies</li>
                <li className="hover:text-foreground cursor-pointer transition-colors touch-target" role="listitem" tabIndex={0}>Bias Detection</li>
                <li className="hover:text-foreground cursor-pointer transition-colors touch-target" role="listitem" tabIndex={0}>Twin Snapshot</li>
                <li className="hover:text-foreground cursor-pointer transition-colors touch-target" role="listitem" tabIndex={0}>Community Signals</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground" role="list">
                <li className="hover:text-foreground cursor-pointer transition-colors touch-target" role="listitem" tabIndex={0}>Neural Twin Guide</li>
                <li className="hover:text-foreground cursor-pointer transition-colors touch-target" role="listitem" tabIndex={0}>API Reference</li>
                <li className="hover:text-foreground cursor-pointer transition-colors touch-target" role="listitem" tabIndex={0}>Research Papers</li>
                <li className="hover:text-foreground cursor-pointer transition-colors touch-target" role="listitem" tabIndex={0}>Bias Academy</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground" role="list">
                <li className="hover:text-foreground cursor-pointer transition-colors touch-target" role="listitem" tabIndex={0}>Help Center</li>
                <li className="hover:text-foreground cursor-pointer transition-colors touch-target" role="listitem" tabIndex={0}>Contact AI Support</li>
                <li className="hover:text-foreground cursor-pointer transition-colors touch-target" role="listitem" tabIndex={0}>System Status</li>
                <li className="hover:text-foreground cursor-pointer transition-colors touch-target" role="listitem" tabIndex={0}>Trading Community</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              &copy; 2025 Neufin AI. All rights reserved. Neural Twin Technology™
            </p>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-foreground cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-foreground cursor-pointer transition-colors">Risk Disclosure</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}