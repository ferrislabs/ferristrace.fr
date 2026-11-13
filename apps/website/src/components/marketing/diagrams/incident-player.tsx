import { useEffect, useState } from 'react'
import { Badge, cn } from '@cometrace/ui'
import {
  BellRing,
  FileText,
  Link2,
  Pause,
  Play,
  RotateCcw,
  Siren,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

interface Step {
  Icon: LucideIcon
  label: string
  time: string
  status: { text: string; tone: 'error' | 'warn' | 'success' }
  event: string
  explain: string
}

const steps: Step[] = [
  {
    Icon: BellRing,
    label: 'Alert fires',
    time: '14:32:07',
    status: { text: 'FIRING', tone: 'error' },
    event: 'alert · checkout p99 above 1s for 2 minutes',
    explain:
      'p99 has been over 1 s for two minutes. The alert comes with the slowest trace attached, so you start from a real request.',
  },
  {
    Icon: Siren,
    label: 'Incident declared',
    time: '14:32:40',
    status: { text: 'SEV-2 · investigating', tone: 'error' },
    event: 'incident INC-482 declared · on-call @marie paged',
    explain:
      'You declare the incident from the alert, give it a severity and an owner, and the on-call gets paged.',
  },
  {
    Icon: Link2,
    label: 'Evidence attached',
    time: '14:34:12',
    status: { text: 'SEV-2 · identified', tone: 'warn' },
    event: 'trace 4bf92f35 · 42 logs · payments error-rate metric attached',
    explain:
      'The trace, 42 log lines and the payments error rate land on the timeline. About two minutes after the alert, deploy v2.14 looks like the cause.',
  },
  {
    Icon: Wrench,
    label: 'Fix shipped',
    time: '14:41:12',
    status: { text: 'resolved', tone: 'success' },
    event: 'rollback to v2.13 · p99 back to 180ms · incident resolved',
    explain:
      'After the rollback, p99 is back to 180 ms on the metric that fired the alert. You close the incident because the graph says so.',
  },
  {
    Icon: FileText,
    label: 'Postmortem',
    time: '14:55:00',
    status: { text: 'postmortem drafted', tone: 'success' },
    event: 'postmortem drafted from the timeline · 2 follow-ups created',
    explain:
      'The timeline becomes the first draft of the postmortem, with two follow-ups already filed. Nobody has to dig through Slack next week.',
  },
]

const tone = {
  error: 'border-severity-error-border bg-severity-error-background text-severity-error-foreground',
  warn: 'border-severity-warn-border bg-severity-warn-background text-severity-warn-foreground',
  success: 'border-success-text/40 bg-success-text/10 text-success-text',
}

const STEP_MS = 3200

/** The life of one incident, played step by step or clicked through. */
export function IncidentPlayer() {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const done = step === steps.length - 1

  useEffect(() => {
    if (!playing) return
    if (done) {
      setPlaying(false)
      return
    }
    const id = window.setTimeout(() => setStep((s) => s + 1), STEP_MS)
    return () => window.clearTimeout(id)
  }, [playing, step, done])

  const current = steps[step]

  return (
    <div className="overflow-hidden border border-border bg-card">
      <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
        <button
          type="button"
          onClick={() => {
            if (done) setStep(0)
            setPlaying((p) => !p || done)
          }}
          className="inline-flex items-center gap-1.5 bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          {playing ? (
            <Pause className="size-3.5" aria-hidden="true" />
          ) : done ? (
            <RotateCcw className="size-3.5" aria-hidden="true" />
          ) : (
            <Play className="size-3.5" aria-hidden="true" />
          )}
          {playing ? 'Pause' : done ? 'Replay' : 'Play the incident'}
        </button>
        <ol className="ml-auto flex flex-wrap gap-1" aria-label="Incident steps">
          {steps.map((s, i) => (
            <li key={s.label}>
              <button
                type="button"
                aria-current={i === step ? 'step' : undefined}
                onClick={() => {
                  setPlaying(false)
                  setStep(i)
                }}
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium transition-colors',
                  i === step
                    ? 'bg-accent text-foreground ring-1 ring-primary/40'
                    : i < step
                      ? 'text-foreground hover:bg-accent'
                      : 'text-faint-foreground hover:bg-accent',
                )}
              >
                <s.Icon className="size-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="p-5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[15px] font-semibold">INC-482 · checkout latency</h3>
            <Badge
              variant="outline"
              className={cn(
                'ml-auto font-mono text-[11px] font-medium transition-colors',
                tone[current.status.tone],
              )}
            >
              {current.status.text}
            </Badge>
          </div>
          <ol className="mt-5 border-l border-border pl-5">
            {steps.slice(0, step + 1).map((s, i) => (
              <li
                key={s.label}
                className={cn('relative pb-4 last:pb-0', i === step && 'problem-panel')}
              >
                <span
                  className={cn(
                    'absolute -left-[25px] top-1 flex size-2.5 border-2 border-card',
                    i === step ? 'bg-primary' : 'bg-faint-foreground',
                  )}
                  aria-hidden="true"
                />
                <span className="font-mono text-[11px] text-faint-foreground">{s.time}</span>
                <p
                  className={cn(
                    'mt-0.5 font-mono text-[12px] leading-5',
                    i === step ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {s.event}
                </p>
              </li>
            ))}
          </ol>
        </div>
        <div
          key={step}
          aria-live="polite"
          className="problem-panel flex flex-col justify-center border-t border-border bg-surface-tint p-6 lg:border-l lg:border-t-0"
        >
          <p className="font-pixel text-[10px] uppercase tracking-[0.08em] text-primary">
            Step {step + 1} of {steps.length} · {current.label}
          </p>
          <p className="mt-3 text-[15px] leading-7">{current.explain}</p>
          <div className="mt-5 h-1 bg-muted">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
