import { useState } from "react";
import { Plus, Search, Filter, Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardGrid, EmptyStateCard, CardSkeleton } from "@/components/ui/card-grid";
import { RBACGuard } from "@/components/auth/RBACGuard";

export default function Assets() {
  const [isLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const mockAssets = []; // Empty for demonstration

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
            <p className="text-muted-foreground">Manage your digital assets and resources</p>
          </div>
        </div>
        
        <CardGrid>
          {Array.from({ length: 8 }).map((_, i) => (
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
          <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
          <p className="text-muted-foreground">Manage your digital assets and resources</p>
        </div>
        
        <RBACGuard permission="canManageAssets">
          <Button className="btn-enterprise">
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
        </RBACGuard>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {mockAssets.length === 0 ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <EmptyStateCard
            icon={Boxes}
            title="No assets found"
            description="Get started by creating your first digital asset"
            action={{
              label: "Create Asset",
              onClick: () => console.log("Create asset clicked")
            }}
          />
        </div>
      ) : (
        <CardGrid>
          {/* Asset cards would go here */}
        </CardGrid>
      )}
    </div>
  );
}