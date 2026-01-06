import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import {
  CheckCircle,
  X,
  Star,
  Zap,
  Crown,
  Rocket,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createClient } from "../utils/supabase/client";
import { projectId } from "../utils/supabase/info";
import { toast } from 'sonner@2.0.3';

const plans = [
  {
    name: "Starter",
    description:
      "Perfect for individual traders getting started with bias detection",
    monthlyPrice: 29,
    yearlyPrice: 290,
    stripePriceIdMonthly: "price_starter_monthly",
    stripePriceIdYearly: "price_starter_yearly",
    icon: Star,
    color: "blue",
    popular: false,
    features: [
      "Basic Neural Twin Analysis",
      "Alpha Score Tracking",
      "5 Bias Types Detection",
      "Daily Market Insights",
      "Basic Portfolio Analytics",
      "Email Support",
      "Mobile App Access",
    ],
    limitations: [
      "Advanced bias detection",
      "Real-time alerts",
      "Custom strategies",
      "API access",
    ],
  },
  {
    name: "Professional",
    description:
      "Advanced features for serious traders and portfolio managers",
    monthlyPrice: 99,
    yearlyPrice: 990,
    stripePriceIdMonthly: "price_professional_monthly",
    stripePriceIdYearly: "price_professional_yearly",
    icon: Zap,
    color: "purple",
    popular: true,
    features: [
      "Advanced Neural Twin AI",
      "Real-time Alpha Optimization",
      "47 Bias Types Detection",
      "Live Sentiment Analysis",
      "Custom Alert System",
      "Advanced Portfolio Analytics",
      "Strategy Marketplace Access",
      "Priority Support",
      "Community Signals",
      "Risk Management Tools",
      "Backtesting Engine",
    ],
    limitations: ["API access", "White-label solutions"],
  },
  {
    name: "Enterprise",
    description:
      "Complete platform for institutions and hedge funds",
    monthlyPrice: 499,
    yearlyPrice: 4990,
    stripePriceIdMonthly: "price_enterprise_monthly",
    stripePriceIdYearly: "price_enterprise_yearly",
    icon: Crown,
    color: "gold",
    popular: false,
    features: [
      "Everything in Professional",
      "Full API Access",
      "Custom Neural Twin Models",
      "White-label Solutions",
      "Dedicated Account Manager",
      "Custom Integrations",
      "Advanced Compliance Tools",
      "Team Management",
      "Custom Reporting",
      "SLA Guarantee",
      "On-premise Deployment",
    ],
    limitations: [],
  },
];

const faqs = [
  {
    question: "How does the Neural Twin work?",
    answer:
      "Our Neural Twin AI analyzes millions of historical trading decisions and market conditions to create a bias-free version of your trading strategy. It identifies when cognitive biases influence your decisions and suggests optimal alternatives.",
  },
  {
    question: "What exchanges and brokers do you support?",
    answer:
      "We integrate with 50+ major brokers including Interactive Brokers, TD Ameritrade, E*TRADE, Schwab, and Fidelity. We also support direct API connections for institutional clients.",
  },
  {
    question: "Is my trading data secure?",
    answer:
      "Absolutely. We use bank-level encryption (AES-256) and never store your login credentials. All data is processed securely and we're SOC 2 Type II certified with regular security audits.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, all plans are month-to-month with no long-term contracts. You can cancel or upgrade/downgrade your plan at any time from your account settings.",
  },
  {
    question: "Do you offer a free trial?",
    answer:
      "Yes! All new users get a 14-day free trial with full access to Professional features. No credit card required to start.",
  },
  {
    question: "What kind of returns can I expect?",
    answer:
      "While past performance doesn't guarantee future results, our users typically see an 18.7% improvement in their Alpha Score within the first 3 months of using bias-corrected recommendations.",
  },
];

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const supabase = createClient();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
  };

  const handleSubscribe = async (plan: any) => {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error('Please log in to subscribe', {
        description: 'You need to be logged in to purchase a subscription',
        action: {
          label: 'Log In',
          onClick: () => navigate('/login'),
        },
      });
      return;
    }

    // Enterprise plan - redirect to email
    if (plan.name === 'Enterprise') {
      window.location.href = `mailto:info@neufin.ai?subject=Enterprise Plan Inquiry&body=Hi, I'm interested in learning more about the Enterprise plan for my organization.`;
      return;
    }

    try {
      setLoadingPlan(plan.name);

      // Get the price ID based on billing cycle
      const priceId = isYearly ? plan.stripePriceIdYearly : plan.stripePriceIdMonthly;

      // Create Stripe checkout session
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-22c8dcd8/stripe/create-checkout`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
            'origin': window.location.origin,
          },
          body: JSON.stringify({
            priceId,
            plan: plan.name,
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        if (data.message?.includes('not configured')) {
          toast.error('Payment System Not Configured', {
            description: 'Please contact support or use the contact form to get started.',
            action: {
              label: 'Contact',
              onClick: () => window.location.href = 'mailto:info@neufin.ai?subject=Subscription Inquiry',
            },
          });
        } else {
          throw new Error(data.error);
        }
      } else if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      toast.error('Failed to start checkout', {
        description: error.message || 'Please try again or contact support.',
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6">
        {/* Pricing Hero Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative mb-12"
        >
          <div className="relative h-40 lg:h-48 rounded-xl overflow-hidden border border-blue-500/20">
            <img
              src="https://images.unsplash.com/photo-1740042372484-67c211647db9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjB0ZWNobm9sb2d5JTIwdGVhbSUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NTk3Mjk1MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Financial technology workspace showcasing team collaboration"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 via-transparent to-purple-600/50" />
          </div>
        </motion.div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16"
        >
          <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30 text-lg px-6 py-2 mb-4">
            🎉 14-Day Free Trial on All Plans
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6" style={{ color: 'var(--heading-primary)' }}>
            Choose Your
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent block">
              Neural Twin Plan
            </span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto mb-8 testimonial-text">
            Try any plan free for 14 days. No credit card required.
            Upgrade, downgrade, or cancel anytime. No hidden fees.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span
              className={`${!isYearly ? "text-foreground" : "text-muted-foreground"}`}
            >
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-purple-600"
            />
            <span
              className={`${isYearly ? "text-foreground" : "text-muted-foreground"}`}
            >
              Yearly
            </span>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 ml-2">
              Save 2 months
            </Badge>
          </div>
        </motion.div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <Card
                className={`h-full relative overflow-hidden ${
                  plan.popular
                    ? "border-purple-500/50 bg-gradient-to-br from-purple-500/5 to-blue-500/5"
                    : "bg-card/50"
                }`}
              >
                <CardHeader className="text-center pb-8">
                  <div
                    className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${
                      plan.color === "purple"
                        ? "bg-purple-500/20"
                        : plan.color === "gold"
                          ? "bg-yellow-500/20"
                          : "bg-blue-500/20"
                    }`}
                  >
                    <plan.icon
                      className={`h-6 w-6 ${
                        plan.color === "purple"
                          ? "text-purple-400"
                          : plan.color === "gold"
                            ? "text-yellow-400"
                            : "text-blue-400"
                      }`}
                    />
                  </div>

                  <CardTitle className="text-2xl mb-2" style={{ color: 'var(--heading-secondary)' }}>
                    {plan.name}
                  </CardTitle>
                  <p className="text-sm mb-6 testimonial-text">
                    {plan.description}
                  </p>

                  <div className="space-y-2">
                    <div className="text-4xl font-bold">
                      $
                      {isYearly
                        ? plan.yearlyPrice
                        : plan.monthlyPrice}
                      <span className="text-lg font-normal text-muted-foreground">
                        /{isYearly ? "year" : "month"}
                      </span>
                    </div>
                    {isYearly && (
                      <div className="text-sm text-green-400">
                        Save $
                        {plan.monthlyPrice * 12 -
                          plan.yearlyPrice}{" "}
                        annually
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Button
                    onClick={() => handleSubscribe(plan)}
                    disabled={loadingPlan !== null}
                    className={`w-full ${
                      plan.popular
                        ? "cta-button"
                        : plan.color === "gold"
                          ? "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                          : "bg-primary hover:bg-primary/90"
                    }`}
                    role="button"
                    aria-label={`Start ${plan.name} plan`}
                  >
                    {loadingPlan === plan.name ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {plan.name === "Enterprise"
                          ? "Contact Sales"
                          : "Start 14-Day Free Trial"}
                      </>
                    )}
                  </Button>

                  <div className="space-y-3">
                    <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">
                      What's Included
                    </h4>

                    <div className="space-y-2">
                      {plan.features.map(
                        (feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-center space-x-2"
                          >
                            <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                            <span className="text-sm">
                              {feature}
                            </span>
                          </div>
                        ),
                      )}

                      {plan.limitations.map(
                        (limitation, limitationIndex) => (
                          <div
                            key={limitationIndex}
                            className="flex items-center space-x-2 opacity-50"
                          >
                            <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">
                              {limitation}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-4">
                <Rocket className="h-8 w-8 text-purple-400 mr-3" />
                <h3 className="text-2xl font-bold" style={{ color: 'var(--heading-secondary)' }}>
                  Need Something Custom?
                </h3>
              </div>
              <p className="mb-6 max-w-2xl mx-auto testimonial-text">
                For hedge funds, family offices, and large
                institutions, we offer custom Neural Twin
                models, dedicated infrastructure, and
                white-label solutions.
              </p>
              <Button
                asChild
                variant="outline"
                className="border-purple-500/30 hover:bg-purple-500/10"
                role="button"
                aria-label="Contact us to schedule a demo"
              >
                <a href="mailto:info@neufin.ai?subject=Demo Request&body=Hi, I'd like to schedule a demo of the Neural Twin AI platform for my organization.">
                  Schedule a Demo
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--heading-primary)' }}>
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-card/50">
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-3">
                      {faq.question}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}