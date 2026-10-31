import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parseChangelog, type Release } from './changelog'

const ROOT = new URL('../../../../', import.meta.url)

/** The core repository owns the changelog: it is edited in the PR that makes the change. */
const DEFAULT_SOURCE = 'https://raw.githubusercontent.com/ferrislabs/ferristrace/main/CHANGELOG.md'

/** Set CHANGELOG_SOURCE_URL to "off" to build without touching the network. */
const SOURCE_URL = process.env.CHANGELOG_SOURCE_URL ?? DEFAULT_SOURCE

const FETCH_TIMEOUT_MS = 5000

export type ChangelogOrigin = 'core' | 'snapshot' | 'none'

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
 *      date, so a network failure never empties the page.
 *
 * There is no third tier. CHANGELOG.example.md is the parser's fixture and
 * nothing else: it was once the last resort here, and the page then published
 * releases that never happened. No real changelog means no releases, and the
 * page shows none rather than borrowing invented ones.
 */
export async function readReleases(): Promise<ChangelogSource> {
  const fromCore = await fetchCore()
  if (fromCore) return { releases: parseChangelog(fromCore), origin: 'core' }

  const snapshot = readLocal('CHANGELOG.md')
  if (snapshot) return { releases: parseChangelog(snapshot), origin: 'snapshot' }

  return { releases: [], origin: 'none' }
}
