import type { ReactNode } from 'react'
import { Badge, Button, Card, Separator, cn } from '@cometrace/ui'
import { CheckList, Container, SectionTitle, StartOnCloudButton } from './shared'
import { links } from './links'

const selfHosted = [
  'Setup token printed at first boot, no default password',
  'Projects, ingest keys and api tokens per workspace',
  'Local accounts, plus OpenID Connect when you configure it',
  'Retention in days, set by an admin',
]

const cloud = [
  'Same UI and API as self-hosted',
  'Regions: [REGIONS]',
  'Retention up to [N] days',
  'Export your data and move to self-hosted any time',
]

export function Editions() {
  return (
    <section
      aria-labelledby="editions-title"
      className="border-t border-border bg-section-alt py-20"
    >
      <Container>
        <SectionTitle
          id="editions-title"
          title="Run it yourself, or don't."
          description="The cloud edition is the same codebase and the same UI. Moving between the two changes where the container runs, nothing else."
        />

        <div className="mt-10 grid items-stretch gap-4 md:grid-cols-2">
          <EditionCard
            id="self-host"
            title="Self-hosted"
            aside={<Badge variant="outline">[LICENSE]</Badge>}
            body="One container, one volume. Your data stays on your server."
            items={selfHosted}
            action={
              <Button asChild variant="outline" className="w-full font-semibold">
                <a href={links.selfHostGuide}>Self-host guide</a>
              </Button>
            }
          />

          <EditionCard
            id="cloud"
            title="Cloud"
            highlighted
            aside={<span className="font-mono text-sm text-foreground">[PRICE]</span>}
            body="We run, upgrade and back up the container. You get a workspace and an ingest key."
            items={cloud}
            action={<StartOnCloudButton className="w-full" />}
          />
        </div>
      </Container>
    </section>
  )
}

interface EditionCardProps {
  id: string
  title: string
  aside: ReactNode
  body: string
  items: string[]
  action: ReactNode
  highlighted?: boolean
}

function EditionCard({
  id,
  title,
  aside,
  body,
  items,
  action,
  highlighted = false,
}: EditionCardProps) {
  return (
    <Card
      id={id}
      className={cn(
        'flex scroll-mt-20 flex-col p-5',
        highlighted && 'border-primary ring-1 ring-primary',
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-[15px] font-semibold">{title}</h3>
        {aside}
      </div>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>

      <Separator className="my-5" />

      <CheckList items={items} />

      <div className="mt-auto pt-6">{action}</div>
    </Card>
  )
}
