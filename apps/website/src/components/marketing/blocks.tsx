import type { ReactNode } from 'react'
import { TooltipProvider, cn } from '@cometrace/ui'
import type { LucideIcon } from 'lucide-react'
import type { CatalogEntry } from '../landing/catalog'
import { links } from '../landing/links'
import { Frame, Kicker, SectionTitle } from '../landing/shared'
import { SiteFooter } from '../landing/site-footer'
import { SiteHeader, type HeaderSection } from '../landing/site-header'
import { PixelSprite } from '../pixel/pixel-sprite'
import { cometCrab, type Sprite } from '../pixel/sprites'

/** Header, skip link, main and footer: what every marketing page shares. */
export function PageShell({ current, children }: { current?: HeaderSection; children: ReactNode }) {
  return (
    <TooltipProvider delayDuration={250}>
      <div className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-3 focus:z-50 focus:border focus:border-border focus:bg-card focus:px-3 focus:py-2 focus:text-sm focus:font-semibold"
        >
          Skip to content
        </a>
        <SiteHeader current={current} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </div>
    </TooltipProvider>
  )
}

interface PageHeroProps {
  /** The page's pixel sprite, drawn in the eyebrow. */
  sprite?: Sprite
  eyebrow: string
  title: string
  /** Second line of the title, drawn in the accent colour. */
  accent?: string
  lead: string
  /** Shown under the actions: the product glimpse or the diagram. */
  children?: ReactNode
}

/** Same shape as the home hero: one promise, one sentence, two actions. */
export function PageHero({ sprite, eyebrow, title, accent, lead, children }: PageHeroProps) {
  return (
    <section aria-labelledby="page-title" className="border-b border-border">
      <div className="mx-auto max-w-6xl border-x border-border">
        <div className="flex flex-col items-center px-5 pb-20 pt-[clamp(4rem,10vh,6.5rem)] text-center">
          <p className="reveal inline-flex items-center gap-3 border border-border bg-card py-1.5 pl-1.5 pr-3">
            <span className="flex size-7 items-center justify-center bg-primary/10">
              <PixelSprite sprite={sprite ?? cometCrab} className="size-4" />
            </span>
            <span className="font-pixel text-[11px] uppercase tracking-[0.06em] text-accent-text">
              {eyebrow}
            </span>
          </p>
          <h1
            id="page-title"
            className="reveal mt-6 max-w-4xl text-[clamp(2.25rem,5vw,4.25rem)] font-medium leading-[1.03] tracking-[-0.04em]"
            style={{ animationDelay: '0.1s' }}
          >
            {/* One block per line, so text-balance evens out each one on phones. */}
            <span className="block text-balance">{title}</span>
            {accent ? <span className="block text-balance text-accent-text">{accent}</span> : null}
          </h1>
          <p
            className="reveal mt-7 max-w-xl text-pretty text-lg leading-8 text-muted-foreground"
            style={{ animationDelay: '0.2s' }}
          >
            {lead}
          </p>
          <HeroActions className="reveal mt-8" />
        </div>
        {children ? (
          <div className="bg-ink-grid border-t border-border px-3 py-10 sm:px-10 sm:py-14">
            {children}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export function HeroActions({ className }: { className?: string }) {
  return (
    <div
      className={cn('flex flex-wrap items-center justify-center gap-3', className)}
      style={{ animationDelay: '0.3s' }}
    >
      <a
        href={links.startOnCloud}
        className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
      >
        Get started for free
        <span aria-hidden="true">→</span>
      </a>
      <a
        href={links.docs}
        className="inline-flex items-center gap-2 border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:bg-foreground/[0.04]"
      >
        Read the docs
      </a>
    </div>
  )
}

export interface Capability {
  Icon: LucideIcon
  title: string
  body: string
}

/**
 * What the product does, one cell each, in the grid of ferriskey.rs. Text
 * only on purpose: the page's diagram is the one visual.
 */
export function Capabilities({ title, items }: { title: string; items: Capability[] }) {
  return (
    <Frame labelledBy="capabilities-title" innerClassName="overflow-hidden">
      <div className="border-b border-border px-5 py-20 sm:px-8 sm:py-28">
        <SectionTitle id="capabilities-title" kicker="Capabilities" title={title} />
      </div>
      <ul className="-mr-px grid sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ Icon, title: name, body }) => (
          <li
            key={name}
            className="group relative border-b border-r border-border px-6 py-10 transition-colors hover:bg-foreground/[0.03] sm:px-8 sm:py-12"
          >
            <span className="flex size-10 items-center justify-center border border-border bg-primary/10">
              <Icon className="size-[18px] text-accent-text" aria-hidden="true" />
            </span>
            <h3 className="mt-8 text-lg font-medium tracking-[-0.01em]">{name}</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{body}</p>
            <span
              className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
              aria-hidden="true"
            />
          </li>
        ))}
      </ul>
    </Frame>
  )
}

/** Wraps an interactive diagram with its title and a one-line instruction. */
export function DiagramSection({
  id,
  kicker,
  title,
  description,
  children,
  alt = false,
}: {
  id: string
  kicker?: string
  title: string
  description: string
  children: ReactNode
  alt?: boolean
}) {
  return (
    <Frame id={id} labelledBy={`${id}-title`} className={cn(alt && 'bg-surface-tint')}>
      <div className="px-5 py-20 sm:px-8 sm:py-28">
        <SectionTitle id={`${id}-title`} kicker={kicker} title={title} description={description} />
        <div className="mt-12">{children}</div>
      </div>
    </Frame>
  )
}

/** Links to the sibling pages, so a visitor keeps exploring instead of leaving. */
export function ExploreGrid({
  id = 'explore',
  title,
  entries,
}: {
  id?: string
  title: string
  entries: CatalogEntry[]
}) {
  return (
    <Frame labelledBy={`${id}-title`} innerClassName="overflow-hidden">
      <div className="border-b border-border px-5 py-16 sm:px-8 sm:py-20">
        <SectionTitle id={`${id}-title`} kicker="Keep exploring" title={title} />
      </div>
      <ul className="-mr-px grid sm:grid-cols-2 lg:grid-cols-4">
        {entries.map(({ href, title: name, summary, sprite }) => (
          <li key={href} className="border-b border-r border-border">
            <a
              href={href}
              className="group relative flex h-full flex-col px-6 py-10 transition-colors hover:bg-foreground/[0.03]"
            >
              <PixelSprite
                sprite={sprite}
                className="block size-9 transition-transform group-hover:-translate-y-0.5"
              />
              <span className="mt-8 text-[17px] font-medium tracking-[-0.01em]">{name}</span>
              <span className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{summary}</span>
              <span className="mt-6 font-pixel text-[10px] uppercase tracking-[0.08em] text-accent-text">
                Learn more <span aria-hidden="true">→</span>
              </span>
              <span
                className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
                aria-hidden="true"
              />
            </a>
          </li>
        ))}
      </ul>
    </Frame>
  )
}

/** The last thing on every page: the brand surface and the same two actions. */
export function CtaBand({ title, body }: { title: string; body: string }) {
  return (
    <section
      aria-labelledby="cta-title"
      className="relative overflow-hidden border-b border-border"
    >
      <div className="mx-auto max-w-6xl border-x border-border">
        <div className="surface-brand relative px-5 py-24 text-center text-white sm:px-8 sm:py-36">
          <div
            className="bg-pixel-grid pointer-events-none absolute inset-0 opacity-60"
            aria-hidden="true"
          />
          <div className="relative flex flex-col items-center">
            <PixelSprite sprite={cometCrab} className="h-8 w-[52px]" />
            <Kicker className="mt-8 text-white/80">Ready when you are</Kicker>
            <h2
              id="cta-title"
              className="mt-6 max-w-3xl text-balance text-[clamp(2.25rem,5.5vw,4.25rem)] font-medium leading-[1.02] tracking-[-0.04em]"
            >
              {title}
            </h2>
            <p className="mt-8 max-w-xl text-pretty text-lg leading-8 text-white/80">{body}</p>
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              <a
                href={links.startOnCloud}
                className="inline-flex items-center gap-2 bg-white px-6 py-3.5 text-sm font-semibold text-indigo-900 transition-opacity hover:opacity-90"
              >
                Get started for free
                <span aria-hidden="true">→</span>
              </a>
              <a
                href={links.docs}
                className="inline-flex items-center gap-2 border border-white/40 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Read the docs
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
