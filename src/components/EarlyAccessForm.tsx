import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { X, Sparkles, CheckCircle, Mail, Phone, User, Briefcase, TrendingUp } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface EarlyAccessFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EarlyAccessForm({ isOpen, onClose }: EarlyAccessFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    portfolioSize: '',
    interests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate a discount code
      const discountCode = `EARLY${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      // Prepare email content
      const emailContent = `
New Early Access Registration - Neufin AI

Registration Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Company: ${formData.company || 'Not provided'}
Portfolio Size: ${formData.portfolioSize || 'Not provided'}
Interests: ${formData.interests || 'Not provided'}

Discount Code Generated: ${discountCode}
Submitted At: ${new Date().toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is an automated notification from the Neufin AI waitlist form.
      `.trim();

      // Send email using Web3Forms
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: '9c8c8e5c-8f7a-4d4e-b8e8-8c8c8e5c8f7a', // This is a placeholder - you'll need to get your own key from web3forms.com
          subject: `🎯 New Early Access Registration - ${formData.name}`,
          from_name: 'Neufin AI Waitlist',
          to: 'info@neufin.ai',
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Store in localStorage as backup
        const submissions = JSON.parse(localStorage.getItem('neufin_early_access') || '[]');
        submissions.push({
          ...formData,
          submittedAt: new Date().toISOString(),
          discountCode: discountCode
        });
        localStorage.setItem('neufin_early_access', JSON.stringify(submissions));

        setIsSubmitting(false);
        setIsSubmitted(true);
        toast.success('Registration submitted! Our team will reach out to you shortly.', { duration: 5000 });
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
      toast.error('Failed to submit registration. Please try again or contact us directly at info@neufin.ai', { 
        duration: 7000 
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      portfolioSize: '',
      interests: ''
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Form Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <Card className="bg-card border-purple-500/30">
            <CardHeader className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-4 right-4"
              >
                <X className="h-4 w-4" />
              </Button>

              {!isSubmitted ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-6 w-6 text-purple-400" />
                    <Badge className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400 border-purple-500/30">
                      Early Bird Special
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">Join the Waitlist</CardTitle>
                  <CardDescription className="text-base">
                    Be among the first to experience Neural Twin Technology™ and unlock exclusive early bird benefits
                  </CardDescription>
                  
                  {/* Benefits List */}
                  <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
                    <p className="text-sm font-medium text-purple-400 mb-2">🎁 Early Bird Benefits:</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-400 flex-shrink-0" />
                        <span>50% discount on first 3 months</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-400 flex-shrink-0" />
                        <span>Priority access to new features</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-400 flex-shrink-0" />
                        <span>Dedicated onboarding session with our team</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-400 flex-shrink-0" />
                        <span>Lifetime early adopter badge</span>
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                  >
                    <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  </motion.div>
                  <CardTitle className="text-2xl mb-2">You're on the list! 🎉</CardTitle>
                  <CardDescription className="text-base">
                    We've received your registration. Check your email for your exclusive early bird discount code.
                  </CardDescription>
                </div>
              )}
            </CardHeader>

            <CardContent>
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-purple-400" />
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-background/50"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-purple-400" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-background/50"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-purple-400" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={handleChange}
                      className="bg-background/50"
                    />
                  </div>

                  {/* Company */}
                  <div className="space-y-2">
                    <Label htmlFor="company" className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-purple-400" />
                      Company (Optional)
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      placeholder="Acme Corp"
                      value={formData.company}
                      onChange={handleChange}
                      className="bg-background/50"
                    />
                  </div>

                  {/* Portfolio Size */}
                  <div className="space-y-2">
                    <Label htmlFor="portfolioSize" className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-purple-400" />
                      Estimated Portfolio Size
                    </Label>
                    <Input
                      id="portfolioSize"
                      name="portfolioSize"
                      placeholder="e.g., $50,000 - $100,000"
                      value={formData.portfolioSize}
                      onChange={handleChange}
                      className="bg-background/50"
                    />
                  </div>

                  {/* Interests */}
                  <div className="space-y-2">
                    <Label htmlFor="interests" className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-400" />
                      What are you most interested in?
                    </Label>
                    <Textarea
                      id="interests"
                      name="interests"
                      placeholder="e.g., Reducing emotional trading, Understanding market sentiment, Automated bias detection..."
                      value={formData.interests}
                      onChange={handleChange}
                      className="bg-background/50 min-h-[100px]"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full cta-button py-6"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        <span>Reserve My Early Bird Spot</span>
                      </div>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By submitting, you agree to receive updates from Neufin AI. Unsubscribe anytime.
                  </p>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20 text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      We'll reach out to you at:
                    </p>
                    <p className="font-medium mb-1">{formData.email}</p>
                    <p className="text-sm text-muted-foreground mb-4">{formData.phone}</p>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-lg px-4 py-2">
                      Early Access Reserved ✓
                    </Badge>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="flex-1"
                    >
                      Submit Another
                    </Button>
                    <Button
                      onClick={onClose}
                      className="flex-1 cta-button"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}