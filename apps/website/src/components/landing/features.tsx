import type { ReactNode } from 'react'
import { cn } from '@cometrace/ui'
import { Frame, SectionTitle } from './shared'
import { links } from './links'
import {
  AgentPreview,
  AiPreview,
  IncidentPreview,
  InfraPreview,
  LogsPreview,
  MetricsPreview,
  TracePreview,
} from './feature-previews'

interface Feature {
  /** Anchor used by the header. */
  id: string
  title: string
  body: string
  href: string
  preview: ReactNode
  wide?: boolean
}

const features: Feature[] = [
  {
    id: 'tracing',
    title: 'Tracing.',
    body: 'Follow a request through every service it touched and find the span that ate the time.',
    href: '/product/observability',
    preview: <TracePreview />,
    wide: true,
  },
  {
    id: 'logs',
    title: 'Logs.',
    body: 'Search your logs, then click an error to open the request that threw it.',
    href: '/product/observability',
    preview: <LogsPreview />,
  },
  {
    id: 'infra',
    title: 'Infrastructure.',
    body: 'See which pod is crash-looping and which deploy put it there.',
    href: '/product/infrastructure',
    preview: <InfraPreview />,
  },
  {
    id: 'incidents',
    title: 'Incidents.',
    body: 'Declare an incident straight from the alert, with the evidence already attached.',
    href: '/product/incidents',
    preview: <IncidentPreview />,
  },
  {
    id: 'ai',
    title: 'AI observability.',
    body: 'See what each LLM call cost and how long it took, by model and by feature.',
    href: '/product/ai-observability',
    preview: <AiPreview />,
  },
  {
    id: 'metrics',
    title: 'Metrics.',
    body: 'When p99 jumps, click the spike to see the traces behind it.',
    href: '/product/observability',
    preview: <MetricsPreview />,
  },
  {
    id: 'agents',
    title: 'Secure AI agents.',
    body: 'Agents can read telemetry and help triage incidents with scoped FerrisKey tokens. You can audit what they did and revoke a token at any time.',
    href: '/product/ai-agents',
    preview: <AgentPreview className="max-w-[380px]" />,
    wide: true,
  },
]

/**
 * Every capability as one tile: a sentence and a glimpse of the screen.
 * Text stays short on purpose, the preview does the explaining.
 */
export function Features() {
  return (
    <Frame
      id="features"
      labelledBy="features-title"
      className="scroll-mt-20"
      innerClassName="overflow-hidden"
    >
      <div className="flex flex-col gap-8 border-b border-border px-5 py-20 sm:px-8 sm:py-28 md:flex-row md:items-end md:justify-between">
        <SectionTitle
          id="features-title"
          kicker="Features"
          title="Built for the bad nights. Handy on the quiet days too."
          description="Take an incident from the first alert to the postmortem without opening another tool."
        />
        <a
          href={links.docs}
          className="inline-flex shrink-0 items-center gap-2 self-start border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-foreground/[0.04] md:self-auto"
        >
          Explore the docs
          <span aria-hidden="true">→</span>
        </a>
      </div>

      <div className="-mr-px grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.id}
            id={feature.id}
            aria-labelledby={`feature-${feature.id}`}
            className={cn(
              'group relative flex scroll-mt-24 flex-col border-b border-r border-border transition-colors hover:bg-foreground/[0.03]',
              feature.wide && 'md:col-span-2',
            )}
          >
            <div className="flex items-start justify-between gap-4 p-6 pb-0 sm:p-8 sm:pb-0">
              <p className="text-[15px] leading-7 text-muted-foreground">
                <a
                  href={feature.href}
                  id={`feature-${feature.id}`}
                  className="font-medium text-foreground after:absolute after:inset-0 focus:outline-none"
                >
                  {feature.title}
                </a>{' '}
                {feature.body}
              </p>
              <span
                aria-hidden="true"
                className="shrink-0 pt-1 font-pixel text-[10px] uppercase tracking-[0.08em] text-faint-foreground transition-colors group-hover:text-accent-text"
              >
                →
              </span>
            </div>
            <div className="mt-auto px-6 pb-6 pt-8 sm:px-8 sm:pb-8">{feature.preview}</div>
            <span
              className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
              aria-hidden="true"
            />
          </article>
        ))}
      </div>
    </Frame>
  )
}
