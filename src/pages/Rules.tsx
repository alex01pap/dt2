import { useState, useMemo } from "react";
import { Plus, Search, Filter, Settings, Play, Pause, AlertTriangle, Edit, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CardGrid, StatsCard, EmptyStateCard, CardSkeleton } from "@/components/ui/card-grid";
import { RBACGuard } from "@/components/auth/RBACGuard";
import { useRealtimeRules } from "@/hooks/useRealtimeRules";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { RuleBuilder } from "@/components/automation/RuleBuilder";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useOrganization } from "@/contexts/OrganizationContext";

export default function Rules() {
  const { rules, isLoading } = useRealtimeRules();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { currentOrgId } = useOrganization();
  const [editingRule, setEditingRule] = useState<any>(null);

  const filteredRules = useMemo(() => {
    if (!searchQuery) return rules;
    const query = searchQuery.toLowerCase();
    return rules.filter(
      (rule) =>
        rule.name.toLowerCase().includes(query) ||
        rule.description?.toLowerCase().includes(query)
    );
  }, [rules, searchQuery]);

  const ruleStats = useMemo(() => {
    const activeCount = rules.filter((r) => r.status === "active").length;
    const inactiveCount = rules.filter((r) => r.status === "inactive").length;
    const triggeredCount = rules.filter((r) => {
      if (!r.last_triggered_at) return false;
      const lastDay = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return new Date(r.last_triggered_at) > lastDay;
    }).length;

    return [
      { title: "Total Rules", value: rules.length.toString(), description: "Configured", icon: Settings },
      { title: "Active", value: activeCount.toString(), description: "Currently running", icon: Play, trend: { value: 0, isPositive: true } },
      { title: "Inactive", value: inactiveCount.toString(), description: "Paused or disabled", icon: Pause },
      { title: "Triggered", value: triggeredCount.toString(), description: "Last 24h", icon: AlertTriangle },
    ];
  }, [rules]);

  const handleSaveRule = async (rule: any) => {
    try {
      if (editingRule) {
        const { error } = await supabase
          .from("rules")
          .update({
            name: rule.name,
            description: rule.description,
            conditions: rule.conditions,
            actions: rule.actions,
            window_config: rule.windowConfig,
            priority: rule.priority,
            status: rule.enabled ? "active" : "inactive",
          })
          .eq("id", editingRule.id);

        if (error) throw error;
        toast.success("Rule updated successfully");
      } else {
        const { error } = await supabase.from("rules").insert({
          name: rule.name,
          description: rule.description,
          conditions: rule.conditions,
          actions: rule.actions,
          window_config: rule.windowConfig,
          priority: rule.priority,
          status: rule.enabled ? "active" : "inactive",
          org_id: currentOrgId!,
        });

        if (error) throw error;
        toast.success("Rule created successfully");
      }
      
      setIsCreateOpen(false);
      setEditingRule(null);
    } catch (error: any) {
      console.error("Error saving rule:", error);
      toast.error(error.message || "Failed to save rule");
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    try {
      const { error } = await supabase.from("rules").delete().eq("id", ruleId);
      if (error) throw error;
      toast.success("Rule deleted successfully");
    } catch (error: any) {
      console.error("Error deleting rule:", error);
      toast.error(error.message || "Failed to delete rule");
    }
  };

  const handleToggleStatus = async (ruleId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      const { error } = await supabase
        .from("rules")
        .update({ status: newStatus })
        .eq("id", ruleId);

      if (error) throw error;
      toast.success(`Rule ${newStatus === "active" ? "activated" : "deactivated"}`);
    } catch (error: any) {
      console.error("Error toggling rule status:", error);
      toast.error(error.message || "Failed to update rule status");
    }
  };

  const mockFields = [
    { key: "temperature", label: "Temperature", type: "number" as const },
    { key: "humidity", label: "Humidity", type: "number" as const },
    { key: "pressure", label: "Pressure", type: "number" as const },
    { key: "air_quality", label: "Air Quality", type: "number" as const },
    { key: "energy_usage", label: "Energy Usage", type: "number" as const },
    { key: "vibration", label: "Vibration", type: "number" as const },
    { key: "status", label: "Status", type: "text" as const },
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
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rules</h1>
            <p className="text-muted-foreground">Configure automation rules and triggers</p>
          </div>
          
          <Button onClick={() => setIsCreateOpen(true)} className="btn-enterprise">
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
          <Badge variant="outline">{filteredRules.length} rules</Badge>
        </div>

        {filteredRules.length === 0 ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <EmptyStateCard
              icon={Settings}
              title="No automation rules"
              description="Create your first rule to automate workflows and responses"
              action={{
                label: "Create Rule",
                onClick: () => setIsCreateOpen(true)
              }}
            />
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Conditions</TableHead>
                  <TableHead>Actions</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.name}</TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {rule.description || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={rule.status === "active" ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleToggleStatus(rule.id, rule.status)}
                      >
                        {rule.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{rule.priority}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {Array.isArray(rule.conditions) ? rule.conditions.length : 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {Array.isArray(rule.actions) ? rule.actions.length : 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingRule(rule);
                              setIsCreateOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(rule.id, rule.status)}
                          >
                            {rule.status === "active" ? (
                              <>
                                <Pause className="h-4 w-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteRule(rule.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Sheet open={isCreateOpen} onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) setEditingRule(null);
        }}>
          <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{editingRule ? "Edit Rule" : "Create New Rule"}</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <RuleBuilder
                rule={editingRule ? {
                  name: editingRule.name,
                  description: editingRule.description || "",
                  conditions: editingRule.conditions || [],
                  actions: editingRule.actions || [],
                  windowConfig: editingRule.window_config || {},
                  priority: editingRule.priority || 0,
                  enabled: editingRule.status === "active",
                } : undefined}
                availableFields={mockFields}
                onSave={handleSaveRule}
                onCancel={() => {
                  setIsCreateOpen(false);
                  setEditingRule(null);
                }}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
  );
}