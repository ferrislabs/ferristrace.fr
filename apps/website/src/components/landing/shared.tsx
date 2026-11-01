import type { ReactNode } from 'react'
import { Button, cn } from '@cometrace/ui'
import { Check } from 'lucide-react'
import { links } from './links'

/** 1200 px of content with 24 px side padding at every width. */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('mx-auto w-full max-w-[1200px] px-6', className)}>{children}</div>
}

export function SectionTitle({
  id,
  title,
  description,
  className,
}: {
  id?: string
  title: string
  description?: string
  className?: string
}) {
  return (
    <div className={cn('max-w-[680px]', className)}>
      <h2 id={id} className="text-pretty text-2xl font-bold tracking-[-0.02em] sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-base leading-7 text-muted-foreground">{description}</p>
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
        <li key={item} className="flex gap-2.5">
          <Check className="mt-1 size-4 shrink-0 text-success-text" aria-hidden="true" />
          <span className="text-muted-foreground">{item}</span>
        </li>
      ))}
    </ul>
  )
}
