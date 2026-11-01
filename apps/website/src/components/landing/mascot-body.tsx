import { useId, type Ref } from 'react'
import { cn } from '@cometrace/ui'

const SHELL = '#4f46e5'
const INK = '#3730a3'
const BLUSH = '#f9a8d4'

/** The comet tail: one fading span per service colour. */
const tail = [
  { x: 22, y: 47, width: 62, color: '#8b93ff' },
  { x: 8, y: 57, width: 74, color: '#2fb394' },
  { x: 30, y: 67, width: 52, color: '#e8893c' },
  { x: 44, y: 77, width: 40, color: '#e05aa8' },
]

const legs = [
  'M80 72 L72 77 L70 86',
  'M84 79 L79 85 L78 93',
  'M92 83 L89 90 L90 97',
  'M120 72 L128 77 L130 86',
  'M116 79 L121 85 L122 93',
  'M108 83 L111 90 L110 97',
]

const CLAW = 'M0 2 C-9 0 -11 -13 -4 -20 C0 -24 7 -23 9 -18 L2 -12 L10 -8 C9 -1 5 3 0 2 Z'

/**
 * Ferris, FerrisTrace's comet crab: a crab dashing sideways with a tail of
 * trace spans. Shared by the floating mascot and the one asleep in the
 * footer (no tail: it is not going anywhere). Open eyes can be moved by the
 * caller through `pupilsRef`.
 */
export function MascotBody({
  eyes = 'open',
  withTail = true,
  pupilsRef,
  className,
}: {
  eyes?: 'open' | 'closed'
  withTail?: boolean
  pupilsRef?: Ref<SVGGElement>
  className?: string
}) {
  // Two crabs can be on the page at once: gradient ids must not collide.
  const id = useId().replace(/:/g, '')

  return (
    <svg
      width={withTail ? 92 : 53}
      height={withTail ? 63 : 58}
      viewBox={withTail ? '0 0 160 110' : '56 8 92 100'}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn('overflow-visible', className)}
    >
      <defs>
        {tail.map((t, i) => (
          <linearGradient key={t.color} id={`${id}-tail-${i}`} x1="1" x2="0">
            <stop offset="0" stopColor={t.color} />
            <stop offset="1" stopColor={t.color} stopOpacity="0" />
          </linearGradient>
        ))}
        <linearGradient id={`${id}-shell`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6c64f2" />
          <stop offset="1" stopColor="#4338ca" />
        </linearGradient>
        <clipPath id={`${id}-body`}>
          <ellipse cx="100" cy="64" rx="31" ry="22" />
        </clipPath>
      </defs>

      {withTail ? (
        <g className="crab-tail">
          {tail.map((t, i) => (
            <rect
              key={t.color}
              x={t.x}
              y={t.y}
              width={t.width}
              height="6"
              rx="3"
              fill={`url(#${id}-tail-${i})`}
              className="crab-tail-span"
              style={{ animationDelay: `${i * -0.37}s` }}
            />
          ))}
          <circle cx="16" cy="50" r="1.6" fill="#8b93ff" className="crab-spark" />
          <circle cx="24" cy="72" r="1.4" fill="#e8893c" className="crab-spark" style={{ animationDelay: '-0.8s' }} />
          <circle cx="36" cy="62" r="1.2" fill="#2fb394" className="crab-spark" style={{ animationDelay: '-0.4s' }} />
        </g>
      ) : null}

      <g transform={withTail ? 'rotate(-6 100 64)' : undefined}>
        <g stroke={INK} strokeWidth="3.6">
          {legs.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>

        <path d="M76 60 Q66 56 64 44" stroke={SHELL} strokeWidth="5" />
        <path d="M124 58 Q136 54 137 40" stroke={SHELL} strokeWidth="5" />
        <g transform="translate(64 44) rotate(-15)">
          <path d={CLAW} fill={SHELL} />
          <path d="M-5 -14 Q-6 -8 -3 -4" stroke="#8b93ff" strokeWidth="1.6" opacity="0.7" />
        </g>
        <g transform="translate(137 40) rotate(20) scale(-1 1)">
          <path d={CLAW} fill={SHELL} />
          <path d="M-5 -14 Q-6 -8 -3 -4" stroke="#8b93ff" strokeWidth="1.6" opacity="0.7" />
        </g>

        <path d="M92 46 L89 32" stroke={INK} strokeWidth="3.6" />
        <path d="M108 46 L111 32" stroke={INK} strokeWidth="3.6" />

        <ellipse cx="100" cy="64" rx="31" ry="22" fill={`url(#${id}-shell)`} />
        <g clipPath={`url(#${id}-body)`}>
          <path d="M66 72 Q100 92 134 72 L134 90 L66 90 Z" fill={INK} opacity="0.45" />
        </g>
        <path d="M80 52 Q88 45 98 44" stroke="#ffffff" strokeWidth="2.6" opacity="0.35" />

        <circle cx="89" cy="29" r="7.5" fill="#ffffff" stroke={INK} strokeWidth="2.4" />
        <circle cx="111" cy="29" r="7.5" fill="#ffffff" stroke={INK} strokeWidth="2.4" />
        {eyes === 'open' ? (
          <g ref={pupilsRef}>
            <circle cx="90.5" cy="29.5" r="3.6" fill="#0c0c0e" />
            <circle cx="112.5" cy="29.5" r="3.6" fill="#0c0c0e" />
            <circle cx="91.6" cy="28.2" r="1.2" fill="#ffffff" />
            <circle cx="113.6" cy="28.2" r="1.2" fill="#ffffff" />
          </g>
        ) : (
          <>
            {/* Closed: the lid covers the top of each eye. */}
            <path d="M81.5 29 A7.5 7.5 0 0 1 96.5 29 Z" fill={SHELL} />
            <path d="M103.5 29 A7.5 7.5 0 0 1 118.5 29 Z" fill={SHELL} />
            <path d="M83 29.5 Q89 33 95 29.5" stroke={INK} strokeWidth="2" />
            <path d="M105 29.5 Q111 33 117 29.5" stroke={INK} strokeWidth="2" />
          </>
        )}

        <ellipse cx="86" cy="66" rx="4" ry="2.4" fill={BLUSH} opacity="0.55" />
        <ellipse cx="114" cy="66" rx="4" ry="2.4" fill={BLUSH} opacity="0.55" />
        {eyes === 'open' ? (
          <path d="M94 64 Q100 70 106 64" stroke="#ffffff" strokeWidth="2.6" />
        ) : (
          <path d="M97 66 Q100 68 103 66" stroke="#ffffff" strokeWidth="2.2" />
        )}
      </g>
    </svg>
  )
}
