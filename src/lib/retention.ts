export const RETENTION_HOURS = 48
export const RETENTION_MS = RETENTION_HOURS * 60 * 60 * 1000

export function getRetentionCutoff() {
  return new Date(Date.now() - RETENTION_MS)
}
