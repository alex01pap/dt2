import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Users, RefreshCw, Search, Shield, Building2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  roles: string[];
  org_memberships: {
    org_id: string;
    org_name: string;
    role: string;
  }[];
}

export default function AdminUsers() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
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
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch organizations
      const { data: orgs } = await supabase
        .from("organizations")
        .select("id, name")
        .order("name");

      setOrganizations(orgs || []);

      // Fetch roles and memberships for each user
      const usersWithDetails = await Promise.all(
        (profiles || []).map(async (profile) => {
          const [rolesRes, membersRes] = await Promise.all([
            supabase.from("user_roles").select("role").eq("user_id", profile.id),
            supabase
              .from("organization_members")
              .select("org_id, role, organizations(name)")
              .eq("user_id", profile.id),
          ]);

          return {
            ...profile,
            roles: (rolesRes.data || []).map((r) => r.role),
            org_memberships: (membersRes.data || []).map((m: any) => ({
              org_id: m.org_id,
              org_name: m.organizations?.name || "Unknown",
              role: m.role,
            })),
          } as UserProfile;
        })
      );

      setUsers(usersWithDetails);
    } catch (err) {
      console.error("Error fetching users:", err);
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

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      searchTerm === "" ||
      (u.display_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOrg =
      orgFilter === "all" ||
      u.org_memberships.some((m) => m.org_id === orgFilter);

    return matchesSearch && matchesOrg;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "moderator":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "owner":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
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
          <h1 className="text-2xl font-semibold text-foreground mb-2">Users</h1>
          <p className="text-muted-foreground">{users.length} registered users</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative sm:max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or ID..."
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
        ) : filteredUsers.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {users.length === 0 ? "No users yet." : "No users match your filters."}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((profile) => (
              <Card key={profile.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* User Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      {profile.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt=""
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <Users className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {profile.display_name || "Unnamed User"}
                      </h3>
                      <p className="text-sm text-muted-foreground font-mono">{profile.id}</p>
                    </div>
                  </div>

                  {/* Roles */}
                  <div className="flex flex-wrap gap-2">
                    {profile.roles.map((role) => (
                      <Badge key={role} className={getRoleBadgeColor(role)}>
                        <Shield className="h-3 w-3 mr-1" />
                        {role}
                      </Badge>
                    ))}
                    {profile.org_memberships.map((membership) => (
                      <Badge
                        key={membership.org_id}
                        variant="outline"
                        className="gap-1"
                      >
                        <Building2 className="h-3 w-3" />
                        {membership.org_name}
                        <span className="text-muted-foreground">({membership.role})</span>
                      </Badge>
                    ))}
                  </div>

                  {/* Created */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(profile.created_at).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
