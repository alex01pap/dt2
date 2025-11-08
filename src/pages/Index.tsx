import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Shield, BarChart3, Cpu, Layers, Eye, User, Globe, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useHeroVideo } from "@/hooks/useHeroVideo";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: heroVideoUrl } = useHeroVideo();
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: Cpu,
      title: "IoT Sensors",
      description: "Real-time monitoring of industrial sensors and devices"
    },
    {
      icon: Layers,
      title: "Digital Twin", 
      description: "3D visualization and simulation of physical assets"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive insights and predictive analytics"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Role-based access control and secure data handling"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar - Pico Style */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Eye className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">TwinVision</span>
            </Link>
            
            {/* Center Navigation */}
            <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
              <Link to="/client-demo" className="hover:text-foreground transition-colors">Products</Link>
              <Link to="/dashboard" className="hover:text-foreground transition-colors">Store</Link>
              <Link to="/architecture" className="hover:text-foreground transition-colors">Community</Link>
              <Link to="/tutorials" className="hover:text-foreground transition-colors">Developer</Link>
              <Link to="/dashboard" className="hover:text-foreground transition-colors">Business</Link>
              <Link to="/dashboard" className="hover:text-foreground transition-colors">Blog</Link>
              <Link to="/dashboard" className="hover:text-foreground transition-colors">Support</Link>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Globe className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Video Background */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {heroVideoUrl ? (
            <>
              {/* Actual Video Background */}
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src={heroVideoUrl} type="video/mp4" />
              </video>
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black/50" />
            </>
          ) : (
            <>
              {/* Fallback when no video */}
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 bg-grid-white/[0.02]" />
              
              {/* 3D Visualization Placeholder */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="relative w-full h-full max-w-5xl mx-auto flex items-center justify-center">
                  <Layers className="h-64 w-64 text-primary/20 animate-pulse" />
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-3xl space-y-6"
            >
              <Badge className="bg-primary/10 text-primary border-primary/20 backdrop-blur-sm">
                <Building2 className="h-3 w-3 mr-1" />
                Digital Twin Technology
              </Badge>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
                Reality.<br />
                <span className="text-primary">Amplified.</span>
              </h1>
              
              <p className="text-xl text-gray-200 max-w-xl">
                Transform your infrastructure with intelligent digital twins. Real-time monitoring meets immersive visualization.
              </p>

              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-gray-100 text-base px-8 h-12 rounded-full group"
                onClick={() => navigate('/dashboard')}
              >
                Explore Platform
                <Play className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Sound Icon - Bottom Right */}
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute bottom-8 right-8 z-20 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
        >
          <span className="text-white text-xl">🔊</span>
        </Button>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Platform Capabilities</h2>
            <p className="text-xl text-muted-foreground">Enterprise-grade digital twin technology</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="card-enterprise h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center">
                      <feature.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-5xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Uptime</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-5xl font-bold text-primary mb-2">10k+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Connected Devices</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="text-5xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Monitoring</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="text-5xl font-bold text-primary mb-2">ISO 27001</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Certified</div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;