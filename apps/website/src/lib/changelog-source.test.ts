import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import type { ChangelogSource } from './changelog-source'

const SNAPSHOT = fileURLToPath(new URL('../../../../CHANGELOG.md', import.meta.url))
const EXAMPLE = fileURLToPath(new URL('../../../../CHANGELOG.example.md', import.meta.url))

/**
 * The module reads CHANGELOG_SOURCE_URL once, at import, so each case sets the
 * variable and then imports a fresh copy.
 */
async function load(sourceUrl: string): Promise<ChangelogSource> {
  process.env.CHANGELOG_SOURCE_URL = sourceUrl
  const module = (await import(`./changelog-source?case=${encodeURIComponent(sourceUrl)}`)) as {
    readReleases: () => Promise<ChangelogSource>
  }
  return module.readReleases()
}

const hadSnapshot = existsSync(SNAPSHOT)

afterEach(() => {
  if (!hadSnapshot && existsSync(SNAPSHOT)) rmSync(SNAPSHOT)
  delete process.env.CHANGELOG_SOURCE_URL
})

describe('readReleases', () => {
  it('falls back to the example when the core cannot be reached and no snapshot exists', async () => {
    if (hadSnapshot) return
    const { origin, releases } = await load('off')
    expect(origin).toBe('example')
    expect(releases.length).toBeGreaterThan(0)
  })

  it('prefers the committed snapshot over the example', async () => {
    writeFileSync(
      SNAPSHOT,
      ['## [1.2.3] - 2026-01-02', '', '### Fixed', '', '- a real release', ''].join('\n'),
    )

    const { origin, releases } = await load('off')
    expect(origin).toBe('snapshot')
    expect(releases.map((release) => release.version)).toEqual(['1.2.3'])
  })

  it('never reports the example as real data', async () => {
    if (hadSnapshot) return
    const { origin } = await load('off')
    expect(origin).not.toBe('core')
    expect(origin).not.toBe('snapshot')
  })

  it('reads the core when the fetch succeeds', async () => {
    // A data: URL stands in for the core repository, so the test never needs
    // the network to prove the first branch is taken.
    const body = ['## [9.9.9] - 2026-03-04', '', '### Added', '', '- from the core', ''].join('\n')
    const { origin, releases } = await load(
      `data:text/plain;base64,${Buffer.from(body).toString('base64')}`,
    )

    expect(origin).toBe('core')
    expect(releases.map((release) => release.version)).toEqual(['9.9.9'])
  })

  it('keeps the example fixture parseable, since it is the last resort', () => {
    expect(readFileSync(EXAMPLE, 'utf8')).toContain('## [0.9.0]')
  })
})
