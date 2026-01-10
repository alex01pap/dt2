import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface Organization {
  id: string;
  name: string;
  slug: string;
  settings: any;
  created_at: string;
  updated_at: string;
}

interface OrganizationMember {
  org_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
}

interface OrganizationContextType {
  organizations: Organization[];
  currentOrg: Organization | null;
  currentOrgId: string | null;
  currentOrgRole: OrganizationMember['role'] | null;
  isLoading: boolean;
  switchOrg: (orgId: string) => void;
  refreshOrganizations: () => Promise<void>;
  isOrgAdmin: boolean;
  isOrgOwner: boolean;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

const ORG_STORAGE_KEY = 'currentOrgId';

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [memberships, setMemberships] = useState<OrganizationMember[]>([]);
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrganizations = useCallback(async () => {
    if (!user) {
      setOrganizations([]);
      setMemberships([]);
      setCurrentOrgId(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Fetch memberships first
      const { data: memberData, error: memberError } = await supabase
        .from('organization_members')
        .select('org_id, user_id, role')
        .eq('user_id', user.id);

      if (memberError) {
        console.error('Error fetching memberships:', memberError);
        setIsLoading(false);
        return;
      }

      setMemberships(memberData || []);

      if (!memberData || memberData.length === 0) {
        setOrganizations([]);
        setCurrentOrgId(null);
        setIsLoading(false);
        return;
      }

      // Fetch organizations
      const orgIds = memberData.map(m => m.org_id);
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .in('id', orgIds);

      if (orgError) {
        console.error('Error fetching organizations:', orgError);
        setIsLoading(false);
        return;
      }

      setOrganizations(orgData || []);

      // Set current org from localStorage or use first org
      const storedOrgId = localStorage.getItem(ORG_STORAGE_KEY);
      if (storedOrgId && orgIds.includes(storedOrgId)) {
        setCurrentOrgId(storedOrgId);
      } else if (orgData && orgData.length > 0) {
        setCurrentOrgId(orgData[0].id);
        localStorage.setItem(ORG_STORAGE_KEY, orgData[0].id);
      }
    } catch (error) {
      console.error('Error in fetchOrganizations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchOrganizations();
    }
  }, [user, authLoading, fetchOrganizations]);

  const switchOrg = (orgId: string) => {
    const org = organizations.find(o => o.id === orgId);
    if (org) {
      setCurrentOrgId(orgId);
      localStorage.setItem(ORG_STORAGE_KEY, orgId);
    }
  };

  const currentOrg = organizations.find(o => o.id === currentOrgId) || null;
  const currentMembership = memberships.find(m => m.org_id === currentOrgId);
  const currentOrgRole = currentMembership?.role || null;
  const isOrgAdmin = currentOrgRole === 'owner' || currentOrgRole === 'admin';
  const isOrgOwner = currentOrgRole === 'owner';

  const value: OrganizationContextType = {
    organizations,
    currentOrg,
    currentOrgId,
    currentOrgRole,
    isLoading,
    switchOrg,
    refreshOrganizations: fetchOrganizations,
    isOrgAdmin,
    isOrgOwner,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};
