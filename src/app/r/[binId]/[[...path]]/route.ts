import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

import { db } from "@/db"
import { bins, requests } from "@/db/schema"
import { createRequestId } from "@/lib/bin-id"
import {
  getClientIp,
  headersToRecord,
  queryToRecord,
  readRequestBody,
} from "@/lib/request-utils"

type RouteContext = {
  params: Promise<{ binId: string; path?: string[] }>
}

async function handleRequest(request: NextRequest, context: RouteContext) {
  const { binId, path = [] } = await context.params

  const bin = await db.query.bins.findFirst({
    where: eq(bins.id, binId),
  })

  if (!bin) {
    return NextResponse.json({ error: "Bin not found" }, { status: 404 })
  }

  const body = await readRequestBody(request)
  const requestPath = path.length > 0 ? `/${path.join("/")}` : "/"
  const contentType = request.headers.get("content-type")

  const [logged] = await db
    .insert(requests)
    .values({
      id: createRequestId(),
      binId,
      method: request.method,
      path: requestPath,
      query: queryToRecord(request),
      headers: headersToRecord(request),
      body,
      contentType,
      ip: getClientIp(request),
    })
    .returning()

  return NextResponse.json(
    {
      ok: true,
      id: logged.id,
      method: logged.method,
      path: logged.path,
      receivedAt: logged.createdAt,
    },
    { status: 200 },
  )
}

export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const PATCH = handleRequest
export const DELETE = handleRequest
export const HEAD = handleRequest
export const OPTIONS = handleRequest
