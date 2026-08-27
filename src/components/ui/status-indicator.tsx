import { cn } from "@/lib/utils"

type StatusIndicatorStatus = "online" | "offline" | "away" | "busy"

type StatusIndicatorProps = {
  status: StatusIndicatorStatus
  label?: string
  pulse?: boolean
  className?: string
}

const statusStyles: Record<
  StatusIndicatorStatus,
  { text: string; dot: string; ping?: string }
> = {
  online: {
    text: "text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-600 dark:bg-emerald-400",
    ping: "bg-emerald-600/60 dark:bg-emerald-400/60",
  },
  away: {
    text: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-600 dark:bg-amber-400",
  },
  busy: {
    text: "text-destructive",
    dot: "bg-destructive",
  },
  offline: {
    text: "text-muted-foreground",
    dot: "bg-muted-foreground/50",
  },
}

const statusLabels: Record<StatusIndicatorStatus, string> = {
  online: "Online",
  offline: "Offline",
  away: "Away",
  busy: "Busy",
}

export function StatusIndicator({
  status,
  label,
  pulse = false,
  className,
}: StatusIndicatorProps) {
  const displayLabel = label ?? statusLabels[status]
  const styles = statusStyles[status]

  return (
    <span
      data-slot="status-indicator"
      className={cn(
        "inline-flex h-5 w-fit shrink-0 items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-xs font-medium",
        styles.text,
        className
      )}
    >
      <span className="relative flex size-1.5 shrink-0">
        {pulse && status === "online" && styles.ping ? (
          <span
            className={cn(
              "absolute inline-flex size-full animate-ping rounded-full opacity-75",
              styles.ping
            )}
          />
        ) : null}
        <span
          className={cn("relative inline-flex size-1.5 rounded-full", styles.dot)}
        />
      </span>
      {displayLabel}
    </span>
  )
}
