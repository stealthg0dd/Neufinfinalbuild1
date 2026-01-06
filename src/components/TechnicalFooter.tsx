import { Badge } from './ui/badge';
import { 
  Code, 
  Database, 
  Lock, 
  Zap, 
  Cloud,
  Cpu,
  Shield,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function TechnicalFooter() {
  const technicalSpecs = [
    {
      category: 'AI & Machine Learning',
      icon: Cpu,
      specs: [
        'Deep Learning: PyTorch 2.0 + TensorFlow',
        'Neural Architecture: Transformer-based (GPT-style) with 175M parameters',
        'Training Data: 10+ years market data, 50M+ transactions',
        'Model Update Frequency: Real-time incremental learning',
        'Inference Latency: <100ms average',
        'Bias Detection: 47 cognitive biases via behavioral finance algorithms'
      ]
    },
    {
      category: 'Data Infrastructure',
      icon: Database,
      specs: [
        'Real-time Data Sources: 50,000+ (Bloomberg, Reuters, SEC, Social)',
        'Data Processing: Apache Kafka + Spark streaming',
        'Time Series DB: InfluxDB for tick-level market data',
        'Data Refresh Rate: <500ms for sentiment, <1s for market data',
        'Historical Data: 20+ years backtesting repository',
        'API Rate Limits: 1000 req/min (Individual), Unlimited (Enterprise)'
      ]
    },
    {
      category: 'Security & Compliance',
      icon: Shield,
      specs: [
        'Certifications: SOC 2 Type II, GDPR, CCPA compliant',
        'Encryption: AES-256 (at rest), TLS 1.3 (in transit)',
        'Authentication: OAuth 2.0, MFA, Biometric (FIDO2)',
        'Zero-Knowledge: Passwords never stored or transmitted',
        'Penetration Testing: Quarterly by certified ethical hackers',
        'Compliance: SEC Reg S-P, FINRA 4512 aligned'
      ]
    },
    {
      category: 'Cloud Architecture',
      icon: Cloud,
      specs: [
        'Infrastructure: AWS (Multi-AZ deployment)',
        'Uptime SLA: 99.9% (Enterprise: 99.99%)',
        'Auto-Scaling: Kubernetes orchestration',
        'CDN: CloudFlare global edge network',
        'Disaster Recovery: RTO <1hr, RPO <15min',
        'Monitoring: Datadog + PagerDuty 24/7'
      ]
    },
    {
      category: 'API & Integrations',
      icon: Code,
      specs: [
        'REST API: OpenAPI 3.0 specification',
        'WebSocket: Real-time signal streaming',
        'Webhooks: Event-driven notifications',
        'SDK Support: Python, JavaScript, Java',
        'Brokerage Integration: Plaid (12,000+ institutions)',
        'Authentication: JWT tokens, API key management'
      ]
    },
    {
      category: 'Performance Metrics',
      icon: Zap,
      specs: [
        'Signal Generation: 2.4 hours ahead of market moves (avg)',
        'Accuracy: 73% directional (6-month rolling)',
        'False Positive Rate: 0.12%',
        'Backtesting: 10,000 Monte Carlo simulations',
        'Portfolio Sync: <5 seconds via Plaid',
        'Dashboard Load Time: <1.2s (Lighthouse 95+ score)'
      ]
    }
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'GDPR Compliance', href: '/gdpr' },
    { label: 'Security', href: '/security' },
    { label: 'Accessibility', href: '/accessibility' }
  ];

  const productLinks = [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Demo', href: '/demo' },
    { label: 'API Documentation', href: '/api' },
    { label: 'Knowledge Hub', href: '/#knowledge-hub' },
    { label: 'FAQ', href: '/#faq' }
  ];

  const companyLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press Kit', href: '/press' },
    { label: 'Contact', href: '/contact' },
    { label: 'Blog', href: '/blog' },
    { label: 'Research', href: '/research' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-950 to-gray-900 border-t border-gray-800">
      {/* Technical Specifications Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 text-green-400 border-green-500/30 px-4 py-2">
            <Code className="h-4 w-4 mr-2" />
            Technical Specifications
          </Badge>
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--heading-primary)' }}>
            Platform Architecture & Performance
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade infrastructure built for speed, security, and scalability
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {technicalSpecs.map((section, index) => (
            <div 
              key={index}
              className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-purple-500/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <section.icon className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--heading-secondary)' }}>
                  {section.category}
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {section.specs.map((spec, specIndex) => (
                  <li key={specIndex} className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span className="leading-relaxed">{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 pb-12 border-b border-gray-800">
          {/* Company Info */}
          <div>
            <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--heading-secondary)' }}>
              Neufin AI
            </h4>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              AI-powered investment intelligence that eliminates cognitive biases and quantifies missed alpha opportunities.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://twitter.com/neufin" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-purple-400 transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a 
                href="https://linkedin.com/company/neufin" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-purple-400 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="https://github.com/neufin" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-purple-400 transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--heading-secondary)' }}>
              Product
            </h4>
            <ul className="space-y-2">
              {productLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-purple-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--heading-secondary)' }}>
              Company
            </h4>
            <ul className="space-y-2">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-purple-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--heading-secondary)' }}>
              Legal & Compliance
            </h4>
            <ul className="space-y-2">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-purple-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2024 Neufin AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-xs">
              <RefreshCw className="h-3 w-3 mr-1" />
              v2.4.1
            </Badge>
            <span>🇺🇸 Proudly built in the USA</span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-xs text-yellow-400/80 leading-relaxed">
            <strong>Investment Disclaimer:</strong> Neufin AI is a decision intelligence platform, not a registered investment advisor or broker-dealer. 
            Information provided is for educational purposes only and should not be construed as financial advice. 
            Past performance does not guarantee future results. Investing involves risk, including potential loss of principal. 
            Always consult with a qualified financial advisor before making investment decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}
