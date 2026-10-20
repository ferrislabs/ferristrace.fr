import type { APIRoute } from 'astro'
import { releaseAnchor } from '../../lib/changelog'
import { readReleases } from '../../lib/changelog-source'

const TITLE = 'Cometrace changelog'
const DESCRIPTION =
  'Every release of Cometrace. Self-hosted and Cloud run the same versions; Cloud workspaces get each release on its publication day.'

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

export const GET: APIRoute = async ({ site }) => {
  const origin = site?.origin ?? ''
  const channelLink = `${origin}/changelog`
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
        `      <pubDate>${new Date(`${release.date}T00:00:00Z`).toUTCString()}</pubDate>`,
        `      <description>${escapeXml(body)}</description>`,
        '    </item>',
      ].join('\n')
    })
    .join('\n')

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    `    <title>${escapeXml(TITLE)}</title>`,
    `    <link>${escapeXml(channelLink)}</link>`,
    `    <description>${escapeXml(DESCRIPTION)}</description>`,
    '    <language>en</language>',
    items,
    '  </channel>',
    '</rss>',
  ]
    .filter((line) => line !== '')
    .join('\n')

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
