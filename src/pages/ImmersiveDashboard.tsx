import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Box, Activity, AlertTriangle, Wifi, Plus, Grid3X3, Map } from "lucide-react";
import { FuturisticLayout } from "@/components/layout/FuturisticLayout";
import { FloatingStats } from "@/components/ui/floating-stats";
import { GlassPanel } from "@/components/ui/glass-panel";
import { GlowButton } from "@/components/ui/glow-button";
import { FloatingTwinCard } from "@/components/dashboard/FloatingTwinCard";
import { useDigitalTwins } from "@/hooks/useDigitalTwins";
import { useRealtimeSensors } from "@/hooks/useRealtimeSensors";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "immersive";

export default function ImmersiveDashboard() {
  const navigate = useNavigate();
  const { twins, isLoading } = useDigitalTwins();
  const { sensors } = useRealtimeSensors();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const onlineSensors = sensors.filter(s => s.status === "online").length;
  const alertSensors = sensors.filter(s => s.status === "warning" || s.status === "critical").length;

  const stats = [
    { icon: Box, label: "Digital Twins", value: twins.length, color: "cyan" as const },
    { icon: Activity, label: "Active Sensors", value: onlineSensors, trend: "up" as const, color: "green" as const },
    { icon: AlertTriangle, label: "Alerts", value: alertSensors, color: alertSensors > 0 ? "pink" as const : "cyan" as const },
    { icon: Wifi, label: "Connected", value: `${sensors.length}`, color: "purple" as const },
  ];

  return (
    <FuturisticLayout>
      {/* Header Stats */}
      <div className="fixed top-4 left-20 right-20 z-30">
        <FloatingStats stats={stats} className="justify-center" />
      </div>

      {/* View Mode Toggle */}
      <div className="fixed top-20 right-4 z-30">
        <GlassPanel className="p-1 flex gap-1">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              viewMode === "grid" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("immersive")}
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              viewMode === "immersive" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Map className="w-5 h-5" />
          </button>
        </GlassPanel>
      </div>

      {/* Main Content */}
      <div className="pt-32 pb-24 px-4 md:px-8">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold holo-text mb-2">
            Digital Twin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage your digital twin ecosystem
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <GlassPanel key={i} className="h-64 animate-pulse">
                <div className="h-full flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              </GlassPanel>
            ))}
          </div>
        ) : twins.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <GlassPanel className="p-12 text-center max-w-md" glow>
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Box className="w-10 h-10 text-primary animate-float" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                No Digital Twins Yet
              </h2>
              <p className="text-muted-foreground mb-6">
                Create your first digital twin to start monitoring your spaces in real-time
              </p>
              <GlowButton onClick={() => navigate("/admin")}>
                <Plus className="w-5 h-5" />
                Create Your First Twin
              </GlowButton>
            </GlassPanel>
          </motion.div>
        ) : (
          /* Twins Grid */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "grid gap-6",
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1 lg:grid-cols-2"
            )}
          >
            {twins.map((twin, index) => (
              <motion.div
                key={twin.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <FloatingTwinCard
                  twin={twin}
                  sensorCount={sensors.length}
                  onView={() => navigate(`/twin/${twin.id}`)}
                  onConfigure={() => navigate("/admin")}
                  isLarge={viewMode === "immersive"}
                />
              </motion.div>
            ))}

            {/* Add New Twin Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: twins.length * 0.1 }}
            >
              <GlassPanel
                className={cn(
                  "flex flex-col items-center justify-center cursor-pointer group",
                  "hover:border-primary/30 transition-all duration-300",
                  viewMode === "immersive" ? "min-h-[400px]" : "min-h-[280px]"
                )}
                onClick={() => navigate("/admin")}
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:shadow-glow-sm transition-all duration-300">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <p className="text-lg font-medium text-foreground mb-1">Create New Twin</p>
                <p className="text-sm text-muted-foreground">Add a new digital space</p>
              </GlassPanel>
            </motion.div>
          </motion.div>
        )}
      </div>
    </FuturisticLayout>
  );
}
