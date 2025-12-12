import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingNav } from "./FloatingNav";
import { BottomToolbar } from "./BottomToolbar";
import { ParticlesBackground } from "@/components/ui/particles-background";

interface FuturisticLayoutProps {
  children: ReactNode;
  showParticles?: boolean;
  showNav?: boolean;
  showToolbar?: boolean;
}

export function FuturisticLayout({ 
  children, 
  showParticles = true,
  showNav = true,
  showToolbar = true,
}: FuturisticLayoutProps) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Ambient particles background */}
      {showParticles && (
        <ParticlesBackground 
          className="fixed inset-0 z-0" 
          particleCount={40}
          color="rgba(34, 211, 238, 0.5)"
        />
      )}

      {/* Grid background */}
      <div className="fixed inset-0 bg-grid z-0 opacity-50" />
      
      {/* Radial glow */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, hsl(185 100% 55% / 0.08) 0%, transparent 50%)"
        }}
      />

      {/* Floating Navigation */}
      {showNav && (
        <FloatingNav isOpen={isNavOpen} onToggle={() => setIsNavOpen(!isNavOpen)} />
      )}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 min-h-screen"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {/* Bottom Toolbar - Mobile/Tablet */}
      {showToolbar && <BottomToolbar />}
    </div>
  );
}
