import { cn } from "@/lib/utils"

export type SurfaceRadius = "sm" | "md" | "lg" | "xl" | "pill"

const radiusClasses: Record<SurfaceRadius, string> = {
  sm: "before:rounded-[calc(var(--radius-squircle-sm)-1px)] before:[corner-shape:squircle]",
  md: "before:rounded-[calc(var(--radius-squircle-md)-1px)] before:[corner-shape:squircle]",
  lg: "before:rounded-[calc(var(--radius-squircle-lg)-1px)] before:[corner-shape:squircle]",
  xl: "before:rounded-[calc(var(--radius-squircle-xl)-1px)] before:[corner-shape:squircle]",
  pill: "before:rounded-full",
}

const depthBefore =
  "before:pointer-events-none before:absolute before:inset-0"

const depthBase =
  "relative shadow-[0_1px_2px_rgb(0_0_0/0.04)] not-dark:bg-clip-padding dark:shadow-[0_1px_2px_rgb(0_0_0/0.24)]"

const depthHighlight =
  "before:shadow-[0_1px_0_rgb(0_0_0/0.04)] dark:before:shadow-[0_-1px_0_rgb(255_255_255/0.06)]"

const depthPressed =
  "active:shadow-none active:before:shadow-[inset_0_1px_0_rgb(0_0_0/0.08)] dark:active:before:shadow-[inset_0_1px_0_rgb(0_0_0/0.24)]"

const depthPrimaryHighlight =
  "before:shadow-[inset_0_1px_0_rgb(255_255_255/0.14)] active:before:shadow-[inset_0_1px_0_rgb(0_0_0/0.1)]"

const depthInput =
  "relative shadow-[0_1px_2px_rgb(0_0_0/0.03)] not-dark:bg-clip-padding dark:bg-card before:shadow-[0_1px_0_rgb(0_0_0/0.04)] dark:before:shadow-[0_-1px_0_rgb(255_255_255/0.05)]"

const squircleClip = "overflow-hidden"

export function surfaceDepth(radius: SurfaceRadius = "lg") {
  return cn(depthBase, depthBefore, depthHighlight, radiusClasses[radius])
}

export function surfaceDepthInteractive(radius: SurfaceRadius = "lg") {
  return cn(surfaceDepth(radius), depthPressed)
}

export function surfaceDepthPrimary(radius: SurfaceRadius = "md") {
  return cn(
    "relative shadow-[0_1px_2px_rgb(0_0_0/0.08)]",
    depthBefore,
    depthPrimaryHighlight,
    radiusClasses[radius],
    "active:shadow-none"
  )
}

export function surfaceDepthPrimarySquircle() {
  return cn(
    squircleClip,
    "relative",
    depthBefore,
    depthPrimaryHighlight,
    radiusClasses.md
  )
}

export function surfaceDepthInteractiveSquircle() {
  return cn(
    squircleClip,
    "relative",
    depthBefore,
    depthHighlight,
    radiusClasses.md,
    depthPressed
  )
}

export function surfaceDepthInput(radius: SurfaceRadius = "md") {
  return cn(depthInput, depthBefore, radiusClasses[radius])
}

export const surfaceDepthFrame =
  "relative shadow-[inset_0_1px_0_rgb(255_255_255/0.04)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.04),inset_0_-1px_0_rgb(0_0_0/0.2)]"
