import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, X, Link as LinkIcon, TrendingUp, Shield, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';

interface Holding {
  ticker: string;
  quantity: number;
  avgCost: number;
}

interface PortfolioEntryProps {
  onComplete: (holdings: Holding[]) => void;
  onBack: () => void;
}

export function PortfolioEntry({ onComplete, onBack }: PortfolioEntryProps) {
  const [entryMethod, setEntryMethod] = useState<'brokerage' | 'manual' | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([
    { ticker: '', quantity: 0, avgCost: 0 },
  ]);
  const [isConnecting, setIsConnecting] = useState(false);

  const brokerages = [
    { name: 'Robinhood', logo: '🏹', popular: true },
    { name: 'Fidelity', logo: '💼', popular: true },
    { name: 'Charles Schwab', logo: '🏦', popular: true },
    { name: 'Interactive Brokers', logo: '📊', popular: true },
    { name: 'Webull', logo: '🚀', popular: false },
    { name: 'TD Ameritrade', logo: '📈', popular: false },
    { name: 'E*TRADE', logo: '💹', popular: false },
    { name: 'Other...', logo: '➕', popular: false },
  ];

  const handleBrokerageConnect = async (brokerage: string) => {
    setIsConnecting(true);
    // Simulate Plaid connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock holdings data
    const mockHoldings: Holding[] = [
      { ticker: 'AAPL', quantity: 50, avgCost: 150.00 },
      { ticker: 'MSFT', quantity: 30, avgCost: 320.00 },
      { ticker: 'GOOGL', quantity: 20, avgCost: 140.00 },
      { ticker: 'NVDA', quantity: 15, avgCost: 450.00 },
      { ticker: 'TSLA', quantity: 10, avgCost: 240.00 },
    ];
    
    setIsConnecting(false);
    onComplete(mockHoldings);
  };

  const addHolding = () => {
    setHoldings([...holdings, { ticker: '', quantity: 0, avgCost: 0 }]);
  };

  const removeHolding = (index: number) => {
    setHoldings(holdings.filter((_, i) => i !== index));
  };

  const updateHolding = (index: number, field: keyof Holding, value: string | number) => {
    const newHoldings = [...holdings];
    newHoldings[index] = { ...newHoldings[index], [field]: value };
    setHoldings(newHoldings);
  };

  const handleManualSubmit = () => {
    const validHoldings = holdings.filter(h => h.ticker && h.quantity > 0);
    if (validHoldings.length > 0) {
      onComplete(validHoldings);
    }
  };

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-background dark flex items-center justify-center p-4">
        <Card className="p-12 text-center max-w-md border-purple-500/20">
          <Loader2 className="h-16 w-16 animate-spin text-purple-500 mx-auto mb-6" />
          <h3 className="text-2xl mb-4">Connecting Securely...</h3>
          <div className="space-y-3 text-left text-sm text-muted-foreground">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Fetching your holdings...</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Retrieving market data...</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Running AI analysis...</span>
            </motion.div>
          </div>
        </Card>
      </div>
    );
  }

  if (!entryMethod) {
    return (
      <div className="min-h-screen bg-background dark flex items-center justify-center p-4">
        <div className="max-w-5xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl mb-4">Add Your Holdings</h2>
            <p className="text-lg text-muted-foreground">
              Choose how you'd like to import your portfolio
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Brokerage Connect */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-8 h-full border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 transition-all cursor-pointer"
                    onClick={() => setEntryMethod('brokerage')}>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-4">
                  Recommended
                </Badge>
                <LinkIcon className="h-12 w-12 text-purple-400 mb-4" />
                <h3 className="text-2xl mb-3">Connect Brokerage</h3>
                <p className="text-muted-foreground mb-6">
                  Instant sync with automatic updates. Secure read-only access via Plaid.
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span>Bank-level security. We never trade on your behalf.</span>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                  Connect Now
                </Button>
              </Card>
            </motion.div>

            {/* Manual Entry */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-8 h-full border-border hover:border-purple-500/30 transition-all cursor-pointer"
                    onClick={() => setEntryMethod('manual')}>
                <TrendingUp className="h-12 w-12 text-blue-400 mb-4" />
                <h3 className="text-2xl mb-3">Manual Entry</h3>
                <p className="text-muted-foreground mb-6">
                  Add your holdings manually. Quick setup in under 2 minutes.
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <span>✓ Full control over your data</span>
                </div>
                <Button variant="outline" className="w-full border-purple-500/30 hover:bg-purple-500/10">
                  Add Manually
                </Button>
              </Card>
            </motion.div>
          </div>

          <div className="text-center mt-8">
            <Button variant="ghost" onClick={onBack}>
              ← Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (entryMethod === 'brokerage') {
    return (
      <div className="min-h-screen bg-background dark flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl mb-4">Select Your Brokerage</h2>
            <p className="text-lg text-muted-foreground">
              We'll securely connect via Plaid for instant portfolio sync
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {brokerages.map((brokerage, idx) => (
              <motion.div
                key={brokerage.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card
                  className="p-6 text-center cursor-pointer hover:border-purple-500/30 hover:bg-purple-500/5 transition-all"
                  onClick={() => handleBrokerageConnect(brokerage.name)}
                >
                  <div className="text-4xl mb-3">{brokerage.logo}</div>
                  <div className="font-medium mb-1">{brokerage.name}</div>
                  {brokerage.popular && (
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                      Popular
                    </Badge>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="p-6 bg-blue-500/5 border-blue-500/20">
            <div className="flex gap-4">
              <Shield className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-2">Your Security is Our Priority</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Read-only access - we can never execute trades</li>
                  <li>✓ Bank-level 256-bit encryption</li>
                  <li>✓ Powered by Plaid - trusted by 11,000+ apps</li>
                  <li>✓ Disconnect anytime from your dashboard</li>
                </ul>
              </div>
            </div>
          </Card>

          <div className="text-center mt-8">
            <Button variant="ghost" onClick={() => setEntryMethod(null)}>
              ← Back to Options
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Manual Entry
  return (
    <div className="min-h-screen bg-background dark flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl mb-4">Add Your Holdings</h2>
          <p className="text-lg text-muted-foreground">
            Add your top 5 holdings to start. You can add more later.
          </p>
        </motion.div>

        <Card className="p-8">
          <div className="space-y-6">
            {holdings.map((holding, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="grid grid-cols-12 gap-4 items-end"
              >
                <div className="col-span-4">
                  <Label>Ticker</Label>
                  <Input
                    placeholder="e.g., AAPL"
                    value={holding.ticker}
                    onChange={(e) => updateHolding(idx, 'ticker', e.target.value.toUpperCase())}
                    className="mt-2"
                  />
                </div>
                <div className="col-span-3">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={holding.quantity || ''}
                    onChange={(e) => updateHolding(idx, 'quantity', parseFloat(e.target.value) || 0)}
                    className="mt-2"
                  />
                </div>
                <div className="col-span-4">
                  <Label>Avg Cost</Label>
                  <Input
                    type="number"
                    placeholder="150.00"
                    value={holding.avgCost || ''}
                    onChange={(e) => updateHolding(idx, 'avgCost', parseFloat(e.target.value) || 0)}
                    className="mt-2"
                  />
                </div>
                <div className="col-span-1">
                  {holdings.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeHolding(idx)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={addHolding}
            className="w-full mt-6 border-purple-500/30 hover:bg-purple-500/10"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Holding
          </Button>

          <div className="flex gap-4 mt-8">
            <Button
              variant="outline"
              onClick={() => setEntryMethod(null)}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleManualSubmit}
              disabled={holdings.filter(h => h.ticker && h.quantity > 0).length === 0}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              Analyze My Portfolio
            </Button>
          </div>

          <p className="text-sm text-muted-foreground text-center mt-4">
            You can add more later. 5 holdings are enough for accurate analysis.
          </p>
        </Card>
      </div>
    </div>
  );
}
