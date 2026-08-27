import { and, eq, lt } from "drizzle-orm"

import { db } from "@/db"
import { requests } from "@/db/schema"

import { getRetentionCutoff } from "./retention"

const CLEANUP_INTERVAL_MS = 60_000
const lastCleanupAt = new Map<string, number>()

export async function cleanupExpiredRequests(binId?: string) {
  const cutoff = getRetentionCutoff()
  const condition = binId
    ? and(eq(requests.binId, binId), lt(requests.createdAt, cutoff))
    : lt(requests.createdAt, cutoff)

  await db.delete(requests).where(condition)
}

export async function cleanupExpiredRequestsIfDue(binId?: string) {
  const key = binId ?? "__global__"
  const now = Date.now()
  const lastRun = lastCleanupAt.get(key) ?? 0

  if (now - lastRun < CLEANUP_INTERVAL_MS) {
    return
  }

  lastCleanupAt.set(key, now)
  await cleanupExpiredRequests(binId)
}
