import { useState } from "react";
import { Plus, Search, Filter, Workflow, Play, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CardGrid, StatsCard, EmptyStateCard, CardSkeleton } from "@/components/ui/card-grid";
import { RBACGuard } from "@/components/auth/RBACGuard";

export default function Scenarios() {
  const [isLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const scenarioStats = [
    { title: "Total Scenarios", value: "0", description: "Created", icon: Workflow },
    { title: "Running", value: "0", description: "Active simulations", icon: Play },
    { title: "Scheduled", value: "0", description: "Queued to run", icon: Clock },
    { title: "Completed", value: "0", description: "Finished today", icon: CheckCircle },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Scenarios</h1>
            <p className="text-muted-foreground">Design and run simulation scenarios</p>
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
    <RBACGuard permission="canAccessScenarios">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Scenarios</h1>
            <p className="text-muted-foreground">Design and run simulation scenarios</p>
          </div>
          
          <Button className="btn-enterprise">
            <Plus className="h-4 w-4 mr-2" />
            New Scenario
          </Button>
        </div>

        <CardGrid className="lg:grid-cols-4">
          {scenarioStats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </CardGrid>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search scenarios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Badge variant="outline">0 scenarios</Badge>
        </div>

        <div className="flex justify-center items-center min-h-[400px]">
          <EmptyStateCard
            icon={Workflow}
            title="No scenarios created"
            description="Build your first simulation scenario to test system behavior"
            action={{
              label: "Create Scenario",
              onClick: () => console.log("Create scenario clicked")
            }}
          />
        </div>
      </div>
    </RBACGuard>
  );
}