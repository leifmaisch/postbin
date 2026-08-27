"use client"

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const separatorVariants = cva(
  "shrink-0 border-border data-horizontal:w-full data-vertical:self-stretch",
  {
    variants: {
      variant: {
        solid: "bg-border data-horizontal:h-px data-vertical:w-px",
        dashed:
          "data-horizontal:h-0 data-horizontal:border-t data-horizontal:border-dashed data-vertical:w-0 data-vertical:border-l data-vertical:border-dashed",
        dotted:
          "data-horizontal:h-0 data-horizontal:border-t data-horizontal:border-dotted data-vertical:w-0 data-vertical:border-l data-vertical:border-dotted",
      },
    },
    defaultVariants: {
      variant: "solid",
    },
  }
)

function Separator({
  className,
  orientation = "horizontal",
  variant = "solid",
  ...props
}: SeparatorPrimitive.Props & VariantProps<typeof separatorVariants>) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(separatorVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Separator, separatorVariants }
