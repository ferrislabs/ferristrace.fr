import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@cometrace/ui'
import { Image } from 'lucide-react'
import { Container } from './shared'

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

export function ProductShot({ light, dark }: ProductShotProps) {
  return (
    <section id="product" aria-label="The trace view" className="scroll-mt-20 pb-20">
      <Container>
        <Tilt>
          {light ? <PhoneScroller><Shots light={light} dark={dark} /></PhoneScroller> : (
            <div className="overflow-hidden rounded-xl border border-border shadow-lg">
              <Placeholder />
            </div>
          )}
        </Tilt>
        {light ? (
          <p className="mt-2 text-center text-[12px] text-faint-foreground sm:hidden" aria-hidden="true">
            Swipe to see the whole view →
          </p>
        ) : null}

        <p className="mx-auto mt-4 max-w-[680px] text-center text-sm leading-6 text-faint-foreground">
          The trace view, with the span waterfall on the left and the selected span's attributes,
          events and resource on the right.
        </p>
      </Container>
    </section>
  )
}

/**
 * On phones the full screenshot shrunk to the screen width is unreadable, so
 * it keeps a readable size instead and scrolls sideways, starting past the
 * app sidebar on the waterfall itself.
 */
const SHOT_CLASS = 'block h-auto w-[260%] max-w-none sm:w-full sm:max-w-full'

function PhoneScroller({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(min-width: 640px)').matches) return
    el.scrollLeft = el.scrollWidth * 0.11
  }, [])

  return (
    <div
      ref={ref}
      className="overflow-x-auto overscroll-x-contain rounded-xl border border-border shadow-lg sm:overflow-hidden"
    >
      {children}
    </div>
  )
}

function Shots({ light, dark }: { light: Shot; dark?: Shot }) {
  // Without a dark file the light one has to serve both themes, so it keeps no
  // swap class and stays visible either way.
  if (!dark) {
    return (
      <img
        src={light.src}
        width={light.width}
        height={light.height}
        alt={alt}
        className={SHOT_CLASS}
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
        className={cn('shot-light', SHOT_CLASS)}
      />
      <img
        src={dark.src}
        width={dark.width}
        height={dark.height}
        alt={alt}
        className={cn('shot-dark', SHOT_CLASS)}
      />
    </>
  )
}

/**
 * A light 3D tilt that follows the pointer, desktop only and disabled under
 * reduced motion. The transform is written straight to the node on pointermove.
 */
function Tilt({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      el.style.transform = `perspective(1400px) rotateX(${(-py * 3).toFixed(2)}deg) rotateY(${(px * 3).toFixed(2)}deg)`
    }
    const onLeave = () => {
      el.style.transform = 'perspective(1400px) rotateX(0deg) rotateY(0deg)'
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div ref={ref} className="transition-transform duration-200 ease-out will-change-transform">
      {children}
    </div>
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
