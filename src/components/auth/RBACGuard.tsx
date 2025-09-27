import { ReactNode } from "react";
import { useAuthStore } from "@/stores/authStore";
import { hasPermission, RBACPermissions } from "@/types/rbac";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldX } from "lucide-react";

interface RBACGuardProps {
  permission: keyof RBACPermissions;
  children: ReactNode;
  fallback?: ReactNode;
}

export function RBACGuard({ permission, children, fallback }: RBACGuardProps) {
  const { user } = useAuthStore();
  
  if (!user || !hasPermission(user.role, permission)) {
    return fallback || (
      <Alert variant="destructive" className="mx-auto max-w-md">
        <ShieldX className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access this feature. Contact your administrator for access.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}