import { CopyCommand } from './copy-command'
import { Container, SectionTitle } from './shared'

export function Instrument() {
  return (
    <section aria-labelledby="instrument-title" className="py-20">
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <SectionTitle
            id="instrument-title"
            title="Your first span in two lines."
            description="No Cometrace SDK. Any OpenTelemetry SDK or Collector already speaks OTLP; point it here with an ingest key."
          />

          <CopyCommand
            label="Copy the OTLP exporter environment variables"
            lines={[
              'export OTEL_EXPORTER_OTLP_ENDPOINT=https://cometrace.example.com',
              'export OTEL_EXPORTER_OTLP_HEADERS="authorization=Bearer cmt_ik_…"',
            ]}
          />
        </div>
      </Container>
    </section>
  )
}
