"use client"

import { Code2, FormInput, Radio, Webhook } from "lucide-react"
import { useRouter } from "next/navigation"
import { useId, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const useCases = [
  {
    title: "Webhook testing",
    description: "Point Stripe, GitHub, or Shopify webhooks at your bin and inspect every payload.",
    icon: Webhook,
    badge: "Popular",
  },
  {
    title: "REST API debugging",
    description: "Capture GET, POST, PUT, PATCH, and DELETE calls with headers, query params, and body.",
    icon: Code2,
  },
  {
    title: "Form submissions",
    description: "See exactly what your forms send before you wire up a backend endpoint.",
    icon: FormInput,
  },
  {
    title: "Live request feed",
    description: "Watch requests arrive in real time and keep logs for up to 48 hours.",
    icon: Radio,
  },
] as const

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const heroId = useId()
  const errorId = useId()

  async function createBin() {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/bins", { method: "POST" })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to create bin")
      }

      router.push(`/bin/${data.id}`)
    } catch {
      setLoading(false)
      setError("Failed to create bin. Please try again.")
    }
  }

  return (
    <main
      id="main-content"
      className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-4 py-12 sm:gap-16 sm:px-6 sm:py-16 md:py-24"
    >
      <section
        aria-labelledby={heroId}
        className="mx-auto flex w-full max-w-xl flex-col items-center text-center"
      >
        <h1 id={heroId} className="text-heading-xl sm:text-[2.5rem] sm:leading-tight">
          Postbin
        </h1>
        <p className="text-description mt-4 text-balance text-lede">
          Create a URL and watch incoming requests in real time.
        </p>
        <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
          <Button
            onClick={createBin}
            disabled={loading}
            size="lg"
            className="min-h-11 w-full"
            aria-busy={loading}
            aria-describedby={error ? errorId : undefined}
          >
            {loading ? "Creating..." : "Generate"}
          </Button>
          {error ? (
            <p id={errorId} role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
        </div>
      </section>

      <section aria-labelledby="use-cases-heading" className="space-y-6">
        <div className="text-center">
          <h2 id="use-cases-heading" className="text-heading-lg">
            Built for
          </h2>
        </div>
        <ul className="grid list-none gap-4 p-0 sm:grid-cols-2">
          {useCases.map((useCase) => {
            const Icon = useCase.icon
            const titleId = `use-case-${useCase.title.toLowerCase().replace(/\s+/g, "-")}`

            return (
              <li key={useCase.title}>
                <article aria-labelledby={titleId}>
                  <Card className="surface-panel h-full">
                    <CardHeader>
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div
                          className="bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-squircle-md border"
                          aria-hidden="true"
                        >
                          <Icon className="size-5" />
                        </div>
                        {"badge" in useCase && useCase.badge ? (
                          <Badge variant="outline">{useCase.badge}</Badge>
                        ) : null}
                      </div>
                      <CardTitle id={titleId}>{useCase.title}</CardTitle>
                      <CardDescription>{useCase.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </article>
              </li>
            )
          })}
        </ul>
      </section>
    </main>
  )
}
