"use client"

import { Copy } from "lucide-react"
import Link from "next/link"
import { use, useCallback, useEffect, useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code } from "@/components/ui/code"
import { EmptyState } from "@/components/ui/empty-state"
import { Separator } from "@/components/ui/separator"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type RequestItem = {
  id: string
  binId: string
  method: string
  path: string
  query: Record<string, string | string[]>
  headers: Record<string, string>
  body: string | null
  contentType: string | null
  ip: string | null
  createdAt: string
}

const POLL_INTERVAL_MS = 3000
const POLL_INTERVAL_SEC = POLL_INTERVAL_MS / 1000

const methodColors: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  GET: "secondary",
  POST: "default",
  PUT: "outline",
  PATCH: "outline",
  DELETE: "destructive",
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(value))
}

function RequestPanel({ request }: { request: RequestItem }) {
  const queryJson = JSON.stringify(request.query, null, 2)
  const headersJson = JSON.stringify(request.headers, null, 2)

  return (
    <Card className="surface-panel">
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
        <div className="flex items-center gap-3">
          <Badge variant={methodColors[request.method] ?? "outline"}>{request.method}</Badge>
          <CardTitle className="text-heading font-mono">{request.path}</CardTitle>
        </div>
        <span className="text-caption">{formatTime(request.createdAt)}</span>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="body">
          <TabsList>
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="query">Query</TabsTrigger>
          </TabsList>
          <TabsContent value="body">
            {request.body ? (
              <Code code={request.body} language="json" />
            ) : (
              <p className="text-description">No body</p>
            )}
          </TabsContent>
          <TabsContent value="headers">
            <Code code={headersJson} language="json" />
          </TabsContent>
          <TabsContent value="query">
            <Code code={queryJson} language="json" />
          </TabsContent>
        </Tabs>
        {request.ip ? <p className="text-caption">From {request.ip}</p> : null}
      </CardContent>
    </Card>
  )
}

export default function BinPage({ params }: PageProps<"/bin/[id]">) {
  const { id } = use(params)
  const [requests, setRequests] = useState<RequestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(POLL_INTERVAL_SEC)

  const requestUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return `/r/${id}`
    }

    return `${window.location.origin}/r/${id}`
  }, [id])

  const fetchRequests = useCallback(async () => {
    const response = await fetch(`/api/bins/${id}/requests`)
    if (!response.ok) {
      return
    }

    const data = await response.json()
    setRequests(data.requests)
    setLoading(false)
  }, [id])

  useEffect(() => {
    fetchRequests()

    const countdown = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          fetchRequests()
          return POLL_INTERVAL_SEC
        }

        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(countdown)
  }, [fetchRequests])

  async function copyUrl() {
    await navigator.clipboard.writeText(requestUrl)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/" className="text-caption hover:text-foreground">
            Postbin
          </Link>
          <h1 className="text-heading-xl mt-2">Bin {id}</h1>
          <div className="mt-3">
            <StatusIndicator status="online" label="Listening for requests" pulse />
          </div>
        </div>
        <Badge variant="outline" className="tabular-nums">
          {secondsLeft}s
        </Badge>
      </div>

      <Card className="surface-panel">
        <CardHeader>
          <CardTitle>Request URL</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <code className="bg-muted flex-1 rounded-squircle-md px-4 py-3 font-mono text-sm break-all">
            {requestUrl}
          </code>
          <Button variant="outline" onClick={copyUrl}>
            <Copy className="size-4" />
            {copied ? "Copied" : "Copy"}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-heading-lg">Requests</h2>
          <Badge variant="secondary">{requests.length}</Badge>
        </div>

        {loading ? (
          <p className="text-description">Loading requests...</p>
        ) : requests.length === 0 ? (
          <EmptyState
            title="No requests yet"
            description="Send a request to your URL and it will show up here automatically."
          />
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <RequestPanel key={request.id} request={request} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
