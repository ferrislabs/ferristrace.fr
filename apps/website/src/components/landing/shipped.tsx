import type { Release } from '../../lib/changelog'
import { formatReleaseDate } from '../../lib/changelog'
import { Band, Column } from './frame'
import { H2 } from './ui'
import { links } from './links'

/** One line per release: its summary, else its title, else its first bullet. */
function line(release: Release): string {
  if (release.summary) return release.summary
  if (release.title) return release.title
  return release.groups[0]?.items[0] ?? '—'
}

/**
 * The four most recent releases, read from CHANGELOG.md at build time rather
 * than written here, so this block cannot drift from the changelog page.
 *
 * Nothing to show means no section at all. It used to fall back to four
 * invented lines, which on the front page read as work already shipped. The
 * caller withholds the example fixture, so an empty list is the honest state.
 */
export function Shipped({ releases = [] }: { releases?: Release[] }) {
  const rows = releases.slice(0, 4)
  if (rows.length === 0) return null

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
          {rows.map((release) => (
            <div
              key={release.version}
              className="grid gap-1 border-t border-border py-4 text-[15px] last:border-b md:grid-cols-[120px_110px_1fr] md:gap-5"
            >
              <span className="font-mono">v{release.version}</span>
              <span className="text-sm text-faint-foreground">
                {release.date ? formatReleaseDate(release.date) : null}
              </span>
              <span className="text-muted-foreground">{line(release)}</span>
            </div>
          ))}
        </div>
      </Column>
    </Band>
  )
}
