/**
 * Reports a 404 so broken links can be found and fixed.
 *
 * The project has no analytics and no server log to write to, so rather than
 * inventing an endpoint this reads PUBLIC_ANALYTICS_URL and does nothing when
 * it is unset. Point it at a collector and reports start flowing.
 *
 * Nothing personal is sent: the pathname without its query string, the
 * referrer reduced to origin and path, and whether the referrer was us.
 */
const ENDPOINT = import.meta.env.PUBLIC_ANALYTICS_URL as string | undefined

export interface NotFoundReport {
  event: 'not_found'
  path: string
  referrer: string | null
  /** True when the broken link is on our own site, so it is ours to fix. */
  internal: boolean
}

export function buildReport(location: URL, referrer: string): NotFoundReport {
  let parsed: URL | null = null
  try {
    parsed = referrer ? new URL(referrer) : null
  } catch {
    parsed = null
  }

  return {
    event: 'not_found',
    path: location.pathname,
    referrer: parsed ? `${parsed.origin}${parsed.pathname}` : null,
    internal: parsed?.host === location.host,
  }
}

export function report404(): void {
  if (!ENDPOINT) return

  const body = JSON.stringify(buildReport(new URL(window.location.href), document.referrer))

  if (navigator.sendBeacon) {
    navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }))
    return
  }

  void fetch(ENDPOINT, {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
  }).catch(() => {
    // A failed report must never surface to the reader.
  })
}
