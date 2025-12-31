import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Link as LinkIcon, Save, CheckCircle } from "lucide-react";
import { SectionHeader, ActionButton, StepIndicator } from "@/components/enterprise";
import { toast } from "sonner";

interface ConnectionSetupProps {
  config: {
    openhab_url: string;
    api_token?: string | null;
    sync_interval: number;
    enabled: boolean;
    last_sync_at?: string | null;
  } | null;
  onSave: (data: {
    openhab_url: string;
    api_token: string;
    sync_interval: number;
    enabled: boolean;
  }) => Promise<void>;
  onTestConnection: (url: string, token?: string) => Promise<boolean>;
}

export function ConnectionSetup({ config, onSave, onTestConnection }: ConnectionSetupProps) {
  const [formData, setFormData] = useState({
    openhab_url: config?.openhab_url || "",
    api_token: config?.api_token || "",
    sync_interval: config?.sync_interval || 30,
    enabled: config?.enabled ?? true,
  });
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  const handleTest = async () => {
    setIsTesting(true);
    setTestSuccess(false);
    try {
      await onTestConnection(formData.openhab_url, formData.api_token);
      setTestSuccess(true);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      toast.success("Configuration saved");
    } finally {
      setIsSaving(false);
    }
  };

  const steps = [
    { title: "Enter URL", description: "Your OpenHAB server address" },
    { title: "Add Token", description: "API token for authentication" },
    { title: "Test", description: "Verify the connection works" },
    { title: "Save", description: "Enable synchronization" },
  ];

  const getCompletedSteps = () => {
    const completed: number[] = [];
    if (formData.openhab_url) completed.push(0);
    if (formData.api_token) completed.push(1);
    if (testSuccess) completed.push(2);
    if (config?.openhab_url) completed.push(3);
    return completed;
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Settings}
        title="Connection Setup"
        description="Configure your OpenHAB server connection"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url">Server URL</Label>
              <Input
                id="url"
                placeholder="https://myopenhab.org or http://192.168.1.100:8080"
                value={formData.openhab_url}
                onChange={(e) => setFormData({ ...formData, openhab_url: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                For myopenHAB.org, use your email:password as the API token
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="token">API Token</Label>
              <Input
                id="token"
                type="password"
                placeholder="your-api-token or email:password for myopenHAB"
                value={formData.api_token}
                onChange={(e) => setFormData({ ...formData, api_token: e.target.value })}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="interval">Sync Interval (seconds)</Label>
                <Input
                  id="interval"
                  type="number"
                  min={10}
                  max={3600}
                  value={formData.sync_interval}
                  onChange={(e) => setFormData({ ...formData, sync_interval: parseInt(e.target.value) || 30 })}
                />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch
                  id="enabled"
                  checked={formData.enabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                />
                <Label htmlFor="enabled" className="cursor-pointer">
                  Enable auto-sync
                </Label>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <ActionButton
                variant="outline"
                onClick={handleTest}
                loading={isTesting}
                icon={testSuccess ? CheckCircle : LinkIcon}
                disabled={!formData.openhab_url}
              >
                {testSuccess ? "Connected" : "Test Connection"}
              </ActionButton>
              <ActionButton
                onClick={handleSave}
                loading={isSaving}
                icon={Save}
                disabled={!formData.openhab_url}
              >
                Save
              </ActionButton>
            </div>

            {config?.last_sync_at && (
              <p className="text-sm text-muted-foreground pt-2">
                Last synced: {new Date(config.last_sync_at).toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Steps */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Setup Progress</h3>
            <StepIndicator
              steps={steps}
              completedSteps={getCompletedSteps()}
              currentStep={getCompletedSteps().length}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
