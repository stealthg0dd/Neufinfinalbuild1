import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Zap, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface AlphaScoreRevealProps {
  alphaScore: number;
  annualOpportunityCost: number;
  onContinue: () => void;
}

export function AlphaScoreReveal({
  alphaScore,
  annualOpportunityCost,
  onContinue,
}: AlphaScoreRevealProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Animate score counter
    const duration = 2000;
    const steps = 60;
    const increment = alphaScore / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= alphaScore) {
        setDisplayScore(alphaScore);
        clearInterval(timer);
        if (alphaScore > 3) {
          setShowConfetti(true);
        }
      } else {
        setDisplayScore(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [alphaScore]);

  const getMessage = () => {
    if (alphaScore > 5) {
      return {
        title: 'Significant Optimization Potential!',
        subtitle: "Let's fix this.",
        color: 'text-orange-400',
      };
    } else if (alphaScore >= 3) {
      return {
        title: 'Solid Portfolio with Room to Improve',
        subtitle: 'Small adjustments can make a big difference.',
        color: 'text-blue-400',
      };
    } else {
      return {
        title: "You're Already a Disciplined Investor!",
        subtitle: 'Small tweaks can help optimize further.',
        color: 'text-green-400',
      };
    }
  };

  const message = getMessage();

  return (
    <div className="min-h-screen bg-background dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20" />
      
      {/* Confetti animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: '50%',
                y: '50%',
                scale: 0,
                opacity: 1,
              }}
              animate={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                scale: [0, 1, 0],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: Math.random() * 0.5,
                ease: 'easeOut',
              }}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: ['#A020F0', '#4A9EFF', '#00FF88', '#FFB84A'][
                  Math.floor(Math.random() * 4)
                ],
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-3xl w-full"
      >
        <Card className="p-12 text-center bg-card/50 backdrop-blur-xl border-purple-500/30">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-2 border-purple-500/30 mb-8"
          >
            <Zap className="h-12 w-12 text-purple-400" />
          </motion.div>

          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-4"
          >
            <h3 className="text-2xl text-muted-foreground">Your Neural Twin Alpha Score</h3>
          </motion.div>

          {/* Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: 'spring' }}
            className="mb-6"
          >
            <div className="text-8xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              {displayScore.toFixed(1)}%
            </div>
          </motion.div>

          {/* Opportunity Cost */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mb-8"
          >
            <div className="text-3xl font-semibold text-foreground mb-2">
              ${annualOpportunityCost.toLocaleString()}
            </div>
            <div className="text-muted-foreground">Annual Opportunity Cost</div>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="mb-8"
          >
            <h3 className={`text-2xl font-semibold mb-2 ${message.color}`}>
              {message.title}
            </h3>
            <p className="text-lg text-muted-foreground">{message.subtitle}</p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
          >
            <Button
              onClick={onContinue}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg px-8"
            >
              Explore Your Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.1 }}
            className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span>AI-Powered Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-400" />
              <span>Real-Time Updates</span>
            </div>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
