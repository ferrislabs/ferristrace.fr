import { useCallback, useEffect, useState } from 'react'
import { Button, TooltipProvider } from '@cometrace/ui'
import { ExternalLink, Rss } from 'lucide-react'
import type { Release } from '../../lib/changelog'
import { Container } from '../landing/shared'
import { SiteFooter } from '../landing/site-footer'
import { SiteHeader } from '../landing/site-header'
import { FILTER_TYPES, FilterBar, type FilterType } from './filter-bar'
import { links } from './links'
import { ReleaseArticle } from './release-article'

const PAGE_SIZE = 10

export const LEAD =
  'Every release of Cometrace. Self-hosted and Cloud run the same versions; Cloud workspaces get each release on its publication day.'

interface ChangelogPageProps {
  releases: Release[]
  /** True when CHANGELOG.md was missing and the example fixture was read. */
  isExample?: boolean
}

function isFilterType(value: string | null): value is FilterType {
  return value !== null && (FILTER_TYPES as readonly string[]).includes(value)
}

function visibleReleases(releases: Release[], type: FilterType, breakingOnly: boolean) {
  return releases
    .filter((release) => !breakingOnly || release.breaking.length > 0)
    .map((release) =>
      type === 'all'
        ? release
        : {
            ...release,
            groups: release.groups.filter((group) => group.type.toLowerCase() === type),
          },
    )
    .filter(
      (release) => release.groups.length > 0 || (type === 'all' && release.breaking.length > 0),
    )
}

export function ChangelogPage({ releases, isExample = false }: ChangelogPageProps) {
  const [type, setType] = useState<FilterType>('all')
  const [breakingOnly, setBreakingOnly] = useState(false)
  const [shown, setShown] = useState(PAGE_SIZE)

  // The server cannot read the query string, so the filters start at their
  // defaults and the URL is applied once the page is live.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlType = params.get('type')
    if (isFilterType(urlType)) setType(urlType)
    if (params.get('breaking') === '1') setBreakingOnly(true)
  }, [])

  const syncUrl = useCallback((nextType: FilterType, nextBreaking: boolean) => {
    const params = new URLSearchParams(window.location.search)

    if (nextType === 'all') params.delete('type')
    else params.set('type', nextType)

    if (nextBreaking) params.set('breaking', '1')
    else params.delete('breaking')

    const query = params.toString()
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`,
    )
  }, [])

  const onTypeChange = (next: FilterType) => {
    setType(next)
    setShown(PAGE_SIZE)
    syncUrl(next, breakingOnly)
  }

  const onBreakingChange = (next: boolean) => {
    setBreakingOnly(next)
    setShown(PAGE_SIZE)
    syncUrl(type, next)
  }

  const filtered = visibleReleases(releases, type, breakingOnly)
  const page = filtered.slice(0, shown)
  const remaining = filtered.length - page.length

  // The compare link needs the next version down in the file, not in the
  // filtered view, so it is read from the full list.
  const previousOf = (version: string) => {
    const index = releases.findIndex((release) => release.version === version)
    return index >= 0 ? releases[index + 1]?.version : undefined
  }

  return (
    <TooltipProvider delayDuration={250}>
      <div className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-3 focus:z-50 focus:rounded-md focus:border focus:border-border focus:bg-card focus:px-3 focus:py-2 focus:text-sm focus:font-semibold"
        >
          Skip to content
        </a>

        <SiteHeader current="Changelog" />

        <main id="main" className="flex-1">
          <Container className="max-w-[1040px] pb-20 pt-12">
            <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
              <div>
                <h1 className="text-[40px] font-bold leading-[48px] tracking-[-0.02em]">
                  Changelog
                </h1>
                <p className="mt-3 max-w-[640px] text-[17px] leading-[26px] text-muted-foreground">
                  {LEAD}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button asChild variant="outline" size="sm" className="font-semibold">
                  <a href={links.rss}>
                    <Rss aria-hidden="true" />
                    RSS
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm" className="font-semibold">
                  <a href={`${links.repo}/releases`} target="_blank" rel="noreferrer noopener">
                    <ExternalLink aria-hidden="true" />
                    GitHub releases
                  </a>
                </Button>
              </div>
            </div>

            {isExample ? (
              <p className="mt-6 rounded-md border border-severity-warn-border bg-severity-warn-background px-4 py-3 text-sm text-severity-warn-foreground">
                Example data. No CHANGELOG.md was found at the repository root, so this page is
                rendering CHANGELOG.example.md. Add the real file to replace it.
              </p>
            ) : null}

            <div className="mt-8">
              <FilterBar
                type={type}
                breakingOnly={breakingOnly}
                onTypeChange={onTypeChange}
                onBreakingChange={onBreakingChange}
              />
            </div>

            {page.length === 0 ? (
              <p className="py-12 text-[15px] text-muted-foreground">
                No release matches these filters.
              </p>
            ) : (
              page.map((release, index) => (
                <ReleaseArticle
                  key={release.version}
                  release={release}
                  previousVersion={previousOf(release.version)}
                  isLatest={index === 0 && releases[0]?.version === release.version}
                />
              ))
            )}

            {remaining > 0 ? (
              <div className="pt-8">
                <Button
                  type="button"
                  variant="outline"
                  className="font-semibold"
                  onClick={() => setShown((current) => current + PAGE_SIZE)}
                >
                  Load older releases
                </Button>
              </div>
            ) : null}
          </Container>
        </main>

        <SiteFooter />
      </div>
    </TooltipProvider>
  )
}
