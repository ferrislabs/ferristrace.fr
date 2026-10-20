import { Badge, Button } from '@explainer/ui'
import { CopyCommand } from './copy-command'
import { Container, StartOnCloudButton } from './shared'
import { links } from './links'

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="pb-16 pt-18">
      <Container>
        <Badge variant="outline" className="gap-2 px-2.5 py-1">
          <span className="size-1.5 rounded-full bg-service-3" aria-hidden="true" />
          Open source · OpenTelemetry native
        </Badge>

        <h1
          id="hero-title"
          className="mt-6 max-w-[900px] text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.08] tracking-[-0.025em] text-balance"
        >
          Traces, metrics and logs in a single container.
        </h1>

        <p className="mt-5 max-w-[680px] text-[19px] leading-7 text-muted-foreground">
          Cometrace takes OpenTelemetry over OTLP and gives your team a fast, keyboard-first UI to
          debug a slow request or a burst of errors. Run it on your own server with one command, or
          let us run it for you. Same code, same UI.
        </p>

        <CopyCommand
          className="mt-8 max-w-[760px]"
          label="Copy the docker run command"
          lines={['$ docker run -d -p 8080:8080 -p 4318:4318 -v cometrace:/data [IMAGE]/cometrace']}
        />

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <StartOnCloudButton className="px-5" />
            <Button asChild variant="outline" className="px-5 font-semibold">
              <a href={links.docs}>Read the docs</a>
            </Button>
          </div>
          <p className="max-w-[460px] text-sm leading-6 text-faint-foreground">
            UI on :8080, OTLP/HTTP on :4318. The first boot prints a setup token, no default
            password.
          </p>
        </div>
      </Container>
    </section>
  )
}
