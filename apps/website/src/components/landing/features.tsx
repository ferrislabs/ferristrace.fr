import type { ReactNode } from 'react'
import { Button, cn } from '@cometrace/ui'
import { ArrowRight } from 'lucide-react'
import { Container } from './shared'
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
  /** Anchor used by the header and the mascot tour. */
  id: string
  title: string
  body: string
  preview: ReactNode
  wide?: boolean
}

const features: Feature[] = [
  {
    id: 'tracing',
    title: 'Tracing.',
    body: 'Follow a request through every service it touched and find the span that ate the time.',
    preview: <TracePreview />,
    wide: true,
  },
  {
    id: 'logs',
    title: 'Logs.',
    body: 'Search your logs, then click an error to open the request that threw it.',
    preview: <LogsPreview />,
  },
  {
    id: 'infra',
    title: 'Infrastructure.',
    body: 'See which pod is crash-looping and which deploy put it there.',
    preview: <InfraPreview />,
  },
  {
    id: 'incidents',
    title: 'Incidents.',
    body: 'Declare an incident straight from the alert, with the evidence already attached.',
    preview: <IncidentPreview />,
  },
  {
    id: 'ai',
    title: 'AI observability.',
    body: 'See what each LLM call cost and how long it took, by model and by feature.',
    preview: <AiPreview />,
  },
  {
    id: 'metrics',
    title: 'Metrics.',
    body: 'When p99 jumps, click the spike to see the traces behind it.',
    preview: <MetricsPreview />,
  },
  {
    id: 'agents',
    title: 'Secure AI agents.',
    body: 'Agents can read telemetry and help triage incidents with scoped FerrisKey tokens. You can audit what they did and revoke a token at any time.',
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
    <section id="features" aria-labelledby="features-title" className="scroll-mt-20 py-24">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2
            id="features-title"
            className="max-w-[620px] text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.08] tracking-[-0.03em] text-balance"
          >
            Built for the bad nights.
            <span className="text-muted-foreground"> Handy on the quiet days too.</span>
          </h2>
          <div className="max-w-[360px] md:text-right">
            <p className="text-[15px] leading-6 text-muted-foreground">
              Take an incident from the first alert to the postmortem without opening another tool.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4 font-semibold">
              <a href={links.docs}>
                Explore the docs <ArrowRight aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.id}
              id={feature.id}
              aria-labelledby={`feature-${feature.id}`}
              className={cn(
                'group flex scroll-mt-24 flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/40',
                feature.wide && 'md:col-span-2',
              )}
            >
              <p className="p-6 pb-0 text-[17px] leading-7 text-muted-foreground">
                <span id={`feature-${feature.id}`} className="font-semibold text-foreground">
                  {feature.title}
                </span>{' '}
                {feature.body}
              </p>
              <div className="mt-auto px-6 pb-6 pt-8">
                <div className="transition-transform duration-300 ease-out group-hover:-translate-y-1">
                  {feature.preview}
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
