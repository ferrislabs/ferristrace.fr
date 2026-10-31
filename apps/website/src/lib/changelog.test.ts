import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { formatReleaseDate, parseChangelog, releaseAnchor, type Release } from './changelog'

const fixture = readFileSync(
  fileURLToPath(new URL('../../../../CHANGELOG.example.md', import.meta.url)),
  'utf8',
)

const releases = parseChangelog(fixture)
const byVersion = (version: string): Release => {
  const found = releases.find((release) => release.version === version)
  if (!found) throw new Error(`fixture is missing ${version}`)
  return found
}

describe('parseChangelog', () => {
  it('reads every released version, newest first, and ignores Unreleased', () => {
    expect(releases.map((release) => release.version)).toEqual(['0.9.0', '0.8.2'])
  })

  it('reads the date from the heading', () => {
    expect(byVersion('0.9.0').date).toBe('2026-10-14')
  })

  it('takes the first quote line as the title and the second as the summary', () => {
    const release = byVersion('0.9.0')
    expect(release.title).toBe('Span links and a faster waterfall')
    expect(release.summary).toBe(
      'The trace view now renders links between spans, and large traces open without the stall.',
    )
  })

  it('leaves the summary undefined when only a title is given', () => {
    const release = byVersion('0.8.2')
    expect(release.title).toBe('Retention fixes')
    expect(release.summary).toBeUndefined()
  })

  it('pulls a Breaking bullet out of its section and strips the marker', () => {
    const release = byVersion('0.9.0')
    expect(release.breaking).toEqual([
      '`cmt_key_` ingest keys are rejected. Reissue them as `cmt_ik_` from the workspace settings.',
    ])

    const changed = release.groups.find((group) => group.type === 'Changed')
    expect(changed?.items).toHaveLength(1)
    expect(changed?.items.join()).not.toContain('Breaking:')
  })

  it('keeps groups in Keep a Changelog order', () => {
    expect(byVersion('0.9.0').groups.map((group) => group.type)).toEqual([
      'Added',
      'Changed',
      'Fixed',
      'Security',
    ])
  })

  it('skips sections that have no items left', () => {
    for (const release of releases) {
      for (const group of release.groups) {
        expect(group.items.length).toBeGreaterThan(0)
      }
    }
    expect(byVersion('0.8.2').groups.map((group) => group.type)).toEqual(['Fixed'])
  })

  it('keeps bullet text verbatim, inline markdown included', () => {
    const added = byVersion('0.9.0').groups.find((group) => group.type === 'Added')
    expect(added?.items[0]).toBe(
      'Span links, rendered in the side panel under `LINKS` with the linked trace id.',
    )
  })

  it('returns nothing for a file with no released versions', () => {
    expect(parseChangelog('# Changelog\n\n## [Unreleased]\n\n### Added\n\n- soon\n')).toEqual([])
  })

  it('tolerates a heading without brackets', () => {
    const parsed = parseChangelog('## 1.0.0 - 2026-01-02\n\n### Fixed\n\n- a thing\n')
    expect(parsed).toHaveLength(1)
    expect(parsed[0].version).toBe('1.0.0')
  })

  it('keeps a release whose heading carries no date', () => {
    const parsed = parseChangelog('## [1.0.0]\n\n### Fixed\n\n- a thing\n')
    expect(parsed).toHaveLength(1)
    expect(parsed[0].version).toBe('1.0.0')
    expect(parsed[0].date).toBeUndefined()
  })

  it('drops the v a tag-shaped heading carries', () => {
    const parsed = parseChangelog('## [v1.0.0] - 2026-01-02\n\n### Fixed\n\n- a thing\n')
    expect(parsed[0].version).toBe('1.0.0')
  })

  it('still ignores Unreleased, which has no version to read', () => {
    const parsed = parseChangelog(
      '## [Unreleased]\n\n### Added\n\n- soon\n\n## [1.0.0] - 2026-01-02\n\n### Fixed\n\n- a thing\n',
    )
    expect(parsed.map((release) => release.version)).toEqual(['1.0.0'])
  })
})

describe('formatReleaseDate', () => {
  it('formats an ISO date in long US form, in UTC', () => {
    expect(formatReleaseDate('2026-10-14')).toBe('October 14, 2026')
  })

  it('returns the input unchanged when it is not a date', () => {
    expect(formatReleaseDate('not-a-date')).toBe('not-a-date')
  })
})

describe('releaseAnchor', () => {
  it('builds the anchor used by /changelog#v0-9-0', () => {
    expect(releaseAnchor('0.9.0')).toBe('v0-9-0')
  })
})
