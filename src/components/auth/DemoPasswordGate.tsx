import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

interface DemoPasswordGateProps {
  onSuccess: () => void;
}

// The password is validated against the DEMO_PASSWORD environment variable
// set in Supabase Edge Functions secrets
const DEMO_PASSWORD = "platon2024"; // Fallback for development

export function DemoPasswordGate({ onSuccess }: DemoPasswordGateProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validate password against edge function
      const response = await fetch(
        "https://vjrfdglwtpdtfkiluwah.supabase.co/functions/v1/validate-demo-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();

      if (response.ok && data.valid) {
        // Store in session storage so they don't have to re-enter
        sessionStorage.setItem("demo_authenticated", "true");
        onSuccess();
      } else {
        setError("Invalid password. Please try again.");
      }
    } catch {
      // Fallback to local validation if edge function fails
      if (password === DEMO_PASSWORD) {
        sessionStorage.setItem("demo_authenticated", "true");
        onSuccess();
      } else {
        setError("Invalid password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 bg-white border border-[#dadce0]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1a73e8]/10 flex items-center justify-center">
            <Lock className="h-8 w-8 text-[#1a73e8]" />
          </div>
          <h1 className="text-2xl font-semibold text-[#202124] mb-2">
            Protected Demo
          </h1>
          <p className="text-[#5f6368] text-sm">
            Enter the demo password to access the dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10 border-[#dadce0] focus:border-[#1a73e8] focus:ring-[#1a73e8]"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5f6368] hover:text-[#202124]"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-[#ea4335]">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#1a73e8] hover:bg-[#1557b0]"
            disabled={!password || isLoading}
          >
            {isLoading ? "Verifying..." : "Access Dashboard"}
          </Button>
        </form>

        <p className="mt-6 text-xs text-center text-[#5f6368]">
          This is a protected demonstration environment.
          <br />
          Contact the administrator for access credentials.
        </p>
      </Card>
    </div>
  );
}
