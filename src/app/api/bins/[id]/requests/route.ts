import { and, desc, eq, gte } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

import { db } from "@/db"
import { bins, requests } from "@/db/schema"
import { cleanupExpiredRequestsIfDue } from "@/lib/cleanup"
import { getRetentionCutoff } from "@/lib/retention"

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params
  const since = request.nextUrl.searchParams.get("since")

  const bin = await db.query.bins.findFirst({
    where: eq(bins.id, id),
  })

  if (!bin) {
    return NextResponse.json({ error: "Bin not found" }, { status: 404 })
  }

  await cleanupExpiredRequestsIfDue(id)

  const retentionCutoff = getRetentionCutoff()
  const sinceDate = since ? new Date(since) : null
  const isValidSince = sinceDate && !Number.isNaN(sinceDate.getTime())
  const effectiveSince =
    isValidSince && sinceDate > retentionCutoff ? sinceDate : retentionCutoff

  const items = await db.query.requests.findMany({
    where: and(eq(requests.binId, id), gte(requests.createdAt, effectiveSince)),
    orderBy: desc(requests.createdAt),
    limit: 100,
  })

  return NextResponse.json({ requests: items })
}
