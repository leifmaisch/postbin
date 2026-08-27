import { squircle } from "@/lib/squircle"
import { cn } from "@/lib/utils"

type EmptyStateProps = {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      style={squircle}
      className={cn(
        "flex flex-col items-center justify-center rounded-squircle-lg border border-dashed bg-muted/30 px-6 py-14 text-center",
        className
      )}
    >
      {icon ? (
        <div
          style={squircle}
          className="mb-4 flex size-12 items-center justify-center rounded-squircle-md border bg-background text-muted-foreground"
        >
          {icon}
        </div>
      ) : null}
      <h3 className="text-heading">{title}</h3>
      {description ? (
        <p className="mt-1.5 max-w-sm text-description">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
