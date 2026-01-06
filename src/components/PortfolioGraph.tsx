import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Info, Play, ZoomIn } from 'lucide-react';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { projectId } from '../utils/supabase/info';

const timeframes = [
  { value: '1M', label: '1 Month' },
  { value: '3M', label: '3 Months' },
  { value: '6M', label: '6 Months' },
  { value: '1Y', label: '1 Year' },
  { value: 'ALL', label: 'All Time' }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm">
                {entry.dataKey === 'actual' ? 'Your Portfolio' : 
                 entry.dataKey === 'biasCorrect' ? 'Bias-Free Twin' : 'Market'}
              </span>
            </div>
            <span className="font-medium">${entry.value.toLocaleString()}</span>
          </div>
        ))}
        {data.delta > 0 && (
          <div className="mt-2 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Missed Opportunity:</span>
              <span className="font-medium text-red-400">-${data.delta.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

interface PortfolioGraphProps {
  accessToken?: string;
}

export function PortfolioGraph({ accessToken }: PortfolioGraphProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1Y');
  const [simulationRiskTolerance, setSimulationRiskTolerance] = useState([7]);
  const [simulationBiasReduction, setSimulationBiasReduction] = useState([85]);
  const [portfolioData, setPortfolioData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [performance, setPerformance] = useState({ yourReturn: 0, biasFreeProcedure: 0, marketReturn: 0, gap: 0 });

  useEffect(() => {
    const fetchPerformanceData = async () => {
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-22c8dcd8/portfolio/performance?timeframe=${selectedTimeframe}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.chartData && data.chartData.length > 0) {
            setPortfolioData(data.chartData);
            setPerformance({
              yourReturn: data.yourReturn || 0,
              biasFreeProcedure: data.biasFreeFeaturn || 0,
              marketReturn: data.marketReturn || 0,
              gap: data.gap || 0,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching performance data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerformanceData();
  }, [accessToken, selectedTimeframe]);

  if (isLoading) {
    return (
      <Card className="bg-card/50">
        <CardContent className="p-8 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle>Twin Snapshot: Bias-Corrected Performance</CardTitle>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Info className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Twin Snapshot</h4>
                  <p className="text-sm text-muted-foreground">
                    Compares your actual portfolio performance with a bias-free "neural twin" 
                    that makes optimal decisions without emotional interference.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex items-center space-x-4">
            {performance.gap > 0 && (
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30">
                  Gap: ${(performance.gap / 1000).toFixed(1)}K
                </Badge>
              </motion.div>
            )}
            
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeframes.map((tf) => (
                  <SelectItem key={tf.value} value={tf.value}>
                    {tf.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Dialog>
              <DialogTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Simulate Adjustments
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Portfolio What-If Scenarios</DialogTitle>
                </DialogHeader>
                
                <Tabs defaultValue="bias-reduction" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="bias-reduction">Bias Reduction</TabsTrigger>
                    <TabsTrigger value="risk-adjustment">Risk Adjustment</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="bias-reduction" className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Bias Reduction Level: {simulationBiasReduction[0]}%
                        </label>
                        <Slider
                          value={simulationBiasReduction}
                          onValueChange={setSimulationBiasReduction}
                          max={100}
                          min={0}
                          step={5}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div>
                          <p className="text-sm text-muted-foreground">Projected Annual Return</p>
                          <p className="text-xl font-semibold text-green-400">
                            +{(performance.yourReturn + (simulationBiasReduction[0] / 100) * 15).toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Additional Alpha</p>
                          <p className="text-xl font-semibold text-blue-400">
                            +{((simulationBiasReduction[0] / 100) * 15).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="risk-adjustment" className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Risk Tolerance: {simulationRiskTolerance[0]}/10
                        </label>
                        <Slider
                          value={simulationRiskTolerance}
                          onValueChange={setSimulationRiskTolerance}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div>
                          <p className="text-sm text-muted-foreground">Expected Volatility</p>
                          <p className="text-xl font-semibold text-orange-400">
                            {(12 + simulationRiskTolerance[0] * 2).toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                          <p className="text-xl font-semibold text-purple-400">
                            {(1.2 + simulationRiskTolerance[0] * 0.1).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline">Reset</Button>
                  <Button>Apply Simulation</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Your Portfolio</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Bias-Free Twin</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span>Market Benchmark</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {portfolioData.length > 0 ? (
          <>
            <div className="h-80 relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={portfolioData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#1E40AF' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="biasCorrect" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={false}
                    activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: '#059669' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="market" 
                    stroke="#6B7280" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, stroke: '#6B7280', strokeWidth: 2, fill: '#4B5563' }}
                  />
                </LineChart>
              </ResponsiveContainer>
              
              <div className="absolute top-4 right-4">
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-60 hover:opacity-100">
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <motion.div 
                className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg cursor-pointer"
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(59, 130, 246, 0.15)' }}
              >
                <p className="text-lg font-semibold text-blue-400">+{performance.yourReturn.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Your Return</p>
              </motion.div>
              <motion.div 
                className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg cursor-pointer"
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(16, 185, 129, 0.15)' }}
              >
                <p className="text-lg font-semibold text-green-400">+{performance.biasFreeProcedure.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Bias-Free Return</p>
              </motion.div>
              <motion.div 
                className="p-4 bg-gray-500/10 border border-gray-500/30 rounded-lg cursor-pointer"
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(107, 114, 128, 0.15)' }}
              >
                <p className="text-lg font-semibold text-gray-400">+{performance.marketReturn.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Market Return</p>
              </motion.div>
            </div>
          </>
        ) : (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">No performance data available</p>
              <p className="text-xs text-muted-foreground mt-2">Data will appear as your portfolio grows</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
