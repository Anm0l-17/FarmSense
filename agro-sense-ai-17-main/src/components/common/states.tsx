import { Loader2, AlertTriangle, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/60 p-10 text-center">
      <Loader2 className="size-6 animate-spin text-primary" />
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
}

export function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="surface-card space-y-3 p-5">
      <Skeleton className="h-4 w-1/3" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-full" />
      ))}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong.",
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/25 bg-destructive/5 p-10 text-center">
      <AlertTriangle className="size-6 text-destructive" />
      <p className="font-semibold">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/60 p-12 text-center">
      <Inbox className="size-7 text-muted-foreground" />
      <p className="font-semibold">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      {action}
    </div>
  );
}
