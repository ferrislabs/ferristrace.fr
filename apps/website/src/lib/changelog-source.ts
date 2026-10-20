import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parseChangelog, type Release } from './changelog'

const ROOT = new URL('../../../../', import.meta.url)

/** The core repository owns the changelog: it is edited in the PR that makes the change. */
const DEFAULT_SOURCE = 'https://raw.githubusercontent.com/Comettrace/Cometrace/main/CHANGELOG.md'

/** Set CHANGELOG_SOURCE_URL to "off" to build without touching the network. */
const SOURCE_URL = process.env.CHANGELOG_SOURCE_URL ?? DEFAULT_SOURCE

const FETCH_TIMEOUT_MS = 5000

export type ChangelogOrigin = 'core' | 'snapshot' | 'example' | 'none'

export interface ChangelogSource {
  releases: Release[]
  origin: ChangelogOrigin
}

function readLocal(name: string): string | null {
  const path = fileURLToPath(new URL(name, ROOT))
  return existsSync(path) ? readFileSync(path, 'utf8') : null
}

async function fetchCore(): Promise<string | null> {
  if (!SOURCE_URL || SOURCE_URL === 'off') return null

  try {
    const response = await fetch(SOURCE_URL, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
    if (!response.ok) return null
    return await response.text()
  } catch {
    // Offline, rate limited, or the file is not there yet. The snapshot below
    // keeps the page showing the last releases we know about.
    return null
  }
}

/**
 * Resolves the changelog at build time, newest source first:
 *
 *   1. the core repository, so a release shows up on the next build;
 *   2. CHANGELOG.md committed here, the snapshot the sync workflow keeps up to
 *      date, so a network failure never empties the page;
 *   3. CHANGELOG.example.md, which the page labels as an example.
 *
 * A failed fetch is never fatal, and never silently produces an empty page:
 * the caller gets the origin and says so when it is only the example.
 */
export async function readReleases(): Promise<ChangelogSource> {
  const fromCore = await fetchCore()
  if (fromCore) return { releases: parseChangelog(fromCore), origin: 'core' }

  const snapshot = readLocal('CHANGELOG.md')
  if (snapshot) return { releases: parseChangelog(snapshot), origin: 'snapshot' }

  const example = readLocal('CHANGELOG.example.md')
  if (example) return { releases: parseChangelog(example), origin: 'example' }

  return { releases: [], origin: 'none' }
}
