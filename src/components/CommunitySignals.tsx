import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { MessageSquare, TrendingUp, Users, ThumbsUp, Share, Plus, Bell, Filter, Heart, Repeat, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

const signals = [
  {
    id: 1,
    user: 'AlphaTrader_Pro',
    avatar: 'AT',
    verified: true,
    signal: 'LONG NVDA',
    ticker: 'NVDA',
    price: '$487.32',
    target: '$520',
    stopLoss: '$465',
    confidence: 'High',
    timeAgo: '2m ago',
    likes: 24,
    comments: 8,
    shares: 3,
    followers: '2.3K',
    accuracy: '89%',
    type: 'signal',
    isLiked: false,
    isFollowing: false
  },
  {
    id: 2,
    user: 'QuantMaster',
    avatar: 'QM',
    verified: false,
    signal: 'SHORT SPY',
    ticker: 'SPY',
    price: '$442.18',
    target: '$435',
    stopLoss: '$448',
    confidence: 'Medium',
    timeAgo: '8m ago',
    likes: 18,
    comments: 12,
    shares: 2,
    followers: '1.8K',
    accuracy: '76%',
    type: 'signal',
    isLiked: true,
    isFollowing: true
  },
  {
    id: 3,
    user: 'TechAnalyst_',
    avatar: 'TA',
    verified: true,
    content: 'The semiconductor sector is showing strong momentum. Key levels to watch on NVDA: Support at $480, resistance at $520. Volume profile suggests continuation.',
    timeAgo: '15m ago',
    likes: 32,
    comments: 15,
    shares: 7,
    followers: '3.1K',
    accuracy: '82%',
    type: 'insight',
    isLiked: false,
    isFollowing: false
  },
  {
    id: 4,
    user: 'CryptoKing99',
    avatar: 'CK',
    verified: false,
    signal: 'LONG COIN',
    ticker: 'COIN',
    price: '$68.45',
    target: '$75',
    stopLoss: '$65',
    confidence: 'Medium',
    timeAgo: '23m ago',
    likes: 15,
    comments: 6,
    shares: 1,
    followers: '1.2K',
    accuracy: '71%',
    type: 'signal',
    isLiked: false,
    isFollowing: false
  },
  {
    id: 5,
    user: 'MarketWizard_AI',
    avatar: 'MW',
    verified: true,
    content: '🔥 Portfolio update: +23.7% this week! My bias-corrected approach is paying off. Key insight: Momentum strategies outperforming in this volatile environment.',
    timeAgo: '45m ago',
    likes: 89,
    comments: 23,
    shares: 12,
    followers: '5.2K',
    accuracy: '94%',
    type: 'update',
    isLiked: true,
    isFollowing: true
  },
  {
    id: 6,
    user: 'RiskManager_Pro',
    avatar: 'RM',
    verified: true,
    signal: 'HEDGE VIX CALL',
    ticker: 'VIX',
    price: '$18.50',
    target: '$22',
    stopLoss: '$17',
    confidence: 'High',
    timeAgo: '1h ago',
    likes: 41,
    comments: 18,
    shares: 9,
    followers: '3.8K',
    accuracy: '85%',
    type: 'signal',
    isLiked: false,
    isFollowing: false
  }
];

const SignalCard = ({ signal, onLike, onShare, onComment, onFollow }: any) => {
  const [isLiked, setIsLiked] = useState(signal.isLiked);
  const [isFollowing, setIsFollowing] = useState(signal.isFollowing);
  const [likes, setLikes] = useState(signal.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    onLike(signal.id);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    onFollow(signal.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-muted/30 rounded-lg hover:bg-muted/40 transition-all border border-border/50"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/20 text-primary text-sm">
                {signal.avatar}
              </AvatarFallback>
            </Avatar>
            {signal.verified && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-sm">{signal.user}</h4>
              <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                {signal.accuracy} Accuracy
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{signal.followers} followers</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">{signal.timeAgo}</span>
          <Button
            variant={isFollowing ? "secondary" : "outline"}
            size="sm"
            className="h-6 text-xs"
            onClick={handleFollow}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        </div>
      </div>
      
      {signal.type === 'signal' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div 
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                  signal.signal.includes('LONG') 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : signal.signal.includes('SHORT')
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <TrendingUp className="h-3 w-3" />
                <span>{signal.signal}</span>
              </motion.div>
              <div className="text-sm">
                <span className="text-muted-foreground">Entry: </span>
                <span className="font-medium">{signal.price}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Target: </span>
                <span className="font-medium text-green-400">{signal.target}</span>
              </div>
            </div>
            <Badge variant={signal.confidence === 'High' ? 'default' : 'secondary'} className="text-xs">
              {signal.confidence} Confidence
            </Badge>
          </div>
          
          {signal.stopLoss && (
            <div className="text-sm">
              <span className="text-muted-foreground">Stop Loss: </span>
              <span className="font-medium text-red-400">{signal.stopLoss}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-3">
          <p className="text-sm text-foreground">{signal.content}</p>
        </div>
      )}
      
      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="flex items-center space-x-4">
          <motion.button
            className={`flex items-center space-x-1 text-xs transition-colors ${
              isLiked ? 'text-red-400' : 'text-muted-foreground hover:text-red-400'
            }`}
            onClick={handleLike}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart className={`h-3 w-3 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likes}</span>
          </motion.button>
          
          <button 
            className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-blue-400 transition-colors"
            onClick={() => onComment(signal.id)}
          >
            <MessageSquare className="h-3 w-3" />
            <span>{signal.comments}</span>
          </button>
          
          <button 
            className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-green-400 transition-colors"
            onClick={() => onShare(signal.id)}
          >
            <Repeat className="h-3 w-3" />
            <span>{signal.shares}</span>
          </button>
          
          <button className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-purple-400 transition-colors">
            <Eye className="h-3 w-3" />
          </button>
        </div>
        
        {signal.type === 'signal' && (
          <Button variant="outline" size="sm" className="h-7 text-xs">
            Copy Trade
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export function CommunitySignals() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [newSignals, setNewSignals] = useState<any[]>([]);

  // Simulate new signals arriving
  useEffect(() => {
    const interval = setInterval(() => {
      // Add a new signal occasionally
      if (Math.random() > 0.7) {
        const newSignal = {
          id: Date.now(),
          user: 'AI_Trader_Bot',
          avatar: 'AI',
          verified: true,
          signal: 'LONG TSLA',
          ticker: 'TSLA',
          price: '$242.50',
          target: '$260',
          confidence: 'High',
          timeAgo: 'just now',
          likes: 0,
          comments: 0,
          shares: 0,
          followers: '10.2K',
          accuracy: '91%',
          type: 'signal',
          isLiked: false,
          isFollowing: false
        };
        setNewSignals(prev => [newSignal, ...prev.slice(0, 2)]);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleLike = (signalId: number) => {
    // Handle like action
  };

  const handleShare = (signalId: number) => {
    // Handle share action
  };

  const handleComment = (signalId: number) => {
    // Handle comment action
  };

  const handleFollow = (signalId: number) => {
    // Handle follow action
  };

  const filteredSignals = signals.filter(signal => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'signals') return signal.type === 'signal';
    if (selectedTab === 'insights') return signal.type === 'insight' || signal.type === 'update';
    return true;
  });

  const allSignals = [...newSignals, ...filteredSignals];

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Users className="h-5 w-5 text-green-400" />
            </motion.div>
            <CardTitle>Community Signals</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Live Feed</span>
              </Badge>
            </motion.div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Join Community
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Join the Neufin Trading Community</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Connect with 50,000+ traders, share signals, and learn from the best. Get access to:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-sm">Live trading signals from verified traders</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
                      <span className="text-sm">Real-time market discussions</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full" />
                      <span className="text-sm">AI-powered bias detection</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Join Now - Free
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Activity</TabsTrigger>
            <TabsTrigger value="signals">Signals</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <ScrollArea className="h-96 w-full">
          <div className="space-y-4 pr-4">
            <AnimatePresence>
              {allSignals.map((signal, index) => (
                <SignalCard
                  key={signal.id}
                  signal={signal}
                  onLike={handleLike}
                  onShare={handleShare}
                  onComment={handleComment}
                  onFollow={handleFollow}
                />
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
        
        <motion.div 
          className="mt-6 p-4 bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-lg"
          animate={{ 
            boxShadow: ['0 0 0 0 rgba(34, 197, 94, 0)', '0 0 0 4px rgba(34, 197, 94, 0.1)', '0 0 0 0 rgba(34, 197, 94, 0)']
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-yellow-400" />
              <h4 className="font-medium text-green-400">Top Performer This Week</h4>
            </div>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 flex items-center space-x-1">
              <TrendingUp className="h-3 w-3" />
              <span>+23.7%</span>
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-green-500/20 text-green-400 text-sm">
                    MW
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>
              <div>
                <p className="font-medium">MarketWizard_AI</p>
                <p className="text-xs text-muted-foreground">94% accuracy • 5.2K followers</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-1" />
                Follow
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Copy Trades
              </Button>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}