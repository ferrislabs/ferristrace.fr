import { Button, TooltipProvider } from '@explainer/ui'
import { Container, StartOnCloudButton } from './shared'
import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'
import { links } from './links'

export function NotFound() {
  return (
    <TooltipProvider delayDuration={250}>
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />

        <main id="main" className="flex flex-1 items-center">
          <Container className="py-24">
            <p className="font-mono text-sm text-muted-foreground">404</p>
            <h1 className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-bold tracking-[-0.025em]">
              That page does not exist.
            </h1>
            <p className="mt-3 max-w-[560px] text-base leading-7 text-muted-foreground">
              The link may be out of date. The docs and the changelog are the two places most links
              point to.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <StartOnCloudButton className="px-5" />
              <Button asChild variant="outline" className="px-5 font-semibold">
                <a href={links.docs}>Read the docs</a>
              </Button>
              <Button asChild variant="ghost" className="px-5 font-semibold">
                <a href="/">Back to home</a>
              </Button>
            </div>
          </Container>
        </main>

        <SiteFooter />
      </div>
    </TooltipProvider>
  )
}
