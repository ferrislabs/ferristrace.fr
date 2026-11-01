import { useState } from 'react'
import { cn } from '@cometrace/ui'
import { Check, Plus } from 'lucide-react'
import { CometMark } from '../../landing/comet-mark'

interface Stage {
  id: string
  label: string
  moment: string
  need: string
  /** Tools a team usually adds at this stage when assembling its own stack. */
  adds: string[]
  /** What already covers it in FerrisTrace. */
  covered: string
}

const stages: Stage[] = [
  {
    id: 'mvp',
    label: 'Day 1',
    moment: 'You ship the MVP.',
    need: 'See errors and slow requests before users report them.',
    adds: ['Error tracker', 'Tracing backend'],
    covered: 'Set two OTLP variables and traces arrive with their logs already linked.',
  },
  {
    id: 'customers',
    label: 'First customers',
    moment: 'People pay, and expect it to work.',
    need: 'Dashboards and uptime you can show.',
    adds: ['Metrics database', 'Dashboards', 'Log store'],
    covered: 'Metrics go to the same endpoint, and every chart opens the traces behind it.',
  },
  {
    id: 'outage',
    label: 'First outage',
    moment: 'Saturday night, checkout is down.',
    need: 'Someone has to get paged, pull people in and explain it on Monday.',
    adds: ['Paging tool', 'Incident tracker'],
    covered: 'The alert opens an incident with the evidence attached, and the timeline becomes your postmortem draft.',
  },
  {
    id: 'ai',
    label: 'AI feature',
    moment: 'You add an LLM to the product.',
    need: 'Know what each model call costs and how long it takes.',
    adds: ['LLM monitoring'],
    covered: 'Model calls are spans with tokens and cost, inside the request that made them.',
  },
  {
    id: 'enterprise',
    label: 'First enterprise deal',
    moment: 'The security questionnaire arrives.',
    need: 'They want single sign-on, an audit trail and data that stays put.',
    adds: ['SSO add-on', 'Audit export'],
    covered: 'OpenID Connect sign-in, the audit log and self-hosting come with every plan.',
  },
]

/**
 * A startup's first year, stage by stage. On the left, the tools a team
 * usually bolts on; on the right, FerrisTrace staying one block.
 */
export function GrowthTimeline() {
  const [index, setIndex] = useState(0)
  const stage = stages[index]
  const stack = stages.slice(0, index + 1).flatMap((s) => s.adds.map((tool) => ({ tool, fresh: s.id === stage.id })))

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <ol className="relative grid grid-cols-5 gap-1" aria-label="Stages">
        <span className="absolute inset-x-[10%] top-[13px] h-px bg-border" aria-hidden="true" />
        <span
          className="absolute left-[10%] top-[13px] h-px bg-primary transition-all duration-500"
          style={{ width: `${(index / (stages.length - 1)) * 80}%` }}
          aria-hidden="true"
        />
        {stages.map((s, i) => (
          <li key={s.id} className="relative flex justify-center">
            <button
              type="button"
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
              className="group flex flex-col items-center gap-2 text-center"
            >
              <span
                className={cn(
                  'flex size-7 items-center justify-center rounded-full border text-[11px] font-semibold transition-all',
                  i < index && 'border-primary bg-primary text-primary-foreground',
                  i === index && 'border-primary bg-card text-primary ring-4 ring-primary/15',
                  i > index && 'border-border bg-card text-faint-foreground group-hover:border-primary/50',
                )}
              >
                {i < index ? <Check className="size-3.5" aria-hidden="true" /> : i + 1}
              </span>
              <span className={cn('text-[12px] leading-tight', i === index ? 'font-semibold' : 'text-muted-foreground')}>
                {s.label}
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div key={stage.id} className="problem-panel mt-8 text-center" aria-live="polite">
        <p className="text-[17px] font-semibold">{stage.moment}</p>
        <p className="mt-1 text-sm text-muted-foreground">{stage.need}</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-dashed border-border p-4">
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-semibold">Assembling it yourself</p>
            <p className="font-mono text-[12px] text-destructive">{stack.length} tools</p>
          </div>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {stack.map(({ tool, fresh }) => (
              <li
                key={tool}
                className={cn(
                  'flex items-center gap-1 rounded-md border px-2 py-1 font-mono text-[11px]',
                  fresh
                    ? 'problem-step border-severity-error-border bg-severity-error-background text-severity-error-foreground'
                    : 'border-border bg-section-alt text-muted-foreground',
                )}
              >
                {fresh ? <Plus className="size-3" aria-hidden="true" /> : null}
                {tool}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[12px] text-muted-foreground">
            Every one of them needs deploying, upgrading, wiring to the others and paying for.
          </p>
        </div>

        <div className="rounded-lg border border-primary/50 bg-primary/5 p-4">
          <div className="flex items-baseline justify-between">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <CometMark className="size-4" />
              With FerrisTrace
            </p>
            <p className="font-mono text-[12px] text-success-text">1 tool</p>
          </div>
          <p key={stage.id} className="problem-step mt-3 flex gap-2 text-sm leading-6">
            <Check className="mt-1 size-4 shrink-0 text-success-text" aria-hidden="true" />
            {stage.covered}
          </p>
          <p className="mt-3 text-[12px] text-muted-foreground">It was already there, so there is nothing to install.</p>
        </div>
      </div>

      <div className="mt-5 flex justify-center">
        <button
          type="button"
          onClick={() => setIndex((i) => (i + 1) % stages.length)}
          className="rounded-md border border-border px-3 py-1.5 text-[13px] font-medium transition-colors hover:bg-accent"
        >
          {index === stages.length - 1 ? 'Start over' : `Next: ${stages[index + 1].label}`}
        </button>
      </div>
    </div>
  )
}
