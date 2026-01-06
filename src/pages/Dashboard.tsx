import { useState } from 'react';
import { AlphaScoreHero } from '../components/AlphaScoreHero';
import { PortfolioGraph } from '../components/PortfolioGraph';
import { SentimentHeatmap } from '../components/SentimentHeatmap';
import { BiasBreakdown } from '../components/BiasBreakdown';
import { AlphaStrategies } from '../components/AlphaStrategies';
import { CommunitySignals } from '../components/CommunitySignals';
import { PerformanceSummary } from '../components/PerformanceSummary';
import { AlphaSuggestion } from '../components/AlphaSuggestion';
import { AiChat } from '../components/AiChat';
import { EnhancedAiChat } from '../components/EnhancedAiChat';
import { motion } from 'motion/react';

export function Dashboard() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
    <main className="container mx-auto px-6 py-8 space-y-8">
      {/* Dashboard Hero Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative mb-8"
      >
        <div className="relative h-48 lg:h-64 rounded-xl overflow-hidden border border-purple-500/20">
          <img
            src="https://images.unsplash.com/photo-1640451859877-1374a1155215?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGZpbmFuY2lhbCUyMHRyYWRpbmclMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzU5NzI5NTE2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="AI Financial Trading Dashboard Interface"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/40 via-transparent to-blue-600/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">
                Neural Twin Dashboard
              </h1>
              <p className="text-lg text-white/90">
                Real-time bias correction and portfolio optimization
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hero Section with Neural Twin Alpha Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <AlphaScoreHero />
      </motion.div>
      
      {/* AI-Powered Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 24H Performance Summary */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <PerformanceSummary />
        </motion.div>
        
        {/* Today's Alpha Suggestion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AlphaSuggestion />
        </motion.div>
        
        {/* AI Chat Assistant */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <AiChat />
        </motion.div>
      </div>
      
      {/* Twin Snapshot - Bias-Corrected Portfolio */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <PortfolioGraph />
      </motion.div>
      
      {/* Analytics Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sentiment & Market Heatmap */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <SentimentHeatmap />
        </motion.div>
        
        {/* Detailed Bias Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <BiasBreakdown />
        </motion.div>
        
        {/* Alpha Strategies Marketplace */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <AlphaStrategies />
        </motion.div>
        
        {/* Community Signals Widget */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <CommunitySignals />
        </motion.div>
      </div>
      
      {/* Live Market Update Badge */}
      <motion.div
        className="flex justify-center"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-blue-400">Live Market Update</span>
          <span className="text-xs text-muted-foreground">• Updated 30s ago</span>
        </div>
      </motion.div>
    </main>
    <EnhancedAiChat
      isOpen={isChatOpen}
      onToggle={() => setIsChatOpen(!isChatOpen)}
      context="dashboard"
    />
    </>
  );
}