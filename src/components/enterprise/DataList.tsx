import { cn } from "@/lib/utils";

interface DataListItem {
  id: string;
  content: React.ReactNode;
}

interface DataListProps {
  items: DataListItem[];
  emptyMessage?: string;
  className?: string;
}

export function DataList({ items, emptyMessage = "No items", className }: DataListProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item) => (
        <div key={item.id}>{item.content}</div>
      ))}
    </div>
  );
}

// Reusable row component for list items
interface DataListRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function DataListRow({ children, className, onClick }: DataListRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 p-4",
        "rounded-lg border border-border/50 bg-card/50",
        "hover:bg-accent/50 hover:border-border transition-colors",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
