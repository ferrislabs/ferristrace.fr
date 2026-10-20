import type { Route } from './routes'

/** Path pieces are split on every separator a URL slug uses. */
const SEPARATORS = /[/\-_.]+/

export function tokenize(path: string): string[] {
  return path.toLowerCase().split(SEPARATORS).filter(Boolean)
}

export function lastSegment(path: string): string {
  const segments = path.toLowerCase().split('/').filter(Boolean)
  return segments[segments.length - 1] ?? ''
}

/** Classic iterative Levenshtein, two rows wide. */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length

  let previous = Array.from({ length: b.length + 1 }, (_, i) => i)

  for (let i = 1; i <= a.length; i++) {
    const current = [i]
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + cost)
    }
    previous = current
  }

  return previous[b.length]
}

/** 1 when identical, 0 when nothing in common. */
function similarity(a: string, b: string): number {
  const longest = Math.max(a.length, b.length)
  if (longest === 0) return 1
  return 1 - levenshtein(a, b) / longest
}

export interface Suggestion extends Route {
  shared: number
  closeness: number
}

/**
 * How close the last segment has to be, on its own, for a route to survive
 * when it shares no token with the request. Tuned so a one or two character
 * typo still matches and an unrelated path matches nothing.
 */
const CLOSENESS_THRESHOLD = 0.6

/**
 * Ranks routes against a requested path: first by how many tokens they share,
 * then by how close the last segments are. Returns nothing when no route is
 * plausible, so the caller can hide the block rather than guess.
 */
export function suggestRoutes(
  requested: string,
  candidates: Route[] = [],
  limit = 3,
): Suggestion[] {
  const requestedTokens = tokenize(requested)
  if (requestedTokens.length === 0) return []

  const requestedTail = lastSegment(requested)

  return candidates
    .map((route) => {
      const routeTokens = new Set(tokenize(route.path))
      const shared = requestedTokens.filter((token) => routeTokens.has(token)).length

      return {
        ...route,
        shared,
        closeness: similarity(requestedTail, lastSegment(route.path)),
      }
    })
    .filter(
      (candidate) =>
        // A shared token is only meaningful if it is not the whole of a very
        // short path: "/" tokenizes to nothing and can never match this way.
        candidate.shared > 0 || candidate.closeness >= CLOSENESS_THRESHOLD,
    )
    .sort((a, b) => b.shared - a.shared || b.closeness - a.closeness)
    .slice(0, limit)
}

/**
 * "/docs/quickstart-selfhost" -> "quickstart selfhost", for prefilling the
 * docs search with something the reader actually typed.
 */
export function searchTermFromPath(path: string): string {
  const tail = lastSegment(path)
  return tail.split(SEPARATORS).filter(Boolean).join(' ')
}

/** Keeps both ends of a long path visible, dropping the middle. */
export function truncateMiddle(value: string, max = 48): string {
  if (value.length <= max) return value

  const keep = max - 1
  const head = Math.ceil(keep / 2)
  const tail = Math.floor(keep / 2)
  return `${value.slice(0, head)}…${value.slice(value.length - tail)}`
}
