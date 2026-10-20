import { useEffect, useState } from 'react'
import { Button, Separator, TooltipProvider } from '@explainer/ui'
import { routes } from '../../lib/routes'
import { searchTermFromPath, suggestRoutes, type Suggestion } from '../../lib/suggest'
import { Container } from '../landing/shared'
import { links } from '../landing/links'
import { SiteFooter } from '../landing/site-footer'
import { SiteHeader } from '../landing/site-header'
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

        <main id="main" className="flex flex-1 items-center">
          <Container className="py-16">
            <div className="mx-auto flex w-full max-w-[560px] flex-col gap-5">
              <PathChip path={path} />

              <h1 className="text-[36px] font-bold leading-[44px] tracking-[-0.02em]">
                Page not found
              </h1>

              <p className="text-[17px] leading-[26px] text-muted-foreground">
                Nothing lives at this address. It may have moved when the docs were reorganised, or
                the link has a typo.
              </p>

              <DocsSearch term={path ? searchTermFromPath(path) : ''} />

              <div className="flex flex-wrap items-center gap-3">
                <Button asChild className="px-5 font-semibold hover:bg-primary-hover">
                  <a href="/">Back to home</a>
                </Button>
                <Button asChild variant="outline" className="px-5 font-semibold">
                  <a href={links.docs}>Open the docs</a>
                </Button>
              </div>

              {suggestions.length > 0 ? (
                <>
                  <Separator />
                  <Suggestions suggestions={suggestions} />
                </>
              ) : null}
            </div>
          </Container>
        </main>

        <SiteFooter />
      </div>
    </TooltipProvider>
  )
}
