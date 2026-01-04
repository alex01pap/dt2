import { ReactNode } from "react";
import { TopBar } from "./TopBar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar />
      <main className="flex-1 bg-gradient-to-br from-background to-muted/20">
        {children}
      </main>
    </div>
  );
}
