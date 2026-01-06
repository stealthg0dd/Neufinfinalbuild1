import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { MessageCircle, Send, Bot, User, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { projectId } from '../utils/supabase/info';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ClaudeChatProps {
  accessToken: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function ClaudeChat({ accessToken, isOpen, onToggle }: ClaudeChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI financial advisor powered by Claude. I have access to your portfolio and can provide personalized investment insights. How can I help you today?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-22c8dcd8/ai/chat`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: input,
            context: 'portfolio-advisor',
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date(data.timestamp),
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickPrompts = [
    'Analyze my portfolio diversification',
    'What are my highest risk holdings?',
    'Suggest rebalancing strategies',
    'Show me market trends for my stocks',
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
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
          className="rounded-full w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-xl"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-background"
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 w-full max-w-md"
    >
      <Card className="border-purple-500/30 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-b border-purple-500/20">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <div className="relative">
                <Sparkles className="h-5 w-5 text-purple-400" />
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-purple-400 rounded-full blur-md"
                />
              </div>
              <span>AI Portfolio Advisor</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse mr-1" />
                Online
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Messages */}
          <div className="h-[400px] overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user' 
                        ? 'bg-purple-500/20' 
                        : 'bg-gradient-to-br from-purple-500/20 to-blue-500/20'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="h-4 w-4 text-purple-400" />
                      ) : (
                        <Bot className="h-4 w-4 text-blue-400" />
                      )}
                    </div>
                    <div>
                      <div className={`rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-purple-600/20 text-white'
                          : 'bg-card/50 border border-border/50'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <div className={`text-xs text-muted-foreground mt-1 ${
                        message.role === 'user' ? 'text-right' : 'text-left'
                      }`}>
                        {message.timestamp.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-blue-400" />
                    </div>
                    <div className="bg-card/50 border border-border/50 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          className="w-2 h-2 bg-blue-400 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 bg-blue-400 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          className="w-2 h-2 bg-blue-400 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 1 && (
            <div className="px-4 pb-3 space-y-2">
              <div className="text-xs text-muted-foreground mb-2">Quick prompts:</div>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickPrompt(prompt)}
                    className="text-xs"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border/50">
            <div className="flex items-center space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your portfolio..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-1 mt-2 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3" />
              <span>Powered by Claude AI</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
