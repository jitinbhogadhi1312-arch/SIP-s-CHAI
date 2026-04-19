import { cn } from "../lib/utils";

export type StatusPillType = "good" | "low" | "critical";

export function StatusPill({ status, label }: { status: StatusPillType, label?: string }) {
  const getStatusClasses = () => {
    switch (status) {
      case "good": return "bg-[hsl(var(--status-good-bg))] text-[hsl(var(--status-good))]";
      case "low": return "bg-[hsl(var(--status-low-bg))] text-[hsl(var(--status-low))]";
      case "critical": return "bg-[hsl(var(--status-critical-bg))] text-[hsl(var(--status-critical))]";
    }
  };

  const statusLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={cn("px-2 py-1 text-xs font-medium rounded-full", getStatusClasses())}>
      {statusLabel}
    </span>
  );
}
