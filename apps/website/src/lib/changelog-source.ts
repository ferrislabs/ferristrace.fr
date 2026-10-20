import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parseChangelog, type Release } from './changelog'

const ROOT = new URL('../../../../', import.meta.url)

/**
 * Reads the changelog at build time. CHANGELOG.md at the repository root is
 * the source of truth; the example fixture only stands in when that file is
 * absent, and the page says so rather than passing it off as real.
 */
export function readReleases(): { releases: Release[]; isExample: boolean } {
  const real = fileURLToPath(new URL('CHANGELOG.md', ROOT))
  if (existsSync(real)) {
    return { releases: parseChangelog(readFileSync(real, 'utf8')), isExample: false }
  }

  const example = fileURLToPath(new URL('CHANGELOG.example.md', ROOT))
  if (existsSync(example)) {
    return { releases: parseChangelog(readFileSync(example, 'utf8')), isExample: true }
  }

  return { releases: [], isExample: false }
}
