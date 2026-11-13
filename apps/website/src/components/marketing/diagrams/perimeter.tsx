import { useState } from 'react'
import { cn } from '@cometrace/ui'
import { Check, Cloud, KeyRound, Lock, Server, X } from 'lucide-react'
import { FerrisMark } from '../../landing/ferris-mark'

type Mode = 'saas' | 'self'

const questions: Array<{ id: string; q: string; saas: string; self: string }> = [
  {
    id: 'where',
    q: 'Where is our telemetry stored?',
    saas: "In the vendor's cloud, in a region they pick, kept as long as they decide.",
    self: 'On your servers, in your network, under the retention you set.',
  },
  {
    id: 'who',
    q: 'Who can sign in?',
    saas: "Anyone with an account in the vendor's user base. SSO is often a paid add-on.",
    self: "Only identities from your provider, over OpenID Connect. Disable a leaver's account and their access goes with it.",
  },
  {
    id: 'audit',
    q: 'Can we prove who read a log line?',
    saas: 'Only if the vendor logs access, and only for what they expose.',
    self: 'Every read and write by people, API tokens and agents is in the audit log.',
  },
  {
    id: 'agents',
    q: 'What can AI agents reach?',
    saas: 'Whatever the API key you gave them can reach, which is often everything.',
    self: 'Only the scopes FerrisKey grants, for a limited time. Admin is never grantable.',
  },
  {
    id: 'exit',
    q: 'Can we leave?',
    saas: 'You export what the vendor lets you export, then rebuild your dashboards somewhere else.',
    self: 'It is Apache 2.0 software running on your own machines, so there is no vendor to leave.',
  },
]

const services = ['checkout', 'payments', 'customers']

/**
 * Your network as a box. In SaaS mode telemetry crosses the boundary; in
 * self-hosted mode it never does. The questions on the right are the ones a
 * security review asks, answered for the mode you picked.
 */
export function Perimeter() {
  const [mode, setMode] = useState<Mode>('saas')
  const [questionId, setQuestionId] = useState(questions[0].id)
  const question = questions.find((q) => q.id === questionId)!
  const saas = mode === 'saas'

  return (
    <div className="overflow-hidden border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <p className="text-sm font-semibold">Where does your telemetry go?</p>
        <div
          className="flex items-center gap-1 border border-border p-0.5"
          role="group"
          aria-label="Deployment model"
        >
          {(
            [
              ['saas', 'Typical SaaS'],
              ['self', 'FerrisTrace self-hosted'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={mode === id}
              onClick={() => setMode(id)}
              className={cn(
                'px-2.5 py-1 text-[12px] font-medium transition-colors',
                mode === id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="grid items-center gap-3 p-5 sm:grid-cols-[minmax(0,1fr)_72px_minmax(0,0.8fr)]">
          <div className="border-2 border-dashed border-primary/40 p-4">
            <p className="flex items-center gap-1.5 font-mono text-[11px] text-faint-foreground">
              <Lock className="size-3" aria-hidden="true" />
              your network
            </p>
            <ul className="mt-3 space-y-1.5">
              {services.map((s) => (
                <li
                  key={s}
                  className="flex items-center gap-2 border border-border bg-surface-tint px-2 py-1.5 font-mono text-[11px]"
                >
                  <Server className="size-3 text-faint-foreground" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
            <div
              className={cn(
                'mt-3 grid grid-cols-2 gap-1.5 transition-opacity duration-300',
                saas ? 'opacity-30' : 'opacity-100',
              )}
            >
              <span className="flex items-center gap-1.5 border border-primary/50 bg-primary/5 px-2 py-1.5 text-[11px] font-semibold">
                <FerrisMark className="size-3.5" />
                FerrisTrace
              </span>
              <span className="flex items-center gap-1.5 border border-primary/50 bg-primary/5 px-2 py-1.5 text-[11px] font-semibold">
                <KeyRound className="size-3.5 text-primary" aria-hidden="true" />
                FerrisKey
              </span>
            </div>
            <p
              className={cn(
                'mt-2 text-[11px]',
                saas ? 'text-faint-foreground' : 'text-success-text',
              )}
            >
              {saas ? 'nothing kept here' : 'telemetry stored and read here'}
            </p>
          </div>

          <div className="flex flex-col items-center gap-1.5 py-2" aria-hidden="true">
            {['logs', 'traces', 'user ids'].map((label) => (
              <div key={label} className="flex w-full flex-col items-center">
                <svg viewBox="0 0 72 8" className="h-2 w-full">
                  <line
                    x1="0"
                    y1="4"
                    x2="72"
                    y2="4"
                    stroke={saas ? 'var(--destructive)' : 'var(--border)'}
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className={cn(saas && 'pipeline-flow')}
                  />
                </svg>
                <span
                  className={cn(
                    'font-mono text-[10px]',
                    saas ? 'text-destructive' : 'text-faint-foreground line-through',
                  )}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div
            className={cn(
              'border p-4 transition-all duration-300',
              saas
                ? 'border-severity-error-border bg-severity-error-background'
                : 'border-border opacity-40',
            )}
          >
            <p className="flex items-center gap-1.5 font-mono text-[11px] text-faint-foreground">
              <Cloud className="size-3" aria-hidden="true" />
              vendor cloud
            </p>
            <ul className="mt-3 space-y-1 text-[12px]">
              <li>another region</li>
              <li>their retention</li>
              <li>their staff access</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border bg-surface-tint p-5 lg:border-l lg:border-t-0">
          <p className="font-pixel text-[10px] uppercase tracking-[0.08em] text-faint-foreground">
            Security review
          </p>
          <ul className="mt-3 space-y-1">
            {questions.map((q) => (
              <li key={q.id}>
                <button
                  type="button"
                  aria-pressed={q.id === question.id}
                  onClick={() => setQuestionId(q.id)}
                  className={cn(
                    'flex w-full items-center gap-2 px-2 py-1.5 text-left text-[13px] transition-colors',
                    q.id === question.id
                      ? 'bg-card font-semibold'
                      : 'text-muted-foreground hover:bg-card/60',
                  )}
                >
                  {saas ? (
                    <X className="size-3.5 shrink-0 text-destructive" aria-hidden="true" />
                  ) : (
                    <Check className="size-3.5 shrink-0 text-success-text" aria-hidden="true" />
                  )}
                  {q.q}
                </button>
              </li>
            ))}
          </ul>
          <p
            key={`${mode}-${question.id}`}
            aria-live="polite"
            className={cn(
              'problem-panel mt-4 border p-3 text-sm leading-6',
              saas ? 'border-severity-error-border bg-card' : 'border-primary/30 bg-primary/5',
            )}
          >
            {saas ? question.saas : question.self}
          </p>
        </div>
      </div>
    </div>
  )
}
