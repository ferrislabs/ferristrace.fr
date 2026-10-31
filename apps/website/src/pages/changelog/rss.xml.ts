import type { APIRoute } from 'astro'
import { releaseAnchor } from '../../lib/changelog'
import { readReleases } from '../../lib/changelog-source'

const TITLE = 'Ferristrace changelog'
const DESCRIPTION =
  'Every release of Ferristrace. Each version is tagged in the repository and published as a container image the same day.'

const rfc822 = (iso: string) => new Date(`${iso}T00:00:00Z`).toUTCString()

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

/**
 * RSS requires absolute URLs: a relative <link>, or a <guid isPermaLink="true">
 * that is only a path, is not a feed a reader can follow. `site` comes from
 * PUBLIC_WEBSITE_URL, so a production build without it would ship a broken
 * feed in silence. It refuses instead, the way the docs links do.
 */
function feedOrigin(site: URL | undefined): URL {
  if (site) return site

  if (import.meta.env.PROD) {
    throw new Error(
      'PUBLIC_WEBSITE_URL is not set. Every link and guid in the changelog feed ' +
        'would be a relative path, which RSS does not allow. Set it in .env or in the host.',
    )
  }

  return new URL('http://localhost:4323')
}

export const GET: APIRoute = async ({ site }) => {
  const origin = feedOrigin(site)
  const channelLink = new URL('/changelog', origin).href
  const feedLink = new URL('/changelog/rss.xml', origin).href
  const { releases } = await readReleases()

  const items = releases
    .map((release) => {
      const tag = `v${release.version}`
      const link = `${channelLink}#${releaseAnchor(release.version)}`
      const title = release.title ? `${tag} — ${release.title}` : tag
      const body = [release.summary, ...release.breaking.map((item) => `Breaking: ${item}`)]
        .filter(Boolean)
        .join('\n\n')

      return [
        '    <item>',
        `      <title>${escapeXml(title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        // A release heading may carry no date, and an Invalid Date in a
        // pubDate is worse than no pubDate at all.
        ...(release.date ? [`      <pubDate>${rfc822(release.date)}</pubDate>`] : []),
        `      <description>${escapeXml(body)}</description>`,
        '    </item>',
      ].join('\n')
    })
    .join('\n')

  // The newest release, not the build clock: a rebuild that changed nothing
  // should not tell every reader the feed moved.
  const lastChanged = releases.find((release) => release.date)?.date

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(TITLE)}</title>`,
    `    <link>${escapeXml(channelLink)}</link>`,
    `    <atom:link href="${escapeXml(feedLink)}" rel="self" type="application/rss+xml"/>`,
    `    <description>${escapeXml(DESCRIPTION)}</description>`,
    '    <language>en</language>',
    lastChanged ? `    <lastBuildDate>${rfc822(lastChanged)}</lastBuildDate>` : '',
    items,
    '  </channel>',
    '</rss>',
  ]
    .filter((line) => line !== '')
    .join('\n')

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
