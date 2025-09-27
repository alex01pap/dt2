import React, { useState, useMemo } from 'react';
import { AlertTriangle, Info, XCircle, CheckCircle, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Event {
  id: string;
  title: string;
  description?: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  source?: string;
  timestamp: Date;
  acknowledged?: boolean;
}

interface RecentEventsTableProps {
  events: Event[];
  isLoading?: boolean;
  className?: string;
}

const getSeverityIcon = (severity: Event['severity']) => {
  switch (severity) {
    case 'info':
      return <Info className="h-4 w-4 text-blue-500" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'error':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'critical':
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
};

const getSeverityBadgeVariant = (severity: Event['severity']) => {
  switch (severity) {
    case 'info':
      return 'outline';
    case 'warning':
      return 'secondary';
    case 'error':
    case 'critical':
      return 'destructive';
    default:
      return 'outline';
  }
};

const formatTimestamp = (timestamp: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else {
    return `${diffDays}d ago`;
  }
};

export const RecentEventsTable: React.FC<RecentEventsTableProps> = ({
  events,
  isLoading = false,
  className = ''
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const filteredEvents = useMemo(() => {
    if (severityFilter === 'all') return events;
    return events.filter(event => event.severity === severityFilter);
  }, [events, severityFilter]);

  const severityCount = useMemo(() => {
    return events.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [events]);

  if (isLoading) {
    return (
      <Card className={`card-enterprise ${className}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-3 border rounded">
                <Skeleton className="h-4 w-4" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card className={`card-enterprise ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            Recent Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 mx-auto text-success mb-4" />
            <h3 className="text-lg font-medium text-success">All Clear!</h3>
            <p className="text-muted-foreground">No recent events to display</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`card-enterprise ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Events</CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ({events.length})</SelectItem>
                <SelectItem value="critical">
                  Critical {severityCount.critical ? `(${severityCount.critical})` : '(0)'}
                </SelectItem>
                <SelectItem value="error">
                  Error {severityCount.error ? `(${severityCount.error})` : '(0)'}
                </SelectItem>
                <SelectItem value="warning">
                  Warning {severityCount.warning ? `(${severityCount.warning})` : '(0)'}
                </SelectItem>
                <SelectItem value="info">
                  Info {severityCount.info ? `(${severityCount.info})` : '(0)'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-2">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className={`
                  flex items-center space-x-4 p-3 rounded-lg border transition-colors
                  hover:bg-muted/30 ${event.acknowledged ? 'opacity-60' : ''}
                `}
              >
                <div className="flex-shrink-0">
                  {getSeverityIcon(event.severity)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium truncate">
                      {event.title}
                    </p>
                    {event.source && (
                      <Badge variant="outline" className="text-xs">
                        {event.source}
                      </Badge>
                    )}
                  </div>
                  {event.description && (
                    <p className="text-xs text-muted-foreground truncate">
                      {event.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <Badge
                    variant={getSeverityBadgeVariant(event.severity)}
                    className="capitalize"
                  >
                    {event.severity}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(event.timestamp)}
                  </span>
                </div>
              </div>
            ))}

            {filteredEvents.length === 0 && severityFilter !== 'all' && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No {severityFilter} events found
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};