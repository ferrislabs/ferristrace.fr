import { Button } from '@cometrace/ui'
import { ArrowRight } from 'lucide-react'
import { Container, StartOnCloudButton } from './shared'
import { links } from './links'

/**
 * Product first: what the team gets, two actions, nothing to read twice.
 * The setup details live further down, next to the editions.
 */
export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="scroll-mt-20 pb-16 pt-20 sm:pt-28">
      <Container className="flex flex-col items-center text-center">
        <a
          href={links.features}
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <span className="size-1.5 rounded-full bg-service-3" aria-hidden="true" />
          One product for observability, incidents and AI agents
          <ArrowRight
            className="size-3 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </a>

        <h1
          id="hero-title"
          className="mt-7 max-w-[920px] text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.04] tracking-[-0.035em] text-balance"
        >
          Find what broke.
          <br />
          <span className="text-muted-foreground">Fix it and go back to bed.</span>
        </h1>

        <p className="mt-6 max-w-[620px] text-lg leading-8 text-muted-foreground text-pretty">
          FerrisTrace keeps your traces, logs, Kubernetes state and LLM calls linked together.
          When the alert fires, you open an incident and the evidence is already in it.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <StartOnCloudButton size="lg" className="px-6">
            Get started for free
          </StartOnCloudButton>
          <Button asChild size="lg" variant="outline" className="px-6 font-semibold">
            <a href={links.docs}>Read the docs</a>
          </Button>
        </div>

        <p className="mt-5 text-sm text-faint-foreground">
          Open source · Self-host with one command · Cloud is free during the beta
        </p>
      </Container>
    </section>
  )
}
