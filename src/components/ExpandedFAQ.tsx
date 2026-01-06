import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from './ui/badge';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqCategories = [
  {
    category: 'Product & Technology',
    questions: [
      {
        question: 'What is Neural Twin Technology and how does it work?',
        answer: 'Neural Twin Technology™ is Neufin\'s proprietary AI system that creates a digital replica of your investment strategy, but without cognitive biases. It analyzes your historical trading patterns, identifies bias-driven decisions (like loss aversion or herding), and simulates what a perfectly rational version of you would have done. The system uses deep learning trained on millions of market scenarios to provide actionable recommendations that align with your risk tolerance but eliminate emotional decision-making. Your Neural Twin continuously learns and adapts to market conditions, stress-testing decisions against 10,000 scenarios before suggesting actions.'
      },
      {
        question: 'How does Neufin detect and quantify cognitive biases in my portfolio?',
        answer: 'Neufin tracks 47 distinct cognitive biases using behavioral finance algorithms. When you connect your portfolio, our system analyzes transaction history, holding periods, entry/exit points, and compares them against optimal decision points identified by your Neural Twin. For example, if you held a losing position 8 months (loss aversion) when optimal exit was at month 2, we calculate the exact dollar cost. We provide a bias breakdown showing: Loss Aversion score (0-100), Disposition Effect percentage, Confirmation Bias frequency, and Herding Behavior instances. Each bias is quantified with dollar impact, helping you understand exactly how much each cognitive error costs annually.'
      },
      {
        question: 'What data sources power Neufin\'s sentiment analysis engine?',
        answer: 'Our sentiment analysis engine aggregates data from 50,000+ sources including: Financial news outlets (Bloomberg, Reuters, CNBC, Financial Times), Social media sentiment (Twitter/X, Reddit WallStreetBets, StockTwits), SEC filings and regulatory documents, Analyst reports from major institutions, Earnings call transcripts, Corporate press releases, and Alternative data (satellite imagery, web traffic, app downloads). The system uses natural language processing (NLP) to extract sentiment scores, weighs sources by historical accuracy, and generates actionable signals 2.4 hours before average market reaction. Our 73% accuracy rate is validated through 6-month backtesting with a 0.12% false positive rate.'
      },
      {
        question: 'How accurate are Neufin\'s trading signals and alpha predictions?',
        answer: 'Neufin\'s signal accuracy is measured across multiple dimensions: Sentiment-based signals achieve 73% directional accuracy (predicting price movement direction) over rolling 6-month periods. Alpha predictions (quantifying missed returns) have 89% correlation with actual post-analysis outcomes. Bias intervention recommendations show 82% success rate when users follow the protocol within suggested timeframes. The Neural Twin simulator has an 18% average outperformance vs. baseline strategies in crash scenarios (based on 10,000 Monte Carlo simulations). We publish monthly performance reports and provide full transparency on prediction accuracy, false positives, and confidence intervals for all signals.'
      }
    ]
  },
  {
    category: 'Pricing & Plans',
    questions: [
      {
        question: 'What pricing plans does Neufin offer?',
        answer: 'Neufin offers three pricing tiers designed for different investor profiles: Individual Investor Plan ($49/month or $470/year): Includes Neural Twin AI, real-time bias detection, sentiment analysis for up to 20 positions, Alpha Score tracking, and mobile app access. Professional Trader Plan ($149/month or $1,490/year): Everything in Individual plus unlimited positions, advanced backtesting, API access, priority support, and institutional-grade analytics. Enterprise/Wealth Manager Plan (Custom pricing): Multi-user seats, white-label options, dedicated account manager, custom integrations, compliance reporting, and SLA guarantees. All plans include a 14-day free trial, and early bird registrants receive 50% off for the first 3 months.'
      },
      {
        question: 'Is there a free trial available?',
        answer: 'Yes! Neufin offers a comprehensive 14-day free trial with full access to all features (no credit card required for early access registrants). During the trial, you can: Connect your portfolio via Plaid or manual entry, receive your complete Alpha Score analysis showing missed returns, access all sentiment analysis and trading signals, see your full bias breakdown across 47 cognitive biases, test the Neural Twin simulator with historical scenarios, and explore all dashboard features and mobile apps. If you\'re on our early access waitlist, you also receive an additional 50% discount code for your first 3 months after trial. We believe in transparent pricing with no hidden fees - cancel anytime during or after the trial with no penalties.'
      },
      {
        question: 'What\'s included in the early bird discount for waitlist members?',
        answer: 'Early access waitlist members receive exclusive benefits: 50% discount on all plans for the first 3 months (save up to $223), Priority onboarding with a dedicated Neufin specialist (30-minute 1-on-1 session), Early access to new features and beta programs, Lifetime "Early Adopter" badge with priority support queue, Exclusive webinars with our AI research team, and Guaranteed price lock for 12 months (no price increases). The early bird program is limited to the first 500 registrants, and spots are allocated on a first-come, first-served basis. Your unique discount code is sent immediately upon approval and can be redeemed anytime within 90 days of issue.'
      }
    ]
  },
  {
    category: 'Data Security & Privacy',
    questions: [
      {
        question: 'How does Neufin protect my financial data?',
        answer: 'Neufin employs bank-level security protocols: SOC 2 Type II certified infrastructure with annual third-party audits, 256-bit AES encryption for data at rest and TLS 1.3 for data in transit, Zero-knowledge architecture (we never store your brokerage passwords), Read-only API access via Plaid (we cannot execute trades without your explicit approval), Multi-factor authentication (MFA) and biometric login options, Real-time fraud monitoring and anomaly detection, GDPR and CCPA compliant data handling, and Regular penetration testing by certified ethical hackers. Your brokerage credentials are never stored on our servers - authentication is handled through secure OAuth tokens that can be revoked anytime. We are NOT a financial institution and do NOT have custody of your assets.'
      },
      {
        question: 'Can Neufin execute trades on my behalf?',
        answer: 'No. Neufin is a decision intelligence platform, not a trading platform or robo-advisor. We provide analysis, signals, and recommendations, but YOU maintain complete control over all trading decisions. Our integration via Plaid is read-only by default. If you choose to enable trade execution features (Professional Trader plan), you must explicitly authorize each trade through two-factor confirmation. We operate on an "Advisory Only" model: You receive signals and recommendations, review them at your discretion, execute trades manually through your brokerage, and we track outcomes to improve your Neural Twin\'s accuracy. This approach ensures you maintain full autonomy while benefiting from AI-powered insights without the regulatory complexity of automated trading.'
      },
      {
        question: 'What happens to my data if I cancel my subscription?',
        answer: 'Neufin provides full data portability and deletion rights: Upon cancellation, your account enters a 30-day grace period where you retain read-only access to historical data and reports. During this period, you can export all your data including Alpha Score history, bias analysis reports, signal logs, and performance metrics (CSV, PDF, or JSON formats). After 30 days, you can choose to: Permanently delete all data (GDPR "Right to be Forgotten" - irreversible deletion within 7 business days), Archive your data for potential future reactivation (retained for 12 months, then auto-deleted), or Reactivate your subscription and restore full access. We send three reminder emails before permanent deletion. Anonymized aggregate data (no personally identifiable information) may be retained for ML model training and research purposes in compliance with our privacy policy.'
      }
    ]
  },
  {
    category: 'Integration & Compatibility',
    questions: [
      {
        question: 'Which brokerages and trading platforms does Neufin support?',
        answer: 'Neufin integrates with 12,000+ financial institutions via Plaid, including all major US brokerages: Robinhood, TD Ameritrade, E*TRADE, Charles Schwab, Fidelity, Interactive Brokers, Webull, M1 Finance, Vanguard, and more. We also support manual portfolio entry for brokerages without API access or international accounts. Supported asset classes include: US equities (stocks, ETFs), Options (calls, puts, spreads), Cryptocurrencies (BTC, ETH, and 50+ alts via Coinbase/Kraken), Forex (major pairs), and Futures (commodity and index futures). If your brokerage isn\'t supported via Plaid, you can upload transaction history (CSV) or use our mobile app to manually sync positions. Our API team continuously adds new integrations based on user demand.'
      },
      {
        question: 'Does Neufin work with international/non-US markets?',
        answer: 'Currently, Neufin\'s primary focus is US markets (NYSE, NASDAQ, and major exchanges), but we support international investors in several ways: You can manually enter positions from any global exchange (London Stock Exchange, Tokyo Stock Exchange, Euronext, Toronto Stock Exchange, etc.). Our sentiment analysis covers global news for major international stocks (especially ADRs trading on US exchanges). The Neural Twin can analyze international holdings, though bias detection is most accurate for US-listed securities due to training data depth. We\'re actively developing direct integrations with major European and Asian brokerages, with UK and Canadian broker support launching in Q2 2025, and full multi-currency portfolio support planned for Q3 2025. Early access users will receive free upgrades to international features as they launch.'
      },
      {
        question: 'Is there a mobile app? What platforms are supported?',
        answer: 'Yes! Neufin offers native mobile apps for both iOS and Android platforms (available in App Store and Google Play). Mobile app features include: Real-time push notifications for high-confidence trading signals, Quick Alpha Score dashboard with portfolio overview, Bias alerts when our system detects emotional decision patterns, Sentiment heatmap with drill-down for specific positions, One-tap portfolio sync via biometric authentication, Dark mode with OLED-optimized design, and Offline mode (cached data for reviewing historical analysis). The mobile apps sync seamlessly with the web dashboard. Minimum requirements: iOS 15+ (iPhone 8 and newer), Android 10+ (2GB RAM minimum). We also offer a Progressive Web App (PWA) for access on any device with a modern browser, including tablets and desktops without app installation.'
      }
    ]
  },
  {
    category: 'Performance & Results',
    questions: [
      {
        question: 'What kind of returns can I expect using Neufin?',
        answer: 'Important disclaimer: Neufin does NOT guarantee investment returns. We are an intelligence platform, not a trading system. Past performance does not indicate future results. However, we can share aggregate user data from our beta program (500+ users, 6-month period): Average Alpha improvement of +3.2% annualized (range: -2.1% to +8.7%), Users with high bias scores (70+) saw average improvement of +4.8%, Sharpe ratio improved by average of +0.34 (better risk-adjusted returns), Reduced drawdowns by 12% on average during volatile periods, and 68% of users following debiasing recommendations outperformed their previous 12-month baseline. Results vary significantly based on portfolio size, asset allocation, user compliance with recommendations, and market conditions. Neufin works best for active investors making 10+ trades per year - passive buy-and-hold strategies may see limited benefit.'
      },
      {
        question: 'How long does it take to see results with Neufin?',
        answer: 'The timeline for seeing results depends on your trading activity and portfolio characteristics: Immediate (Day 1): Upon connecting your portfolio, you receive an instant Alpha Score analysis showing historical missed opportunities and bias quantification. This baseline assessment alone provides valuable insights. Week 1-2: As you receive your first trading signals and bias alerts, you\'ll start seeing how your Neural Twin would have approached recent decisions differently. Many users report "aha moments" recognizing past emotional decisions. Month 1-3: This is when behavior change begins to compound. Users who actively engage with debiasing interventions typically see measurable Alpha improvement (average +1.8% in first quarter). Month 3-6: Your Neural Twin becomes highly personalized, learning your risk tolerance and adapting recommendations. Average Alpha improvement accelerates to +3.2% annualized. 6+ Months: Long-term users develop "bias awareness" - they preemptively recognize cognitive traps before our system alerts them. This is when sustainable behavior change crystallizes.'
      }
    ]
  }
];

export function ExpandedFAQ() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/30" id="faq">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
            <HelpCircle className="h-4 w-4 mr-2" />
            Comprehensive FAQ
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: 'var(--heading-primary)' }}>
            Everything You Need to Know
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block">
              About Neufin AI
            </span>
          </h2>
          <p className="text-xl max-w-3xl mx-auto testimonial-text">
            Detailed answers about our technology, security, pricing, integrations, and expected results. Can't find what you're looking for? Contact us at info@neufin.ai
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-12">
          {faqCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: 'var(--heading-secondary)' }}>
                <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full" />
                {category.category}
              </h3>
              
              <div className="space-y-4">
                {category.questions.map((item, itemIndex) => {
                  const itemId = `${categoryIndex}-${itemIndex}`;
                  const isOpen = openItems.includes(itemId);

                  return (
                    <div
                      key={itemIndex}
                      className="bg-card border border-border rounded-lg overflow-hidden hover:border-purple-500/30 transition-all"
                    >
                      <button
                        onClick={() => toggleItem(itemId)}
                        className="w-full text-left p-6 flex justify-between items-start gap-4 hover:bg-muted/30 transition-colors"
                        aria-expanded={isOpen}
                      >
                        <h4 className="text-lg font-semibold pr-4" style={{ color: 'var(--heading-secondary)' }}>
                          {item.question}
                        </h4>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex-shrink-0"
                        >
                          <ChevronDown className="h-5 w-5 text-purple-400" />
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="px-6 pb-6 testimonial-text leading-relaxed">
                              {item.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="p-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20 inline-block">
            <p className="text-lg mb-4 testimonial-text">
              Still have questions? Our team is here to help.
            </p>
            <a
              href="mailto:info@neufin.ai"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
              Contact us at info@neufin.ai →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
