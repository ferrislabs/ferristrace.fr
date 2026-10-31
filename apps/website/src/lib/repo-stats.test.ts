import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { REPO_SLUG } from '../components/landing/links'
import { readRepoStats } from './repo-stats'

const CACHE = fileURLToPath(
  new URL('../../node_modules/.cache/ferristrace/repo-stats.json', import.meta.url),
)

/** The five calls one build makes, in the order Promise.all fires them. */
function answer(body: unknown, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status: 200, headers })
}

function happyFetch() {
  return vi.fn(async (input: string | URL | Request, _init?: RequestInit) => {
    const url = String(input)
    if (url.endsWith(`/repos/${REPO_SLUG}`)) return answer({ stargazers_count: 1234 })
    if (url.includes('contributors?per_page=1')) {
      return answer([{}], { link: `<...?per_page=1&page=7>; rel="last"` })
    }
    if (url.includes('/commits')) return answer([{}, {}, {}])
    if (url.includes('/releases/latest')) return answer({ tag_name: 'v2.1.0' })
    if (url.includes('contributors?per_page=8')) return answer([{ avatar_url: 'a.png' }])
    throw new Error(`unexpected call: ${url}`)
  })
}

let tmp: string

beforeEach(() => {
  rmSync(CACHE, { force: true })
  tmp = mkdtempSync(join(tmpdir(), 'ferristrace-'))
  delete process.env.GITHUB_TOKEN
  delete process.env.GITHUB_TOKEN_FILE
})

afterEach(() => {
  rmSync(CACHE, { force: true })
  rmSync(tmp, { recursive: true, force: true })
  vi.unstubAllGlobals()
  delete process.env.GITHUB_TOKEN
  delete process.env.GITHUB_TOKEN_FILE
})

describe('readRepoStats', () => {
  it('reads the counts the API answers', async () => {
    vi.stubGlobal('fetch', happyFetch())

    expect(await readRepoStats()).toEqual({
      stars: 1234,
      contributors: 7,
      commitsLastMonth: 3,
      version: '2.1.0',
      avatars: ['a.png'],
    })
  })

  it('sends the token from GITHUB_TOKEN_FILE, which is how the image gets it', async () => {
    const file = join(tmp, 'token')
    writeFileSync(file, 'ghp_secret\n')
    process.env.GITHUB_TOKEN_FILE = file

    const fetched = happyFetch()
    vi.stubGlobal('fetch', fetched)
    await readRepoStats()

    const [, init] = fetched.mock.calls[0]
    expect((init?.headers as Record<string, string>).authorization).toBe('Bearer ghp_secret')
  })

  it('goes out anonymously when no token is configured', async () => {
    const fetched = happyFetch()
    vi.stubGlobal('fetch', fetched)
    await readRepoStats()

    const [, init] = fetched.mock.calls[0]
    expect((init?.headers as Record<string, string>).authorization).toBeUndefined()
  })

  it('caches the answer so a second build spends no quota', async () => {
    const fetched = happyFetch()
    vi.stubGlobal('fetch', fetched)
    await readRepoStats()
    expect(existsSync(CACHE)).toBe(true)

    const calls = fetched.mock.calls.length
    expect(await readRepoStats()).toMatchObject({ stars: 1234 })
    expect(fetched.mock.calls.length).toBe(calls)
  })

  it('ignores a cache written for another repository', async () => {
    writeFileSync(
      CACHE,
      JSON.stringify({ at: Date.now(), slug: 'someone/else', stats: { stars: 9 } }),
    )
    vi.stubGlobal('fetch', happyFetch())

    expect((await readRepoStats()).stars).toBe(1234)
  })

  it('ignores a cache older than its lifetime', async () => {
    const old = Date.now() - 7 * 60 * 60 * 1000
    writeFileSync(CACHE, JSON.stringify({ at: old, slug: REPO_SLUG, stats: { stars: 9 } }))
    vi.stubGlobal('fetch', happyFetch())

    expect((await readRepoStats()).stars).toBe(1234)
  })

  it('falls back to placeholders, and caches nothing, when the quota is spent', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () => new Response('{}', { status: 403, headers: { 'x-ratelimit-remaining': '0' } }),
      ),
    )
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    expect(await readRepoStats()).toEqual({
      stars: undefined,
      contributors: undefined,
      commitsLastMonth: undefined,
      version: undefined,
      avatars: undefined,
    })
    expect(existsSync(CACHE)).toBe(false)
    expect(warn).toHaveBeenCalledOnce()

    warn.mockRestore()
  })

  it('survives the network being down', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('ENOTFOUND')
      }),
    )

    expect((await readRepoStats()).stars).toBeUndefined()
    expect(existsSync(CACHE)).toBe(false)
  })

  it('keeps the slug it cached under, so a rename invalidates the file', async () => {
    vi.stubGlobal('fetch', happyFetch())
    await readRepoStats()

    expect(JSON.parse(readFileSync(CACHE, 'utf8')).slug).toBe(REPO_SLUG)
  })
})
