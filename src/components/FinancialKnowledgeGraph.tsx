import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Network, 
  Target, 
  BarChart3, 
  ArrowRight,
  ArrowDown,
  ArrowUp,
  Eye,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';

interface Entity {
  id: string;
  name: string;
  type: 'stock' | 'sector' | 'event' | 'factor';
  value?: string;
  change?: number;
  impact?: 'high' | 'medium' | 'low';
  confidence?: number;
}

interface Relationship {
  from: string;
  to: string;
  type: 'correlation' | 'causation' | 'influence' | 'sector_relation';
  strength: number;
  description: string;
}

const entities: Entity[] = [
  { id: 'AAPL', name: 'Apple Inc.', type: 'stock', value: '$175.23', change: 2.3, impact: 'high', confidence: 87 },
  { id: 'MSFT', name: 'Microsoft', type: 'stock', value: '$420.15', change: 1.8, impact: 'high', confidence: 91 },
  { id: 'TECH', name: 'Technology', type: 'sector', change: 1.9, impact: 'high', confidence: 85 },
  { id: 'FED_RATE', name: 'Fed Interest Rate', type: 'factor', value: '5.25%', change: 0, impact: 'high', confidence: 95 },
  { id: 'EARNINGS', name: 'Q4 Earnings Season', type: 'event', impact: 'medium', confidence: 78 },
  { id: 'AI_TREND', name: 'AI Technology Trend', type: 'factor', impact: 'high', confidence: 82 }
];

const relationships: Relationship[] = [
  {
    from: 'FED_RATE',
    to: 'TECH',
    type: 'causation',
    strength: 0.8,
    description: 'Higher interest rates negatively impact growth stocks'
  },
  {
    from: 'AI_TREND',
    to: 'AAPL',
    type: 'influence',
    strength: 0.75,
    description: 'AI investments boost Apple\'s innovation potential'
  },
  {
    from: 'TECH',
    to: 'AAPL',
    type: 'sector_relation',
    strength: 0.9,
    description: 'Apple is a major component of technology sector'
  },
  {
    from: 'EARNINGS',
    to: 'MSFT',
    type: 'influence',
    strength: 0.65,
    description: 'Earnings results drive near-term price movements'
  }
];

const marketEvents = [
  {
    time: '2 hours ago',
    event: 'Fed Chair Powell Speech',
    impact: 'High',
    sentiment: 'Neutral',
    affectedEntities: ['FED_RATE', 'TECH'],
    description: 'Comments on future rate policy direction'
  },
  {
    time: '4 hours ago',
    event: 'AAPL AI Partnership Rumor',
    impact: 'Medium',
    sentiment: 'Positive',
    affectedEntities: ['AAPL', 'AI_TREND'],
    description: 'Speculation about major AI integration announcement'
  },
  {
    time: '6 hours ago',
    event: 'Tech Sector Rotation',
    impact: 'Medium',
    sentiment: 'Mixed',
    affectedEntities: ['TECH', 'AAPL', 'MSFT'],
    description: 'Institutional investors rebalancing tech exposure'
  }
];

const causalChains = [
  {
    chain: ['FED_RATE', 'TECH', 'AAPL'],
    description: 'Fed policy → Sector performance → Individual stock impact',
    probability: 0.82,
    timeframe: '1-3 months'
  },
  {
    chain: ['AI_TREND', 'AAPL'],
    description: 'Technology trend → Direct company benefit',
    probability: 0.75,
    timeframe: '6-12 months'
  }
];

export function FinancialKnowledgeGraph() {
  const [selectedEntity, setSelectedEntity] = useState<string | null>('AAPL');
  const [selectedTab, setSelectedTab] = useState('network');
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey(prev => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getEntityConnections = (entityId: string) => {
    return relationships.filter(rel => rel.from === entityId || rel.to === entityId);
  };

  const getChangeIcon = (change?: number) => {
    if (!change) return <Clock className="w-4 h-4 text-gray-400" />;
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    return <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  const getImpactColor = (impact?: string) => {
    switch (impact) {
      case 'high': return 'text-red-500 bg-red-500/20';
      case 'medium': return 'text-orange-500 bg-orange-500/20';
      case 'low': return 'text-yellow-500 bg-yellow-500/20';
      default: return 'text-gray-500 bg-gray-500/20';
    }
  };

  const NetworkVisualization = () => (
    <div className="relative h-96 bg-gradient-to-br from-slate-900/50 to-blue-900/30 rounded-lg p-6 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      {/* Central Node */}
      <motion.div
        key={`central-${animationKey}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-white/30 flex items-center justify-center cursor-pointer ${
          selectedEntity === 'AAPL' ? 'ring-4 ring-blue-400/50' : ''
        }`}
        onClick={() => setSelectedEntity('AAPL')}
        >
          <span className="text-white font-semibold text-sm">AAPL</span>
        </div>
      </motion.div>

      {/* Surrounding Nodes */}
      {entities.filter(e => e.id !== 'AAPL').map((entity, index) => {
        const angle = (index * 360) / 5;
        const radius = 120;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <motion.div
            key={`${entity.id}-${animationKey}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="absolute top-1/2 left-1/2"
            style={{
              transform: `translate(${x - 32}px, ${y - 32}px)`
            }}
          >
            <div
              className={`w-12 h-12 rounded-full bg-gradient-to-br ${
                entity.type === 'stock' ? 'from-green-500 to-emerald-600' :
                entity.type === 'sector' ? 'from-orange-500 to-red-600' :
                entity.type === 'event' ? 'from-purple-500 to-pink-600' :
                'from-gray-500 to-slate-600'
              } border border-white/20 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform ${
                selectedEntity === entity.id ? 'ring-2 ring-white/50' : ''
              }`}
              onClick={() => setSelectedEntity(entity.id)}
            >
              <span className="text-white text-xs font-medium">
                {entity.type === 'stock' ? entity.name.split(' ')[0] :
                 entity.type === 'sector' ? 'TECH' :
                 entity.type === 'event' ? 'E' : 'F'}
              </span>
            </div>

            {/* Connection Lines */}
            {getEntityConnections(entity.id).map((rel, relIndex) => {
              const isFromEntity = rel.from === entity.id;
              const opacity = rel.strength;
              
              return (
                <motion.div
                  key={`line-${rel.from}-${rel.to}-${animationKey}`}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                >
                  <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ width: '400px', height: '400px', top: '-200px', left: '-200px' }}>
                    <line
                      x1="200"
                      y1="200"
                      x2={200 + x}
                      y2={200 + y}
                      stroke={rel.type === 'causation' ? '#ef4444' : rel.type === 'correlation' ? '#3b82f6' : '#10b981'}
                      strokeWidth="2"
                      strokeOpacity={opacity}
                      strokeDasharray={rel.type === 'influence' ? '5,5' : 'none'}
                    />
                  </svg>
                </motion.div>
              );
            })}
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-blue-500" />
            <CardTitle>Financial Knowledge Graph</CardTitle>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live Analysis
          </Badge>
        </div>
        <CardDescription>
          Interconnected market intelligence and relationship mapping
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="network">Network View</TabsTrigger>
            <TabsTrigger value="events">Event Stream</TabsTrigger>
            <TabsTrigger value="causality">Causal Chains</TabsTrigger>
            <TabsTrigger value="entities">Entity Details</TabsTrigger>
          </TabsList>

          <TabsContent value="network" className="space-y-4">
            <NetworkVisualization />
            
            {selectedEntity && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">
                      {entities.find(e => e.id === selectedEntity)?.name || selectedEntity}
                    </h4>
                    <Badge className={getImpactColor(entities.find(e => e.id === selectedEntity)?.impact)}>
                      {entities.find(e => e.id === selectedEntity)?.impact?.toUpperCase()} IMPACT
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Current Value:</span>
                      <span className="font-medium">{entities.find(e => e.id === selectedEntity)?.value || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">24h Change:</span>
                      <div className="flex items-center gap-1">
                        {getChangeIcon(entities.find(e => e.id === selectedEntity)?.change)}
                        <span className={entities.find(e => e.id === selectedEntity)?.change && entities.find(e => e.id === selectedEntity)!.change! > 0 ? 'text-green-500' : 'text-red-500'}>
                          {entities.find(e => e.id === selectedEntity)?.change ? `${entities.find(e => e.id === selectedEntity)?.change}%` : 'No change'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">AI Confidence:</span>
                      <span className="font-medium">{entities.find(e => e.id === selectedEntity)?.confidence || 0}%</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h5 className="font-medium text-sm mb-2">Connected Entities:</h5>
                    <div className="flex flex-wrap gap-1">
                      {getEntityConnections(selectedEntity).map((rel, index) => {
                        const connectedEntity = rel.from === selectedEntity ? rel.to : rel.from;
                        return (
                          <Badge key={index} variant="outline" className="text-xs">
                            {entities.find(e => e.id === connectedEntity)?.name || connectedEntity}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            {marketEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={event.sentiment === 'Positive' ? 'default' : event.sentiment === 'Negative' ? 'destructive' : 'secondary'}>
                          {event.sentiment}
                        </Badge>
                        <Badge className={getImpactColor(event.impact.toLowerCase())}>
                          {event.impact} Impact
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{event.time}</span>
                    </div>
                    <h4 className="font-semibold mb-1">{event.event}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {event.affectedEntities.map((entityId, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {entities.find(e => e.id === entityId)?.name || entityId}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="causality" className="space-y-4">
            {causalChains.map((chain, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">Causal Chain {index + 1}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{chain.probability * 100}% probability</Badge>
                        <Badge variant="outline">{chain.timeframe}</Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      {chain.chain.map((entityId, idx) => (
                        <React.Fragment key={entityId}>
                          <Badge variant="outline" className="px-3 py-1">
                            {entities.find(e => e.id === entityId)?.name || entityId}
                          </Badge>
                          {idx < chain.chain.length - 1 && (
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{chain.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="entities" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {entities.map((entity, index) => (
                <motion.div
                  key={entity.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={selectedEntity === entity.id ? 'ring-2 ring-blue-500/50' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {entity.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <h4 className="font-semibold">{entity.name}</h4>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedEntity(entity.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {entity.value && (
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Value:</span>
                          <span className="font-medium">{entity.value}</span>
                        </div>
                      )}
                      
                      {entity.change !== undefined && (
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Change:</span>
                          <div className="flex items-center gap-1">
                            {getChangeIcon(entity.change)}
                            <span className={entity.change > 0 ? 'text-green-500' : 'text-red-500'}>
                              {entity.change}%
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Confidence:</span>
                        <span className="font-medium">{entity.confidence}%</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}