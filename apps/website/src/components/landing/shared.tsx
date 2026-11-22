import type { ReactNode } from 'react'
import { Button, cn } from '@cometrace/ui'
import { links } from './links'

/** The 72 rem column every section is built on, with the side gutter. */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('mx-auto w-full max-w-6xl px-5 sm:px-8', className)}>{children}</div>
}

/**
 * One band of the page: a full-width rule under it and the bordered column in
 * the middle, so the sections stack into the same grid as ferrislabs.fr.
 */
export function Frame({
  id,
  labelledBy,
  className,
  innerClassName,
  children,
}: {
  id?: string
  labelledBy?: string
  className?: string
  innerClassName?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn('scroll-mt-12 border-b border-border', className)}
    >
      <div className={cn('relative mx-auto max-w-6xl border-x border-border', innerClassName)}>
        {children}
      </div>
    </section>
  )
}

/** The small bitmap label above a title. */
export function Kicker({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <p
      className={cn(
        'font-pixel text-[11px] uppercase tracking-[0.08em] text-accent-text',
        className,
      )}
    >
      {children}
    </p>
  )
}

export function SectionTitle({
  id,
  kicker,
  title,
  description,
  className,
}: {
  id?: string
  kicker?: string
  title: string
  description?: string
  className?: string
}) {
  return (
    <div className={cn('max-w-2xl', className)}>
      {kicker ? <Kicker className="mb-6">{kicker}</Kicker> : null}
      <h2
        id={id}
        className="text-balance text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.035em]"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-6 max-w-xl text-pretty text-[15px] leading-7 text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}

/**
 * The single primary action of the page, repeated as-is in the header, the
 * hero and the cloud card.
 */
export function StartOnCloudButton({
  size = 'default',
  className,
  children = 'Start on Cloud',
}: {
  size?: 'sm' | 'default' | 'lg'
  className?: string
  children?: ReactNode
}) {
  return (
    <Button asChild size={size} className={cn('font-semibold hover:bg-primary-hover', className)}>
      <a href={links.startOnCloud}>{children}</a>
    </Button>
  )
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5 text-sm leading-6">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-2 size-1.5 shrink-0 bg-primary" aria-hidden="true" />
          <span className="text-muted-foreground">{item}</span>
        </li>
      ))}
    </ul>
  )
}
