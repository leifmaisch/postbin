import { and, desc, eq, gt } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

import { db } from "@/db"
import { bins, requests } from "@/db/schema"

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

  const sinceDate = since ? new Date(since) : null
  const isValidSince = sinceDate && !Number.isNaN(sinceDate.getTime())

  const items = await db.query.requests.findMany({
    where: isValidSince
      ? and(eq(requests.binId, id), gt(requests.createdAt, sinceDate))
      : eq(requests.binId, id),
    orderBy: desc(requests.createdAt),
    limit: 100,
  })

  return NextResponse.json({ requests: items })
}
