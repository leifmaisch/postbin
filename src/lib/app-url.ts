export function getAppUrl() {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "")
  if (configured) {
    return configured
  }

  if (typeof window !== "undefined") {
    return window.location.origin
  }

  return ""
}

export function getBinRequestUrl(binId: string) {
  const base = getAppUrl()
  return base ? `${base}/r/${binId}` : `/r/${binId}`
}
