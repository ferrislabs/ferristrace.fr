import { useEffect, useRef, useState } from 'react'
import { cn } from '@cometrace/ui'
import { X } from 'lucide-react'
import { links } from './links'
import { MascotBody } from './mascot-body'

const STORAGE_KEY = 'ferristrace:mascot-tour-v1'
/** Closing Ferris hides it for the rest of the visit, not forever. */
const DISMISSED_KEY = 'ferristrace:mascot-dismissed'
/** Dispatched by the footer: replay the tour, or tell Ferris it is home. */
export const TOUR_EVENT = 'ferristrace:mascot-tour'
export const HOME_EVENT = 'ferristrace:mascot-home'

/** Where Ferris sits relative to the cursor while it follows. */
const FOLLOW_OFFSET = { x: 72, y: -18 }
/**
 * Once it has settled, Ferris ignores the pointer until it goes this far
 * away, so it can be hovered and closed. Larger than FOLLOW_OFFSET, so the
 * pointer it just caught up with does not wake it.
 */
const HITBOX_RADIUS = 110
/** The root is w-60 with the svg centred: its centre is this far from the root's corner. */
const BODY_CENTER = { x: 131, y: 37 }

interface TourStep {
  /** Section the bubble is anchored to while shown. */
  anchor?: string
  text: string
  action?: { label: string; href: string }
}

const tour: TourStep[] = [
  {
    text: "Hi, I'm Ferris. Got two minutes? I'll show you the parts that matter at 3 a.m.",
  },
  {
    anchor: '#product',
    text: 'This is one request, service by service. Click a span to see its attributes. Anything in your cluster that speaks OpenTelemetry can show up here.',
  },
  {
    anchor: '#incidents',
    text: 'When something breaks, the incident collects the alerts, traces, logs and metrics for you. You can close the other four tabs.',
  },
  {
    anchor: '#agents',
    text: 'AI agents can dig in too. FerrisKey gives each one a scoped token, so it only sees what you allow. Want to try it?',
    action: { label: 'Start on Cloud', href: links.startOnCloud },
  },
]

type Phase = 'hidden' | 'idle' | 'tour'

/**
 * The site mascot: a small crab whose pupils track the pointer. On first
 * visit it runs a short guided tour; while the tour runs, the bubble is
 * anchored next to the section it talks about (it must stay clickable, so it
 * does NOT follow the cursor then). Afterwards Ferris just trails the
 * cursor at a short distance. Bringing the pointer onto it stops it (a
 * hitbox, like incident.io's mascot), which reveals a close button. Hidden on
 * touch devices, parked in the corner without motion under reduced motion.
 */
export function Mascot() {
  const [phase, setPhase] = useState<Phase>('hidden')
  const [step, setStep] = useState(0)
  const [reduced, setReduced] = useState(false)
  /** True while the footer, where a sleeping Ferris lives, is on screen. */
  const [home, setHome] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const pupilsRef = useRef<SVGGElement>(null)
  /** Ferris runs sideways: 1 facing right, -1 facing left, its tail behind. */
  const flipRef = useRef<HTMLSpanElement>(null)
  const facingRef = useRef(1)
  // Current viewport position of Ferris, shared by the pupil tracker.
  const posRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReduced(reduce)
    if (!fine) return
    posRef.current = { x: window.innerWidth * 0.72 + BODY_CENTER.x, y: window.innerHeight * 0.45 }

    const startTour = () => {
      window.sessionStorage.removeItem(DISMISSED_KEY)
      setStep(0)
      setPhase('tour')
    }
    // The footer mascot on other pages links to /?tour.
    const params = new URLSearchParams(window.location.search)
    if (params.has('tour')) {
      params.delete('tour')
      const query = params.toString()
      window.history.replaceState(null, '', window.location.pathname + (query ? `?${query}` : '') + window.location.hash)
      startTour()
    } else if (window.sessionStorage.getItem(DISMISSED_KEY) !== 'yes') {
      setPhase(window.localStorage.getItem(STORAGE_KEY) === 'done' ? 'idle' : 'tour')
    }

    const onHome = (e: Event) => setHome((e as CustomEvent<boolean>).detail)
    window.addEventListener(TOUR_EVENT, startTour)
    window.addEventListener(HOME_EVENT, onHome)
    return () => {
      window.removeEventListener(TOUR_EVENT, startTour)
      window.removeEventListener(HOME_EVENT, onHome)
    }
  }, [])

  // Tour mode: anchor the bubble next to the current step's section. Re-place
  // on scroll/resize so it stays next to the section while it moves.
  useEffect(() => {
    if (phase !== 'tour' || reduced) return
    const root = rootRef.current
    if (!root) return

    const place = () => {
      const anchor = tour[step]?.anchor
      const el = anchor ? document.querySelector(anchor) : null
      const r = el?.getBoundingClientRect()
      const x = r
        ? Math.min(Math.max(r.left + r.width * 0.72, 16), window.innerWidth - 270)
        : window.innerWidth - 270
      // No anchor: park bottom-right, clear of the hero title and actions.
      const y = r ? Math.max(r.top + 48, 84) : window.innerHeight - 220
      posRef.current = { x: x + BODY_CENTER.x, y: y + BODY_CENTER.y }
      root.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }

    place()
    window.addEventListener('scroll', place, { passive: true })
    window.addEventListener('resize', place)
    return () => {
      window.removeEventListener('scroll', place)
      window.removeEventListener('resize', place)
    }
  }, [phase, step, reduced])

  // Idle mode: follow the cursor. Two states with hysteresis, so it never
  // stutters between them: "following" chases the cursor until it has
  // settled, then "resting" ignores the pointer until it leaves the hitbox.
  // Writes straight to the DOM node, re-rendering React every frame for a
  // cursor trail is not worth it.
  useEffect(() => {
    if (phase !== 'idle' || reduced) return
    const root = rootRef.current
    if (!root) return

    let raf = 0
    let last = performance.now()
    let following = false
    // Centre of Ferris's body, in viewport coordinates.
    const pos = { ...posRef.current }
    const target = { ...pos }
    let tilt = 0
    let rush = 0

    const aim = (x: number, y: number) => {
      target.x = Math.min(x + FOLLOW_OFFSET.x, window.innerWidth - 40)
      target.y = Math.max(y + FOLLOW_OFFSET.y, 40)
    }

    const onMove = (e: PointerEvent) => {
      if (following) {
        aim(e.clientX, e.clientY)
      } else if (Math.hypot(e.clientX - pos.x, e.clientY - pos.y) > HITBOX_RADIUS) {
        following = true
        aim(e.clientX, e.clientY)
      }
    }

    const tick = (now: number) => {
      // Frame-rate independent exponential smoothing: no overshoot, no wobble.
      const dt = Math.min(now - last, 64) / 1000
      last = now
      const k = 1 - Math.exp(-dt * 5)
      const dx = (target.x - pos.x) * k
      const dy = (target.y - pos.y) * k
      pos.x += dx
      pos.y += dy
      posRef.current = { x: pos.x, y: pos.y }

      if (following && Math.hypot(target.x - pos.x, target.y - pos.y) < 1) following = false

      const speed = dt > 0 ? dx / dt : 0
      const wanted = Math.max(-14, Math.min(14, speed * 0.02))
      tilt += (wanted - tilt) * (1 - Math.exp(-dt * 8))
      // The tail stretches with speed and shrinks back when Ferris stops.
      const velocity = dt > 0 ? Math.hypot(dx, dy) / dt : 0
      rush += (Math.min(1, velocity / 900) - rush) * (1 - Math.exp(-dt * 6))
      root.style.setProperty('--crab-rush', rush.toFixed(3))
      // Turn around only on a clear change of direction, never on jitter.
      const facing = speed > 60 ? 1 : speed < -60 ? -1 : facingRef.current
      if (facing !== facingRef.current && flipRef.current) {
        facingRef.current = facing
        flipRef.current.style.transform = `scaleX(${facing})`
      }
      root.style.transform = `translate3d(${pos.x - BODY_CENTER.x}px, ${pos.y - BODY_CENTER.y}px, 0) rotate(${tilt.toFixed(2)}deg)`
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [phase, reduced])

  // Pupils track the pointer in every visible mode.
  useEffect(() => {
    if (phase === 'hidden' || reduced) return
    let raf = 0
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
    }
    const tick = () => {
      const pupils = pupilsRef.current
      if (pupils) {
        const dx = target.x - posRef.current.x
        const dy = target.y - posRef.current.y
        const angle = Math.atan2(dy, dx)
        const dist = Math.min(2.4, Math.hypot(dx, dy) / 70)
        pupils.style.transform = `translate(${Math.cos(angle) * dist * facingRef.current}px, ${Math.sin(angle) * dist}px)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [phase, reduced])

  // Reduced motion: no tracking at all, Ferris just sits in the corner.
  useEffect(() => {
    if (phase === 'hidden' || !reduced) return
    const root = rootRef.current
    if (root) root.style.transform = 'translate3d(calc(100vw - 120px), calc(100dvh - 150px), 0)'
  }, [phase, reduced])

  // Each tour step scrolls its anchor into view.
  useEffect(() => {
    if (phase !== 'tour') return
    const anchor = tour[step]?.anchor
    if (!anchor) return
    document
      .querySelector(anchor)
      ?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
  }, [phase, step, reduced])

  const finish = () => {
    window.localStorage.setItem(STORAGE_KEY, 'done')
    setPhase('idle')
  }

  const dismiss = () => {
    window.sessionStorage.setItem(DISMISSED_KEY, 'yes')
    setPhase('hidden')
  }

  if (phase === 'hidden') return null

  const current = tour[step]
  const last = step === tour.length - 1

  return (
    <div
      ref={rootRef}
      // While idle it flies under the sticky header and its menus; the tour
      // bubble must stay on top of everything.
      className={cn(
        'pointer-events-none fixed left-0 top-0 transition-opacity duration-300 will-change-transform',
        phase === 'tour' ? 'z-[70]' : 'z-30',
        phase === 'idle' && home && 'opacity-0 [&_*]:!pointer-events-none',
      )}
      aria-hidden="true"
    >
      <div className="flex w-60 flex-col items-center">
        {phase === 'tour' && current ? (
          <div className="pointer-events-auto mb-2 rounded-lg border border-border bg-popover p-3 text-left shadow-[var(--elevation-lg)]">
            <p className="text-[13px] leading-5 text-popover-foreground">{current.text}</p>
            <div className="mt-2.5 flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-faint-foreground">
                {step + 1}/{tour.length}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={finish}
                  className="rounded-md px-2 py-1 text-xs font-medium text-faint-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  Skip
                </button>
                {last ? (
                  current.action ? (
                    <a
                      href={current.action.href}
                      onClick={finish}
                      className="rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
                    >
                      {current.action.label}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={finish}
                      className="rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
                    >
                      Got it
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s + 1)}
                    className="rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : null}

        <div
          className={cn(
            'group relative flex flex-col items-center',
            phase === 'idle' && 'pointer-events-auto',
          )}
        >
          {phase === 'idle' ? (
            <button
              type="button"
              onClick={dismiss}
              aria-label="Hide the mascot"
              tabIndex={-1}
              className="absolute -right-3 -top-2 z-10 flex size-5 items-center justify-center rounded-full border border-border bg-popover text-faint-foreground opacity-0 shadow-sm transition-opacity hover:text-foreground group-hover:opacity-100"
            >
              <X className="size-3" aria-hidden="true" />
            </button>
          ) : null}
          <span ref={flipRef} className="block origin-[62.5%_58%] transition-transform duration-300">
            <MascotBody pupilsRef={pupilsRef} className={cn('mascot-bob', reduced && 'mascot-bob-off')} />
          </span>
          <span
            aria-hidden="true"
            className={cn('mascot-shadow mt-1 h-1.5 w-8 rounded-full bg-foreground/15 blur-[2px]', reduced && 'mascot-bob-off')}
          />
        </div>
      </div>
    </div>
  )
}
