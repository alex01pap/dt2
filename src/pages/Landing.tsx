import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight,
  Check,
  Building2,
  Zap,
  Shield,
  Globe,
  Eye,
  Star,
  HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  "Real-time monitoring",
  "3D visualization",
  "AI analytics",
  "Custom rules engine",
  "Multi-tenant support",
  "Enterprise security"
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$0",
    period: "/ month",
    description: "Perfect for testing and small deployments",
    features: [
      "Up to 10 sensors",
      "Real-time monitoring",
      "3D visualization",
      "Basic analytics",
      "Community support"
    ],
    cta: "Start Free",
    highlighted: false
  },
  {
    name: "Professional",
    price: "$299",
    originalPrice: "$599",
    period: "/ month",
    description: "For growing operations",
    badge: "🔥 50% OFF 🔥",
    features: [
      "Unlimited sensors",
      "Advanced AI analytics",
      "Custom dashboards",
      "API access",
      "openHAB integration",
      "Priority support",
      "Custom rules engine",
      "Historical data"
    ],
    cta: "Get Started",
    highlighted: true
  },
  {
    name: "Enterprise",
    price: "$999",
    originalPrice: "$1999",
    period: "/ month",
    description: "For large-scale deployments",
    features: [
      "Everything in Pro",
      "Multi-site support",
      "Dedicated support",
      "Custom training",
      "SLA 99.9% uptime",
      "White-label options",
      "On-premise deployment",
      "Custom integrations"
    ],
    cta: "Contact Sales",
    highlighted: false
  }
];

export default function Landing() {
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dot Pattern Background */}
      <div className="absolute inset-0 dot-pattern opacity-50" />
      
      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between p-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Eye className="h-6 w-6 text-foreground" />
          <span className="text-lg font-semibold text-foreground">TwinVision</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link to="/architecture" className="hover:text-foreground transition-colors">Docs</Link>
          <Link to="/client-demo" className="hover:text-foreground transition-colors">Resources</Link>
          <Link to="/dashboard" className="hover:text-foreground transition-colors">Hub</Link>
          <Link to="/dashboard" className="hover:text-foreground transition-colors font-medium bg-secondary px-3 py-1.5 rounded-md">Pricing</Link>
        </div>

        <div className="flex items-center gap-3">
          <Button size="sm" className="hidden md:inline-flex rounded-full">
            Sign up
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 text-center px-6 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto space-y-6">
          <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-sm">
            <Star className="h-3.5 w-3.5 mr-1.5 inline" />
            Next-Gen IoT Platform
          </Badge>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-tight tracking-tight">
            Monitor smarter than ever
          </h1>
          
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transform your infrastructure with intelligent digital twins. 
            Real-time monitoring, 3D visualization, and AI-powered insights for modern buildings.
          </p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2">
            <span className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-orange-500" />
              Trusted by 150+ facilities worldwide
            </span>
          </div>

          {/* Avatar Group */}
          <div className="flex justify-center -space-x-2 pt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border-2 border-background"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative z-10 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index}
                className={`relative transition-all duration-300 ${
                  plan.highlighted 
                    ? 'card-gradient border-0 scale-105 shadow-lg' 
                    : 'card-enterprise hover:scale-105'
                }`}
                onMouseEnter={() => setHoveredPlan(index)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent px-4 py-1 rounded-full text-xs font-medium">
                    {plan.badge}
                  </div>
                )}
                
                <CardHeader className="space-y-3 pb-6">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  {plan.originalPrice && (
                    <div className="text-sm text-muted-foreground line-through">
                      {plan.originalPrice}
                    </div>
                  )}
                  <CardDescription className="text-xs text-muted-foreground">
                    {plan.description}
                  </CardDescription>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                    <Eye className="h-4 w-4" />
                    <span>Single seat</span>
                    <HelpCircle className="h-3.5 w-3.5" />
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-1">
                    <div className="text-sm font-medium mb-3">Products</div>
                    <div className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                          <HelpCircle className="h-3.5 w-3.5 ml-auto" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className={`w-full rounded-full ${
                      plan.highlighted 
                        ? 'bg-primary text-primary-foreground hover:bg-primary-hover' 
                        : 'bg-secondary text-secondary-foreground hover:bg-muted'
                    }`}
                    asChild
                  >
                    <Link to="/dashboard">
                      {plan.cta}
                    </Link>
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    {plan.highlighted 
                      ? "Keep everything you build. Cancel anytime."
                      : "Start for free. No commitment."}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Wave Hero Section */}
      <section className="relative z-10 px-6 py-20 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-b from-cyan-50 to-cyan-200 p-12 lg:p-20">
            {/* Circular Waves */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-[200%] h-[200%] rounded-full border border-white/20" />
              <div className="absolute w-[150%] h-[150%] rounded-full border border-white/20" />
              <div className="absolute w-[100%] h-[100%] rounded-full border border-white/20" />
            </div>
            
            <div className="relative z-10 text-center space-y-6">
              <div className="inline-block w-0.5 h-16 bg-muted-foreground/30 mb-4" />
              
              <Button 
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary-hover rounded-full shadow-lg"
                asChild
              >
                <Link to="/dashboard">
                  Start now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="relative z-10 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="card-enterprise p-8">
            <div className="flex items-start justify-between gap-4">
              <p className="text-lg text-foreground max-w-2xl">
                "TwinVision transformed how we monitor our facilities. The 3D visualization makes it incredibly easy to spot issues before they become problems. Real game-changer!"
              </p>
              <Button variant="ghost" size="icon" className="rounded-full">
                <span className="text-xl">𝕏</span>
              </Button>
            </div>
            
            <div className="flex items-center gap-3 mt-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-sm">Andreas Schmidt</div>
                <div className="text-xs text-muted-foreground">Facility Manager @TechCorp</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="card-enterprise p-8 col-span-1 md:col-span-2 bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                    From single room
                    to smart campus
                  </h2>
                  <p className="text-muted-foreground">
                    See how TwinVision scaled from monitoring a single restaurant to managing entire smart building complexes
                  </p>
                  
                  <div className="flex items-center gap-3 pt-4">
                    <Building2 className="w-10 h-10 text-primary" />
                    <span className="font-medium text-sm">Restaurant Case Study</span>
                  </div>
                  
                  <Button className="mt-6 bg-primary text-primary-foreground hover:bg-primary-hover rounded-full" asChild>
                    <Link to="/client-demo">
                      View Demo
                    </Link>
                  </Button>
                </div>
                
                <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl aspect-video flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20" />
                  <Eye className="h-24 w-24 text-cyan-400" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Frequently
              asked questions
            </h2>
            <p className="text-muted-foreground">
              Learn more about TwinVision
            </p>
          </div>
          
          <div className="space-y-4">
            {[
              "What sensors are supported?",
              "Can I integrate with openHAB?",
              "How does 3D visualization work?",
              "What's included in the free plan?",
              "Do you offer on-premise deployment?"
            ].map((question, idx) => (
              <Card key={idx} className="card-enterprise p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{question}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
                </div>
              </Card>
            ))}
            
            <p className="text-sm text-muted-foreground pt-4 text-center">
              Got more questions? Email us at{' '}
              <span className="text-primary font-medium">support@twinvision.com</span>
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-b from-slate-50 to-slate-200 p-12 lg:p-20">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-[200%] h-[200%] rounded-full border border-white/20" />
              <div className="absolute w-[150%] h-[150%] rounded-full border border-white/20" />
            </div>
            
            <div className="relative z-10 text-center space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                Start monitoring smarter
              </h2>
              
              <Button 
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary-hover rounded-full shadow-lg"
                asChild
              >
                <Link to="/dashboard">
                  Launch Platform
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
