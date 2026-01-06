import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, TrendingUp, Brain, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';

interface WelcomeModalProps {
  userName: string;
  onClose: () => void;
  onContinue: () => void;
}

export function WelcomeModal({ userName, onClose, onContinue }: WelcomeModalProps) {
  const [step, setStep] = useState(1);

  const steps = [
    {
      icon: TrendingUp,
      title: 'Add Holdings',
      description: 'Connect your brokerage or add manually',
    },
    {
      icon: Brain,
      title: 'AI Analysis',
      description: 'We analyze your portfolio for biases',
    },
    {
      icon: Zap,
      title: 'View Alpha Score',
      description: 'See your hidden potential',
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-2xl w-full"
        >
          <Card className="p-8 bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-purple-500/30">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 border-2 border-purple-500/30 mb-4"
              >
                <Zap className="h-8 w-8 text-purple-400" />
              </motion.div>
              <h2 className="text-3xl mb-2">Welcome to Neufin, {userName}!</h2>
              <p className="text-lg text-muted-foreground">
                Let's unlock your portfolio's hidden potential in 3 steps
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <Progress value={(step / 3) * 100} className="h-2 mb-4" />
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3].map((num) => (
                  <div
                    key={num}
                    className={`w-3 h-3 rounded-full transition-all ${
                      num <= step
                        ? 'bg-purple-500 scale-110'
                        : 'bg-muted scale-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className="grid gap-4 mb-8">
              {steps.map((stepItem, idx) => {
                const StepIcon = stepItem.icon;
                const isActive = idx + 1 === step;
                const isCompleted = idx + 1 < step;

                return (
                  <motion.div
                    key={stepItem.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
                      isActive
                        ? 'bg-purple-500/10 border-purple-500/30'
                        : isCompleted
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-card/50 border-border/50'
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                        isActive
                          ? 'bg-purple-500/20 border border-purple-500/30'
                          : isCompleted
                          ? 'bg-green-500/20 border border-green-500/30'
                          : 'bg-muted/20 border border-muted/30'
                      }`}
                    >
                      <StepIcon
                        className={`h-5 w-5 ${
                          isActive
                            ? 'text-purple-400'
                            : isCompleted
                            ? 'text-green-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">
                        Step {idx + 1}: {stepItem.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {stepItem.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 border-purple-500/30 hover:bg-purple-500/10"
              >
                Skip for Now
              </Button>
              <Button
                onClick={onContinue}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                Continue
                <Zap className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
