import { cn } from "@/lib/utils";
import type { RiskLevel, Severity } from "@/types";

const LEVELS: Severity[] = ["Low", "Moderate", "High"];

const tone: Record<string, string> = {
  Low: "bg-success text-success-foreground",
  Moderate: "bg-warning text-warning-foreground",
  High: "bg-destructive text-destructive-foreground",
};

const dot: Record<string, string> = {
  Low: "🟢",
  Moderate: "🟠",
  High: "🔴",
};

export function SeverityBadge({
  level,
  label,
  className,
}: {
  level: Severity | RiskLevel;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        tone[level],
        className,
      )}
    >
      <span aria-hidden>{dot[level]}</span>
      {label ?? level.toUpperCase()}
    </span>
  );
}

export function SeverityScale({ level }: { level: Severity }) {
  return (
    <div>
      <div className="flex gap-2" role="img" aria-label={`Severity: ${level}`}>
        {LEVELS.map((l) => (
          <div key={l} className="flex-1">
            <div
              className={cn(
                "h-2.5 rounded-full transition-colors",
                l === level ? tone[l] : "bg-muted",
              )}
            />
            <p
              className={cn(
                "mt-1.5 text-center text-xs",
                l === level ? "font-semibold text-foreground" : "text-muted-foreground",
              )}
            >
              {l.toUpperCase()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RiskIndicator({
  level,
  reason,
  factors,
}: {
  level: RiskLevel;
  reason?: string;
  factors?: string[];
}) {
  return (
    <div className="space-y-3">
      <SeverityBadge level={level} label={`${level.toUpperCase()} RISK`} />
      {reason && <p className="text-sm text-muted-foreground">{reason}</p>}
      {factors && (
        <div className="flex flex-wrap gap-2">
          {factors.map((f) => (
            <span
              key={f}
              className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground"
            >
              {f}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
