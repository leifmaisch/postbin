import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

import { db } from "@/db"
import { bins } from "@/db/schema"

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params

  const bin = await db.query.bins.findFirst({
    where: eq(bins.id, id),
  })

  if (!bin) {
    return NextResponse.json({ error: "Bin not found" }, { status: 404 })
  }

  return NextResponse.json(bin)
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params

  const result = await db.delete(bins).where(eq(bins.id, id)).returning({ id: bins.id })

  if (result.length === 0) {
    return NextResponse.json({ error: "Bin not found" }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
