import { squircle } from "@/lib/squircle"
import { surfaceDepthFrame } from "@/lib/surface-depth"
import { cn } from "@/lib/utils"

function Frame({ className, style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="frame"
      style={{ ...squircle, ...style }}
      className={cn(
        "relative flex flex-col rounded-squircle-xl border border-border/60 bg-muted/50 p-1",
        surfaceDepthFrame,
        className
      )}
      {...props}
    />
  )
}

function FrameFooter({ className, ...props }: React.ComponentProps<"footer">) {
  return (
    <footer
      data-slot="frame-footer"
      className={cn("px-4 py-3", className)}
      {...props}
    />
  )
}

export { Frame, FrameFooter }
