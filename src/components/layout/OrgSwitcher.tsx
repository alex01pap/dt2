import { Building2, Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useOrganization } from '@/contexts/OrganizationContext';
import { Badge } from '@/components/ui/badge';

export function OrgSwitcher() {
  const { organizations, currentOrg, currentOrgRole, switchOrg, isLoading } = useOrganization();

  // Don't show if user has only one org or none
  if (isLoading || organizations.length <= 1) {
    if (currentOrg) {
      return (
        <div className="flex items-center gap-2 px-2 py-1 text-sm">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium truncate max-w-[150px]">{currentOrg.name}</span>
          {currentOrgRole && (
            <Badge variant="outline" className="text-xs capitalize">
              {currentOrgRole}
            </Badge>
          )}
        </div>
      );
    }
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 max-w-[200px]">
          <Building2 className="h-4 w-4" />
          <span className="truncate">{currentOrg?.name || 'Select Org'}</span>
          <ChevronsUpDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[220px]">
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => switchOrg(org.id)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span className="truncate">{org.name}</span>
            {org.id === currentOrg?.id && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
