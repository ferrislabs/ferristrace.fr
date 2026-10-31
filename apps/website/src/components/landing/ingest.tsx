import { CodeBlock } from './code-block'
import { Band, Column } from './frame'
import { H2, Intro } from './ui'

/** The three stops, left to right. The last one is the only highlighted box. */
const stops = [
  { title: 'checkout-api', detail: '@opentelemetry/sdk-node' },
  { title: 'OTLP over HTTP or gRPC', detail: ':4318 · :4317' },
  { title: 'FerrisTrace, on your server', detail: 'one container · /data volume', here: true },
]

/** A 64 px grid, the only patterned ground on the page, inside the frame. */
const grid = {
  backgroundImage:
    'linear-gradient(to right, var(--border-subtle) 1px, transparent 1px), linear-gradient(to bottom, var(--border-subtle) 1px, transparent 1px)',
  backgroundSize: '64px 64px',
}

export function Ingest() {
  return (
    <Band labelledBy="ingest-title">
      <Column className="py-[88px]">
        <H2 id="ingest-title">How your data gets in</H2>
        <Intro className="mt-5">
          FerrisTrace has no SDK of its own. Anything that speaks OTLP works: the OpenTelemetry
          SDKs, the Collector, Grafana Alloy, Vector. Removing us later is one environment
          variable.
        </Intro>

        <div className="mt-6 max-w-[560px]">
          <p className="mb-2 text-sm text-muted-foreground">In your app&rsquo;s environment:</p>
          <CodeBlock code="OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318" />
        </div>

        <div className="mt-10 border border-border px-5 py-7 md:px-12 md:py-12" style={grid}>
          <div className="mx-auto flex max-w-[860px] flex-col items-stretch md:flex-row md:items-center">
            {stops.map((stop, index) => (
              <div key={stop.title} className="contents">
                {index > 0 ? <Wire order={index - 1} /> : null}
                <div
                  className={`w-full rounded-[2px] border bg-card px-4 py-3.5 text-[13.5px] md:w-[230px] md:shrink-0 ${
                    stop.here ? 'border-primary' : 'border-border'
                  }`}
                >
                  <p className="font-semibold">{stop.title}</p>
                  <p className="mt-0.5 font-mono text-[12px] text-faint-foreground">
                    {stop.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Column>
    </Band>
  )
}

/**
 * The dashed run between two stops, with a turned square crossing it.
 *
 * `order` offsets the two wires by half a cycle, so the diagram shows a steady
 * stream rather than two squares moving in lockstep.
 */
function Wire({ order }: { order: number }) {
  return (
    <span
      aria-hidden="true"
      className="relative flex h-9 w-full shrink-0 items-center justify-center md:h-auto md:min-w-10 md:flex-1 md:self-stretch"
    >
      <span className="absolute inset-y-0 left-1/2 w-0 -translate-x-1/2 border-l-[1.5px] border-dashed border-faint-foreground md:inset-x-0 md:inset-y-auto md:left-0 md:top-1/2 md:h-0 md:w-full md:-translate-x-0 md:-translate-y-1/2 md:border-l-0 md:border-t-[1.5px]" />
      <span
        className="packet size-2 rotate-45 bg-foreground"
        style={{ animationDelay: `${order * 900}ms` }}
      />
    </span>
  )
}
