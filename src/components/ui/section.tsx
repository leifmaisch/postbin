import { cn } from "@/lib/utils"

function Section({
  className,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="section"
      className={cn(
        "mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6 md:py-20 lg:py-28",
        className
      )}
      {...props}
    />
  )
}

function SectionHeader({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="section-header"
      className={cn(
        "mb-8 flex flex-col items-center gap-4 text-center md:mb-14",
        className
      )}
      {...props}
    />
  )
}

function SectionTitle({
  className,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="section-title"
      className={cn(
        "max-w-2xl text-balance text-heading text-2xl sm:text-3xl md:text-4xl",
        className
      )}
      {...props}
    />
  )
}

function SectionDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="section-description"
      className={cn("max-w-lg text-balance text-description", className)}
      {...props}
    />
  )
}

export { Section, SectionDescription, SectionHeader, SectionTitle }
