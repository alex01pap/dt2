import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, ChevronLeft, ChevronRight, Volume2, VolumeX, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useHeroVideo } from "@/hooks/useHeroVideo";
import { DigitalTwinEcosystem } from "@/components/home/DigitalTwinEcosystem";
import { StatsSection } from "@/components/home/StatsSection";

const heroSlides = [
  {
    id: 1,
    badge: "Digital Twin Platform",
    title: "Reality. Amplified.",
    description: "Experience your infrastructure in real-time 3D visualization",
    cta: "Explore Platform",
    link: "/dashboard"
  },
  {
    id: 2,
    badge: "Smart Buildings",
    title: "Monitor. Anywhere. Anytime.",
    description: "Complete control of your facilities from any device",
    cta: "Learn More",
    link: "/client-demo"
  },
  {
    id: 3,
    badge: "Enterprise IoT",
    title: "Intelligent Infrastructure.",
    description: "Connect thousands of sensors with enterprise-grade reliability",
    cta: "See Architecture",
    link: "/architecture"
  }
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: heroVideoUrl } = useHeroVideo();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Redirect authenticated users
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const currentHero = heroSlides[currentSlide];

  const scrollToContent = () => {
    const nextSection = document.getElementById('stats-section');
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
              <Eye className="h-6 w-6" />
              <span className="text-xl font-semibold">TwinVision</span>
            </Link>
            
            {/* Center Navigation */}
            <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
              <Link to="/client-demo" className="hover:text-black transition-colors">Products</Link>
              <Link to="/dashboard" className="hover:text-black transition-colors">Store</Link>
              <Link to="/architecture" className="hover:text-black transition-colors">Community</Link>
              <Link to="/tutorials" className="hover:text-black transition-colors">Developer</Link>
              <Link to="/dashboard" className="hover:text-black transition-colors">Business</Link>
              <Link to="/dashboard" className="hover:text-black transition-colors">Blog</Link>
              <Link to="/dashboard" className="hover:text-black transition-colors">Support</Link>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Eye className="h-4 w-4" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Full-Screen Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          {heroVideoUrl ? (
            <video
              key={heroVideoUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={heroVideoUrl} type="video/mp4" />
            </video>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
          )}
          
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6 lg:px-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block mb-6"
                >
                  <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm border border-white/20">
                    {currentHero.badge}
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
                >
                  {currentHero.title}
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-white/90 mb-8 max-w-xl"
                >
                  {currentHero.description}
                </motion.p>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link to={currentHero.link}>
                    <Button 
                      className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 rounded-full px-8 py-6 text-base group"
                    >
                      {currentHero.cta}
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-4">
          <button
            onClick={prevSlide}
            className="p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full transition-colors border border-white/20"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full transition-colors border border-white/20"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-32 left-6 z-20 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-12 bg-white' 
                  : 'w-6 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Thumbnail Preview */}
        <div className="absolute bottom-8 left-6 z-20">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
            <div className="w-16 h-16 rounded-lg bg-white/20 flex items-center justify-center overflow-hidden">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div className="text-white">
              <div className="text-sm font-medium">{currentHero.badge}</div>
              <div className="text-xs text-white/70">TwinVision Platform</div>
            </div>
          </div>
        </div>

        {/* Sound Control */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute bottom-8 right-8 z-20 p-4 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full transition-colors border border-white/20"
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5 text-white" />
          ) : (
            <Volume2 className="h-5 w-5 text-white" />
          )}
        </button>

        {/* Scroll Down Button */}
        <motion.button
          onClick={scrollToContent}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white hover:text-white/80 transition-colors group"
        >
          <span className="text-sm font-medium">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 group-hover:bg-white/20 transition-colors"
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.button>
      </section>

      {/* Stats Section */}
      <div id="stats-section">
        <StatsSection />
      </div>

      {/* Digital Twin Ecosystem Section */}
      <DigitalTwinEcosystem />
    </div>
  );
}
