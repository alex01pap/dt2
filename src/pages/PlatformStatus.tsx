import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  Users, 
  Settings, 
  Database,
  CheckCircle,
  Circle,
  Clock,
  AlertCircle,
  Layers,
  Cpu,
  BarChart3,
  Zap,
  Building2,
  Code,
  GitBranch,
  Rocket
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";

interface FeatureStatus {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
  progress: number;
  icon: any;
  category: 'auth' | 'core' | 'advanced' | 'integration';
}

interface Phase {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  progress: number;
  features: string[];
  estimatedCompletion?: string;
}

export default function PlatformStatus() {
  const { user, userRoles, hasRole } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const userPermissions = [
    { 
      permission: 'canViewDashboard', 
      granted: hasRole('user') || hasRole('moderator') || hasRole('admin'),
      description: 'Access main dashboard'
    },
    { 
      permission: 'canViewAssets', 
      granted: hasRole('user') || hasRole('moderator') || hasRole('admin'),
      description: 'View digital assets'
    },
    { 
      permission: 'canManageAssets', 
      granted: hasRole('moderator') || hasRole('admin'),
      description: 'Create and edit assets'
    },
    { 
      permission: 'canViewSensors', 
      granted: hasRole('user') || hasRole('moderator') || hasRole('admin'),
      description: 'Monitor IoT sensors'
    },
    { 
      permission: 'canEditRules', 
      granted: hasRole('moderator') || hasRole('admin'),
      description: 'Configure automation rules'
    },
    { 
      permission: 'canAccessScenarios', 
      granted: hasRole('moderator') || hasRole('admin'),
      description: 'Run simulation scenarios'
    },
    { 
      permission: 'canViewAdmin', 
      granted: hasRole('admin'),
      description: 'Access admin panel'
    },
    { 
      permission: 'canManageUsers', 
      granted: hasRole('admin'),
      description: 'Manage user accounts'
    },
    { 
      permission: 'canManageRoles', 
      granted: hasRole('admin'),
      description: 'Assign user roles'
    }
  ];

  const platformFeatures: FeatureStatus[] = [
    {
      id: 'auth',
      name: 'Authentication System',
      description: 'Complete user auth with roles & permissions',
      status: 'completed',
      progress: 100,
      icon: Shield,
      category: 'auth'
    },
    {
      id: 'dashboard',
      name: 'Real-time Dashboard',
      description: 'Live KPIs and analytics dashboard',
      status: 'completed',
      progress: 100,
      icon: BarChart3,
      category: 'core'
    },
    {
      id: 'digital-twin',
      name: '3D Digital Twin Viewer',
      description: '3D visualization with sensor data',
      status: 'completed',
      progress: 85,
      icon: Building2,
      category: 'core'
    },
    {
      id: 'assets-crud',
      name: 'Assets Management',
      description: 'CRUD operations for digital assets',
      status: 'in-progress',
      progress: 30,
      icon: Layers,
      category: 'core'
    },
    {
      id: 'sensors-management',
      name: 'IoT Sensors Integration',
      description: 'Connect and manage IoT sensors',
      status: 'in-progress',
      progress: 20,
      icon: Cpu,
      category: 'core'
    },
    {
      id: 'automation-rules',
      name: 'Automation Rules Engine',
      description: 'Build and execute automation workflows',
      status: 'planned',
      progress: 0,
      icon: Settings,
      category: 'advanced'
    },
    {
      id: 'scenarios',
      name: 'Simulation Scenarios',
      description: 'Run complex simulation scenarios',
      status: 'planned',
      progress: 0,
      icon: Rocket,
      category: 'advanced'
    },
    {
      id: 'realtime-data',
      name: 'Real-time Data Streaming',
      description: 'WebSocket connections for live data',
      status: 'planned',
      progress: 0,
      icon: Zap,
      category: 'advanced'
    },
    {
      id: 'openhab-integration',
      name: 'OpenHAB Integration',
      description: 'Connect with OpenHAB home automation',
      status: 'planned',
      progress: 0,
      icon: Database,
      category: 'integration'
    },
    {
      id: 'file-uploads',
      name: 'File Upload System',
      description: 'Upload assets and configuration files',
      status: 'planned',
      progress: 0,
      icon: Code,
      category: 'core'
    }
  ];

  const developmentPhases: Phase[] = [
    {
      id: 'phase-1',
      name: 'Phase 1: Foundation',
      description: 'Core authentication and basic infrastructure',
      status: 'completed',
      progress: 100,
      features: ['Authentication System', 'User Roles & Permissions', 'Dashboard Layout', 'Basic Navigation'],
      estimatedCompletion: 'Completed ✓'
    },
    {
      id: 'phase-2', 
      name: 'Phase 2: Core Platform',
      description: 'Essential platform features and data management',
      status: 'current',
      progress: 65,
      features: ['Real-time Dashboard', '3D Digital Twin Viewer', 'Database Schema', 'Assets Management'],
      estimatedCompletion: 'In Progress'
    },
    {
      id: 'phase-3',
      name: 'Phase 3: IoT Integration',
      description: 'IoT sensors and real-time data processing',
      status: 'upcoming',
      progress: 0,
      features: ['IoT Sensors Management', 'Real-time Data Streaming', 'Sensor Analytics', 'Live Monitoring'],
      estimatedCompletion: 'Next Phase'
    },
    {
      id: 'phase-4',
      name: 'Phase 4: Automation',
      description: 'Advanced automation and workflows',
      status: 'upcoming',
      progress: 0,
      features: ['Automation Rules Engine', 'Workflow Builder', 'Event Triggers', 'Smart Notifications'],
      estimatedCompletion: 'Future Release'
    },
    {
      id: 'phase-5',
      name: 'Phase 5: Advanced Features',
      description: 'Simulation, scenarios and external integrations',
      status: 'upcoming',
      progress: 0,
      features: ['Simulation Scenarios', 'OpenHAB Integration', 'Advanced Analytics', 'API Integrations'],
      estimatedCompletion: 'Future Release'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Features', count: platformFeatures.length },
    { id: 'auth', name: 'Authentication', count: platformFeatures.filter(f => f.category === 'auth').length },
    { id: 'core', name: 'Core Features', count: platformFeatures.filter(f => f.category === 'core').length },
    { id: 'advanced', name: 'Advanced', count: platformFeatures.filter(f => f.category === 'advanced').length },
    { id: 'integration', name: 'Integrations', count: platformFeatures.filter(f => f.category === 'integration').length }
  ];

  const filteredFeatures = selectedCategory === 'all' 
    ? platformFeatures 
    : platformFeatures.filter(f => f.category === selectedCategory);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-warning" />;
      case 'planned': return <Circle className="h-4 w-4 text-muted-foreground" />;
      default: return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-success/10 text-success border-success/20">Completed</Badge>;
      case 'in-progress': return <Badge className="bg-warning/10 text-warning border-warning/20">In Progress</Badge>;
      case 'current': return <Badge className="bg-primary/10 text-primary border-primary/20">Current Phase</Badge>;
      case 'planned': 
      case 'upcoming': return <Badge variant="outline">Planned</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const overallProgress = Math.round(
    platformFeatures.reduce((acc, feature) => acc + feature.progress, 0) / platformFeatures.length
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="space-y-2">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
        >
          Platform Status
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground"
        >
          Development & Permissions Overview - Monitor user permissions, platform features, and development roadmap
        </motion.p>
      </div>

      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="card-enterprise">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-primary" />
              Overall Development Progress
            </CardTitle>
            <CardDescription>
              Platform completion status across all features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{overallProgress}%</span>
              <Badge className="bg-primary/10 text-primary border-primary/20">
                Active Development
              </Badge>
            </div>
            <Progress value={overallProgress} className="w-full" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-success">
                  {platformFeatures.filter(f => f.status === 'completed').length}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-warning">
                  {platformFeatures.filter(f => f.status === 'in-progress').length}
                </div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-muted-foreground">
                  {platformFeatures.filter(f => f.status === 'planned').length}
                </div>
                <div className="text-sm text-muted-foreground">Planned</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* User Permissions */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="card-enterprise">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Your Permissions
            </CardTitle>
            <CardDescription>
              Current user: {user?.email} | Roles: {userRoles.map(r => r.role).join(', ')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {userPermissions.map((perm, index) => (
                <motion.div
                  key={perm.permission}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    perm.granted 
                      ? 'bg-success/5 border-success/20' 
                      : 'bg-muted/20 border-muted-foreground/20'
                  }`}
                >
                  {perm.granted ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${perm.granted ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {perm.permission.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {perm.description}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Platform Features */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="card-enterprise">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Platform Features
            </CardTitle>
            <CardDescription>
              Current implementation status of all platform features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge 
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name} ({category.count})
                </Badge>
              ))}
            </div>

            <Separator />

            {/* Features List */}
            <div className="grid gap-4 md:grid-cols-2">
              {filteredFeatures.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                  className="p-4 rounded-lg border bg-card"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <feature.icon className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">{feature.name}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                    {getStatusBadge(feature.status)}
                  </div>
                  
                  {feature.progress > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{feature.progress}%</span>
                      </div>
                      <Progress value={feature.progress} className="w-full" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Development Roadmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="card-enterprise">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              Development Roadmap
            </CardTitle>
            <CardDescription>
              Digital Twin platform development phases and milestones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {developmentPhases.map((phase, index) => (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  className={`p-6 rounded-lg border-l-4 ${
                    phase.status === 'completed' 
                      ? 'border-l-success bg-success/5' 
                      : phase.status === 'current'
                      ? 'border-l-primary bg-primary/5'
                      : 'border-l-muted-foreground bg-muted/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{phase.name}</h3>
                      <p className="text-muted-foreground">{phase.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(phase.status)}
                      <span className="text-sm text-muted-foreground">
                        {phase.estimatedCompletion}
                      </span>
                    </div>
                  </div>

                  {phase.progress > 0 && (
                    <div className="mb-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Phase Progress</span>
                        <span>{phase.progress}%</span>
                      </div>
                      <Progress value={phase.progress} className="w-full" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {phase.features.map((feature, featureIndex) => (
                        <Badge 
                          key={featureIndex} 
                          variant="outline" 
                          className="text-xs"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}