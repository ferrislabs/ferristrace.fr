import { Card } from '@explainer/ui'
import { Container, SectionTitle } from './shared'

const shortcuts = [
  { keys: ['G', 'T'], action: 'Go to traces (L logs, M metrics)' },
  { keys: ['J', 'K'], action: 'Move through rows and spans' },
  { keys: ['↵'], action: 'Open the trace, expand the log record' },
  { keys: ['C'], action: 'Copy the id under the cursor' },
  { keys: ['/'], action: 'Focus the search field' },
  { keys: ['P'], action: 'Switch project' },
]

export function KeyboardFirst() {
  return (
    <section aria-labelledby="keyboard-title" className="py-20">
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <SectionTitle
            id="keyboard-title"
            title="Made for the tenth visit of the day."
            description="No onboarding tour, no dashboard to build first. 32 px rows, monospace ids, durations aligned to the right, light and dark themes that follow your system, and a shortcut for everything you do often."
          />

          <Card className="p-5">
            <dl className="divide-y divide-border">
              {shortcuts.map(({ keys, action }) => (
                <div key={action} className="flex min-h-8 items-center gap-4 py-1">
                  <dt className="flex w-16 shrink-0 items-center gap-1">
                    {keys.map((key) => (
                      <kbd
                        key={key}
                        className="inline-flex h-6 min-w-6 items-center justify-center rounded-sm border border-border bg-muted px-1.5 font-mono text-[11px] font-medium text-muted-foreground"
                      >
                        {key}
                      </kbd>
                    ))}
                  </dt>
                  <dd className="text-sm text-foreground">{action}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </Container>
    </section>
  )
}
