import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { routes } from './routes'

const pages = fileURLToPath(new URL('../pages/', import.meta.url))
const docsContent = fileURLToPath(
  new URL('../../../docs/src/content/docs/cometrace/default/en/', import.meta.url),
)

/** "/changelog" -> changelog.astro or changelog/index.astro; "/" -> index.astro. */
function pageExists(path: string): boolean {
  const name = path === '/' ? 'index' : path.replace(/^\//, '').replace(/\/$/, '')
  return existsSync(`${pages}${name}.astro`) || existsSync(`${pages}${name}/index.astro`)
}

function docExists(path: string): boolean {
  return existsSync(`${docsContent}${path.replace(/^\//, '')}.mdx`)
}

describe('routes', () => {
  it('only lists local routes that have a page, so a suggestion cannot 404', () => {
    for (const route of routes.filter((candidate) => candidate.local)) {
      expect(pageExists(route.path), `${route.path} has no page in src/pages`).toBe(true)
    }
  })

  it('only lists docs routes that have an MDX file in apps/docs', () => {
    for (const route of routes.filter((candidate) => !candidate.local)) {
      expect(docExists(route.path), `${route.path} has no MDX file in the docs`).toBe(true)
    }
  })

  it('lists every docs page, so the sidebar and the suggestions cannot drift apart', () => {
    const listed = new Set(routes.filter((route) => !route.local).map((route) => route.path))
    expect(listed.size).toBe(22)
  })

  it('gives every route a title to show in the suggestion list', () => {
    for (const route of routes) {
      expect(route.title.trim().length).toBeGreaterThan(0)
    }
  })

  it('has no duplicate paths', () => {
    const paths = routes.map((route) => route.path)
    expect(new Set(paths).size).toBe(paths.length)
  })

  it('sends docs suggestions to the docs app, not to this one', () => {
    for (const route of routes.filter((candidate) => !candidate.local)) {
      expect(route.href).toContain('/en/cometrace')
    }
  })
})
