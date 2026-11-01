import type { ReactNode } from 'react'
import { Button, TooltipProvider, cn } from '@cometrace/ui'
import { ArrowRight, type LucideIcon } from 'lucide-react'
import type { CatalogEntry } from '../landing/catalog'
import { links } from '../landing/links'
import { Container, SectionTitle, StartOnCloudButton } from '../landing/shared'
import { SiteFooter } from '../landing/site-footer'
import { SiteHeader, type HeaderSection } from '../landing/site-header'

/** Header, skip link, main and footer: what every marketing page shares. */
export function PageShell({ current, children }: { current?: HeaderSection; children: ReactNode }) {
  return (
    <TooltipProvider delayDuration={250}>
      <div className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-3 focus:z-50 focus:rounded-md focus:border focus:border-border focus:bg-card focus:px-3 focus:py-2 focus:text-sm focus:font-semibold"
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
  Icon?: LucideIcon
  eyebrow: string
  title: string
  /** Second line of the title, drawn muted. */
  accent?: string
  lead: string
  /** Shown under the actions: the product glimpse or the diagram. */
  children?: ReactNode
}

/** Same shape as the home hero: one promise, one sentence, two actions. */
export function PageHero({ Icon, eyebrow, title, accent, lead, children }: PageHeroProps) {
  return (
    <section aria-labelledby="page-title" className="pb-20 pt-20 sm:pt-24">
      <Container className="flex flex-col items-center text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          {Icon ? <Icon className="size-3.5 text-primary" aria-hidden="true" /> : null}
          {eyebrow}
        </p>
        <h1
          id="page-title"
          className="mt-6 max-w-[900px] text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.05] tracking-[-0.03em] text-balance"
        >
          {title}
          {accent ? (
            <>
              <br />
              <span className="text-muted-foreground">{accent}</span>
            </>
          ) : null}
        </h1>
        <p className="mt-6 max-w-[620px] text-lg leading-8 text-muted-foreground text-pretty">
          {lead}
        </p>
        <HeroActions className="mt-9" />
      </Container>
      {children ? <Container className="mt-16">{children}</Container> : null}
    </section>
  )
}

export function HeroActions({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center justify-center gap-3', className)}>
      <StartOnCloudButton size="lg" className="px-6">
        Get started for free
      </StartOnCloudButton>
      <Button asChild size="lg" variant="outline" className="px-6 font-semibold">
        <a href={links.docs}>Read the docs</a>
      </Button>
    </div>
  )
}

export interface Capability {
  Icon: LucideIcon
  title: string
  body: string
}

/**
 * What the product does, as a short list. Text only on purpose: the page's
 * diagram is the one visual, so nothing is shown twice.
 */
export function Capabilities({ title, items }: { title: string; items: Capability[] }) {
  return (
    <section aria-labelledby="capabilities-title" className="border-t border-border py-24">
      <Container>
        <SectionTitle id="capabilities-title" title={title} />
        <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ Icon, title: name, body }) => (
            <li key={name} className="flex gap-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card">
                <Icon className="size-4 text-primary" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-[15px] font-semibold">{name}</span>
                <span className="mt-1 block text-sm leading-6 text-muted-foreground">{body}</span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

/** Wraps an interactive diagram with its title and a one-line instruction. */
export function DiagramSection({
  id,
  title,
  description,
  children,
  alt = false,
}: {
  id: string
  title: string
  description: string
  children: ReactNode
  alt?: boolean
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn('scroll-mt-20 border-t border-border py-24', alt && 'bg-section-alt')}
    >
      <Container>
        <SectionTitle id={`${id}-title`} title={title} description={description} />
        <div className="mt-10">{children}</div>
      </Container>
    </section>
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
    <section aria-labelledby={`${id}-title`} className="border-t border-border py-24">
      <Container>
        <SectionTitle id={`${id}-title`} title={title} />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {entries.map(({ href, title: name, summary, Icon }) => (
            <li key={href}>
              <a
                href={href}
                className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
              >
                <Icon className="size-5 text-primary" aria-hidden="true" />
                <span className="mt-4 text-[15px] font-semibold">{name}</span>
                <span className="mt-1 flex-1 text-sm leading-6 text-muted-foreground">
                  {summary}
                </span>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Learn more
                  <ArrowRight
                    className="size-3.5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

/** The last thing on every page: the same two actions as the hero. */
export function CtaBand({ title, body }: { title: string; body: string }) {
  return (
    <section aria-labelledby="cta-title" className="border-t border-border bg-section-alt py-24">
      <Container className="flex flex-col items-center text-center">
        <h2
          id="cta-title"
          className="max-w-[720px] text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em] text-balance"
        >
          {title}
        </h2>
        <p className="mt-4 max-w-[560px] text-base leading-7 text-muted-foreground">{body}</p>
        <HeroActions className="mt-8" />
      </Container>
    </section>
  )
}
