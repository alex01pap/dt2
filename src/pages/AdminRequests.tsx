import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Check, X, Copy, RefreshCw, Mail, Building, User, MessageSquare, UserPlus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AccessRequest {
  id: string;
  full_name: string;
  email: string;
  organization: string;
  role: string;
  message: string | null;
  status: string;
  access_code: string | null;
  approved_org_id: string | null;
  created_at: string;
}

interface Organization {
  id: string;
  name: string;
  slug: string;
}

function generateAccessCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 50) + "-" + Math.random().toString(36).substring(2, 6);
}

export default function AdminRequests() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [organizations, setOrganizations] = useState<Map<string, Organization>>(new Map());
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [attachUserDialog, setAttachUserDialog] = useState<{ open: boolean; requestId: string | null }>({
    open: false,
    requestId: null,
  });

  const isAdmin = hasRole("admin");

  useEffect(() => {
    if (user && isAdmin) {
      fetchRequests();
    }
  }, [user, isAdmin]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("access_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      const requestData = (data || []) as AccessRequest[];
      setRequests(requestData);

      // Fetch organizations for approved requests
      const orgIds = requestData
        .filter((r) => r.approved_org_id)
        .map((r) => r.approved_org_id!);

      if (orgIds.length > 0) {
        const { data: orgsData } = await supabase
          .from("organizations")
          .select("id, name, slug")
          .in("id", orgIds);

        const orgMap = new Map<string, Organization>();
        (orgsData || []).forEach((org) => {
          orgMap.set(org.id, org as Organization);
        });
        setOrganizations(orgMap);
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
      toast.error("Failed to load access requests");
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (request: AccessRequest) => {
    setUpdating(request.id);
    try {
      // 1. Create organization
      const slug = generateSlug(request.organization);
      const { data: orgData, error: orgError } = await supabase
        .from("organizations")
        .insert({
          name: request.organization,
          slug,
        })
        .select()
        .single();

      if (orgError) throw orgError;

      const accessCode = generateAccessCode();

      // 2. Update access request
      const { error: updateError } = await supabase
        .from("access_requests")
        .update({
          status: "approved",
          access_code: accessCode,
          approved_org_id: orgData.id,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id || "",
        })
        .eq("id", request.id);

      if (updateError) throw updateError;

      // Note: User will be attached when they sign up and use the access code
      // We cannot query auth.users directly from the client

      // Update local state
      setRequests((prev) =>
        prev.map((r) =>
          r.id === request.id
            ? { ...r, status: "approved", access_code: accessCode, approved_org_id: orgData.id }
            : r
        )
      );
      setOrganizations((prev) => new Map(prev).set(orgData.id, orgData as Organization));

      toast.success("Request approved and organization created");
    } catch (err) {
      console.error("Error approving request:", err);
      toast.error("Failed to approve request");
    } finally {
      setUpdating(null);
    }
  };

  const rejectRequest = async (id: string) => {
    setUpdating(id);
    try {
      const { error } = await supabase
        .from("access_requests")
        .update({
          status: "rejected",
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id || "",
        })
        .eq("id", id);

      if (error) throw error;

      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r))
      );

      toast.success("Request rejected");
    } catch (err) {
      console.error("Error rejecting request:", err);
      toast.error("Failed to reject request");
    } finally {
      setUpdating(null);
    }
  };

  const attachUser = async (requestId: string) => {
    const request = requests.find((r) => r.id === requestId);
    if (!request || !request.approved_org_id) return;

    setUpdating(requestId);
    try {
      // Try to find auth user by email
      // Since we can't directly query auth.users, we check profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", request.email) // This won't work directly - we need a different approach
        .maybeSingle();

      // For now, show a message that the user needs to sign up first
      toast.info("User must sign up first with email: " + request.email);
      setAttachUserDialog({ open: false, requestId: null });
    } catch (err) {
      console.error("Error attaching user:", err);
      toast.error("Failed to attach user");
    } finally {
      setUpdating(null);
    }
  };

  const copyInviteMessage = (request: AccessRequest) => {
    const org = request.approved_org_id ? organizations.get(request.approved_org_id) : null;
    const message = `Welcome to the Digital Twin Platform!

Your access has been approved for organization: ${org?.name || request.organization}

To get started:
1. Visit: ${window.location.origin}/auth
2. Sign up with your email: ${request.email}
3. Use this access code when prompted: ${request.access_code}

If you have any questions, please contact the administrator.`;

    navigator.clipboard.writeText(message);
    toast.success("Invite message copied to clipboard");
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Access code copied");
  };

  // Filter requests
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      searchTerm === "" ||
      request.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.organization.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don't have permission to view this page.</p>
          <Link to="/">
            <Button variant="outline" className="rounded-full">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/10">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Pending</Badge>;
    }
  };

  const getUserStatusBadge = (request: AccessRequest) => {
    if (request.status !== "approved" || !request.approved_org_id) return null;
    
    // For now, we show "Waiting for signup" since we can't easily check if user exists
    return (
      <Badge variant="outline" className="gap-1 text-xs">
        <Clock className="h-3 w-3" />
        Waiting for signup
      </Badge>
    );
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
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchRequests}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-screen-xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Access Requests</h1>
          <p className="text-muted-foreground">
            {requests.length} total request{requests.length !== 1 ? "s" : ""} •{" "}
            {requests.filter((r) => r.status === "pending").length} pending
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="Search by name, email, or organization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:max-w-xs"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <p className="text-muted-foreground">
              {requests.length === 0 ? "No access requests yet." : "No requests match your filters."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => {
              const org = request.approved_org_id
                ? organizations.get(request.approved_org_id)
                : null;

              return (
                <div
                  key={request.id}
                  className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg font-medium text-foreground">{request.full_name}</h3>
                        {getStatusBadge(request.status)}
                        {getUserStatusBadge(request)}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <a href={`mailto:${request.email}`} className="hover:text-primary">
                            {request.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Building className="h-4 w-4" />
                          {request.organization}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-4 w-4" />
                          {request.role}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground text-xs">
                          {new Date(request.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>

                      {request.message && (
                        <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                          <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <p>{request.message}</p>
                        </div>
                      )}

                      {/* Organization created */}
                      {org && (
                        <div className="flex items-center gap-2 text-sm bg-primary/5 border border-primary/10 rounded-lg p-3">
                          <Building className="h-4 w-4 text-primary" />
                          <span className="text-foreground">Organization created:</span>
                          <span className="font-medium text-primary">{org.name}</span>
                          <span className="text-muted-foreground text-xs">({org.slug})</span>
                        </div>
                      )}

                      {/* Access code and invite */}
                      {request.access_code && (
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Access Code:</span>
                            <code className="bg-primary/10 text-primary px-3 py-1 rounded font-mono text-sm">
                              {request.access_code}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyCode(request.access_code!)}
                              className="h-8 w-8 p-0"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyInviteMessage(request)}
                            className="gap-2"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            Copy Invite Message
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 lg:flex-col">
                      {request.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => approveRequest(request)}
                            disabled={updating === request.id}
                            className="bg-green-600 hover:bg-green-700 gap-2"
                          >
                            <Check className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rejectRequest(request.id)}
                            disabled={updating === request.id}
                            className="text-destructive border-destructive/20 hover:bg-destructive/10 gap-2"
                          >
                            <X className="h-4 w-4" />
                            Reject
                          </Button>
                        </>
                      )}
                      {request.status === "approved" && request.approved_org_id && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setAttachUserDialog({ open: true, requestId: request.id })}
                          disabled={updating === request.id}
                          className="gap-2"
                        >
                          <UserPlus className="h-4 w-4" />
                          Attach User
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Attach User Dialog */}
      <Dialog
        open={attachUserDialog.open}
        onOpenChange={(open) => setAttachUserDialog({ open, requestId: open ? attachUserDialog.requestId : null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attach User to Organization</DialogTitle>
            <DialogDescription>
              The user must sign up with their email address first. Once they have an account, they will automatically be linked to their organization.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAttachUserDialog({ open: false, requestId: null })}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
