import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
import satori from 'satori'
import { resolveColor } from './colors'

const __dirname = dirname(fileURLToPath(import.meta.url))
const asset = (name: string) => readFileSync(resolve(__dirname, 'assets', name))

// Source Sans 3, the font of the site (SIL Open Font License).
const fontRegular = asset('SourceSans3-Regular.ttf')
const fontSemiBold = asset('SourceSans3-SemiBold.ttf')
const fontBold = asset('SourceSans3-Bold.ttf')

// Ferris, rendered from apps/website/src/components/landing/mascot-body.tsx.
// Regenerate it when the mascot changes.
const ferris = `data:image/svg+xml;base64,${asset('ferris.svg').toString('base64')}`
// The small mark, a copy of apps/website/public/favicon.svg.
const mark = `data:image/svg+xml;base64,${asset('mark.svg').toString('base64')}`

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

/** A faint trace waterfall behind Ferris: one row per span, in service colours. */
const waterfall: Array<{ left: number; width: number; color: string }> = [
  { left: 0, width: 420, color: '#8b93ff' },
  { left: 40, width: 210, color: '#2fb394' },
  { left: 110, width: 260, color: '#e8893c' },
  { left: 150, width: 120, color: '#e05aa8' },
  { left: 250, width: 170, color: '#5b8cf5' },
  { left: 290, width: 90, color: '#2fb394' },
]

export async function generateThumbnail(options: ThumbnailOptions): Promise<string> {
  const { headline, title, description } = options
  const primaryColor = resolveColor(options.primaryColor)

  return satori(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        backgroundColor: '#0b0a1f',
        backgroundImage: `radial-gradient(circle at 85% 10%, ${primaryColor}55 0%, transparent 55%)`,
        fontFamily: 'Source Sans 3',
        color: '#ffffff',
      }}
    >
      <div style={{ position: 'absolute', right: 70, top: 92, display: 'flex', flexDirection: 'column', opacity: 0.22 }}>
        {waterfall.map((bar, i) => (
          <div
            key={i}
            style={{
              marginLeft: bar.left,
              width: bar.width,
              height: 14,
              marginBottom: 12,
              borderRadius: 7,
              backgroundColor: bar.color,
            }}
          />
        ))}
      </div>

      <img src={ferris} width={480} height={330} style={{ position: 'absolute', right: 40, bottom: 26 }} />

      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 72px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={mark} width={52} height={52} />
          <span style={{ marginLeft: 14, fontSize: 36, fontWeight: 700, letterSpacing: '-0.01em' }}>FerrisTrace</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 690 }}>
          {headline && (
            <span style={{ fontSize: 28, fontWeight: 600, color: '#a5abff', marginBottom: 14 }}>{headline}</span>
          )}
          <span style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.04, letterSpacing: '-0.025em' }}>{title}</span>
          {description && (
            <span style={{ fontSize: 28, lineHeight: 1.3, color: '#c4c4d4', marginTop: 20 }}>{description}</span>
          )}
        </div>

        <span style={{ fontSize: 24, color: '#9a9ab0' }}>ferristrace.dev · Open source · OpenTelemetry</span>
      </div>
    </div>,
    {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      fonts: [
        { name: 'Source Sans 3', data: fontRegular, weight: 400 },
        { name: 'Source Sans 3', data: fontSemiBold, weight: 600 },
        { name: 'Source Sans 3', data: fontBold, weight: 700 },
      ],
    },
  )
}
