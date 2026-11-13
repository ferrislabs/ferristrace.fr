import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
import satori from 'satori'
import { resolveColor } from './colors'

const __dirname = dirname(fileURLToPath(import.meta.url))
const asset = (name: string) => readFileSync(resolve(__dirname, 'assets', name))

// The fonts of the site (SIL Open Font License), as static woff: Satori reads
// neither woff2 nor variable fonts.
const fontRegular = asset('SpaceGrotesk-Regular.woff')
const fontMedium = asset('SpaceGrotesk-Medium.woff')
const fontPixel = asset('Silkscreen-Regular.woff')

/** Social card size recommended by every network that reads og:image. */
export const CARD_WIDTH = 1200
export const CARD_HEIGHT = 630

export interface ThumbnailOptions {
  /** Small label above the title, e.g. the product or the section. */
  headline?: string
  title: string
  description?: string
  primaryColor?: string
}

const svgUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`

/**
 * The comet crab, a copy of cometCrab in
 * apps/website/src/components/pixel/sprites.ts.
 */
const CRAB_ROWS = [
  '.............',
  '......D...D..',
  '.....DD...DD.',
  '.....D.E.E.D.',
  'YYY..DOOOOOD.',
  '.BBBOOOOOOOOO',
  'CCC..OOOOOOO.',
  '.....D.OOO.D.',
]
const CRAB_PALETTE: Record<string, string> = {
  D: '#3730a3',
  O: '#6366f1',
  Y: '#a5b4fc',
  E: '#0c0c0e',
  B: '#2fb394',
  C: '#e8893c',
}

function crabSvg() {
  const rects = CRAB_ROWS.flatMap((row, y) =>
    [...row].flatMap((c, x) =>
      CRAB_PALETTE[c]
        ? [`<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${CRAB_PALETTE[c]}"/>`]
        : [],
    ),
  )
  return svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 8" shape-rendering="crispEdges">${rects.join('')}</svg>`,
  )
}

/**
 * The pixel band of the hero (apps/website/src/components/landing/pixel-band.tsx),
 * with bigger blocks so it reads at card size: indigo rows darkening downwards,
 * dithered where two rows meet, thinning out at the top.
 */
const BAND_COLS = 100
const BAND_ROWS = 12
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

function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function bandSvg() {
  const random = seeded(11)
  const rects: string[] = []
  for (let y = 0; y < BAND_ROWS; y++) {
    const density = Math.min(1, 0.14 + y * 0.3)
    const level = (y / (BAND_ROWS - 1)) * (RAMP.length - 1)
    for (let x = 0; x < BAND_COLS; x++) {
      if (random() > density) continue
      const step = random() < level % 1 ? Math.ceil(level) : Math.floor(level)
      const fill = RAMP[Math.min(step, RAMP.length - 1)]
      rects.push(`<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${fill}"/>`)
    }
  }
  return svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${BAND_COLS} ${BAND_ROWS}" shape-rendering="crispEdges">${rects.join('')}</svg>`,
  )
}

const crab = crabSvg()
const band = bandSvg()
const BAND_HEIGHT = (CARD_WIDTH / BAND_COLS) * BAND_ROWS

export async function generateThumbnail(options: ThumbnailOptions): Promise<string> {
  const { headline, title, description } = options
  const accent = resolveColor(options.primaryColor)

  return satori(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        backgroundColor: '#ffffff',
        fontFamily: 'Space Grotesk',
        color: '#09090b',
      }}
    >
      <img
        src={band}
        width={CARD_WIDTH}
        height={BAND_HEIGHT}
        style={{ position: 'absolute', left: 0, bottom: 0 }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '56px 72px 0',
          width: '100%',
          height: CARD_HEIGHT - BAND_HEIGHT + 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={crab} width={65} height={40} />
            <span
              style={{ marginLeft: 16, fontSize: 34, fontWeight: 500, letterSpacing: '-0.03em' }}
            >
              FerrisTrace
            </span>
          </div>
          <span
            style={{
              fontFamily: 'Silkscreen',
              fontSize: 16,
              color: '#71717a',
              letterSpacing: '0.04em',
            }}
          >
            FERRISTRACE.DEV · APACHE 2.0
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 'auto',
            marginBottom: 'auto',
            maxWidth: 1000,
          }}
        >
          {headline && (
            <span
              style={{
                fontFamily: 'Silkscreen',
                fontSize: 20,
                color: accent,
                letterSpacing: '0.04em',
                marginBottom: 20,
              }}
            >
              {headline.toUpperCase()}
            </span>
          )}
          <span
            style={{ fontSize: 62, fontWeight: 500, lineHeight: 1.04, letterSpacing: '-0.045em' }}
          >
            {title}
          </span>
          {description && (
            <span style={{ fontSize: 26, lineHeight: 1.35, color: '#52525b', marginTop: 18 }}>
              {description}
            </span>
          )}
        </div>
      </div>
    </div>,
    {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      fonts: [
        { name: 'Space Grotesk', data: fontRegular, weight: 400 },
        { name: 'Space Grotesk', data: fontMedium, weight: 500 },
        { name: 'Silkscreen', data: fontPixel, weight: 400 },
      ],
    },
  )
}
