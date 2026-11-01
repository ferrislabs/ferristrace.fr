import type { APIRoute } from 'astro'
import { pages } from '../lib/pages'

/** Every indexable page, from the same list the <head> tags come from. */
export const GET: APIRoute = ({ site }) => {
  if (!site) return new Response('PUBLIC_WEBSITE_URL is not set', { status: 500 })
  const lastmod = new Date().toISOString().slice(0, 10)
  const urls = pages
    .map(
      (page) =>
        `  <url><loc>${new URL(page.path, site).href}</loc><lastmod>${lastmod}</lastmod><priority>${page.priority.toFixed(1)}</priority></url>`,
    )
    .join('\n')
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
