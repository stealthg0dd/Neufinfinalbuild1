import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { TrendingUp, TrendingDown, Clock, AlertCircle, CheckCircle, Target, Lightbulb, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { projectId } from '../utils/supabase/info';

const BiasImpactIndicator = ({ bias, impact }: { bias: string; impact: number }) => {
  const biasConfig: Record<string, any> = {
    loss_aversion: { color: 'text-red-400', bg: 'bg-red-500/20', label: 'Loss Aversion' },
    confirmation: { color: 'text-orange-400', bg: 'bg-orange-500/20', label: 'Confirmation Bias' },
    anchoring_bias: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Anchoring Bias' }
  };

  const config = biasConfig[bias] || biasConfig.loss_aversion;

  return (
    <div className={`flex items-center space-x-2 p-2 rounded-lg ${config.bg}`}>
      <AlertCircle className={`h-4 w-4 ${config.color}`} />
      <div>
        <p className={`text-xs font-medium ${config.color}`}>{config.label}</p>
        <p className="text-xs text-muted-foreground">
          Cost: ${Math.abs(impact).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

interface PerformanceSummaryProps {
  accessToken?: string;
}

export function PerformanceSummary({ accessToken }: PerformanceSummaryProps) {
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-22c8dcd8/portfolio/performance?timeframe=24h`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setPerformanceData(data);
        }
      } catch (error) {
        console.error('Error fetching performance:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerformance();
  }, [accessToken]);

  if (isLoading) {
    return (
      <Card className="bg-card/50">
        <CardContent className="p-8 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const overall = performanceData?.overall || { change: 0, value: '$0', previousValue: '$0', timeframe: '24h' };
  const positions = performanceData?.positions || [];
  const missedOpportunities = performanceData?.missedOpportunities || [];
  const totalMissedValue = missedOpportunities.reduce(
    (sum: number, opp: any) => sum + (opp.potentialSaving || opp.potentialGain || 0), 0
  );

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Clock className="h-5 w-5 text-blue-400" />
            </motion.div>
            <CardTitle>24H Performance Summary</CardTitle>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <AlertCircle className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Neural Twin Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Real-time comparison of your decisions vs. bias-free neural twin recommendations 
                    over the past 24 hours.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <Badge 
            variant="secondary" 
            className={`${
              overall.change >= 0 
                ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border-red-500/30'
            }`}
          >
            <Clock className="h-3 w-3 mr-1" />
            Last 24h
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Performance */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              {overall.change >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
              <span className="text-sm text-muted-foreground">Portfolio Value</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{overall.value}</p>
              <p className={`text-sm ${
                overall.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {overall.change >= 0 ? '+' : ''}{overall.change.toFixed(2)}%
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-muted-foreground">Missed Alpha</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400">
                {totalMissedValue > 0 ? `-$${totalMissedValue.toLocaleString()}` : '$0'}
              </p>
              <p className="text-sm text-muted-foreground">Could have saved/gained</p>
            </div>
          </div>
        </div>

        {/* Position Breakdown */}
        {positions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Position Performance</span>
            </h4>
            
            <div className="space-y-2">
              {positions.slice(0, 4).map((position: any, index: number) => (
                <motion.div
                  key={position.symbol}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      position.change >= 0 ? 'bg-green-400' : 'bg-red-400'
                    }`} />
                    <div>
                      <p className="font-medium">{position.symbol}</p>
                      <p className="text-sm text-muted-foreground">{position.value}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {position.bias && position.impact < 0 && (
                      <BiasImpactIndicator bias={position.bias} impact={position.impact} />
                    )}
                    <div className="text-right">
                      <p className={`font-medium ${
                        position.change >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {position.change >= 0 ? '+' : ''}{position.change.toFixed(1)}%
                      </p>
                      {position.impact < 0 && (
                        <p className="text-xs text-red-400">-${Math.abs(position.impact)}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* What Could Have Been Better */}
        {missedOpportunities.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center space-x-2">
              <Lightbulb className="h-4 w-4 text-yellow-400" />
              <span>Neural Twin Insights</span>
            </h4>
            
            <div className="space-y-3">
              {missedOpportunities.slice(0, 3).map((opportunity: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-400">{opportunity.action}</p>
                        <p className="text-xs text-muted-foreground">{opportunity.reasoning}</p>
                      </div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        opportunity.confidence === 'High' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {opportunity.confidence}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Bias: <span className="text-orange-400">{opportunity.bias?.replace('_', ' ')}</span>
                    </p>
                    <p className={`text-sm font-medium ${
                      opportunity.potentialSaving ? 'text-green-400' : 'text-blue-400'
                    }`}>
                      {opportunity.potentialSaving ? 'Save' : 'Gain'}: $
                      {(opportunity.potentialSaving || opportunity.potentialGain || 0).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Zap className="h-4 w-4 mr-2" />
            Apply Neural Twin Recommendations
          </Button>
        </motion.div>

        {!performanceData && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No performance data available yet</p>
            <p className="text-xs text-muted-foreground mt-2">Data will appear after 24 hours of trading</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
