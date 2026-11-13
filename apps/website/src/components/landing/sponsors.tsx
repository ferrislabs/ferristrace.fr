import { Image } from 'lucide-react'
import { Frame, Kicker } from './shared'
import { links } from './links'

interface Sponsor {
  /** The company's name. Becomes the logo's alt text, so it is never decorative. */
  name: string
  /** Logo file in public/sponsors/. An SVG keeps its own colours and scales. */
  logoSrc?: string
  /** Second file for marks that need a different version on a dark ground. */
  logoDarkSrc?: string
  /**
   * The mark is drawn for dark grounds and washes out on white, so its tile
   * keeps a dark surface in both themes rather than recolouring the brand.
   */
  logoOnDark?: boolean
  href?: string
}

/** Add an entry per company, with its logo in public/sponsors/. */
const sponsors: Sponsor[] = [
  { name: 'Wakfuli', logoSrc: '/sponsors/wakfuli.svg', logoOnDark: true },
]

export function Sponsors() {
  return (
    <Frame labelledBy="sponsors-title" innerClassName="overflow-hidden">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border px-5 py-12 sm:px-8 sm:py-14">
        <div>
          <Kicker>Sponsoring</Kicker>
          <h2
            id="sponsors-title"
            className="mt-3 max-w-xl text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl"
          >
            Backed by teams who run it in production.
          </h2>
        </div>
        <a
          href={links.sponsor}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2 border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-foreground/[0.04]"
        >
          Become a sponsor
          <span aria-hidden="true">→</span>
        </a>
      </div>

      <div className="border-b border-border px-5 py-9 sm:px-8">
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
          FerrisTrace is open source. The companies below run it on their own servers and help pay
          for its development.
        </p>
      </div>

      <ul className="-mr-px grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {sponsors.map((sponsor, index) => (
          <li key={`${sponsor.name}-${index}`} className="border-b border-r border-border">
            <SponsorTile sponsor={sponsor} />
          </li>
        ))}
        <li className="border-b border-r border-border">
          <a
            href={links.sponsor}
            target="_blank"
            rel="noreferrer noopener"
            className="flex h-36 items-center justify-center px-4 transition-colors hover:bg-foreground/[0.03]"
          >
            <span className="font-pixel text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
              Your logo
            </span>
          </a>
        </li>
      </ul>
    </Frame>
  )
}

function tileClass(sponsor: Sponsor) {
  return [
    'flex h-36 w-full items-center justify-center px-4 transition-colors',
    // #111114 is the dark theme's card colour, so the tile only reads as a
    // tile in the light theme and is seamless in the dark one.
    sponsor.logoOnDark ? 'bg-[#111114]' : 'hover:bg-foreground/[0.03]',
  ].join(' ')
}

function SponsorTile({ sponsor }: { sponsor: Sponsor }) {
  // The picture is display:contents so the img is the flex item itself. On a
  // picture flex item, the img's percentage max-width resolves against an
  // indefinite width and collapses the logo to a zero-sized box.
  const logo = sponsor.logoSrc ? (
    <picture className="contents">
      {sponsor.logoDarkSrc ? (
        <source media="(prefers-color-scheme: dark)" srcSet={sponsor.logoDarkSrc} />
      ) : null}
      <img
        src={sponsor.logoSrc}
        alt={sponsor.name}
        className="max-h-10 w-auto max-w-[140px] object-contain"
      />
    </picture>
  ) : (
    // A slot waiting for a logo: the mark says so without a bracketed label.
    <Image
      className="size-5 text-faint-foreground"
      aria-label={`${sponsor.name}, logo coming`}
      role="img"
    />
  )

  if (!sponsor.href) {
    return <div className={tileClass(sponsor)}>{logo}</div>
  }

  return (
    <a href={sponsor.href} target="_blank" rel="noreferrer noopener" className={tileClass(sponsor)}>
      {logo}
    </a>
  )
}
