import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Box, RefreshCw, Search, Building2, Calendar, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface DigitalTwin {
  id: string;
  name: string;
  template_id: string;
  size: string;
  building: string | null;
  tags: string[] | null;
  org_id: string;
  org_name?: string;
  sensor_count?: number;
  created_at: string;
}

export default function AdminDigitalTwins() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const [twins, setTwins] = useState<DigitalTwin[]>([]);
  const [organizations, setOrganizations] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [orgFilter, setOrgFilter] = useState<string>("all");

  const isAdmin = hasRole("admin");

  useEffect(() => {
    if (user && isAdmin) {
      fetchData();
    }
  }, [user, isAdmin]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch organizations first
      const { data: orgs } = await supabase
        .from("organizations")
        .select("id, name")
        .order("name");

      setOrganizations(orgs || []);

      const orgMap = new Map((orgs || []).map((o) => [o.id, o.name]));

      // Fetch digital twins
      const { data: twinsData, error } = await supabase
        .from("digital_twins")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch sensor counts for each twin
      const twinsWithDetails = await Promise.all(
        (twinsData || []).map(async (twin) => {
          const { count } = await supabase
            .from("sensors")
            .select("id", { count: "exact", head: true })
            .eq("twin_id", twin.id);

          return {
            ...twin,
            org_name: orgMap.get(twin.org_id) || "Unknown",
            sensor_count: count || 0,
          } as DigitalTwin;
        })
      );

      setTwins(twinsWithDetails);
    } catch (err) {
      console.error("Error fetching twins:", err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">Admin access required.</p>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const filteredTwins = twins.filter((twin) => {
    const matchesSearch =
      searchTerm === "" ||
      twin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      twin.template_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (twin.building || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOrg = orgFilter === "all" || twin.org_id === orgFilter;

    return matchesSearch && matchesOrg;
  });

  const getTemplateIcon = (templateId: string) => {
    // Simple mapping based on common template types
    return Box;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-card border-b border-border">
        <div className="container flex h-16 max-w-screen-xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Admin
            </Link>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchData}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-screen-xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Digital Twins</h1>
          <p className="text-muted-foreground">{twins.length} digital twins across all organizations</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative sm:max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search twins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={orgFilter} onValueChange={setOrgFilter}>
            <SelectTrigger className="sm:w-48">
              <SelectValue placeholder="Filter by org" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Organizations</SelectItem>
              {organizations.map((org) => (
                <SelectItem key={org.id} value={org.id}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredTwins.length === 0 ? (
          <Card className="p-12 text-center">
            <Box className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {twins.length === 0 ? "No digital twins yet." : "No twins match your filters."}
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTwins.map((twin) => {
              const Icon = getTemplateIcon(twin.template_id);
              return (
                <Link key={twin.id} to={`/twin/${twin.id}`}>
                  <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{twin.name}</h3>
                          <p className="text-sm text-muted-foreground">{twin.template_id}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Org:</span>
                        <Badge variant="outline">{twin.org_name}</Badge>
                      </div>

                      {twin.building && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Building: {twin.building}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Cpu className="h-4 w-4" />
                          Sensors
                        </span>
                        <Badge variant="secondary">{twin.sensor_count}</Badge>
                      </div>

                      {twin.tags && twin.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-2">
                          {twin.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {twin.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{twin.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
                        <Calendar className="h-3 w-3" />
                        {new Date(twin.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
