import type { ReactNode } from 'react'
import { Card } from '@cometrace/ui'
import { ChartGantt, ChartLine, Logs, type LucideIcon } from 'lucide-react'
import { Container, SectionTitle } from './shared'
import { SeverityPreview, SparklinePreview, WaterfallPreview } from './signal-previews'

interface SignalCard {
  title: string
  Icon: LucideIcon
  body: string
  preview: ReactNode
}

const signals: SignalCard[] = [
  {
    title: 'Traces',
    Icon: ChartGantt,
    body: 'Dense list, newest first, errors in the first column. A waterfall coloured by service, with every attribute typed: strings, ints, doubles, bools, bytes as hex, nested maps.',
    preview: <WaterfallPreview />,
  },
  {
    title: 'Logs',
    Icon: Logs,
    body: 'Filter by minimum severity, text and trace id. Severity always has an icon and a word, never colour alone. Expand a record to see its attributes and jump to its trace.',
    preview: <SeverityPreview />,
  },
  {
    title: 'Metrics',
    Icon: ChartLine,
    body: 'Search a metric name as you type, get one chart per attribute set on a shared scale, and switch to the raw points when you need the exact value.',
    preview: <SparklinePreview />,
  },
]

export function Signals() {
  return (
    <section
      aria-labelledby="signals-title"
      className="border-t border-border bg-section-alt py-20"
    >
      <Container>
        <SectionTitle
          id="signals-title"
          title="Three signals, linked by trace id."
          description="A log record knows its trace. A span knows its service. You go from a red line in the logs to the slow span that caused it in one keystroke."
        />

        <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
          {signals.map(({ title, Icon, body, preview }) => (
            <Card key={title} className="flex flex-col p-5">
              <div className="flex items-center gap-2">
                <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                <h3 className="text-[15px] font-semibold">{title}</h3>
              </div>
              <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{body}</p>
              <div className="mt-5 flex h-20 items-center border-t border-border pt-5">
                <div className="w-full">{preview}</div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}
