import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Boxes,
  Cpu,
  Settings,
  Zap,
  Play,
  GraduationCap,
  ShieldCheck,
  Workflow,
} from "lucide-react";

type CommandItem = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
} & (
  | { path: string; action?: never }
  | { action: string; path?: never }
);

const commands = [
  {
    group: "Navigation",
    items: [
      { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { name: "Assets", path: "/assets", icon: Boxes },
      { name: "Sensors", path: "/sensors", icon: Cpu },
      { name: "Rules", path: "/rules", icon: Settings },
      { name: "Scenarios", path: "/scenarios", icon: Workflow },
      { name: "Playback", path: "/playback", icon: Play },
      { name: "Tutorials", path: "/tutorials", icon: GraduationCap },
      { name: "Admin", path: "/admin", icon: ShieldCheck },
    ] as CommandItem[],
  },
  {
    group: "Actions",
    items: [
      { name: "Create Asset", action: "create-asset", icon: Boxes },
      { name: "Add Sensor", action: "add-sensor", icon: Cpu },
      { name: "New Rule", action: "new-rule", icon: Zap },
      { name: "Run Scenario", action: "run-scenario", icon: Play },
    ] as CommandItem[],
  },
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const handleSelect = (item: CommandItem) => {
    onOpenChange(false);
    
    if (item.path) {
      navigate(item.path);
    } else if (item.action) {
      // Handle actions based on the action type
      switch (item.action) {
        case 'create-asset':
          // Navigate to assets page or open create modal
          navigate('/assets');
          break;
        case 'add-sensor':
          navigate('/sensors');
          break;
        case 'new-rule':
          navigate('/rules');
          break;
        case 'run-scenario':
          navigate('/scenarios');
          break;
      }
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {commands.map((group) => (
          <CommandGroup key={group.group} heading={group.group}>
            {group.items.map((item) => (
              <CommandItem
                key={item.name}
                onSelect={() => handleSelect(item)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}