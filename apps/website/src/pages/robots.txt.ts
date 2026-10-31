import type { APIRoute } from 'astro'

/**
 * Generated rather than dropped in public/, because the Sitemap line has to be
 * an absolute URL and the host is only known at build time. A robots.txt
 * committed with a hard-coded domain would point staging at production.
 *
 * Without `site` the file still answers, minus that line: a crawler finds the
 * sitemap on its own at the usual path, and an absolute URL built on a wrong
 * origin is worse than none.
 */
export const GET: APIRoute = ({ site }) => {
  const lines = ['User-agent: *', 'Allow: /']

  if (site) lines.push('', `Sitemap: ${new URL('/sitemap-index.xml', site).href}`)

  return new Response(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
