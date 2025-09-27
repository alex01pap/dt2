import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface RBACGuardProps {
  children: ReactNode;
  permission: string;
  fallback?: ReactNode;
}

export const RBACGuard = ({ children, permission, fallback = null }: RBACGuardProps) => {
  const { user, hasRole } = useAuth();
  
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Define permissions based on roles
    const permissions: Record<string, string[]> = {
      user: [
        'canViewDashboard',
        'canViewAssets', 
        'canViewSensors',
        'canViewDigitalTwin',
        'canViewTutorials'
      ],
      moderator: [
        'canViewDashboard',
        'canViewAssets',
        'canViewSensors', 
        'canViewDigitalTwin',
        'canViewTutorials',
        'canEditRules',
        'canAccessScenarios',
        'canManageAssets'
      ],
      admin: [
        'canViewDashboard',
        'canViewAssets',
        'canViewSensors',
        'canViewDigitalTwin', 
        'canViewTutorials',
        'canEditRules',
        'canAccessScenarios',
        'canManageAssets',
        'canViewAdmin',
        'canManageUsers',
        'canManageRoles'
      ]
    };
    
    // Check if user has required permission based on their roles
    if (hasRole('admin') && permissions.admin.includes(permission)) return true;
    if (hasRole('moderator') && permissions.moderator.includes(permission)) return true;
    if (hasRole('user') && permissions.user.includes(permission)) return true;
    
    return false;
  };
  
  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};