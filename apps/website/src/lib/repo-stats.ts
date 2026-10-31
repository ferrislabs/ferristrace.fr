import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { REPO_SLUG } from '../components/landing/links'
import type { RepoStats } from '../components/landing/community'

/**
 * Repository counts for the landing, read once at build time.
 *
 * Every field is optional and every failure is silent: the page renders its
 * placeholders rather than a spinner or a number nobody measured. A build on
 * a machine without network, or against a rate-limited API, still succeeds.
 *
 * Anonymous calls to the GitHub API are capped at 60 an hour for the whole
 * machine, and one build spends five of them, so a handful of rebuilds is
 * enough to exhaust it. Two things keep that from showing:
 *
 *   - answers are cached on disk for CACHE_TTL_MS, so repeated builds of the
 *     same checkout cost nothing;
 *   - a token raises the cap to 5000 an hour. Set GITHUB_TOKEN, or point
 *     GITHUB_TOKEN_FILE at a file holding one — which is how the Dockerfile
 *     reads the BuildKit secret, so the token never becomes a build arg and
 *     never reaches the image's history.
 */
const API = 'https://api.github.com'
const TIMEOUT_MS = 4000
const CACHE_TTL_MS = 6 * 60 * 60 * 1000

const CACHE_FILE = join(
  fileURLToPath(new URL('../../node_modules/.cache/ferristrace/', import.meta.url)),
  'repo-stats.json',
)

interface Cached {
  at: number
  slug: string
  stats: RepoStats
}

function readCache(): RepoStats | undefined {
  try {
    const cached = JSON.parse(readFileSync(CACHE_FILE, 'utf8')) as Cached
    if (cached.slug !== REPO_SLUG) return undefined
    if (Date.now() - cached.at > CACHE_TTL_MS) return undefined
    return cached.stats
  } catch {
    return undefined
  }
}

function writeCache(stats: RepoStats): void {
  try {
    mkdirSync(dirname(CACHE_FILE), { recursive: true })
    const entry: Cached = { at: Date.now(), slug: REPO_SLUG, stats }
    writeFileSync(CACHE_FILE, JSON.stringify(entry))
  } catch {
    // A read-only or missing node_modules only costs the next build a fetch.
  }
}

function token(): string | undefined {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN

  const file = process.env.GITHUB_TOKEN_FILE
  if (!file) return undefined

  try {
    return readFileSync(file, 'utf8').trim() || undefined
  } catch {
    // The secret was not mounted. Fall through to an anonymous call.
    return undefined
  }
}

/**
 * Set when a call comes back 403 with the quota spent, so the build can say
 * why the counts are missing. Reset per call: a build makes one, but a stale
 * flag would blame the quota for the next failure whatever its cause.
 */
let rateLimited = false

async function call(path: string): Promise<Response | undefined> {
  const bearer = token()

  try {
    const response = await fetch(`${API}${path}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        accept: 'application/vnd.github+json',
        'user-agent': 'ferristrace-website',
        ...(bearer ? { authorization: `Bearer ${bearer}` } : {}),
      },
    })

    if (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0') {
      rateLimited = true
      return undefined
    }

    return response.ok ? response : undefined
  } catch {
    return undefined
  }
}

async function get<T>(path: string): Promise<T | undefined> {
  const response = await call(path)
  if (!response) return undefined

  try {
    return (await response.json()) as T
  } catch {
    return undefined
  }
}

/** The Link header's `rel="last"` page number is the contributor count. */
function lastPage(link: string | null): number | undefined {
  const match = link?.match(/[?&]page=(\d+)>;\s*rel="last"/)
  return match ? Number(match[1]) : undefined
}

async function contributorCount(): Promise<number | undefined> {
  // One contributor per page, so the number of pages is the number of people.
  const response = await call(`/repos/${REPO_SLUG}/contributors?per_page=1&anon=1`)
  if (!response) return undefined
  return lastPage(response.headers.get('link')) ?? 1
}

async function fetchStats(): Promise<RepoStats> {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [repo, contributors, commits, release, people] = await Promise.all([
    get<{ stargazers_count: number }>(`/repos/${REPO_SLUG}`),
    contributorCount(),
    get<unknown[]>(`/repos/${REPO_SLUG}/commits?since=${since}&per_page=100`),
    get<{ tag_name: string }>(`/repos/${REPO_SLUG}/releases/latest`),
    get<{ avatar_url: string }[]>(`/repos/${REPO_SLUG}/contributors?per_page=8`),
  ])

  return {
    stars: repo?.stargazers_count,
    contributors,
    commitsLastMonth: commits?.length,
    version: release?.tag_name?.replace(/^v/, ''),
    avatars: people?.map((person) => person.avatar_url),
  }
}

export async function readRepoStats(): Promise<RepoStats> {
  rateLimited = false

  const cached = readCache()
  if (cached) return cached

  const stats = await fetchStats()
  const answered = Object.values(stats).some((value) => value !== undefined)

  if (answered) {
    writeCache(stats)
    return stats
  }

  if (rateLimited) {
    console.warn(
      `[repo-stats] GitHub's anonymous rate limit is spent, so ${REPO_SLUG}'s counts fall back ` +
        'to their placeholders. Set GITHUB_TOKEN to raise the limit to 5000 an hour.',
    )
  }

  // Nothing answered, so nothing is cached: the next build tries again.
  return stats
}
