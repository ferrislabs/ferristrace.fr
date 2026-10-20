import { describe, expect, it } from 'vitest'
import { routes } from './routes'
import {
  lastSegment,
  levenshtein,
  searchTermFromPath,
  suggestRoutes,
  tokenize,
  truncateMiddle,
} from './suggest'

describe('suggestRoutes', () => {
  it('puts an exact match first', () => {
    const [first] = suggestRoutes('/changelog', routes)
    expect(first?.path).toBe('/changelog')
    expect(first?.closeness).toBe(1)
  })

  it('recovers from a typo in the last segment', () => {
    const [first] = suggestRoutes('/administration/backups-and-upgrade', routes)
    expect(first?.path).toBe('/administration/backups-and-upgrades')
  })

  it('recovers from a transposition', () => {
    const [first] = suggestRoutes('/getting-started/quickstart-self-hsot', routes)
    expect(first?.path).toBe('/getting-started/quickstart-self-host')
  })

  it('returns nothing when no route is plausible', () => {
    expect(suggestRoutes('/qqqq/zzzzzz', routes)).toEqual([])
  })

  it('returns nothing for the root path, which tokenizes to nothing', () => {
    expect(suggestRoutes('/', routes)).toEqual([])
  })

  it('never returns more than the limit', () => {
    expect(suggestRoutes('/using-cometrace/anything', routes).length).toBeLessThanOrEqual(3)
  })

  it('only ever returns routes from the list it was given', () => {
    const known = new Set(routes.map((route) => route.path))
    for (const suggestion of suggestRoutes('/getting-started/quickstart-self-hsot', routes)) {
      expect(known.has(suggestion.path)).toBe(true)
    }
  })

  it('ranks a route sharing more tokens above a closer tail', () => {
    const candidates = [
      { path: '/docs/deployment/docker', href: '/docs/deployment/docker', title: 'Docker' },
      { path: '/dock', href: '/dock', title: 'Dock' },
    ]
    const [first] = suggestRoutes('/docs/deployment/dockr', candidates)
    expect(first?.path).toBe('/docs/deployment/docker')
  })
})

describe('tokenize', () => {
  it('splits on every slug separator', () => {
    expect(tokenize('/Docs/quickstart-selfhost_v2.md')).toEqual([
      'docs',
      'quickstart',
      'selfhost',
      'v2',
      'md',
    ])
  })
})

describe('lastSegment', () => {
  it('takes the final path segment, ignoring a trailing slash', () => {
    expect(lastSegment('/docs/deployment/docker/')).toBe('docker')
  })

  it('is empty for the root path', () => {
    expect(lastSegment('/')).toBe('')
  })
})

describe('levenshtein', () => {
  it('is zero for identical strings', () => {
    expect(levenshtein('docker', 'docker')).toBe(0)
  })

  it('counts a single substitution', () => {
    expect(levenshtein('docker', 'dockor')).toBe(1)
  })

  it('counts a transposition as two edits', () => {
    expect(levenshtein('host', 'hsot')).toBe(2)
  })

  it('falls back to the other string length when one is empty', () => {
    expect(levenshtein('', 'docs')).toBe(4)
  })
})

describe('searchTermFromPath', () => {
  it('turns the last segment into words', () => {
    expect(searchTermFromPath('/docs/quickstart-selfhost')).toBe('quickstart selfhost')
  })

  it('is empty for the root path', () => {
    expect(searchTermFromPath('/')).toBe('')
  })
})

describe('truncateMiddle', () => {
  it('leaves a short path alone', () => {
    expect(truncateMiddle('/docs/upgrades')).toBe('/docs/upgrades')
  })

  it('drops the middle of a long path and keeps both ends', () => {
    const long = `/docs/${'a'.repeat(60)}/end`
    const result = truncateMiddle(long)
    expect(result).toHaveLength(48)
    expect(result.startsWith('/docs/')).toBe(true)
    expect(result.endsWith('end')).toBe(true)
    expect(result).toContain('…')
  })
})
