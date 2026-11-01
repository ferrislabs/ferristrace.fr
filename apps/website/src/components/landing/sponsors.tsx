import { Button } from '@cometrace/ui'
import { Image } from 'lucide-react'
import { Container, SectionTitle } from './shared'
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
    <section
      aria-labelledby="sponsors-title"
      className="border-t border-border bg-section-alt py-20"
    >
      <Container>
        <SectionTitle
          id="sponsors-title"
          title="Backed by teams who run it in production."
          description="FerrisTrace is open source. The companies below run it on their own servers and help pay for its development."
        />

        <ul className="mt-10 flex flex-wrap gap-3">
          {sponsors.map((sponsor, index) => (
            <li key={`${sponsor.name}-${index}`}>
              <SponsorTile sponsor={sponsor} />
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <Button asChild variant="outline" className="px-5 font-semibold">
            <a href={links.sponsor} target="_blank" rel="noreferrer noopener">
              Become a sponsor
            </a>
          </Button>
        </div>
      </Container>
    </section>
  )
}

function tileClass(sponsor: Sponsor) {
  return [
    'flex h-16 w-[180px] items-center justify-center rounded-md border border-border px-4',
    // #111114 is the dark theme's card colour, so the chip only reads as a
    // chip in the light theme and is seamless in the dark one.
    sponsor.logoOnDark ? 'bg-[#111114]' : 'bg-card',
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
        className="max-h-10 w-auto max-w-full object-contain"
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
    <a
      href={sponsor.href}
      target="_blank"
      rel="noreferrer noopener"
      className={`${tileClass(sponsor)} transition-colors hover:border-input`}
    >
      {logo}
    </a>
  )
}
