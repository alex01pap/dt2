import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Box, 
  Cpu, 
  Database, 
  Cloud, 
  Activity, 
  Zap,
  GitBranch,
  Layers,
  Eye,
  Gauge,
  Network,
  Server
} from "lucide-react";

const categories = [
  { id: "iot", name: "IoT Platforms", icon: Activity },
  { id: "cloud", name: "Cloud Services", icon: Cloud },
  { id: "analytics", name: "Analytics", icon: Gauge },
  { id: "integration", name: "Integration", icon: GitBranch }
];

const ecosystemData = {
  iot: [
    { icon: Activity, name: "MQTT", color: "text-purple-500", position: "top-left" },
    { icon: Zap, name: "ModBus", color: "text-green-500", position: "top-right" },
    { icon: Server, name: "OPC UA", color: "text-red-500", position: "bottom-left" },
    { icon: Network, name: "BACnet", color: "text-gray-800", position: "bottom-right" }
  ],
  cloud: [
    { icon: Cloud, name: "AWS IoT", color: "text-orange-500", position: "top-left" },
    { icon: Database, name: "Azure", color: "text-blue-500", position: "top-right" },
    { icon: Server, name: "GCP", color: "text-green-500", position: "bottom-left" },
    { icon: Cloud, name: "Private", color: "text-gray-700", position: "bottom-right" }
  ],
  analytics: [
    { icon: Gauge, name: "Real-time", color: "text-purple-500", position: "top-left" },
    { icon: Activity, name: "Predictive", color: "text-green-500", position: "top-right" },
    { icon: Layers, name: "Historical", color: "text-red-500", position: "bottom-left" },
    { icon: Box, name: "ML Models", color: "text-gray-800", position: "bottom-right" }
  ],
  integration: [
    { icon: GitBranch, name: "REST API", color: "text-purple-500", position: "top-left" },
    { icon: Zap, name: "WebSocket", color: "text-green-500", position: "top-right" },
    { icon: Database, name: "GraphQL", color: "text-red-500", position: "bottom-left" },
    { icon: Network, name: "gRPC", color: "text-gray-800", position: "bottom-right" }
  ]
};

const getPositionClasses = (position: string) => {
  switch (position) {
    case "top-left":
      return "top-[15%] left-[15%]";
    case "top-right":
      return "top-[15%] right-[15%]";
    case "bottom-left":
      return "bottom-[15%] left-[15%]";
    case "bottom-right":
      return "bottom-[15%] right-[15%]";
    default:
      return "";
  }
};

export function DigitalTwinEcosystem() {
  const [activeCategory, setActiveCategory] = useState("iot");
  const currentNodes = ecosystemData[activeCategory as keyof typeof ecosystemData];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        {/* Category Tabs */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-white rounded-full p-1 shadow-lg border border-gray-200">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300
                    ${activeCategory === category.id 
                      ? 'bg-gray-900 text-white shadow-md' 
                      : 'text-gray-600 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ecosystem Diagram */}
        <motion.div 
          key={activeCategory}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-4xl mx-auto aspect-square"
        >
          {/* Background Glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          </div>

          {/* Center Hub */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <div className="relative">
              {/* Outer ring with animation */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4"
              >
                <div className="w-full h-full rounded-full border-2 border-dashed border-blue-200" />
              </motion.div>

              {/* Main hub circle */}
              <div className="relative w-32 h-32 rounded-full bg-white shadow-2xl border-4 border-blue-100 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Eye className="h-12 w-12 text-white" />
                </div>
              </div>

              {/* Pulsing rings */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-blue-400"
              />
            </div>
          </motion.div>

          {/* Connecting Lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            {/* Lines from center to each node */}
            {currentNodes.map((node, index) => {
              const angle = (index / currentNodes.length) * Math.PI * 2 - Math.PI / 2;
              const centerX = 50;
              const centerY = 50;
              const radius = 35;
              const endX = centerX + Math.cos(angle) * radius;
              const endY = centerY + Math.sin(angle) * radius;
              
              return (
                <motion.line
                  key={`${activeCategory}-${index}`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                  x1={`${centerX}%`}
                  y1={`${centerY}%`}
                  x2={`${endX}%`}
                  y2={`${endY}%`}
                  stroke="url(#lineGradient)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              );
            })}
          </svg>

          {/* Surrounding Nodes */}
          {currentNodes.map((node, index) => {
            const Icon = node.icon;
            return (
              <motion.div
                key={`${activeCategory}-${node.name}-${index}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: 0.4 + index * 0.1,
                  type: "spring",
                  stiffness: 200
                }}
                className={`absolute ${getPositionClasses(node.position)} z-10`}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="relative group cursor-pointer"
                >
                  {/* Node circle */}
                  <div className="w-24 h-24 rounded-full bg-white shadow-xl border-2 border-gray-100 flex items-center justify-center relative overflow-hidden">
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <Icon className={`h-10 w-10 ${node.color} relative z-10`} />
                  </div>

                  {/* Label */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-700">{node.name}</span>
                  </div>

                  {/* Dot indicators */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white"
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Seamless Integration Ecosystem
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect your digital twin with industry-leading platforms and protocols.
            Real-time synchronization across your entire infrastructure.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
