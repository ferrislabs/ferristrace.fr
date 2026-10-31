import { Band, Column } from './frame'
import { H2, Intro } from './ui'
import { docsLink, links } from './links'

/**
 * The questions someone asks before they will run a thing on their own
 * hardware. Every answer is a fact this repository can back — the licence, the
 * compose file, a documented page.
 *
 * While the docs are unpublished each answer stands on its own and the links
 * drop out: an answer that ends on a dead link is worse than one that stops.
 *
 * Nothing about sizing or throughput: those numbers have not been measured,
 * and a visitor would dimension a machine on whatever is written here.
 */
const sdkDocs = docsLink('/sending-data/opentelemetry-sdks')
const upgradeDocs = docsLink('/administration/backups-and-upgrades')

const link = 'underline underline-offset-2 hover:no-underline'

const questions = [
  {
    q: 'What does it cost?',
    a: (
      <>
        Nothing. Apache 2.0, no tier, no per-seat price, no event quota. You pay for the server
        it runs on, which you were already paying for.
      </>
    ),
  },
  {
    q: 'Can I run it for my clients?',
    a: <>Yes. Apache 2.0 places no limit on deploying it, charging for it, or building on it.</>,
  },
  {
    q: 'Do I have to use your SDK?',
    a: (
      <>
        There is no SDK to use. Anything that speaks OTLP works: the OpenTelemetry SDKs, the
        Collector, Alloy, Vector.
        {sdkDocs ? (
          <>
            {' '}
            See{' '}
            <a href={sdkDocs} className={link}>
              sending data
            </a>
            .
          </>
        ) : null}
      </>
    ),
  },
  {
    q: 'How do I upgrade without losing the data?',
    a: (
      <>
        Back up the volume, pull the new tag, let the migrations run at boot.
        {upgradeDocs ? (
          <>
            {' '}
            The procedure, and what to do when one fails, is in{' '}
            <a href={upgradeDocs} className={link}>
              backups and upgrades
            </a>
            .
          </>
        ) : null}
      </>
    ),
  },
  {
    q: 'What happens if the project stops?',
    a: (
      <>
        The code stays Apache 2.0 and forkable, and the data was never ours: it sits in your own
        Postgres and ClickHouse, which any client can read without us. Leaving costs you the one
        environment variable it took to arrive.
      </>
    ),
  },
]

export function Faq() {
  return (
    <Band tint labelledBy="faq-title">
      <Column className="py-[88px]">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <H2 id="faq-title">Before you run it</H2>
          {links.selfHostGuide ? (
            <a
              href={links.selfHostGuide}
              className="text-sm font-semibold text-accent-text hover:underline"
            >
              Self-host guide &rarr;
            </a>
          ) : null}
        </div>

        <Intro className="mt-5">The questions that come before the first container.</Intro>

        <dl className="mt-7">
          {questions.map(({ q, a }) => (
            <div
              key={q}
              className="grid gap-1 border-t border-border py-5 last:border-b md:grid-cols-[340px_1fr] md:gap-10"
            >
              <dt className="text-[15px] font-semibold">{q}</dt>
              <dd className="text-[15px] leading-[23px] text-muted-foreground">{a}</dd>
            </div>
          ))}
        </dl>
      </Column>
    </Band>
  )
}
