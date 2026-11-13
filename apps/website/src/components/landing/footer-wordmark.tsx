import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@cometrace/ui'
import { MascotBody } from './mascot-body'

const WORD = 'FerrisTrace'
const T_INDEX = WORD.indexOf('T')

/** viewBox units. The text is stretched to exactly WIDTH. */
const WIDTH = 1000
const HEIGHT = 180
const BASELINE = 165
const FONT_SIZE = 200
/** Space Grotesk cap height is 0.7 em: the top of the T bar, where Ferris sleeps. */
const CAP_TOP = BASELINE - FONT_SIZE * 0.7

const ROW_HEIGHT = 7
const ROW_STEP = 9
/** One colour per row, like the services of a trace waterfall. */
const colors = [
  'var(--service-1)',
  'var(--service-2)',
  'var(--service-3)',
  'var(--service-4)',
  'var(--primary)',
]

interface Bar {
  x: number
  y: number
  width: number
  color: string
  opacity: number
  delay: number
}

/** Small seeded generator, so server and client draw the same bars. */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildBars(): Bar[] {
  const random = seeded(7)
  const bars: Bar[] = []
  let row = 0
  let previous = ''
  for (let y = CAP_TOP - 4; y < BASELINE + 2; y += ROW_STEP, row++) {
    let x = -random() * 60
    // Never the same service twice in a row, so the rows read apart.
    let color = colors[Math.floor(random() * colors.length)]
    while (color === previous) color = colors[Math.floor(random() * colors.length)]
    previous = color
    let segment = 0
    while (x < WIDTH) {
      const width = 90 + random() * 320
      bars.push({
        x,
        y,
        width,
        color,
        opacity: random() < 0.2 ? 0.6 : 1,
        delay: row * 45 + segment * 140,
      })
      x += width + 6 + random() * 10
      segment++
    }
  }
  return bars
}

/**
 * The closing wordmark: FerrisTrace written with trace spans, filling in like
 * a waterfall when it scrolls into view. Ferris sleeps on the T, and hovering
 * wakes it up.
 */
export function FooterWordmark() {
  const bars = useMemo(buildBars, [])
  const rootRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<SVGTextElement>(null)
  const [visible, setVisible] = useState(false)
  const [interactive, setInteractive] = useState(false)
  const [awake, setAwake] = useState(false)
  /** Centre of the T as a fraction of the width, measured once the font is in. */
  const [tCenter, setTCenter] = useState(0.585)

  useEffect(() => {
    setInteractive(window.matchMedia('(pointer: fine)').matches)

    const measure = () => {
      const text = textRef.current
      if (!text) return
      try {
        const before = text.getSubStringLength(0, T_INDEX)
        const t = text.getSubStringLength(T_INDEX, 1)
        setTCenter((before + t / 2) / WIDTH)
      } catch {
        // Keep the estimate.
      }
    }
    document.fonts?.ready.then(measure)

    const root = rootRef.current
    if (!root) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.35 },
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  const crab = (
    <>
      {awake ? null : (
        <span
          className="absolute left-[14%] top-[18%] font-pixel text-accent-text"
          aria-hidden="true"
        >
          <span className="wordmark-zzz absolute text-[11px]">z</span>
          <span className="wordmark-zzz absolute left-2 text-[13px] [animation-delay:0.9s]">z</span>
          <span className="wordmark-zzz absolute left-4 text-[15px] [animation-delay:1.8s]">Z</span>
        </span>
      )}
      <MascotBody
        withTail={false}
        eyes={awake ? 'open' : 'closed'}
        className={cn('size-full', !awake && 'wordmark-breathe')}
      />
    </>
  )

  const crabClass =
    'absolute aspect-[92/100] w-[clamp(44px,8%,96px)] -translate-x-[48%] translate-y-[9%]'
  const crabStyle = { left: `${tCenter * 100}%`, bottom: `${((HEIGHT - CAP_TOP) / HEIGHT) * 100}%` }

  return (
    <div ref={rootRef} className={cn('relative mt-16 select-none', visible && 'is-visible')}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="block h-auto w-full"
        role="img"
        aria-label="FerrisTrace"
      >
        <defs>
          <clipPath id="footer-wordmark-clip">
            <text
              x="0"
              y={BASELINE}
              fontSize={FONT_SIZE}
              fontWeight={700}
              textLength={WIDTH}
              lengthAdjust="spacingAndGlyphs"
            >
              {WORD}
            </text>
          </clipPath>
        </defs>
        <text
          ref={textRef}
          x="0"
          y={BASELINE}
          fontSize={FONT_SIZE}
          fontWeight={700}
          textLength={WIDTH}
          lengthAdjust="spacingAndGlyphs"
          fill="var(--foreground)"
          fillOpacity={0.06}
        >
          {WORD}
        </text>
        <g clipPath="url(#footer-wordmark-clip)">
          {bars.map((bar, i) => (
            <rect
              key={i}
              x={bar.x}
              y={bar.y}
              width={bar.width}
              height={ROW_HEIGHT}
              rx={2}
              fill={bar.color}
              fillOpacity={bar.opacity}
              className="wordmark-span"
              style={{ animationDelay: `${bar.delay}ms` }}
            />
          ))}
        </g>
      </svg>

      <span
        className={crabClass}
        style={crabStyle}
        aria-hidden="true"
        onPointerEnter={() => interactive && setAwake(true)}
        onPointerLeave={() => setAwake(false)}
      >
        {crab}
      </span>
    </div>
  )
}
