import type { Release } from '../../lib/changelog'
import { ColumnRails } from './frame'
import { Community, type RepoStats } from './community'
import { Faq } from './faq'
import { Hero } from './hero'
import { Ingest } from './ingest'
import { Logos } from './logos'
import { Modules } from './modules'
import { Shipped } from './shipped'
import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'
import { Where } from './where'
import { Why } from './why'
import type { Shot } from './shot'

interface LandingProps {
  /** Trace view screenshots, resolved at build time in pages/index.astro. */
  shotLight?: Shot
  shotDark?: Shot
  /** Repository counts, read at build time. Missing values stay placeholders. */
  stats?: RepoStats
  /**
   * Parsed CHANGELOG.md. The four most recent entries fill "Recently shipped",
   * and an empty list drops the section: the caller passes nothing rather than
   * the example fixture, so the page never presents made-up releases.
   */
  releases?: Release[]
}

export function Landing({ shotLight, shotDark, stats, releases }: LandingProps) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-3 focus:z-50 focus:rounded-[2px] focus:border focus:border-border focus:bg-card focus:px-3 focus:py-2 focus:text-sm focus:font-semibold"
      >
        Skip to content
      </a>

      {/* Drawn once for the whole page, over the band grounds. */}
      <ColumnRails />

      <SiteHeader stars={stats?.stars} />

      <main id="main" className="flex-1">
        <Hero stars={stats?.stars} version={stats?.version} />
        <Why />
        <Logos />
        <Ingest />
        <Modules shotLight={shotLight} shotDark={shotDark} />
        <Shipped releases={releases} />
        <Where />
        <Faq />
        <Community stats={stats} />
      </main>

      <SiteFooter />
    </div>
  )
}
