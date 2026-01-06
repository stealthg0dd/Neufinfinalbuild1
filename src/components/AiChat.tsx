import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { MessageSquare, Send, Bot, User, Sparkles, TrendingUp, PieChart, BarChart3, Lightbulb } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Avatar, AvatarFallback } from './ui/avatar';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hi! I'm Claude, your AI trading assistant. I can help you analyze your portfolio, understand market trends, explain bias patterns, and answer any questions about your dashboard. What would you like to know?",
    timestamp: new Date(),
    suggestions: [
      "Analyze my TSLA position",
      "Why did I lose money today?", 
      "Explain confirmation bias",
      "What's driving AMD momentum?"
    ]
  }
];

const quickPrompts = [
  { icon: TrendingUp, text: "Market analysis", color: "text-green-400" },
  { icon: PieChart, text: "Portfolio review", color: "text-blue-400" },
  { icon: BarChart3, text: "Performance insights", color: "text-purple-400" },
  { icon: Lightbulb, text: "Trading tips", color: "text-yellow-400" }
];

// Simulated AI responses based on common queries
const getAIResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();
  
  if (message.includes('tsla') || message.includes('tesla')) {
    return "Based on your portfolio data, TSLA dropped 4.1% today to $242.50. The Neural Twin detected negative sentiment shift 2 hours before market open, suggesting confirmation bias affected your hold decision. Consider setting stop-losses at 8% down to avoid similar losses. The stock shows oversold RSI but faces headwinds from EV competition.";
  }
  
  if (message.includes('lose') || message.includes('lost') || message.includes('down')) {
    return "Your portfolio is down 2.3% today ($3,030 loss), primarily due to TSLA (-$680) and AAPL (-$450). The Neural Twin analysis shows these losses could have been prevented: 1) Setting stop-losses on TSLA, 2) Recognizing AAPL's resistance level. Your bias toward loss aversion prevented timely exits. Tomorrow's focus: implement automated stop-losses.";
  }
  
  if (message.includes('confirmation bias')) {
    return "Confirmation bias is seeking information that confirms your existing beliefs while ignoring contradictory evidence. In your case, it cost you $680 on TSLA today. You likely focused on positive news while dismissing negative sentiment indicators. The Neural Twin uses sentiment analysis from 10,000+ sources to provide unbiased signals. Consider enabling bias alerts for future trades.";
  }
  
  if (message.includes('amd')) {
    return "AMD is today's top alpha suggestion (+10.9% potential). Key drivers: 1) Technical breakout above $140 resistance with 40% volume surge, 2) Strong AI chip demand and data center growth, 3) CES keynote tomorrow with potential announcements. Sentiment score: 78/100. The Neural Twin removed anchoring bias from previous price levels, suggesting $158 target with 95% confidence.";
  }
  
  if (message.includes('portfolio') || message.includes('performance')) {
    return "Your portfolio ($128,670) is diversified across tech giants but shows concentration risk. Performance: NVDA (+3.2%) carried gains while TSLA (-4.1%) dragged down returns. The Neural Twin suggests: 1) Reduce TSLA exposure, 2) Add defensive positions, 3) Implement sector rotation. Your Alpha Score of 8.7 indicates room for 13% improvement through bias reduction.";
  }
  
  if (message.includes('bias') || message.includes('improve')) {
    return "Your top biases costing alpha: 1) Confirmation bias (75% severity, -$18,200 impact), 2) Loss aversion (60% severity, -$12,800), 3) Anchoring (45% severity, -$8,400). Start with confirmation bias - diversify news sources and use our contrarian signals. Your 87% bias correction progress shows excellent improvement. Focus on automated stop-losses to combat loss aversion.";
  }
  
  if (message.includes('strategy') || message.includes('alpha')) {
    return "Based on your risk profile and performance, I recommend the 'Momentum Breakout Pro' strategy ($49/mo, 34.7% returns, 73% win rate). It aligns with your tech focus but adds systematic entry/exit rules. The Neural Twin detected you're good at picking winners but struggle with timing. This strategy would have saved you $1,130 in the last month through better exit discipline.";
  }
  
  // Default response
  return "I understand you're asking about your trading performance. Could you be more specific? I can help with portfolio analysis, bias detection, market insights, strategy recommendations, or explaining any dashboard metrics. Your Neural Twin Alpha Score is 8.7/10, showing strong potential for improvement.";
};

export function AiChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(content),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleQuickPrompt = (promptText: string) => {
    setInputValue(`Tell me about ${promptText.toLowerCase()}`);
    inputRef.current?.focus();
  };

  return (
    <Card className="bg-card/50 h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Bot className="h-5 w-5 text-blue-400" />
            </motion.div>
            <CardTitle>Chat with AI</CardTitle>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border-blue-500/30 flex items-center space-x-1">
                <Sparkles className="h-3 w-3" />
                <span>Powered by Claude</span>
              </Badge>
            </motion.div>
          </div>
        </div>
        
        {/* Quick Prompts */}
        <div className="flex flex-wrap gap-2 mt-3">
          {quickPrompts.map((prompt, index) => (
            <motion.button
              key={index}
              onClick={() => handleQuickPrompt(prompt.text)}
              className={`flex items-center space-x-1 px-3 py-1 bg-muted/30 hover:bg-muted/50 rounded-full text-xs transition-colors ${prompt.color}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <prompt.icon className="h-3 w-3" />
              <span>{prompt.text}</span>
            </motion.button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-4">
          <div className="space-y-4 py-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex items-start space-x-3 ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className={`${
                      message.role === 'user' 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`flex-1 max-w-[80%] ${
                    message.role === 'user' ? 'flex flex-col items-end' : ''
                  }`}>
                    <div className={`p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-8'
                        : 'bg-muted/30 text-foreground mr-8'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    
                    {message.suggestions && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <motion.button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded text-xs transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {suggestion}
                          </motion.button>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-3"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-500/20 text-blue-400">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex space-x-1">
                    <motion.div
                      className="w-2 h-2 bg-blue-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-blue-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-blue-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>
        
        {/* Input */}
        <div className="p-4 border-t border-border">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about your portfolio, biases, market trends..."
              className="flex-1 bg-background/50"
              disabled={isTyping}
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                type="submit" 
                size="icon" 
                disabled={!inputValue.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </motion.div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}