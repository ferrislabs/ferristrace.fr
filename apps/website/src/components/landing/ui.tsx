import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { cn } from '@ferristrace/ui'

/**
 * The landing's own button. The app's Button carries the product's radii and
 * sizes; this page is set at 2 px corners throughout, so it gets its own
 * rather than fighting the shared one with overrides.
 */
type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: 'primary' | 'outline'
  size?: 'default' | 'sm'
  children: ReactNode
}

export function LinkButton({
  variant = 'primary',
  size = 'default',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <a
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[2px] font-semibold transition-colors [&_svg]:size-4 [&_svg]:shrink-0',
        size === 'sm' ? 'h-[34px] px-3 text-[13.5px]' : 'h-11 px-[18px] text-[15px]',
        variant === 'primary'
          ? 'bg-primary text-primary-foreground hover:bg-primary-hover'
          : 'border border-border bg-background text-foreground hover:bg-muted',
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  )
}

/** h2, at the scale the brief sets: 48/52 desktop, 32/36 under 768 px. */
export function H2({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="font-display text-[32px] font-semibold leading-[36px] md:text-[48px] md:leading-[52px]"
    >
      {children}
    </h2>
  )
}

/** h3, 22/28, with the looser tracking the brief asks for at that size. */
export function H3({
  id,
  className,
  children,
}: {
  id?: string
  className?: string
  children: ReactNode
}) {
  return (
    <h3
      id={id}
      className={cn(
        'font-display text-[22px] font-semibold leading-[28px] tracking-[-0.01em]',
        className,
      )}
    >
      {children}
    </h3>
  )
}

/** The paragraph that follows a section heading. */
export function Intro({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <p className={cn('max-w-[680px] text-[17px] leading-[27px] text-muted-foreground', className)}>
      {children}
    </p>
  )
}
