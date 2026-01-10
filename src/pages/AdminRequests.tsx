import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { GraduationCap, Check, X, Copy, RefreshCw, Mail, Building, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface AccessRequest {
  id: string;
  full_name: string;
  email: string;
  organization: string;
  role: string;
  message: string | null;
  status: string;
  access_code: string | null;
  created_at: string;
}

function generateAccessCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default function AdminRequests() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

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
        .from("access_requests" as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests((data as unknown as AccessRequest[]) || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
      toast.error("Failed to load access requests");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    setUpdating(id);
    try {
      const updates: { status: string; access_code?: string; reviewed_at: string; reviewed_by: string } = {
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user?.id || "",
      };

      if (status === "approved") {
        updates.access_code = generateAccessCode();
      }

      const { error } = await supabase
        .from("access_requests" as any)
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status, access_code: updates.access_code || r.access_code } : r
        )
      );

      toast.success(`Request ${status}`);
    } catch (err) {
      console.error("Error updating request:", err);
      toast.error("Failed to update request");
    } finally {
      setUpdating(null);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Access code copied");
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-[#5f6368]" />
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
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[#202124] mb-2">Access Denied</h1>
          <p className="text-[#5f6368] mb-6">You don't have permission to view this page.</p>
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
        return <Badge className="bg-[#34a853] hover:bg-[#34a853]">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary" className="bg-[#fbbc04] text-[#202124] hover:bg-[#fbbc04]">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-[#dadce0]">
        <div className="container flex h-16 max-w-screen-xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1a73e8] flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-semibold text-[#202124] leading-tight block">Digital Twin</span>
              <span className="text-xs text-[#5f6368]">Admin Panel</span>
            </div>
          </Link>
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
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="rounded-full">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-screen-xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#202124] mb-2">Access Requests</h1>
          <p className="text-[#5f6368]">
            {requests.length} total request{requests.length !== 1 ? "s" : ""} •{" "}
            {requests.filter((r) => r.status === "pending").length} pending
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="h-6 w-6 animate-spin text-[#5f6368]" />
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#dadce0] p-12 text-center">
            <p className="text-[#5f6368]">No access requests yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-xl border border-[#dadce0] p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-medium text-[#202124]">{request.full_name}</h3>
                      {getStatusBadge(request.status)}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-[#5f6368]">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${request.email}`} className="hover:text-[#1a73e8]">
                          {request.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-[#5f6368]">
                        <Building className="h-4 w-4" />
                        {request.organization}
                      </div>
                      <div className="flex items-center gap-2 text-[#5f6368]">
                        <User className="h-4 w-4" />
                        {request.role}
                      </div>
                      <div className="flex items-center gap-2 text-[#5f6368] text-xs">
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
                      <div className="flex items-start gap-2 text-sm text-[#5f6368] bg-[#f8f9fa] rounded-lg p-3">
                        <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <p>{request.message}</p>
                      </div>
                    )}

                    {request.access_code && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#5f6368]">Access Code:</span>
                        <code className="bg-[#e8f0fe] text-[#1a73e8] px-3 py-1 rounded font-mono text-sm">
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
                    )}
                  </div>

                  {/* Actions */}
                  {request.status === "pending" && (
                    <div className="flex gap-2 lg:flex-col">
                      <Button
                        size="sm"
                        onClick={() => updateStatus(request.id, "approved")}
                        disabled={updating === request.id}
                        className="bg-[#34a853] hover:bg-[#2d9249] gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(request.id, "rejected")}
                        disabled={updating === request.id}
                        className="text-red-600 border-red-200 hover:bg-red-50 gap-2"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}