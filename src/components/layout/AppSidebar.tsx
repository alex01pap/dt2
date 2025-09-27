import { 
  LayoutDashboard, 
  Boxes,
  Cpu,
  Settings,
  Workflow,
  Play,
  GraduationCap,
  ShieldCheck,
  Building2,
  GitBranch,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { 
    title: "Dashboard", 
    url: "/dashboard", 
    icon: LayoutDashboard,
    description: "System overview"
  },
  { 
    title: "Assets", 
    url: "/assets", 
    icon: Boxes,
    description: "Digital assets"
  },
  { 
    title: "Sensors", 
    url: "/sensors", 
    icon: Cpu,
    description: "IoT sensors"
  },
  { 
    title: "Rules", 
    url: "/rules", 
    icon: Settings,
    description: "Automation rules"
  },
];

const simulationItems = [
  { 
    title: "Scenarios", 
    url: "/scenarios", 
    icon: Workflow,
    description: "Test scenarios"
  },
  { 
    title: "Playback", 
    url: "/playback", 
    icon: Play,
    description: "Historical data"
  },
];

const systemItems = [
  { 
    title: "Platform Status", 
    url: "/status", 
    icon: GitBranch,
    description: "Development status"
  },
  { 
    title: "Tutorials", 
    url: "/tutorials", 
    icon: GraduationCap,
    description: "Learning guides"
  },
  { 
    title: "Admin", 
    url: "/admin", 
    icon: ShieldCheck,
    description: "System admin"
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";
  
  const isActive = (path: string) => location.pathname === path;
  
  const SidebarNavGroup = ({ 
    items, 
    label 
  }: { 
    items: typeof mainNavItems; 
    label: string; 
  }) => (
    <SidebarGroup>
      {!isCollapsed && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                tooltip={isCollapsed ? item.title : undefined}
                className={cn(
                  "sidebar-item",
                  isActive(item.url) && "sidebar-item-active"
                )}
              >
                <NavLink 
                  to={item.url}
                  className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors"
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <span className="font-medium">{item.title}</span>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.description}
                      </p>
                    </div>
                  )}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar 
      className="border-r border-sidebar-border bg-sidebar"
      collapsible="icon"
    >
      <SidebarContent className="py-4">
        <div className="px-3 py-2 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-semibold text-sidebar-foreground">Digital Twin</h1>
                <p className="text-xs text-sidebar-foreground/70">Platform</p>
              </div>
            )}
          </div>
        </div>
        
        <SidebarNavGroup items={mainNavItems} label="Main" />
        <SidebarNavGroup items={simulationItems} label="Simulation" />
        <SidebarNavGroup items={systemItems} label="System" />
      </SidebarContent>
    </Sidebar>
  );
}