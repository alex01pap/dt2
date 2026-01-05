import { useEffect, lazy, Suspense } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { TechnoEconomicAnalysis } from "@/components/home/TechnoEconomicAnalysis";
import { DemoTwinViewer } from "@/components/home/DemoTwinViewer";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar - Clean minimal style */}
      <nav className="border-b border-border/40">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Eye className="h-6 w-6" />
              <span className="text-xl font-semibold">TwinVision</span>
            </Link>
            
            {/* Center Navigation */}
            <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
              <Link to="/architecture" className="hover:text-foreground transition-colors">Docs</Link>
              <Link to="/client-demo" className="hover:text-foreground transition-colors">Resources</Link>
              <Link to="/dashboard" className="hover:text-foreground transition-colors">Hub</Link>
              <Link to="/dashboard" className="hover:text-foreground transition-colors">Pricing</Link>
            </div>

            {/* Sign Up Button */}
            <Button 
              className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-6"
              onClick={() => navigate('/auth?mode=signup')}
            >
              Sign up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Centered minimal design */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge 
                variant="secondary" 
                className="rounded-full px-4 py-2 text-sm font-normal bg-muted/50 hover:bg-muted/70 transition-colors"
              >
                <Star className="h-3.5 w-3.5 mr-2 inline" />
                Next-Gen IoT Platform
              </Badge>
            </motion.div>
            
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
            >
              Monitor smarter than ever
            </motion.h1>
            
            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              Transform your infrastructure with intelligent digital twins. Real-time monitoring, 3D visualization, and AI-powered insights for modern buildings.
            </motion.p>
            
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4"
            >
              <Zap className="h-4 w-4 text-orange-500" />
              <span>Trusted by 150+ facilities worldwide</span>
            </motion.div>

            {/* Avatar Group */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex justify-center -space-x-3 pt-4"
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border-4 border-background shadow-lg"
                />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-4">
              Interactive Demo
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              See it in action
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore a classroom digital twin with real-time sensor data, heat maps, and HVAC visualization.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <DemoTwinViewer />
          </motion.div>
        </div>
      </section>

      {/* Techno-Economic Analysis Section */}
      <TechnoEconomicAnalysis />

      {/* Footer CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center space-y-6"
          >
            <Button 
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-12 text-base"
              onClick={() => navigate('/dashboard')}
            >
              Get Started Free
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
