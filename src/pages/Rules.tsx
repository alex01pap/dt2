import { useState } from "react";
import { Plus, Search, Filter, Settings, Play, Pause, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CardGrid, StatsCard, EmptyStateCard, CardSkeleton } from "@/components/ui/card-grid";
import { RBACGuard } from "@/components/auth/RBACGuard";

export default function Rules() {
  const [isLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const ruleStats = [
    { title: "Total Rules", value: "0", description: "Configured", icon: Settings },
    { title: "Active", value: "0", description: "Currently running", icon: Play, trend: { value: 0, isPositive: true } },
    { title: "Inactive", value: "0", description: "Paused or disabled", icon: Pause },
    { title: "Triggered", value: "0", description: "Last 24h", icon: AlertTriangle },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rules</h1>
            <p className="text-muted-foreground">Configure automation rules and triggers</p>
          </div>
        </div>
        
        <CardGrid>
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </CardGrid>
        
        <CardGrid>
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </CardGrid>
      </div>
    );
  }

  return (
    <RBACGuard permission="canEditRules">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rules</h1>
            <p className="text-muted-foreground">Configure automation rules and triggers</p>
          </div>
          
          <Button className="btn-enterprise">
            <Plus className="h-4 w-4 mr-2" />
            Create Rule
          </Button>
        </div>

        <CardGrid className="lg:grid-cols-4">
          {ruleStats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </CardGrid>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Badge variant="outline">0 rules</Badge>
        </div>

        <div className="flex justify-center items-center min-h-[400px]">
          <EmptyStateCard
            icon={Settings}
            title="No automation rules"
            description="Create your first rule to automate workflows and responses"
            action={{
              label: "Create Rule",
              onClick: () => console.log("Create rule clicked")
            }}
          />
        </div>
      </div>
    </RBACGuard>
  );
}