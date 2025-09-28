import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ParticlesBackground } from '@/components/ui/particles-background';
import { 
  ArrowRight,
  Play,
  Building2,
  Zap,
  Shield,
  Globe,
  Users,
  Database,
  Brain,
  Eye,
  CheckCircle,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Building2,
    title: "Digital Twin Technology",
    description: "Create accurate digital replicas of your physical assets with real-time monitoring and control."
  },
  {
    icon: Brain,
    title: "AI-Powered Analytics", 
    description: "Advanced machine learning algorithms provide predictive insights and automated optimization."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade security with role-based access control and comprehensive audit trails."
  },
  {
    icon: Globe,
    title: "Global Scalability",
    description: "Multi-tenant SaaS architecture scales from prototype to millions of users worldwide."
  }
];

const stats = [
  { label: "Active Installations", value: "150+", icon: Building2 },
  { label: "Data Points Monitored", value: "2.5M+", icon: Database },
  { label: "Enterprise Clients", value: "50+", icon: Users },
  { label: "Uptime Guarantee", value: "99.9%", icon: CheckCircle }
];

export default function Landing() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <ParticlesBackground particleCount={80} color="rgba(34, 211, 238, 0.3)" />
      
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between p-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Eye className="h-8 w-8 text-cyan-400" />
          <span className="text-xl font-bold text-white">TwinVision</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-slate-300">
          <Link to="/architecture" className="hover:text-cyan-400 transition-colors">Architecture</Link>
          <Link to="/dashboard" className="hover:text-cyan-400 transition-colors">Platform</Link>
          <Link to="/twin/1" className="hover:text-cyan-400 transition-colors">Demo</Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
            Sign In
          </Button>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 text-center px-6 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto space-y-8">
          <Badge className="bg-cyan-400/10 text-cyan-300 border-cyan-400/30 px-4 py-2">
            <Star className="h-4 w-4 mr-2" />
            Next-Generation Digital Twin Platform
          </Badge>
          
          <h1 className="text-4xl lg:text-7xl font-bold text-white leading-tight">
            Ready to transform your
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent block glow-text">
              infrastructure monitoring?
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Create intelligent digital twins of your facilities, monitor real-time performance, 
            and optimize operations with our enterprise-grade SaaS platform.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 text-lg"
              asChild
            >
              <Link to="/dashboard">
                Access Platform
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-slate-600 text-slate-300 hover:bg-slate-700 px-8 py-4 text-lg"
              asChild
            >
              <Link to="/twin/1">
                <Play className="h-5 w-5 mr-2" />
                View Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="border-slate-700/50 bg-slate-800/30 backdrop-blur-sm text-center">
                <CardContent className="p-6 space-y-2">
                  <stat.icon className="h-8 w-8 text-cyan-400 mx-auto" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              Enterprise-Grade <span className="text-cyan-400">Features</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Built for scalability, security, and performance at every level of your organization.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className={`border-slate-700/50 bg-slate-800/30 backdrop-blur-sm transition-all duration-300 cursor-pointer
                  ${hoveredFeature === index ? 'border-cyan-400/50 shadow-lg shadow-cyan-400/20' : ''}`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg transition-colors duration-300
                      ${hoveredFeature === index ? 'bg-cyan-400/20' : 'bg-slate-700/50'}`}>
                      <feature.icon className={`h-6 w-6 transition-colors duration-300
                        ${hoveredFeature === index ? 'text-cyan-400' : 'text-slate-400'}`} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                      <p className="text-slate-300">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="border-slate-700/50 bg-slate-800/20 backdrop-blur-sm">
            <CardContent className="p-12 space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-white">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-slate-300">
                Join leading organizations already transforming their operations with our platform.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-8 py-4"
                  asChild
                >
                  <Link to="/dashboard">
                    Start Free Trial
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 px-8 py-4"
                  asChild
                >
                  <Link to="/architecture">
                    Learn More
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}