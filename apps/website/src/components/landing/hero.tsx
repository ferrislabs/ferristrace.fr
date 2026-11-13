import { useEffect, useRef } from 'react'
import { PixelBand } from './pixel-band'
import { ProductWindow, type Shot } from './product-shot'
import { Container } from './shared'
import { links } from './links'

/** The places a failure hides, rolled one after the other under the title. */
const places = ['in the trace.', 'in the cluster.', 'in the LLM call.', 'in the logs.']

/**
 * The selected error row of the screenshot, as fractions of the image:
 * measured on public/screenshots/trace-*.png (2880 × 2520, x 186–2037,
 * y 562–623). Re-measure when the screenshots change.
 */
const ERROR_ROW = { left: 0.0646, top: 0.223, width: 0.6431, height: 0.0246 }

/**
 * A little depth on scroll: the screenshot climbs a bit faster than the band
 * behind it. Desktop pointers only, and never under reduced motion.
 */
function useParallax() {
  const windowRef = useRef<HTMLDivElement>(null)
  const bandRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(min-width: 640px)').matches) return

    let frame = 0
    const update = () => {
      frame = 0
      const y = Math.min(window.scrollY, 900)
      if (windowRef.current)
        windowRef.current.style.transform = `translate3d(0, ${(-y * 0.08).toFixed(1)}px, 0)`
      if (bandRef.current)
        bandRef.current.style.transform = `translate3d(0, ${(y * 0.04).toFixed(1)}px, 0)`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return { windowRef, bandRef }
}

interface HeroProps {
  /** Trace view screenshots. Resolved at build time in pages/index.astro. */
  shotLight?: Shot
  shotDark?: Shot
}

/**
 * Product first, the way mistral.ai opens: a large left-aligned promise, one
 * sentence and two actions beside it, then the real product on a band of
 * pixels. No frame lines and no scene. What moves stays quiet: the title's
 * last line, a sweep through the band, a little depth on scroll and the
 * failing row breathing.
 */
export function Hero({ shotLight, shotDark }: HeroProps) {
  const { windowRef, bandRef } = useParallax()

  return (
    <section id="hero" aria-labelledby="hero-title" className="relative overflow-hidden">
      <Container className="pt-[clamp(4.5rem,13vh,8.5rem)]">
        <p className="reveal font-pixel text-[11px] uppercase tracking-[0.08em]">
          <span className="text-accent-text">Open-source observability</span>
          <span className="text-faint-foreground"> · Apache 2.0</span>
        </p>

        <h1
          id="hero-title"
          className="reveal mt-7 text-balance text-[clamp(2.5rem,5.4vw,5.25rem)] font-medium leading-[1] tracking-[-0.045em]"
          style={{ animationDelay: '0.08s' }}
        >
          <span className="block">Find what broke</span>
          <span className="hero-roll block text-accent-text">
            <span className="sr-only">{places[0]}</span>
            <span className="hero-roll-track" aria-hidden="true">
              {[...places, places[0]].map((place, i) => (
                <span key={i} className="hero-roll-item block">
                  {place}
                </span>
              ))}
            </span>
          </span>
        </h1>

        <div
          className="reveal mt-12 grid gap-8 lg:grid-cols-[minmax(0,34rem)_1fr] lg:items-end"
          style={{ animationDelay: '0.16s' }}
        >
          <p className="text-pretty text-lg leading-8 text-muted-foreground">
            FerrisTrace keeps your traces, logs, Kubernetes state and LLM calls linked together.
            When the alert fires, you open an incident and the evidence is already in it.
          </p>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <a
              href={links.startOnCloud}
              className="inline-flex items-center gap-2 bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Get started for free
              <span aria-hidden="true">→</span>
            </a>
            <a
              href={links.docs}
              className="inline-flex items-center gap-2 border border-border bg-card px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-foreground/[0.04]"
            >
              Read the docs
            </a>
          </div>
        </div>
      </Container>

      <div
        className="reveal relative mt-16 pb-14 sm:mt-24 sm:pb-24"
        style={{ animationDelay: '0.24s' }}
      >
        <div ref={bandRef} className="absolute inset-x-0 bottom-0 h-[72%] will-change-transform">
          <PixelBand className="size-full" />
        </div>
        <Container className="relative">
          <div ref={windowRef} className="will-change-transform">
            <ProductWindow
              light={shotLight}
              dark={shotDark}
              className="aspect-[4/5] shadow-[0_24px_60px_-20px_rgba(30,27,75,0.45)] sm:aspect-[16/10]"
              overlay={
                <span
                  aria-hidden="true"
                  className="hero-error-halo pointer-events-none absolute"
                  style={{
                    left: `${ERROR_ROW.left * 100}%`,
                    top: `${ERROR_ROW.top * 100}%`,
                    width: `${ERROR_ROW.width * 100}%`,
                    height: `${ERROR_ROW.height * 100}%`,
                  }}
                />
              }
            />
          </div>
        </Container>
      </div>
    </section>
  )
}
