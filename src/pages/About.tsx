import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Brain, Users, Target, Zap, Award, TrendingUp, Shield, Lightbulb, Github, Linkedin, Twitter } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import varunImage from 'figma:asset/8e2ff8165f1275e62c161d31d060fac73b28630b.png';
import haPhamImage from 'figma:asset/605288320eabea65049af0b15dbcd91a0646626b.png';
import rayNeeImage from 'figma:asset/1a6953dac9b9a752de2cbd81d301fe4039450d79.png';

const values = [
  {
    icon: Brain,
    title: 'AI-First Approach',
    description: 'We believe artificial intelligence can eliminate human cognitive biases and democratize access to institutional-grade trading intelligence.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20'
  },
  {
    icon: Shield,
    title: 'Data Privacy',
    description: 'Your trading data is sacred. We use military-grade encryption and never share or sell personal information to third parties.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20'
  },
  {
    icon: Target,
    title: 'Measurable Results',
    description: 'Every recommendation is quantified. We track your Alpha Score improvement and provide transparent performance metrics.',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20'
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Trading is better together. Our platform connects traders to share insights while maintaining individual privacy.',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20'
  }
];

const founders = [
  {
    name: 'Varun Srivastava',
    role: 'Founder & CEO',
    bio: 'Cyber Defense and AI leader with global experience in threat intelligence and risk systems. Previously led teams countering nation-state cyberattacks. Brings deep expertise in AI, cybersecurity, and behavioral finance; founded Neufin to make hedge fund–level intelligence accessible to retail investors.',
    image: varunImage,
    social: {
      linkedin: 'https://www.linkedin.com/in/varuns/'
    }
  },
  {
    name: 'Ha Pham',
    role: 'Co-Founder & Chief Strategy Officer',
    bio: '15+ years in digital banking, scaling Vietnam International Bank to 93% digital transactions and 60% adoption. Recognized by The Banker and The Asset. Brings to Neufin proven expertise in AI-driven personalization, platform strategy, and scaling innovation, ensuring a mission-led, user-first approach to growth.',
    image: haPhamImage,
    social: {
      linkedin: 'https://www.linkedin.com/in/ha-pham-thu/'
    }
  },
  {
    name: 'Ray Nee',
    role: 'Co-Founder & Chief of Hustle',
    bio: 'Operations and program leader with experience across Singapore, Japan, and New Zealand. Managed multi-million-dollar upskilling programs and global brand campaigns. Focuses on human-centered technology, partnerships, and operational excellence to drive Neufin\'s scaling journey.',
    image: rayNeeImage,
    social: {
      linkedin: 'https://www.linkedin.com/in/ray-nee-tong-589385117/'
    }
  }
];

const stats = [
  { label: 'Early Adopters', value: '400+', desc: 'Testing and validating our platform' },
  { label: 'Analytics Sources', value: '10,000+', desc: 'Real-time data feeds and signals' },
  { label: 'Bias Types', value: '47', desc: 'Cognitive biases detected and corrected' },
  { label: 'Papers Published', value: '23', desc: 'Peer-reviewed research contributions' }
];

export function About() {
  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10" />
        <motion.div
          className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3] 
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6" style={{ color: 'var(--heading-primary)' }}>
              Eliminating Bias from
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent block">
                Financial Markets
              </span>
            </h1>
            
            <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed testimonial-text">
              We're a team of former Wall Street quantitative researchers and AI engineers on a mission 
              to democratize access to institutional-grade trading intelligence through advanced neural networks.
            </p>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl lg:text-3xl font-bold text-purple-400 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium mb-1">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technology Showcase Section */}
      <section className="py-20 bg-gradient-to-br from-muted/30 to-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6" style={{ color: 'var(--heading-primary)' }}>
              Our Technology
            </h2>
            <p className="text-lg leading-relaxed testimonial-text">
              Advanced AI and machine learning algorithms power our bias detection and trading optimization platform.
            </p>
          </motion.div>

          {/* Technology Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-16"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1695902173528-0b15104c4554?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMG1hY2hpbmUlMjBsZWFybmluZyUyMHZpc3VhbGl6YXRpb258ZW58MXx8fHwxNzU5NzI5NTI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="AI machine learning visualization showing neural networks and data analysis"
                className="w-full h-80 object-cover rounded-xl shadow-2xl border border-purple-500/20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-600/30 to-transparent rounded-xl" />
              <div className="absolute bottom-6 left-6">
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-3 py-1">
                  <Brain className="h-4 w-4 mr-2" />
                  Neural Network Architecture
                </Badge>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6" style={{ color: 'var(--heading-primary)' }}>
              Our Mission
            </h2>
            <p className="text-lg leading-relaxed testimonial-text">
              Traditional trading platforms focus on tools and data, but they ignore the biggest factor 
              affecting performance: human psychology. Research shows that cognitive biases cost individual 
              traders an average of 2-4% annually. Our Neural Twin AI technology identifies and corrects 
              these biases in real-time, helping traders make more rational, profitable decisions.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-card/50">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Lightbulb className="h-6 w-6 text-purple-400" />
                    </div>
                    <CardTitle style={{ color: 'var(--heading-secondary)' }}>The Problem</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="testimonial-text">
                    Even professional traders fall victim to cognitive biases like confirmation bias, 
                    loss aversion, and anchoring. These psychological patterns consistently lead to:
                  </p>
                  <ul className="space-y-2 text-sm testimonial-text">
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                      <span>Holding losing positions too long</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                      <span>Selling winners too early</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                      <span>Overconfidence in recent performance</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                      <span>Emotional decision making during volatility</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-card/50">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Award className="h-6 w-6 text-green-400" />
                    </div>
                    <CardTitle style={{ color: 'var(--heading-secondary)' }}>Our Solution</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="testimonial-text">
                    Neufin's Neural Twin AI acts as your bias-free trading companion, trained on 
                    millions of market decisions to provide objective recommendations:
                  </p>
                  <ul className="space-y-2 text-sm testimonial-text">
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      <span>Real-time bias detection and alerts</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      <span>Optimal entry and exit timing</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      <span>Quantified Alpha Score improvement</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      <span>Emotion-free decision frameworks</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6" style={{ color: 'var(--heading-primary)' }}>
              Our Values
            </h2>
            <p className="text-lg max-w-3xl mx-auto testimonial-text">
              These principles guide everything we build and every decision we make.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-card/50 hover:bg-card/70 transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${value.bgColor} group-hover:scale-110 transition-transform`}>
                        <value.icon className={`h-6 w-6 ${value.color}`} />
                      </div>
                      <CardTitle style={{ color: 'var(--heading-secondary)' }}>{value.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed testimonial-text">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-muted/30 to-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6" style={{ color: 'var(--heading-primary)' }}>
              Meet Our Founders
            </h2>
            <p className="text-lg max-w-3xl mx-auto testimonial-text">
              Experienced leaders bringing together expertise in AI, cybersecurity, digital banking, and operations.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {founders.map((founder, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-card/50 hover:bg-card/70 transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-6">
                      <img
                        src={founder.image}
                        alt={`${founder.name} - ${founder.role}`}
                        className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-purple-500/30"
                      />
                      <div className="absolute inset-0 w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    <h3 className="font-semibold mb-1" style={{ color: 'var(--heading-secondary)' }}>
                      {founder.name}
                    </h3>
                    <p className="text-sm text-purple-400 mb-4 font-medium">{founder.role}</p>
                    <p className="text-sm leading-relaxed mb-6 testimonial-text">{founder.bio}</p>
                    
                    <div className="flex justify-center">
                      {founder.social.linkedin && (
                        <Button 
                          asChild
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 icon-enhanced" 
                          aria-label={`${founder.name}'s LinkedIn`}
                        >
                          <a href={founder.social.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6" style={{ color: 'var(--heading-primary)' }}>
              Ready to Meet Your
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent block">
                Neural Twin?
              </span>
            </h2>
            
            <p className="text-lg mb-8 testimonial-text">
              Join thousands of traders who've eliminated bias from their decision-making process.
            </p>
            
            <Button 
              asChild
              size="lg" 
              className="cta-button px-8 py-4"
              role="button"
              aria-label="Contact us to start your Neural Twin trial"
            >
              <a href="mailto:info@neufin.ai?subject=Neural Twin Free Trial Request&body=Hi, I'm interested in starting a free trial of the Neural Twin AI platform.">
                Start Your Free Trial
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}