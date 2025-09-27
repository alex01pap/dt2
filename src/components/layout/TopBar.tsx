import { useState } from "react";
import { Bell, LogOut, User, Settings, Search, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CommandPalette } from "./CommandPalette";
import { Breadcrumbs } from "./Breadcrumbs";
import { useAuthStore } from "@/stores/authStore";

export function TopBar() {
  const { user, logout } = useAuthStore();
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <>
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex items-center justify-between h-full px-6">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-1" />
            
            <Breadcrumbs />
            
            {/* Command Palette Trigger */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCommandOpen(true)}
              className="hidden md:flex items-center gap-2 text-muted-foreground"
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">Search...</span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Mobile Command Trigger */}
            <Button 
              variant="outline" 
              size="icon" 
              className="md:hidden"
              onClick={() => setCommandOpen(true)}
            >
              <Command className="h-4 w-4" />
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatar} alt={user?.firstName} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.firstName?.charAt(0)}
                      {user?.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground capitalize">
                      {user?.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  );
}