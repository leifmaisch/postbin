import { squircle } from "@/lib/squircle"
import { surfaceDepth } from "@/lib/surface-depth"
import { cn } from "@/lib/utils"
import {
  Section,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "@/components/ui/section"

type BentoGridProps = Omit<React.ComponentProps<typeof Section>, "children"> & {
  title?: string
  description?: string
  children: React.ReactNode
}

function BentoGrid({
  title,
  description,
  className,
  children,
  ...props
}: BentoGridProps) {
  return (
    <Section data-slot="bento-grid" className={className} {...props}>
      {title ? (
        <SectionHeader>
          <SectionTitle>{title}</SectionTitle>
          {description ? (
            <SectionDescription>{description}</SectionDescription>
          ) : null}
        </SectionHeader>
      ) : null}
      <div
        className="grid auto-rows-[minmax(9rem,auto)] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {children}
      </div>
    </Section>
  )
}

type BentoCellSpan = "default" | "wide" | "tall" | "large"

const spanClasses: Record<BentoCellSpan, string> = {
  default: "",
  wide: "sm:col-span-2",
  tall: "lg:row-span-2",
  large: "sm:col-span-2 lg:row-span-2",
}

type BentoCellProps = React.ComponentProps<"article"> & {
  span?: BentoCellSpan
}

function BentoCell({
  span = "default",
  className,
  children,
  style,
  ...props
}: BentoCellProps) {
  return (
    <article
      data-slot="bento-cell"
      data-span={span !== "default" ? span : undefined}
      style={{ ...squircle, ...style }}
      className={cn(
        "flex min-h-36 flex-col rounded-squircle-lg border border-border/60 bg-muted/30 p-1.5",
        spanClasses[span],
        className
      )}
      {...props}
    >
      {children}
    </article>
  )
}

function BentoCellPanel({
  className,
  children,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bento-cell-panel"
      style={{ ...squircle, ...style }}
      className={cn(
        "relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-squircle-inner border border-border bg-card",
        surfaceDepth("md"),
        className
      )}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_80%_at_50%_100%,color-mix(in_srgb,var(--primary)_8%,transparent),transparent_65%)]"
      />
      <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  )
}

function BentoCellVisual({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bento-cell-visual"
      className={cn("flex min-h-24 flex-1 items-center justify-center p-4", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function BentoCellContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bento-cell-content"
      className={cn("px-4 pb-4 pt-1 sm:px-5 sm:pb-5", className)}
      {...props}
    />
  )
}

function BentoCellTitle({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="bento-cell-title"
      className={cn("text-title", className)}
      {...props}
    />
  )
}

function BentoCellDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="bento-cell-description"
      className={cn("mt-1 text-description", className)}
      {...props}
    />
  )
}

export {
  BentoCell,
  BentoCellContent,
  BentoCellDescription,
  BentoCellPanel,
  BentoCellTitle,
  BentoCellVisual,
  BentoGrid,
}
