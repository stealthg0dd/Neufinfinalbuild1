import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  TrendingUp,
  Brain,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Minimize2,
  Maximize2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actionButtons?: { label: string; action: string; variant?: 'default' | 'outline' }[];
}

interface ChatProps {
  isOpen: boolean;
  onToggle: () => void;
  context?: 'journey' | 'dashboard' | 'general';
}

const quickPrompts = {
  journey: [
    "Explain my current portfolio health status",
    "What biases are affecting my investment decisions?",
    "Show me the latest sentiment analysis for my holdings",
    "Run a scenario analysis for interest rate changes"
  ],
  dashboard: [
    "Why did my Alpha Score change today?",
    "Explain the current market sentiment trends",
    "What defensive strategies do you recommend?",
    "Analyze my portfolio's bias risk factors"
  ],
  general: [
    "Help me understand the Neural Twin technology",
    "What makes Neufin different from other platforms?",
    "Explain alpha generation strategies",
    "How does bias detection work?"
  ]
};

const mockResponses = {
  "explain my current portfolio health status": {
    content: "Your portfolio health is currently **Neutral** with a score of 7.2/10. Here's what I found:\n\n• **Risk Level**: Medium (↑ 0.3 from last week)\n• **Diversification**: Good (8.1/10)\n• **Bias Score**: 7.2/10 (Moderate concern)\n• **Alpha Potential**: High in defensive sectors\n\nThe main concern is an emerging disposition effect in your tech holdings. You're holding onto losing positions 23% longer than optimal.",
    suggestions: ["View detailed bias breakdown", "Run portfolio optimization", "Set up bias alerts"],
    actionButtons: [
      { label: "Fix Bias Issues", action: "bias-fix", variant: "default" },
      { label: "Optimize Portfolio", action: "optimize", variant: "outline" }
    ]
  },
  "what biases are affecting my investment decisions?": {
    content: "I've detected **3 active biases** affecting your decisions:\n\n🧠 **Disposition Effect** (Score: 8.1/10)\n• Holding losing tech stocks 23% longer than optimal\n• Estimated cost: -2.3% annual return\n\n⚖️ **Confirmation Bias** (Score: 6.7/10)\n• Over-weighting bullish news for growth stocks\n• Risk of missing warning signals\n\n📈 **Anchoring Bias** (Score: 5.9/10)\n• Using outdated price targets for valuation\n• Affects 40% of your position sizing decisions",
    suggestions: ["Enable 24-hour cooling periods", "Set up bias intervention alerts", "View historical bias trends"],
    actionButtons: [
      { label: "Enable Interventions", action: "enable-interventions", variant: "default" },
      { label: "View Full Analysis", action: "bias-analysis", variant: "outline" }
    ]
  },
  "default": {
    content: "I'm here to help you navigate your investment journey with AI-powered insights. I can explain your portfolio health, analyze market sentiment, detect behavioral biases, and run scenario simulations.\n\nWhat would you like to explore?",
    suggestions: ["Check portfolio health", "Analyze market sentiment", "Detect investment biases", "Run scenario analysis"]
  }
};

export function EnhancedAiChat({ isOpen, onToggle, context = 'general' }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your Neufin AI assistant. I can help you understand your portfolio, detect biases, analyze market sentiment, and optimize your investment strategy. What would you like to explore?",
      timestamp: new Date(),
      suggestions: quickPrompts[context]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (message?: string) => {
    const messageText = message || inputValue.trim();
    if (!messageText) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responseKey = messageText.toLowerCase();
      const response = mockResponses[responseKey as keyof typeof mockResponses] || mockResponses.default;
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
        actionButtons: response.actionButtons
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSend(prompt);
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('•')) {
        return <li key={index} className="ml-4">{line.substring(1).trim()}</li>;
      }
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={index} className="mb-2">
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
            )}
          </p>
        );
      }
      if (line.trim()) {
        return <p key={index} className="mb-2">{line}</p>;
      }
      return <br key={index} />;
    });
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={onToggle}
          size="lg"
          className="rounded-full h-14 w-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Card className={`w-96 shadow-xl border-2 ${isMinimized ? 'h-auto' : 'h-[600px]'}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-lg">Neufin AI Assistant</CardTitle>
              <Badge variant="secondary" className="text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                Online
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onToggle}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <CardContent className="p-0 flex flex-col h-[500px]">
                <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                          <div className={`flex items-start gap-2 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`p-2 rounded-full ${
                              message.type === 'user' 
                                ? 'bg-blue-600' 
                                : 'bg-gradient-to-r from-purple-600 to-blue-600'
                            }`}>
                              {message.type === 'user' ? (
                                <User className="h-3 w-3 text-white" />
                              ) : (
                                <Bot className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <div className={`p-3 rounded-lg ${
                              message.type === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-muted text-foreground'
                            }`}>
                              <div className="text-sm">
                                {message.type === 'assistant' ? formatContent(message.content) : message.content}
                              </div>
                              <div className="text-xs opacity-70 mt-1">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>

                          {message.actionButtons && (
                            <div className="flex gap-2 mt-3 ml-12">
                              {message.actionButtons.map((button, index) => (
                                <Button
                                  key={index}
                                  variant={button.variant || 'outline'}
                                  size="sm"
                                  className="text-xs"
                                >
                                  {button.label}
                                </Button>
                              ))}
                            </div>
                          )}

                          {message.suggestions && (
                            <div className="mt-3 ml-12">
                              <p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
                              <div className="flex flex-wrap gap-1">
                                {message.suggestions.map((suggestion, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-auto py-1 px-2"
                                    onClick={() => handleQuickPrompt(suggestion)}
                                  >
                                    {suggestion}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}

                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="flex items-start gap-2">
                          <div className="p-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600">
                            <Bot className="h-3 w-3 text-white" />
                          </div>
                          <div className="p-3 rounded-lg bg-muted">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>

                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask about your portfolio, biases, or market trends..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      className="flex-1"
                    />
                    <Button 
                      onClick={() => handleSend()}
                      disabled={!inputValue.trim() || isTyping}
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}