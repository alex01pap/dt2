import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Menu, X, Home, LayoutDashboard, Box, Activity, 
  Settings, LogOut, User, Layers, FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/ui/glass-panel";
import { useAuth } from "@/contexts/AuthContext";

interface FloatingNavProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Box, label: "Digital Twins", path: "/assets" },
  { icon: Activity, label: "Sensors", path: "/sensors" },
  { icon: Layers, label: "Scenarios", path: "/scenarios" },
  { icon: FileText, label: "Rules", path: "/rules" },
  { icon: Settings, label: "Admin", path: "/admin" },
];

export function FloatingNav({ isOpen, onToggle }: FloatingNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleNavigate = (path: string) => {
    navigate(path);
    onToggle();
  };

  return (
    <>
      {/* Toggle Button - Always visible */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "fixed top-4 left-4 z-50 w-12 h-12 rounded-xl",
          "glass-panel flex items-center justify-center",
          "touch-button cursor-pointer",
          "hover:shadow-glow-sm transition-all duration-300",
          isOpen && "bg-primary/20"
        )}
        onClick={onToggle}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-5 h-5 text-primary" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-5 h-5 text-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* User Avatar - Top Right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-4 right-4 z-50"
      >
        <button
          onClick={() => navigate("/profile")}
          className={cn(
            "w-12 h-12 rounded-xl glass-panel",
            "flex items-center justify-center",
            "touch-button hover:shadow-glow-sm transition-all duration-300"
          )}
        >
          <User className="w-5 h-5 text-foreground" />
        </button>
      </motion.div>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Navigation Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-4 top-20 bottom-4 z-50 w-72"
          >
            <GlassPanel className="h-full p-4 flex flex-col" glow>
              {/* Logo/Brand */}
              <div className="mb-6 px-2">
                <h2 className="text-xl font-bold holo-text">Platon Schools</h2>
                <p className="text-xs text-muted-foreground">Digital Twin Platform</p>
              </div>

              {/* Nav Items */}
              <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
                {navItems.map((item, index) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;

                  return (
                    <motion.button
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleNavigate(item.path)}
                      onMouseEnter={() => setHoveredItem(item.path)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl",
                        "text-left transition-all duration-200",
                        "min-h-[48px] touch-button",
                        isActive 
                          ? "bg-primary/20 text-primary shadow-glow-sm" 
                          : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                      )}
                    >
                      <Icon className={cn(
                        "w-5 h-5 transition-all duration-200",
                        isActive && "text-glow-cyan"
                      )} />
                      <span className="font-medium">{item.label}</span>
                      
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-glow-sm"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </nav>

              {/* User Section */}
              {user && (
                <div className="pt-4 mt-4 border-t border-border/50">
                  <div className="px-4 py-2 mb-2">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">Logged in</p>
                  </div>
                  <button
                    onClick={signOut}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl",
                      "text-destructive hover:bg-destructive/10",
                      "transition-all duration-200 min-h-[48px] touch-button"
                    )}
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              )}
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
