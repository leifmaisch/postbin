"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function createBin() {
    setLoading(true)

    try {
      const response = await fetch("/api/bins", { method: "POST" })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to create bin")
      }

      router.push(`/bin/${data.id}`)
    } catch {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-full w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="mb-10 text-center">
        <h1 className="text-heading-xl">Postbin</h1>
      </div>

      <Card className="surface-panel w-full max-w-lg">
        <CardHeader>
          <CardTitle>Create a bin</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={createBin} disabled={loading} className="w-full" size="lg">
            {loading ? "Creating..." : "Generate"}
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
