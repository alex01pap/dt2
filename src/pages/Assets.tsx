import { useState, useEffect, useMemo } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardGrid, EmptyStateCard, CardSkeleton } from "@/components/ui/card-grid";
import { RBACGuard } from "@/components/auth/RBACGuard";
import { AssetTree } from "@/components/data/AssetTree";
import { AssetForm } from "@/components/data/AssetForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Assets() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [assets, setAssets] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      const { data, error } = await supabase.from('assets').select('*');
      if (!error) {
        setAssets(data || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to load assets",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAssets = useMemo(() => {
    return assets.filter((asset: any) => {
      const matchesSearch = !searchQuery || 
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = typeFilter === "all" || asset.type === typeFilter;
      const matchesStatus = statusFilter === "all" || asset.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [assets, searchQuery, typeFilter, statusFilter]);

  const handleNodeSelect = (node: any) => {
    toast({
      title: "Asset Selected",
      description: `${node.name} (${node.type})`,
    });
  };

  const handleNodeAction = async (action: string, node: any) => {
    switch (action) {
      case 'view':
        toast({
          title: "View Details",
          description: `Viewing ${node.name}`,
        });
        break;
      case 'edit':
        setEditingAsset(node);
        setIsFormOpen(true);
        break;
      case 'configure':
        toast({
          title: "Configure",
          description: `Configuring ${node.name}`,
        });
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete ${node.name}?`)) {
          try {
            const { error } = await supabase
              .from('assets')
              .delete()
              .eq('id', node.id);
            
            if (error) throw error;
            
            toast({
              title: "Success",
              description: "Asset deleted successfully",
            });
            loadAssets();
          } catch (error: any) {
            toast({
              title: "Error",
              description: error.message || "Failed to delete asset",
              variant: "destructive",
            });
          }
        }
        break;
    }
  };

  const handleFormSuccess = () => {
    loadAssets();
    setEditingAsset(null);
  };

  const clearFilters = () => {
    setTypeFilter("all");
    setStatusFilter("all");
    setSearchQuery("");
  };

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
          <Button className="btn-enterprise" onClick={() => setIsFormOpen(true)}>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5 text-sm font-semibold">Type</div>
            <DropdownMenuItem onClick={() => setTypeFilter("all")}>
              All Types
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter("building")}>
              Building
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter("room")}>
              Room
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter("equipment")}>
              Equipment
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter("sensor")}>
              Sensor
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter("system")}>
              System
            </DropdownMenuItem>
            <div className="border-t my-1"></div>
            <DropdownMenuItem onClick={clearFilters}>
              Clear Filters
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AssetTree
        assets={filteredAssets}
        onNodeSelect={handleNodeSelect}
        onNodeAction={handleNodeAction}
        lazyLoad={true}
      />

      <AssetForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingAsset(null);
        }}
        onSuccess={handleFormSuccess}
        editAsset={editingAsset}
      />
    </div>
  );
}