import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, LayoutDashboard, Activity, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const toolbarItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Activity, label: "Sensors", path: "/sensors" },
  { icon: Settings, label: "Admin", path: "/admin" },
];

export function BottomToolbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, type: "spring", damping: 20 }}
      className="fixed bottom-4 left-4 right-4 z-40 md:left-1/2 md:-translate-x-1/2 md:w-auto md:right-auto"
    >
      <div className="glass-panel rounded-2xl p-2 flex items-center justify-around md:justify-center md:gap-2 safe-bottom">
        {toolbarItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl",
                "min-w-[64px] min-h-[56px] touch-button",
                "transition-all duration-200",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {/* Active glow indicator */}
              {isActive && (
                <motion.div
                  layoutId="toolbarIndicator"
                  className="absolute -top-1 w-6 h-1 rounded-full bg-primary shadow-glow-sm"
                />
              )}
              
              <Icon className={cn(
                "w-5 h-5 transition-all duration-200",
                isActive && "animate-pulse-glow"
              )} />
              <span className={cn(
                "text-xs font-medium",
                isActive && "text-glow-cyan"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
