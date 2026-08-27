import * as React from "react"

import { squircle } from "@/lib/squircle"
import { surfaceDepthInput } from "@/lib/surface-depth"
import { cn } from "@/lib/utils"

function Textarea({
  className,
  style,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      style={{ ...squircle, ...style }}
      className={cn(
        "box-border flex field-sizing-content min-h-20 w-full min-w-0 max-w-full rounded-squircle-md border border-input bg-background px-3 py-2 text-base transition-colors duration-150 outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm",
        surfaceDepthInput("md"),
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
