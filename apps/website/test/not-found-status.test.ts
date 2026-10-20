import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { preview } from 'astro'

/**
 * Lives outside src/pages on purpose: Astro routes every file in there, and
 * would try to build a test as an endpoint.
 *
 * The site is a static build, so the 404 status comes from the host serving
 * 404.html rather than from a route handler. This drives Astro's own preview
 * server, which behaves the way a static host does, and asserts that an
 * unknown URL answers 404 with this page rather than 200 with a soft 404.
 */
const root = fileURLToPath(new URL('../', import.meta.url))
const built = fileURLToPath(new URL('../dist/404.html', import.meta.url))

// A port the repo's dev servers do not use, so the test can never end up
// talking to another app that happens to be running.
const PORT = 4487

let server: Awaited<ReturnType<typeof preview>> | undefined
let origin = ''

beforeAll(async () => {
  if (!existsSync(built)) return

  server = await preview({
    root,
    server: { port: PORT, host: '127.0.0.1' },
    logLevel: 'silent',
  })
  origin = `http://127.0.0.1:${PORT}`
}, 60_000)

afterAll(async () => {
  await server?.stop()
})

describe('404 handling', () => {
  it('has a built 404 page', () => {
    expect(existsSync(built), 'run `pnpm --filter @cometrace/website build` first').toBe(true)
  })

  it('answers an unknown path with status 404', async () => {
    const response = await fetch(`${origin}/this-page-does-not-exist`)
    expect(response.status).toBe(404)
  })

  it('serves the not found page, not a soft 404', async () => {
    const response = await fetch(`${origin}/this-page-does-not-exist`)
    const html = await response.text()

    expect(html).toContain('Page not found')
    expect(html).toContain('name="robots" content="noindex"')
  })

  it('keeps the not found page out of search results', async () => {
    const response = await fetch(`${origin}/404`)
    expect(await response.text()).toContain('content="noindex"')
  })

  it('still answers 200 on a real page', async () => {
    const response = await fetch(`${origin}/changelog/`)
    expect(response.status).toBe(200)
  })
})
