import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  BarChart3, 
  FileText, 
  Shield,
  Building2,
  CreditCard 
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
    description: "Overview and metrics"
  },
  { 
    title: "Analytics", 
    url: "/analytics", 
    icon: BarChart3,
    description: "Data insights"
  },
  { 
    title: "Users", 
    url: "/users", 
    icon: Users,
    description: "User management"
  },
  { 
    title: "Reports", 
    url: "/reports", 
    icon: FileText,
    description: "Generate reports"
  },
];

const organizationItems = [
  { 
    title: "Company", 
    url: "/company", 
    icon: Building2,
    description: "Organization settings"
  },
  { 
    title: "Billing", 
    url: "/billing", 
    icon: CreditCard,
    description: "Manage subscription"
  },
];

const systemItems = [
  { 
    title: "Security", 
    url: "/security", 
    icon: Shield,
    description: "Security settings"
  },
  { 
    title: "Settings", 
    url: "/settings", 
    icon: Settings,
    description: "Application settings"
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
                <h1 className="font-semibold text-sidebar-foreground">Enterprise</h1>
                <p className="text-xs text-sidebar-foreground/70">Dashboard</p>
              </div>
            )}
          </div>
        </div>
        
        <SidebarNavGroup items={mainNavItems} label="Main" />
        <SidebarNavGroup items={organizationItems} label="Organization" />
        <SidebarNavGroup items={systemItems} label="System" />
      </SidebarContent>
    </Sidebar>
  );
}