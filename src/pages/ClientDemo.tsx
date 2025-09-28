import { motion } from "framer-motion";
import { 
  TrendingUp,
  Zap,
  Shield,
  DollarSign,
  Building2,
  BarChart3,
  CheckCircle2,
  Brain,
  ArrowRight,
  PlayCircle,
  Lightbulb,
  Timer,
  Sparkles,
  Infinity,
  Globe,
  Star
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const metrics = [
  {
    icon: TrendingUp,
    title: "Efficiency Increase",
    value: "35%",
    description: "Average improvement in operational efficiency",
    gradient: "from-green-400 to-emerald-600"
  },
  {
    icon: DollarSign,
    title: "Cost Reduction",
    value: "$240K",
    description: "Annual savings through predictive maintenance",
    gradient: "from-blue-400 to-cyan-600"
  },
  {
    icon: Zap,
    title: "Energy Savings",
    value: "28%",
    description: "Reduction in energy consumption",
    gradient: "from-orange-400 to-amber-600"
  },
  {
    icon: Timer,
    title: "Downtime Reduction",
    value: "65%",
    description: "Less unplanned maintenance events",
    gradient: "from-purple-400 to-violet-600"
  }
];

const features = [
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Machine learning algorithms that understand your facility patterns and predict future states with 95% accuracy.",
    gradient: "from-indigo-500 to-purple-600"
  },
  {
    icon: Building2,
    title: "3D Digital Twin",
    description: "Photorealistic 3D visualization of your facilities with real-time data overlay and interactive controls.",
    gradient: "from-cyan-500 to-blue-600"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade security with SOC 2 certification, end-to-end encryption, and comprehensive audit trails.",
    gradient: "from-green-500 to-teal-600"
  },
  {
    icon: Infinity,
    title: "Unlimited Scalability",
    description: "From single buildings to global portfolios, our platform scales seamlessly with your business growth.",
    gradient: "from-pink-500 to-rose-600"
  }
];

const testimonials = [
  {
    quote: "The Digital Twin platform transformed our operations completely. We're seeing results we never thought possible.",
    author: "Sarah Chen",
    title: "VP Operations, TechCorp Industries",
    metrics: "32% energy reduction, $280K annual savings",
    avatar: "SC"
  },
  {
    quote: "Implementation was seamless and ROI was achieved in just 6 months. The team's expertise is unmatched.",
    author: "Michael Rodriguez", 
    title: "Facility Director, Global Logistics Inc",
    metrics: "45% less equipment failures, 99.9% uptime",
    avatar: "MR"
  }
];

export default function ClientDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.05)_50%,transparent_75%,transparent),linear-gradient(-45deg,transparent_25%,rgba(68,68,68,.05)_50%,transparent_75%,transparent)] bg-[length:20px_20px]" />
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32"
        >
          <motion.div variants={itemVariants} className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-slate-200">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-medium text-slate-700">Next-Generation Digital Twin Platform</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
              <span className="text-slate-900">Transform Your</span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Operations
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-xl text-slate-600 leading-relaxed">
              Harness the power of digital twins to optimize performance, predict failures, 
              and unlock unprecedented insights from your physical assets.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-xl"
              >
                <PlayCircle className="h-5 w-5 mr-2" />
                Watch Demo
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg border-slate-300 hover:bg-slate-50"
              >
                Get Started
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Metrics Section */}
      <section className="py-20 bg-white">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-6"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Measurable Impact From Day One
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Join industry leaders who've transformed their operations with our platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group"
              >
                <Card className="p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white hover:-translate-y-2">
                  <CardContent className="p-0 text-center">
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${metric.gradient} flex items-center justify-center shadow-lg`}>
                      <metric.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent`}>
                      {metric.value}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {metric.title}
                    </h3>
                    
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {metric.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-6"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Engineered for Excellence
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Advanced capabilities that set new standards for digital transformation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group"
              >
                <Card className="p-8 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="flex items-start gap-6">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <feature.icon className="h-7 w-7 text-white" />
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/50 to-purple-900/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-white/5 to-transparent" />
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative max-w-7xl mx-auto px-6"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
              See how organizations like yours are achieving breakthrough results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group"
              >
                <Card className="p-8 border-0 bg-white/10 backdrop-blur-md shadow-2xl hover:bg-white/15 transition-all duration-500">
                  <CardContent className="p-0">
                    <div className="flex items-start gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    <blockquote className="text-lg text-white mb-6 leading-relaxed italic">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center font-bold text-white">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{testimonial.author}</div>
                          <div className="text-indigo-200 text-sm">{testimonial.title}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <div className="text-sm text-cyan-300 font-medium">
                        {testimonial.metrics}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 bg-white">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-6"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Leading Companies Choose Us
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Comprehensive benefits that drive real business transformation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "Global Scale",
                description: "Deploy across multiple sites and regions with unified management and reporting capabilities."
              },
              {
                icon: CheckCircle2,
                title: "Proven ROI",
                description: "Average 6-month payback period with measurable improvements in efficiency and cost reduction."
              },
              {
                icon: Shield,
                title: "Enterprise Ready",
                description: "SOC 2 certified with enterprise-grade security, compliance, and 99.99% uptime guarantee."
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Ready to Transform Your Operations?
            </h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Join the digital transformation revolution. Schedule a personalized demo 
              and see how our platform can optimize your specific use case.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-xl"
              >
                <Lightbulb className="h-5 w-5 mr-2" />
                Schedule Demo
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg border-slate-300 hover:bg-slate-50"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                ROI Calculator
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>No commitment required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Free consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Custom ROI analysis</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}