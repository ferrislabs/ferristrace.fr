import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@cometrace/ui'
import { Image } from 'lucide-react'

export interface Shot {
  src: string
  width: number
  height: number
}

interface ProductShotProps {
  /** Resolved at build time from public/screenshots/ by pages/index.astro. */
  light?: Shot
  dark?: Shot
}

const alt =
  "The FerrisTrace trace detail view: a waterfall of spans on the left, the selected span's attributes, events and resource on the right."

/**
 * The screenshot, framed, for the hero to set on the pixel band. On phones it
 * keeps a readable size and scrolls sideways. `overlay` is drawn over the
 * image itself, in its own coordinates, so it can point at a part of it.
 */
export function ProductWindow({
  light,
  dark,
  className,
  overlay,
}: ProductShotProps & { className?: string; overlay?: ReactNode }) {
  if (!light) {
    return (
      <div className={cn(frameClass, className)}>
        <Placeholder />
      </div>
    )
  }
  return (
    <PhoneScroller className={className}>
      <div className="relative w-[260%] sm:w-full">
        <Shots light={light} dark={dark} imgClass="block h-auto w-full max-w-none" />
        {overlay}
      </div>
    </PhoneScroller>
  )
}

const frameClass =
  'overflow-hidden border border-border bg-card shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0_0_rgba(0,0,0,0.45)]'

/**
 * On phones the full screenshot shrunk to the screen width is unreadable, so
 * it keeps a readable size instead and scrolls sideways, starting past the
 * app sidebar on the waterfall itself.
 */
const SHOT_CLASS = 'block h-auto w-[260%] max-w-none sm:w-full sm:max-w-full'

function PhoneScroller({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(min-width: 640px)').matches) return
    el.scrollLeft = el.scrollWidth * 0.11
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        frameClass,
        'overflow-x-auto overscroll-x-contain sm:overflow-hidden',
        className,
      )}
    >
      {children}
    </div>
  )
}

function Shots({
  light,
  dark,
  imgClass = SHOT_CLASS,
}: {
  light: Shot
  dark?: Shot
  imgClass?: string
}) {
  // Without a dark file the light one has to serve both themes, so it keeps no
  // swap class and stays visible either way.
  if (!dark) {
    return (
      <img
        src={light.src}
        width={light.width}
        height={light.height}
        alt={alt}
        className={imgClass}
      />
    )
  }

  return (
    <>
      <img
        src={light.src}
        width={light.width}
        height={light.height}
        alt={alt}
        className={cn('shot-light', imgClass)}
      />
      <img
        src={dark.src}
        width={dark.width}
        height={dark.height}
        alt={alt}
        className={cn('shot-dark', imgClass)}
      />
    </>
  )
}

function Placeholder() {
  return (
    <div className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 bg-muted">
      <Image className="size-6 text-faint-foreground" aria-hidden="true" />
      <span className="px-6 text-center font-mono text-xs text-muted-foreground">
        Drop the trace view screenshots in public/screenshots to replace this.
      </span>
    </div>
  )
}
