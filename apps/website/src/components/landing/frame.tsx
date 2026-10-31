import type { ReactNode } from 'react'
import { cn } from '@ferristrace/ui'

/** The 1120 px column every band aligns to. 48 px of side padding, 20 on mobile. */
export function Column({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('mx-auto w-full max-w-[1120px] px-5 md:px-12', className)}>{children}</div>
}

/**
 * The two hairlines that run the whole height of the page at the edges of the
 * 1120 px column. Drawn once, over the section backgrounds and under nothing
 * that can be clicked. The centred wrapper clamps them to the viewport on
 * screens narrower than the column.
 */
export function ColumnRails() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 hidden md:block">
      <div className="mx-auto h-full max-w-[1120px] border-x border-border" />
    </div>
  )
}

/**
 * The marker drawn where a section boundary crosses a column rail: two 1 px
 * strokes, 11 px across. Each band draws its own pair, so a band added or
 * removed needs nothing kept in sync elsewhere.
 */
function Plus({ side }: { side: 'left' | 'right' }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'absolute top-0 hidden size-[11px] -translate-y-1/2 md:block',
        side === 'left' ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2',
      )}
    >
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-faint-foreground" />
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-faint-foreground" />
    </span>
  )
}

/** The pair of markers for one boundary, placed at the column's own edges. */
export function BoundaryMarkers() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-20">
      <div className="relative mx-auto h-0 max-w-[1120px]">
        <Plus side="left" />
        <Plus side="right" />
      </div>
    </div>
  )
}

interface BandProps {
  id?: string
  labelledBy?: string
  /** The tinted ground. Bands alternate between this and the page background. */
  tint?: boolean
  className?: string
  children: ReactNode
}

/**
 * One section of the page: a full-width 1 px rule across the top, its two
 * crossing markers, and an optional tinted ground.
 */
export function Band({ id, labelledBy, tint, className, children }: BandProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn('relative border-t border-border', tint && 'bg-sidebar', className)}
    >
      <BoundaryMarkers />
      {children}
    </section>
  )
}
