import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, ArrowRight, Shield, BarChart3, Users, LogIn, UserPlus, Cpu, Layers, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 max-w-4xl mx-auto"
        >
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            Industrial IoT Platform
          </Badge>
          
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
            <Building2 className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent">
            Digital Twin Platform
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Monitor, analyze, and optimize your industrial assets with our comprehensive 
            IoT platform. Real-time insights, predictive analytics, and automated workflows.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              size="lg" 
              className="btn-hero text-lg px-8 py-6 h-auto"
              onClick={() => navigate('/auth?mode=signup')}
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-6 h-auto border-primary/20 hover:bg-primary/5"
              onClick={() => navigate('/auth')}
            >
              <LogIn className="mr-2 h-5 w-5" />
              Sign In
            </Button>
          </div>

          {/* Platform Status Link for Developers */}
          <div className="pt-6 flex flex-col sm:flex-row gap-2 justify-center">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/architecture')}
              className="text-muted-foreground hover:text-primary"
            >
              <Layers className="mr-2 h-4 w-4" />
              Platform Architecture
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/status')}
              className="text-muted-foreground hover:text-primary"
            >
              <GitBranch className="mr-2 h-4 w-4" />
              Development Status
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-24 grid md:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            >
              <Card className="card-enterprise h-full">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-24 grid md:grid-cols-4 gap-8 text-center"
        >
          <div>
            <div className="text-3xl font-bold text-primary">99.9%</div>
            <div className="text-sm text-muted-foreground">Uptime</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">10k+</div>
            <div className="text-sm text-muted-foreground">Connected Devices</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">24/7</div>
            <div className="text-sm text-muted-foreground">Monitoring</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">ISO 27001</div>
            <div className="text-sm text-muted-foreground">Certified</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;