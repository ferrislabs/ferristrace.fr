import type { Release } from '../../lib/changelog'
import { formatReleaseDate } from '../../lib/changelog'
import { Band, Column } from './frame'
import { H2 } from './ui'
import { links } from './links'

/**
 * The four most recent releases, read from CHANGELOG.md at build time rather
 * than written here, so this block cannot drift from the changelog page.
 * Without the file it shows the placeholders the brief asks for.
 */
const PLACEHOLDERS = [
  'Issues: exceptions grouped by fingerprint, with the release that introduced them.',
  'Releases: deploy markers on every chart, error rate before and after.',
  'Status page on your own domain, fed by your alerts.',
  'Single image: ingest, storage and UI in one container, one volume.',
]

/** One line per release: its summary, else its title, else its first bullet. */
function line(release: Release): string {
  if (release.summary) return release.summary
  if (release.title) return release.title
  return release.groups[0]?.items[0] ?? '—'
}

export function Shipped({ releases = [] }: { releases?: Release[] }) {
  const rows = releases.slice(0, 4)
  const empty = rows.length === 0

  return (
    <Band labelledBy="shipped-title">
      <Column className="py-[88px]">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <H2 id="shipped-title">Recently shipped</H2>
          <a
            href={links.changelog}
            className="text-sm font-semibold text-accent-text hover:underline"
          >
            Full changelog &rarr;
          </a>
        </div>

        <div className="mt-7">
          {(empty ? PLACEHOLDERS : rows).map((entry, index) => {
            const release = empty ? undefined : (entry as Release)
            const text = empty ? (entry as string) : line(entry as Release)

            return (
              <div
                key={release?.version ?? index}
                className="grid gap-1 border-t border-border py-4 text-[15px] last:border-b md:grid-cols-[120px_110px_1fr] md:gap-5"
              >
                <span className="font-mono">
                  {release ? `v${release.version}` : 'v[X.Y.Z]'}
                </span>
                <span className="text-sm text-faint-foreground">
                  {release?.date ? formatReleaseDate(release.date) : '[DATE]'}
                </span>
                <span className="text-muted-foreground">{text}</span>
              </div>
            )
          })}
        </div>
      </Column>
    </Band>
  )
}
