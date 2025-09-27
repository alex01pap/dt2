import { useState, useMemo, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Search, Filter, AlertCircle, AlertTriangle, Info, CheckCircle, Clock, MoreHorizontal } from "lucide-react";

export interface EventData {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'success';
  title: string;
  description: string;
  source?: string;
  category?: string;
  metadata?: Record<string, any>;
}

export interface EventStreamProps {
  events: EventData[];
  loading?: boolean;
  onEventClick?: (event: EventData) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  height?: number;
  className?: string;
  showFilters?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
  maxVisibleEvents?: number;
}

const LEVEL_ICONS = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle,
};

const LEVEL_COLORS = {
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  error: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  success: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
};

export function EventStream({
  events,
  loading = false,
  onEventClick,
  onLoadMore,
  hasMore = false,
  height = 400,
  className,
  showFilters = true,
  autoRefresh = false,
  refreshInterval = 5000,
  maxVisibleEvents = 50,
}: EventStreamProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(maxVisibleEvents);

  // Auto-refresh logic
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Trigger refresh - typically would call a parent refresh function
      console.log('Auto-refreshing events...');
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Filter and search logic
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = !searchQuery || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.source?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLevel = levelFilter === "all" || event.level === levelFilter;
      const matchesSource = sourceFilter === "all" || event.source === sourceFilter;

      return matchesSearch && matchesLevel && matchesSource;
    });
  }, [events, searchQuery, levelFilter, sourceFilter]);

  // Get visible events (for performance with large lists)
  const visibleEvents = useMemo(() => {
    return filteredEvents.slice(0, visibleCount);
  }, [filteredEvents, visibleCount]);

  // Get unique sources for filter dropdown
  const uniqueSources = useMemo(() => {
    const sources = events.map(e => e.source).filter(Boolean);
    return [...new Set(sources)] as string[];
  }, [events]);

  const handleEventClick = useCallback((event: EventData) => {
    onEventClick?.(event);
  }, [onEventClick]);

  const handleLoadMore = useCallback(() => {
    setVisibleCount(prev => prev + maxVisibleEvents);
  }, [maxVisibleEvents]);

  const EventItem = ({ event }: { event: EventData }) => {
    const IconComponent = LEVEL_ICONS[event.level];

    return (
      <div
        className={cn(
          "flex items-start gap-3 p-3 border-b cursor-pointer hover:bg-muted/50 transition-colors",
          onEventClick && "cursor-pointer"
        )}
        onClick={() => handleEventClick(event)}
      >
        <div className="flex-shrink-0 mt-1">
          <IconComponent className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <h4 className="text-sm font-medium truncate">{event.title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {event.description}
              </p>
            </div>
            
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <Badge 
                variant="secondary" 
                className={cn("text-xs", LEVEL_COLORS[event.level])}
              >
                {event.level}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {new Date(event.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
          
          {event.source && (
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {event.source}
              </Badge>
              {onEventClick && (
                <Button variant="ghost" size="sm" className="h-auto p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className={cn("card-enterprise", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Event Stream</CardTitle>
          <div className="flex items-center gap-2">
            {autoRefresh && (
              <Badge variant="outline" className="text-xs">
                Auto-refresh
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs">
              {filteredEvents.length} events
            </Badge>
          </div>
        </div>
        
        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="success">Success</SelectItem>
              </SelectContent>
            </Select>
            
            {uniqueSources.length > 0 && (
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {uniqueSources.map(source => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea style={{ height }}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center p-8">
                <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No events found</p>
                {searchQuery && (
                  <p className="text-xs mt-1">Try adjusting your search or filters</p>
                )}
              </div>
            </div>
          ) : (
            <>
              {visibleEvents.map(event => (
                <EventItem key={event.id} event={event} />
              ))}
              
              {(visibleCount < filteredEvents.length || hasMore) && (
                <div className="p-3 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={visibleCount < filteredEvents.length ? handleLoadMore : onLoadMore}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : 
                     visibleCount < filteredEvents.length ? 
                     `Show More (${filteredEvents.length - visibleCount} remaining)` :
                     "Load More Events"}
                  </Button>
                </div>
              )}
            </>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}