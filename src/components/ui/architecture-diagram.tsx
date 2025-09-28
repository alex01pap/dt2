import { motion } from 'framer-motion';
import { 
  Database, 
  Cloud, 
  Smartphone, 
  Monitor,
  Settings,
  Users,
  Shield,
  Zap,
  Globe,
  Server,
  Cpu,
  Layers,
  Network,
  BarChart3,
  Activity,
  Building2
} from 'lucide-react';

interface DiagramNodeProps {
  icon: React.ComponentType<any>;
  label: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  position: { x: number; y: number };
  delay?: number;
}

const DiagramNode = ({ icon: Icon, label, color, size = 'md', position, delay = 0 }: DiagramNodeProps) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16', 
    lg: 'w-24 h-24'
  };

  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 300 }}
      className="absolute"
      style={{ left: `${position.x}%`, top: `${position.y}%`, transform: 'translate(-50%, -50%)' }}
    >
      <div className={`${sizeClasses[size]} rounded-full bg-white shadow-lg border flex items-center justify-center relative`}
           style={{ boxShadow: `0 8px 25px ${color}20` }}>
        <Icon className={`${iconSizes[size]} text-${color}-600`} style={{ color }} />
      </div>
      <p className="text-xs font-medium text-center mt-2 text-gray-700">{label}</p>
    </motion.div>
  );
};

interface ConnectionProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  delay?: number;
  type?: 'solid' | 'dashed';
}

const Connection = ({ from, to, delay = 0, type = 'solid' }: ConnectionProps) => {
  const length = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
  const angle = Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI;
  
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ delay, duration: 0.8 }}
      className="absolute origin-left"
      style={{
        left: `${from.x}%`,
        top: `${from.y}%`,
        width: `${length}%`,
        height: '2px',
        background: type === 'dashed' 
          ? 'repeating-linear-gradient(90deg, #94a3b8 0, #94a3b8 5px, transparent 5px, transparent 10px)'
          : '#94a3b8',
        transform: `rotate(${angle}deg) translateY(-1px)`,
        transformOrigin: '0 50%'
      }}
    />
  );
};

export function ArchitectureDiagram() {
  const nodes = [
    // Center - Main Platform
    { icon: Building2, label: 'Digital Twin Platform', color: '#3b82f6', size: 'lg' as const, position: { x: 50, y: 50 } },
    
    // Data Sources (Left)
    { icon: Cpu, label: 'IoT Devices', color: '#8b5cf6', size: 'md' as const, position: { x: 15, y: 25 } },
    { icon: Database, label: 'Database', color: '#8b5cf6', size: 'md' as const, position: { x: 15, y: 50 } },
    { icon: Zap, label: 'MQTT', color: '#8b5cf6', size: 'md' as const, position: { x: 15, y: 75 } },
    
    // Applications (Right)
    { icon: Monitor, label: 'Web Dashboard', color: '#10b981', size: 'md' as const, position: { x: 85, y: 25 } },
    { icon: Smartphone, label: 'Mobile App', color: '#10b981', size: 'md' as const, position: { x: 85, y: 50 } },
    { icon: BarChart3, label: 'Analytics', color: '#10b981', size: 'md' as const, position: { x: 85, y: 75 } },
    
    // Supporting Services (Top/Bottom)
    { icon: Shield, label: 'Security', color: '#ef4444', size: 'sm' as const, position: { x: 30, y: 15 } },
    { icon: Users, label: 'User Mgmt', color: '#f59e0b', size: 'sm' as const, position: { x: 70, y: 15 } },
    { icon: Cloud, label: 'Cloud Storage', color: '#6366f1', size: 'sm' as const, position: { x: 30, y: 85 } },
    { icon: Globe, label: 'API Gateway', color: '#ec4899', size: 'sm' as const, position: { x: 70, y: 85 } },
  ];

  const connections = [
    // From data sources to center
    { from: { x: 15, y: 25 }, to: { x: 50, y: 50 } },
    { from: { x: 15, y: 50 }, to: { x: 50, y: 50 } },
    { from: { x: 15, y: 75 }, to: { x: 50, y: 50 } },
    
    // From center to applications
    { from: { x: 50, y: 50 }, to: { x: 85, y: 25 } },
    { from: { x: 50, y: 50 }, to: { x: 85, y: 50 } },
    { from: { x: 50, y: 50 }, to: { x: 85, y: 75 } },
    
    // Supporting services connections
    { from: { x: 30, y: 15 }, to: { x: 50, y: 50 }, type: 'dashed' as const },
    { from: { x: 70, y: 15 }, to: { x: 50, y: 50 }, type: 'dashed' as const },
    { from: { x: 30, y: 85 }, to: { x: 50, y: 50 }, type: 'dashed' as const },
    { from: { x: 70, y: 85 }, to: { x: 50, y: 50 }, type: 'dashed' as const },
  ];

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg border">
      {connections.map((connection, index) => (
        <Connection
          key={index}
          from={connection.from}
          to={connection.to}
          type={connection.type}
          delay={0.5 + index * 0.1}
        />
      ))}
      
      {nodes.map((node, index) => (
        <DiagramNode
          key={index}
          icon={node.icon}
          label={node.label}
          color={node.color}
          size={node.size}
          position={node.position}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
}