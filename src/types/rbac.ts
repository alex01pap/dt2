export type UserRole = 'owner' | 'admin' | 'member';

export interface RBACPermissions {
  canViewAdmin: boolean;
  canManageUsers: boolean;
  canEditRules: boolean;
  canAccessScenarios: boolean;
  canManageAssets: boolean;
}

export const rolePermissions: Record<UserRole, RBACPermissions> = {
  owner: {
    canViewAdmin: true,
    canManageUsers: true,
    canEditRules: true,
    canAccessScenarios: true,
    canManageAssets: true,
  },
  admin: {
    canViewAdmin: true,
    canManageUsers: true,
    canEditRules: true,
    canAccessScenarios: true,
    canManageAssets: true,
  },
  member: {
    canViewAdmin: false,
    canManageUsers: false,
    canEditRules: false,
    canAccessScenarios: false,
    canManageAssets: false,
  },
};

export const hasPermission = (userRole: UserRole, permission: keyof RBACPermissions): boolean => {
  return rolePermissions[userRole][permission];
};