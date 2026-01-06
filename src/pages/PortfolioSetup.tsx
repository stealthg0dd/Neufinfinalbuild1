import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Building2, Plus, Trash2, TrendingUp, AlertCircle, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlaidLink } from 'react-plaid-link';
import { supabase } from '../utils/supabase/client';
import { createLinkToken, exchangePublicToken, saveManualPortfolio } from '../api/plaid';
import { toast } from 'sonner';

interface Holding {
  symbol: string;
  shares: number;
  avgCost: number;
}

export function PortfolioSetup() {
  const [setupMethod, setSetupMethod] = useState<'plaid' | 'manual' | null>(null);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [manualPositions, setManualPositions] = useState([
    { symbol: '', shares: '', costBasis: '', purchaseDate: '' }
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        try {
          const token = await createLinkToken(user.id)
          setLinkToken(token)
        } catch (error) {
          console.error('Plaid init failed:', error)
          toast.error('Plaid integration temporarily unavailable')
        }
      }
    }
    init()
  }, [])

  const onPlaidSuccess = async (publicToken: string) => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      await exchangePublicToken(publicToken, user.id)
      toast.success('Brokerage connected successfully!')
      navigate('/user-dashboard')
    } catch (error) {
      toast.error('Failed to connect brokerage')
    } finally {
      setLoading(false)
    }
  }

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: onPlaidSuccess,
  })

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      const validPositions = manualPositions
        .filter(p => p.symbol && p.shares && p.costBasis)
        .map(p => ({
          symbol: p.symbol,
          shares: parseFloat(p.shares),
          costBasis: parseFloat(p.costBasis),
          purchaseDate: p.purchaseDate || undefined,
        }))

      await saveManualPortfolio(user.id, validPositions)
      toast.success('Portfolio saved successfully!')
      navigate('/user-dashboard')
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save portfolio')
    } finally {
      setLoading(false)
    }
  }

  const addPosition = () => {
    setManualPositions([...manualPositions, { symbol: '', shares: '', costBasis: '', purchaseDate: '' }])
  }

  const removePosition = (index: number) => {
    setManualPositions(manualPositions.filter((_, i) => i !== index))
  }

  const updatePosition = (index: number, field: string, value: string) => {
    const newPositions = [...manualPositions]
    newPositions[index] = { ...newPositions[index], [field]: value }
    setManualPositions(newPositions)
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Badge className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400 border-purple-500/30 mb-4">
              <TrendingUp className="h-3 w-3 mr-1" />
              Step 1: Portfolio Setup
            </Badge>
            
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--heading-primary)' }}>
              Connect Your Portfolio
            </h1>
            <p className="text-muted-foreground">
              Link your brokerage account or manually enter your holdings to get started
            </p>
          </div>

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center space-x-3"
            >
              <Check className="h-5 w-5 text-green-400" />
              <p className="text-green-400">Portfolio saved successfully! Redirecting to dashboard...</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center space-x-3"
            >
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="text-red-400">{error}</p>
            </motion.div>
          )}

          {!setupMethod ? (
            <>
              {/* Info Banner */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg"
              >
                <p className="text-sm text-blue-400">
                  <strong>Note:</strong> Plaid integration requires API credentials to be configured. 
                  If you encounter any issues with the brokerage connection, please use the Manual Entry option below.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Plaid Option */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="cursor-pointer hover:border-purple-500/50 transition-all h-full"
                    onClick={() => setSetupMethod('plaid')}
                  >
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-3 bg-purple-500/20 rounded-lg">
                        <Building2 className="h-6 w-6 text-purple-400" />
                      </div>
                      <CardTitle>Connect Brokerage</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Securely connect your brokerage account via Plaid for automatic portfolio sync
                    </p>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        <span>Real-time portfolio updates</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        <span>Bank-level encryption</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        <span>Automatic trade tracking</span>
                      </li>
                    </ul>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      Recommended
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Manual Option */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className="cursor-pointer hover:border-purple-500/50 transition-all h-full"
                  onClick={() => setSetupMethod('manual')}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-3 bg-blue-500/20 rounded-lg">
                        <Plus className="h-6 w-6 text-blue-400" />
                      </div>
                      <CardTitle>Manual Entry</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Manually enter your portfolio holdings and update them as needed
                    </p>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                        <span>Full control over data</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                        <span>No account linking required</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                        <span>Quick setup</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
              </div>
            </>
          ) : setupMethod === 'plaid' ? (
            <Card>
              <CardHeader>
                <CardTitle>Connect Your Brokerage Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-sm text-yellow-400">
                    <strong>Note:</strong> Plaid integration requires additional API setup and credentials. 
                    For this demo, please use Manual Entry or contact support to enable Plaid integration.
                  </p>
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={() => open()}
                    disabled={loading || !ready}
                    className="bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    {loading ? 'Connecting...' : 'Launch Plaid Link'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSetupMethod(null)}
                  >
                    Back to Options
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Enter Your Portfolio Holdings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {manualPositions.map((position, index) => (
                    <div key={index} className="flex gap-3 items-end">
                      <div className="flex-1">
                        <Label htmlFor={`symbol-${index}`}>Stock Symbol</Label>
                        <Input
                          id={`symbol-${index}`}
                          placeholder="AAPL"
                          value={position.symbol}
                          onChange={(e) => updatePosition(index, 'symbol', e.target.value.toUpperCase())}
                          className="bg-background/50"
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={`shares-${index}`}>Shares</Label>
                        <Input
                          id={`shares-${index}`}
                          type="number"
                          placeholder="100"
                          value={position.shares}
                          onChange={(e) => updatePosition(index, 'shares', e.target.value)}
                          className="bg-background/50"
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={`costBasis-${index}`}>Avg Cost ($)</Label>
                        <Input
                          id={`costBasis-${index}`}
                          type="number"
                          step="0.01"
                          placeholder="150.00"
                          value={position.costBasis}
                          onChange={(e) => updatePosition(index, 'costBasis', e.target.value)}
                          className="bg-background/50"
                        />
                      </div>
                      {manualPositions.length > 1 && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removePosition(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={addPosition}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Holding
                </Button>

                <Separator />

                <div className="flex space-x-4">
                  <Button
                    onClick={handleManualSubmit}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    {loading ? 'Saving...' : 'Save Portfolio'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSetupMethod(null)}
                    disabled={loading}
                  >
                    Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
