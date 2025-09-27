import React, { useState, useCallback, useMemo } from 'react';
import { ChevronRight, ChevronDown, MoreHorizontal, Building2, Settings, Zap, Database } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Badge } from '@/components/ui/badge';

interface AssetNode {
  id: string;
  name: string;
  type: 'building' | 'room' | 'equipment' | 'sensor' | 'system';
  status?: 'online' | 'offline' | 'warning' | 'critical';
  children?: AssetNode[];
  parentId?: string;
  metadata?: Record<string, any>;
}

interface AssetTreeProps {
  assets: AssetNode[];
  onNodeSelect?: (node: AssetNode) => void;
  onNodeAction?: (action: string, node: AssetNode) => void;
  selectedNodeId?: string;
  lazyLoad?: boolean;
  className?: string;
}

interface TreeNodeProps {
  node: AssetNode;
  level: number;
  onSelect: (node: AssetNode) => void;
  onAction: (action: string, node: AssetNode) => void;
  isSelected: boolean;
  lazyLoad: boolean;
}

const getNodeIcon = (type: AssetNode['type']) => {
  switch (type) {
    case 'building': return Building2;
    case 'room': return Database;
    case 'equipment': return Settings;
    case 'sensor': return Zap;
    case 'system': return Database;
    default: return Database;
  }
};

const getStatusColor = (status?: AssetNode['status']) => {
  switch (status) {
    case 'online': return 'text-green-500';
    case 'warning': return 'text-yellow-500';
    case 'critical': return 'text-red-500';
    case 'offline': return 'text-gray-400';
    default: return 'text-muted-foreground';
  }
};

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  level,
  onSelect,
  onAction,
  isSelected,
  lazyLoad
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hasChildren = node.children && node.children.length > 0;
  const Icon = getNodeIcon(node.type);
  const statusColor = getStatusColor(node.status);

  const handleToggle = useCallback(async () => {
    if (!hasChildren) return;

    if (lazyLoad && !isExpanded && !isLoading) {
      setIsLoading(true);
      // Simulate lazy loading
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsLoading(false);
    }

    setIsExpanded(!isExpanded);
  }, [hasChildren, lazyLoad, isExpanded, isLoading]);

  const handleSelect = useCallback(() => {
    onSelect(node);
  }, [node, onSelect]);

  const handleContextAction = useCallback((action: string) => {
    onAction(action, node);
  }, [node, onAction]);

  return (
    <div className="select-none">
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={`
              flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer
              hover:bg-muted/50 transition-colors group
              ${isSelected ? 'bg-primary/10 text-primary' : ''}
            `}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            onClick={handleSelect}
          >
            {hasChildren && (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-muted"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle();
                }}
              >
                {isLoading ? (
                  <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            )}
            
            {!hasChildren && <div className="w-4" />}

            <Icon className={`h-4 w-4 ${statusColor}`} />
            
            <span className="flex-1 text-sm font-medium truncate">
              {node.name}
            </span>

            {node.status && (
              <Badge
                variant={node.status === 'online' ? 'default' : 'secondary'}
                className="text-xs px-1.5 py-0.5"
              >
                {node.status}
              </Badge>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem onClick={() => handleContextAction('view')}>
            View Details
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleContextAction('edit')}>
            Edit Properties
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleContextAction('configure')}>
            Configure
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleContextAction('delete')}>
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {isExpanded && hasChildren && (
        <div className="animate-accordion-down">
          {node.children?.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              onAction={onAction}
              isSelected={isSelected}
              lazyLoad={lazyLoad}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const AssetTree: React.FC<AssetTreeProps> = ({
  assets,
  onNodeSelect = () => {},
  onNodeAction = () => {},
  selectedNodeId,
  lazyLoad = false,
  className = ''
}) => {
  const handleNodeSelect = useCallback((node: AssetNode) => {
    onNodeSelect(node);
  }, [onNodeSelect]);

  const handleNodeAction = useCallback((action: string, node: AssetNode) => {
    onNodeAction(action, node);
  }, [onNodeAction]);

  const rootNodes = useMemo(() => {
    return assets.filter(asset => !asset.parentId);
  }, [assets]);

  if (assets.length === 0) {
    return (
      <Card className={`p-6 text-center ${className}`}>
        <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground">No Assets</h3>
        <p className="text-sm text-muted-foreground">
          Create your first asset to get started
        </p>
      </Card>
    );
  }

  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-1">
        {rootNodes.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            level={0}
            onSelect={handleNodeSelect}
            onAction={handleNodeAction}
            isSelected={selectedNodeId === node.id}
            lazyLoad={lazyLoad}
          />
        ))}
      </div>
    </Card>
  );
};

export default AssetTree;