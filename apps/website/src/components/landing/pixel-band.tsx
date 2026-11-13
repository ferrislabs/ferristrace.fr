import { useId } from 'react'

/**
 * A band of indigo blocks that darkens row by row, with dithered edges where
 * two rows meet: the gradient of the comet crab, drawn in pixels. Squares stay
 * square at every width; the sides are cropped instead.
 *
 * Every few seconds a lighter column sweeps it left to right, like the time
 * cursor of a trace. The sweep is clipped to the blocks, so it never lights
 * the gaps. The loose blocks of the top rows sink and rise column by
 * column, so a swell rolls across the surface. Both only run when motion is
 * allowed (globals.css, "Pixel band").
 */
const COLS = 200
const ROWS = 22
/** Width of the sweeping column, in blocks. */
const WAVE = 8
/** The top rows are the surface: their blocks move instead of merging. */
const SURFACE = 5
/** Length of one swell, in columns, and how long a block takes to rise and fall. */
const SWELL = 48
const SWELL_SECONDS = 2.4

const RAMP = [
  '#c7d2fe',
  '#a5b4fc',
  '#818cf8',
  '#6366f1',
  '#4f46e5',
  '#4338ca',
  '#3730a3',
  '#312e81',
  '#1e1b4b',
]

/** Small seeded generator, so the server and the client draw the same blocks. */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface Run {
  x: number
  y: number
  width: number
  fill: string
}

/**
 * Blocks of one row that touch and share a colour become one rect. Surface
 * blocks stay single and are grouped by column, so each column can move.
 */
function buildBand() {
  const random = seeded(11)
  const runs: Run[] = []
  const columns = new Map<number, Run[]>()
  for (let y = 0; y < ROWS; y++) {
    // The top rows thin out into the page instead of starting on a hard edge.
    const density = Math.min(1, 0.12 + y * 0.22)
    const level = (y / (ROWS - 1)) * (RAMP.length - 1)
    let current: Run | undefined
    for (let x = 0; x < COLS; x++) {
      if (random() > density) {
        current = undefined
        continue
      }
      const step = random() < level % 1 ? Math.ceil(level) : Math.floor(level)
      const fill = RAMP[Math.min(step, RAMP.length - 1)]
      if (y < SURFACE) {
        const column = columns.get(x) ?? []
        column.push({ x, y, width: 1, fill })
        columns.set(x, column)
        continue
      }
      if (current && current.fill === fill) {
        current.width++
      } else {
        current = { x, y, width: 1, fill }
        runs.push(current)
      }
    }
  }
  return { runs, columns: [...columns.entries()] }
}

const { runs, columns } = buildBand()

/** Later columns start later in the swell, so it travels left to right. */
function swellDelay(x: number) {
  return `${(-(1 - (x % SWELL) / SWELL) * SWELL_SECONDS).toFixed(2)}s`
}

export function PixelBand({ className }: { className?: string }) {
  const clipId = `pixel-band-${useId().replace(/:/g, '')}`

  return (
    <svg
      viewBox={`0 0 ${COLS} ${ROWS}`}
      preserveAspectRatio="xMidYMax slice"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
      overflow="visible"
    >
      <defs>
        <clipPath id={clipId}>
          {runs.map((r) => (
            <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.width + 0.02} height={1.02} />
          ))}
        </clipPath>
      </defs>
      {runs.map((r) => (
        <rect
          key={`${r.x}-${r.y}`}
          x={r.x}
          y={r.y}
          width={r.width + 0.02}
          height={1.02}
          fill={r.fill}
        />
      ))}
      {columns.map(([x, blocks]) => (
        <g key={x} className="pixel-band-swell" style={{ animationDelay: swellDelay(x) }}>
          {blocks.map((b) => (
            <rect key={b.y} x={b.x} y={b.y} width={1.02} height={1.02} fill={b.fill} />
          ))}
        </g>
      ))}
      <g clipPath={`url(#${clipId})`}>
        <g className="pixel-band-wave" style={{ ['--cols' as string]: COLS + WAVE }}>
          <rect x={-WAVE} y={0} width={WAVE / 2} height={ROWS} fill="#ffffff" fillOpacity={0.12} />
          <rect
            x={-WAVE / 2}
            y={0}
            width={WAVE / 2}
            height={ROWS}
            fill="#ffffff"
            fillOpacity={0.24}
          />
        </g>
      </g>
    </svg>
  )
}
