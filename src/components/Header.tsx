import { Search, Bell, User, Activity, Zap, Menu, X, LogOut } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createClient } from '../utils/supabase/client';
import { EarlyAccessForm } from './EarlyAccessForm';
import neufinLogo from 'figma:asset/1e05f334cab806cc0d5cb5a632565c93d01080cd.png';

const tickerSuggestions = [
  { symbol: 'AAPL', name: 'Apple Inc.', change: '+2.3%' },
  { symbol: 'TSLA', name: 'Tesla Inc.', change: '-1.7%' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', change: '+4.2%' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', change: '+0.8%' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', change: '+1.5%' },
];

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Demo', href: '/demo' },
  { name: 'Customer Login', href: '/customer-portal', highlight: false, style: 'border' }
];

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showEarlyAccessForm, setShowEarlyAccessForm] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const supabase = createClient();

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setUserEmail(session?.user?.email || null);
    };
    
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setUserEmail(session?.user?.email || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserEmail(null);
    navigate('/');
  };
  
  const filteredSuggestions = tickerSuggestions.filter(ticker =>
    ticker.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticker.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link to="/">
            <motion.div 
              className="flex items-center space-x-3 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <img 
                  src={neufinLogo} 
                  alt="Neufin Logo" 
                  className="h-10 w-10 object-contain"
                />
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Neufin AI</h1>
                <p className="text-xs text-muted-foreground">A Unit of CTECH Ventures</p>
              </div>
            </motion.div>
          </Link>

          {/* Navigation Menu - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.href
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-muted-foreground'
                } ${item.highlight ? 'relative' : ''} ${
                  item.style === 'border' 
                    ? 'border border-purple-500/30 px-3 py-1.5 rounded-lg hover:bg-purple-500/10' 
                    : ''
                }`}
              >
                {item.name}
                {item.highlight && (
                  <span className="absolute -top-2 -right-2 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Enhanced Ticker Search - Only show on dashboard */}
          {location.pathname === '/dashboard' && (
            <div className="flex-1 max-w-md mx-8 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickers (e.g., AAPL, TSLA)"
                className="pl-10 bg-background/80 border-border transition-all duration-200 focus:ring-2 focus:ring-blue-500/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              <Activity className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500 animate-pulse" />
            </div>
            
            {/* Autocomplete Dropdown */}
            {showSuggestions && searchQuery && filteredSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full mt-2 w-full bg-card border border-border rounded-lg shadow-lg z-50"
              >
                {filteredSuggestions.map((ticker) => (
                  <div
                    key={ticker.symbol}
                    className="flex items-center justify-between p-3 hover:bg-accent cursor-pointer border-b border-border last:border-b-0"
                    onClick={() => {
                      setSearchQuery(ticker.symbol);
                      setShowSuggestions(false);
                    }}
                  >
                    <div>
                      <p className="font-medium">{ticker.symbol}</p>
                      <p className="text-sm text-muted-foreground">{ticker.name}</p>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={ticker.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}
                    >
                      {ticker.change}
                    </Badge>
                  </div>
                ))}
              </motion.div>
            )}
            </div>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Alpha Score - Only show on dashboard */}
            {location.pathname === '/dashboard' && (
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="hidden sm:block"
              >
                <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 flex items-center space-x-1">
                  <Zap className="h-3 w-3" />
                  <span>Alpha Score: 8.7</span>
                </Badge>
              </motion.div>
            )}
            
            {/* Show logout button prominently on customer-pane and customer-portal */}
            {(location.pathname === '/customer-pane' || location.pathname === '/customer-portal') && isAuthenticated && (
              <Button 
                onClick={handleLogout}
                variant="outline" 
                size="sm"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            )}
            
            {/* Auth Buttons - Show based on authentication state */}
            {!location.pathname.includes('/user-dashboard') && 
             !location.pathname.includes('/portfolio-setup') && 
             !location.pathname.includes('/dashboard-mock') &&
             !location.pathname.includes('/user-journey-mock') && 
             !location.pathname.includes('/customer-pane') && 
             !location.pathname.includes('/customer-portal') && 
             location.pathname !== '/login' && (
              <div className="hidden md:flex items-center space-x-3">
                {isAuthenticated ? (
                  <>
                    <Button asChild variant="ghost" size="sm">
                      <Link to="/user-dashboard">
                        <User className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    </Button>
                    {userEmail && (
                      <span className="text-xs text-muted-foreground hidden lg:inline">
                        {userEmail}
                      </span>
                    )}
                    <Button 
                      onClick={handleLogout}
                      variant="outline" 
                      size="sm"
                      className="border-red-500/30 hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="ghost" size="sm">
                      <Link to="/login">Sign In</Link>
                    </Button>
                    <Button 
                      onClick={() => setShowEarlyAccessForm(true)}
                      size="sm" 
                      className="cta-button"
                      role="button"
                      aria-label="Join the waitlist for early bird discount"
                    >
                      Join Waitlist
                    </Button>
                  </>
                )}
              </div>
            )}
            
            {/* Dashboard Actions */}
            {location.pathname === '/dashboard' && (
              <>
                <div className="relative">
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                  </Button>
                  <motion.div
                    className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
                
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </>
            )}
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border mt-4 pt-4"
            >
              <nav className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`text-sm font-medium transition-colors hover:text-primary flex items-center justify-between ${
                      location.pathname === item.href
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{item.name}</span>
                    {item.highlight && (
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                        New
                      </Badge>
                    )}
                  </Link>
                ))}
                
                {!location.pathname.includes('/user-dashboard') && 
                 !location.pathname.includes('/portfolio-setup') && 
                 !location.pathname.includes('/dashboard-mock') &&
                 !location.pathname.includes('/user-journey-mock') && 
                 location.pathname !== '/login' && (
                  <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                    {isAuthenticated ? (
                      <>
                        <Button asChild variant="ghost" size="sm">
                          <Link to="/user-dashboard" onClick={() => setMobileMenuOpen(false)}>
                            <User className="h-4 w-4 mr-2" />
                            Dashboard
                          </Link>
                        </Button>
                        {userEmail && (
                          <p className="text-xs text-muted-foreground px-2">
                            {userEmail}
                          </p>
                        )}
                        <Button 
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}
                          variant="outline" 
                          size="sm"
                          className="border-red-500/30 hover:bg-red-500/10"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button asChild variant="ghost" size="sm">
                          <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                        </Button>
                        <Button 
                          onClick={() => setShowEarlyAccessForm(true)}
                          size="sm" 
                          className="cta-button"
                          role="button"
                          aria-label="Join the waitlist for early bird discount"
                        >
                          Join Waitlist
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Early Access Form Modal */}
      <EarlyAccessForm 
        isOpen={showEarlyAccessForm} 
        onClose={() => setShowEarlyAccessForm(false)} 
      />
    </header>
  );
}