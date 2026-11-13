import { useEffect, useState } from 'react'
import { TooltipProvider } from '@cometrace/ui'
import { routes } from '../../lib/routes'
import { searchTermFromPath, suggestRoutes, type Suggestion } from '../../lib/suggest'
import { Frame } from '../landing/shared'
import { links } from '../landing/links'
import { SiteFooter } from '../landing/site-footer'
import { SiteHeader } from '../landing/site-header'
import { PixelSprite } from '../pixel/pixel-sprite'
import { cometCrab } from '../pixel/sprites'
import { DocsSearch } from './docs-search'
import { PathChip } from './path-chip'
import { report404 } from './report'
import { Suggestions } from './suggestions'

export function NotFoundPage() {
  // The host serves this page for any unknown URL, so the browser's address
  // bar holds the requested path. A static build cannot know it any earlier.
  const [path, setPath] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])

  useEffect(() => {
    const requested = window.location.pathname
    setPath(requested)
    setSuggestions(suggestRoutes(requested, routes))
    report404()
  }, [])

  return (
    <TooltipProvider delayDuration={250}>
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />

        <main id="main" className="flex-1">
          <Frame labelledBy="page-title">
            <div className="bg-ink-grid flex flex-col items-center border-b border-border px-5 pb-10 pt-16 sm:pt-24">
              <div className="reveal relative">
                <PixelSprite
                  sprite={cometCrab}
                  className="absolute -top-2 left-1/2 block h-[clamp(2.5rem,7vw,5rem)] w-[clamp(4rem,11vw,8rem)] -translate-x-1/2 -translate-y-full -rotate-6"
                />
                <p
                  aria-hidden="true"
                  className="select-none font-pixel text-[clamp(6rem,24vw,15rem)] leading-[0.9] tracking-[0.02em] text-accent-text"
                >
                  404
                </p>
                <span
                  className="absolute -right-2 -top-4 font-pixel text-[clamp(1.5rem,4vw,3rem)] leading-none text-accent-text sm:-right-8"
                  aria-hidden="true"
                >
                  ?
                </span>
              </div>
            </div>

            <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 px-5 py-16 text-center sm:py-20">
              <PathChip path={path} />

              <h1
                id="page-title"
                className="text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.035em]"
              >
                Page not found
              </h1>

              <p className="text-pretty text-[15px] leading-7 text-muted-foreground">
                Nothing lives at this address. It may have moved when the docs were reorganised, or
                the link has a typo.
              </p>

              <DocsSearch term={path ? searchTermFromPath(path) : ''} />

              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href="/"
                  className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
                >
                  Back to home
                  <span aria-hidden="true">→</span>
                </a>
                <a
                  href={links.docs}
                  className="inline-flex items-center gap-2 border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:bg-foreground/[0.04]"
                >
                  Open the docs
                </a>
              </div>
            </div>
          </Frame>

          {suggestions.length > 0 ? <Suggestions suggestions={suggestions} /> : null}
        </main>

        <SiteFooter />
      </div>
    </TooltipProvider>
  )
}
