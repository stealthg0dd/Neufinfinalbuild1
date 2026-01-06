import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { motion, AnimatePresence } from 'motion/react';

export function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappNumber = '+6597627734';
  const defaultMessage = 'Hi! I have a question about Neufin Neural Twin technology.';
  
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(defaultMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* WhatsApp Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 260, damping: 20 }}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="mb-4"
            >
              <Card className="w-80 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/30">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <MessageCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-green-800 dark:text-green-200">
                          Neufin Support
                        </h4>
                        <p className="text-xs text-green-600 dark:text-green-300">
                          Typically replies instantly
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-green-600 hover:text-green-800 dark:text-green-300"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-200 mb-3">
                    Hi there! 👋 Have questions about Neural Twin technology or need help getting started?
                  </p>
                  <Button
                    onClick={handleWhatsAppClick}
                    className="w-full bg-green-500 hover:bg-green-600 text-white text-sm"
                    aria-label="Start WhatsApp chat"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Start Chat
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg touch-target"
            aria-label="Open WhatsApp chat"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <MessageCircle className="h-6 w-6" />
            )}
          </Button>
        </motion.div>

        {/* Pulse animation for attention */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full bg-green-500"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.div>
    </>
  );
}