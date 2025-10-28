import { useState, useEffect } from "react";
import { Shield, Lock, AlertTriangle, Activity, Eye, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  ip?: string;
  status: "success" | "failed";
}

export function SecurityCenter() {
  const [auditLogs] = useState<AuditLog[]>([
    {
      id: "1",
      action: "User Login",
      user: "admin@example.com",
      timestamp: new Date().toISOString(),
      ip: "192.168.1.1",
      status: "success",
    },
    {
      id: "2",
      action: "Configuration Changed",
      user: "admin@example.com",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      ip: "192.168.1.1",
      status: "success",
    },
  ]);

  const securityMetrics = [
    { label: "Failed Login Attempts (24h)", value: "0", status: "success" },
    { label: "Active Sessions", value: "1", status: "success" },
    { label: "Security Alerts", value: "0", status: "success" },
    { label: "Last Security Scan", value: "2h ago", status: "success" },
  ];

  return (
    <div className="space-y-6">
      <Card className="card-enterprise">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Center
          </CardTitle>
          <CardDescription>
            Monitor security events and manage access controls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="audit">Audit Logs</TabsTrigger>
              <TabsTrigger value="policies">Policies</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 pt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {securityMetrics.map((metric) => (
                  <Card key={metric.label}>
                    <CardContent className="p-6">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {metric.label}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-2xl font-bold">{metric.value}</p>
                          {metric.status === "success" && (
                            <Badge className="bg-green-600">OK</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Security Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-600"></div>
                      <span className="text-sm">Firewall</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-600">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-600"></div>
                      <span className="text-sm">SSL Certificate</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-600">
                      Valid
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-600"></div>
                      <span className="text-sm">Database Encryption</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-600">
                      Enabled
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-600"></div>
                      <span className="text-sm">API Rate Limiting</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-600">
                      Active
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audit" className="space-y-6 pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing recent security events
                </p>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Logs
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-muted-foreground" />
                            {log.action}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{log.user}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {log.ip}
                        </TableCell>
                        <TableCell>
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              log.status === "success" ? "default" : "destructive"
                            }
                          >
                            {log.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="policies" className="space-y-6 pt-6">
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-base">Access Control Policies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg border bg-background">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-semibold">Admin Access</h4>
                        <p className="text-sm text-muted-foreground">
                          Full system access for administrators
                        </p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border bg-background">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-semibold">User Access</h4>
                        <p className="text-sm text-muted-foreground">
                          Read-only access to sensors and dashboards
                        </p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border bg-background">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-semibold">API Access</h4>
                        <p className="text-sm text-muted-foreground">
                          Rate-limited API access with authentication
                        </p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-semibold text-yellow-900">
                        Security Recommendation
                      </h4>
                      <p className="text-sm text-yellow-800">
                        Consider enabling two-factor authentication for all admin users
                        to enhance security.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
