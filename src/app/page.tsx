"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      className="mx-auto flex min-h-full w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-16"
    >
      <div className="mb-10 text-center">
        <h1 className="text-heading-xl">Postbin</h1>
      </div>

      <Card className="surface-panel w-full max-w-lg" aria-labelledby="create-bin-title">
        <CardHeader>
          <CardTitle id="create-bin-title">Create a bin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={createBin}
            disabled={loading}
            className="w-full"
            size="lg"
            aria-busy={loading}
          >
            {loading ? "Creating..." : "Generate"}
          </Button>
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </main>
  )
}
