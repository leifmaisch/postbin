import { NextRequest } from "next/server"

export function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? null
  }

  return request.headers.get("x-real-ip")
}

export function headersToRecord(request: NextRequest) {
  const headers: Record<string, string> = {}

  request.headers.forEach((value, key) => {
    headers[key] = value
  })

  return headers
}

export function queryToRecord(request: NextRequest) {
  const query: Record<string, string | string[]> = {}

  request.nextUrl.searchParams.forEach((value, key) => {
    const existing = query[key]
    if (existing === undefined) {
      query[key] = value
      return
    }

    query[key] = Array.isArray(existing) ? [...existing, value] : [existing, value]
  })

  return query
}

export async function readRequestBody(request: NextRequest) {
  if (request.method === "GET" || request.method === "HEAD") {
    return null
  }

  const contentType = request.headers.get("content-type") ?? ""
  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData()
    const entries: Record<string, string> = {}

    formData.forEach((value, key) => {
      entries[key] = typeof value === "string" ? value : `[file: ${value.name}]`
    })

    return JSON.stringify(entries, null, 2)
  }

  const text = await request.text()
  return text.length > 0 ? text : null
}
