"use client"

import { Copy } from "lucide-react"
import Link from "next/link"
import { use, useCallback, useEffect, useMemo, useRef, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code } from "@/components/ui/code"
import { EmptyState } from "@/components/ui/empty-state"
import { Separator } from "@/components/ui/separator"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getBinRequestUrl } from "@/lib/app-url"

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
  const titleId = `request-${request.id}-title`

  return (
    <article aria-labelledby={titleId}>
      <Card className="surface-panel">
        <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
          <div className="flex min-w-0 items-center gap-3">
            <Badge variant={methodColors[request.method] ?? "outline"} aria-hidden="true">
              {request.method}
            </Badge>
            <CardTitle id={titleId} className="text-heading truncate font-mono">
              <span className="sr-only">{request.method} request to </span>
              {request.path}
            </CardTitle>
          </div>
          <time className="text-caption shrink-0" dateTime={request.createdAt}>
            {formatTime(request.createdAt)}
          </time>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="body">
            <TabsList aria-label={`${request.method} ${request.path} details`}>
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
    </article>
  )
}

export default function BinPage({ params }: PageProps<"/bin/[id]">) {
  const { id } = use(params)
  const [requests, setRequests] = useState<RequestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(POLL_INTERVAL_SEC)
  const [announcement, setAnnouncement] = useState("")
  const [reduceMotion, setReduceMotion] = useState(false)
  const previousCountRef = useRef(0)
  const hasLoadedRef = useRef(false)

  const requestUrl = useMemo(() => getBinRequestUrl(id), [id])

  const fetchRequests = useCallback(async () => {
    const response = await fetch(`/api/bins/${id}/requests`)
    if (!response.ok) {
      setLoading(false)
      return
    }

    const data = await response.json()
    const count = data.requests.length

    if (hasLoadedRef.current && count > previousCountRef.current) {
      const diff = count - previousCountRef.current
      setAnnouncement(`${diff} new request${diff === 1 ? "" : "s"} received`)
    }

    hasLoadedRef.current = true
    previousCountRef.current = count
    setRequests(data.requests)
    setLoading(false)
  }, [id])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateMotionPreference = () => setReduceMotion(mediaQuery.matches)

    updateMotionPreference()
    mediaQuery.addEventListener("change", updateMotionPreference)

    return () => mediaQuery.removeEventListener("change", updateMotionPreference)
  }, [])

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

  useEffect(() => {
    if (!announcement) {
      return
    }

    const timeout = window.setTimeout(() => setAnnouncement(""), 3000)
    return () => window.clearTimeout(timeout)
  }, [announcement])

  async function copyUrl() {
    await navigator.clipboard.writeText(requestUrl)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <main
      id="main-content"
      className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-10"
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <nav aria-label="Breadcrumb">
            <Link href="/" className="text-caption hover:text-foreground">
              Postbin
            </Link>
          </nav>
          <h1 className="text-heading-xl mt-2">Bin {id}</h1>
          <div className="mt-3">
            <StatusIndicator
              status="online"
              label="Listening for requests"
              pulse={!reduceMotion}
            />
          </div>
        </div>
        <Badge
          variant="outline"
          className="tabular-nums"
          aria-label={`Refreshing in ${secondsLeft} seconds`}
        >
          <span aria-hidden="true">{secondsLeft}s</span>
        </Badge>
      </header>

      <Card className="surface-panel" aria-labelledby="request-url-title">
        <CardHeader>
          <CardTitle id="request-url-title">Request URL</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <code
            id="request-url-value"
            className="bg-muted flex-1 rounded-squircle-md px-4 py-3 font-mono text-sm break-all"
          >
            {requestUrl}
          </code>
          <Button
            variant="outline"
            onClick={copyUrl}
            aria-label={copied ? "Copied request URL" : "Copy request URL"}
            aria-describedby="request-url-value"
          >
            <Copy className="size-4" aria-hidden="true" />
            {copied ? "Copied" : "Copy"}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <section aria-labelledby="requests-heading" aria-busy={loading}>
        <div className="mb-4 flex items-center justify-between">
          <h2 id="requests-heading" className="text-heading-lg">
            Requests
          </h2>
          <Badge variant="secondary" aria-label={`${requests.length} requests`}>
            {requests.length}
          </Badge>
        </div>

        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {announcement}
        </p>

        {loading ? (
          <p className="text-description" role="status">
            Loading requests...
          </p>
        ) : requests.length === 0 ? (
          <EmptyState
            title="No requests yet"
            description="Send a request to your URL and it will show up here automatically."
          />
        ) : (
          <ol className="space-y-4" aria-label="Received requests">
            {requests.map((request) => (
              <li key={request.id}>
                <RequestPanel request={request} />
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  )
}
