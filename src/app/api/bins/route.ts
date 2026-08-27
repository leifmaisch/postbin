import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

import { db } from "@/db"
import { bins } from "@/db/schema"
import { createBinId } from "@/lib/bin-id"

export async function POST() {
  const id = createBinId()

  await db.insert(bins).values({ id })

  return NextResponse.json({ id })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  const bin = await db.query.bins.findFirst({
    where: eq(bins.id, id),
  })

  if (!bin) {
    return NextResponse.json({ error: "Bin not found" }, { status: 404 })
  }

  return NextResponse.json(bin)
}
