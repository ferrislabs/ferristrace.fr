import { TooltipProvider } from '@cometrace/ui'
import { Editions } from './editions'
import { Features } from './features'
import { Hero } from './hero'
import { Problems } from './problems'
import type { Shot } from './product-shot'
import { Sponsors } from './sponsors'
import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'

interface LandingProps {
  /** Trace view screenshots. Resolved at build time in pages/index.astro. */
  shotLight?: Shot
  shotDark?: Shot
}

export function Landing({ shotLight, shotDark }: LandingProps) {
  return (
    <TooltipProvider delayDuration={250}>
      <div className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-3 focus:z-50 focus:border focus:border-border focus:bg-card focus:px-3 focus:py-2 focus:text-sm focus:font-semibold"
        >
          Skip to content
        </a>

        <SiteHeader />

        <main id="main" className="flex-1">
          <Hero shotLight={shotLight} shotDark={shotDark} />
          <Features />
          <Problems />
          <Editions />
          <Sponsors />
        </main>

        <SiteFooter />
      </div>
    </TooltipProvider>
  )
}
