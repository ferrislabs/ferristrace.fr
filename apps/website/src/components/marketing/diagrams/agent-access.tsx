import { useState } from 'react'
import { cn } from '@cometrace/ui'
import { ArrowRight, Bot, Check, KeyRound, ShieldCheck, X } from 'lucide-react'
import { FerrisMark } from '../../landing/ferris-mark'

const scopes = [
  { id: 'telemetry:read', label: 'Read traces, logs and metrics' },
  { id: 'incidents:comment', label: 'Comment on incidents' },
  { id: 'incidents:resolve', label: 'Resolve incidents' },
] as const

type ScopeId = (typeof scopes)[number]['id']

const actions: Array<{ text: string; needs: ScopeId | 'admin' }> = [
  { text: 'Read the traces of checkout for the last hour', needs: 'telemetry:read' },
  { text: 'Post a root-cause summary on INC-482', needs: 'incidents:comment' },
  { text: 'Mark INC-482 as resolved', needs: 'incidents:resolve' },
  { text: 'Delete the project checkout', needs: 'admin' },
]

/**
 * Agent -> FerrisKey -> FerrisTrace, with the token's scopes as switches.
 * Every action the agent tries is checked against them, live: the visitor
 * sees that the agent can only do what it was given, and that "admin" is
 * never on the table.
 */
export function AgentAccess() {
  const [granted, setGranted] = useState<Set<ScopeId>>(
    () => new Set<ScopeId>(['telemetry:read', 'incidents:comment']),
  )

  const toggle = (id: ScopeId) =>
    setGranted((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const allowed = (needs: ScopeId | 'admin') => needs !== 'admin' && granted.has(needs)
  const scopeText = granted.size ? [...granted].join(' ') : '(none)'

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="grid items-center gap-3 border-b border-border p-5 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <Actor Icon={Bot} title="triage-agent" sub="your AI agent" />
        <ArrowRight className="mx-auto size-4 rotate-90 text-faint-foreground sm:rotate-0" aria-hidden="true" />
        <Actor Icon={KeyRound} title="FerrisKey" sub="issues a scoped token" highlight />
        <ArrowRight className="mx-auto size-4 rotate-90 text-faint-foreground sm:rotate-0" aria-hidden="true" />
        <Actor mark title="FerrisTrace" sub="checks every call" />
      </div>

      <div className="grid lg:grid-cols-2">
        <fieldset className="p-5">
          <legend className="text-xs font-semibold uppercase tracking-wide text-faint-foreground">
            Token scopes
          </legend>
          <div className="mt-3 space-y-2">
            {scopes.map((scope) => {
              const on = granted.has(scope.id)
              return (
                <label
                  key={scope.id}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors',
                    on ? 'border-primary/50 bg-primary/5' : 'border-border hover:bg-accent/60',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggle(scope.id)}
                    className="size-4 accent-[var(--primary)]"
                  />
                  <span>
                    <span className="block font-mono text-[12px]">{scope.id}</span>
                    <span className="block text-[13px] text-muted-foreground">{scope.label}</span>
                  </span>
                </label>
              )
            })}
          </div>
          <p className="mt-4 rounded-md bg-muted px-3 py-2 font-mono text-[11px] text-muted-foreground">
            scope=&quot;{scopeText}&quot; · expires in 12h
          </p>
        </fieldset>

        <div className="border-t border-border bg-section-alt p-5 lg:border-l lg:border-t-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-faint-foreground">
            What the agent tries
          </p>
          <ul className="mt-3 space-y-2" aria-live="polite">
            {actions.map((action) => {
              const ok = allowed(action.needs)
              return (
                <li
                  key={action.text}
                  className={cn(
                    'flex items-start gap-3 rounded-lg border p-3 text-[13px] transition-colors',
                    ok ? 'border-success-text/40 bg-success-text/5' : 'border-severity-error-border bg-severity-error-background',
                  )}
                >
                  {ok ? (
                    <Check className="mt-0.5 size-4 shrink-0 text-success-text" aria-hidden="true" />
                  ) : (
                    <X className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
                  )}
                  <span className="flex-1">
                    {action.text}
                    <span className="mt-0.5 block font-mono text-[11px] text-faint-foreground">
                      {ok ? 'allowed · logged in audit' : action.needs === 'admin' ? 'denied · never grantable to an agent' : `denied · needs ${action.needs}`}
                    </span>
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

function Actor({
  Icon,
  mark,
  title,
  sub,
  highlight,
}: {
  Icon?: typeof Bot
  mark?: boolean
  title: string
  sub: string
  highlight?: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border p-3',
        highlight ? 'border-primary/50 bg-primary/5' : 'border-border bg-background',
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-card">
        {mark ? <FerrisMark className="size-4" /> : Icon ? <Icon className="size-4 text-primary" aria-hidden="true" /> : null}
      </span>
      <span>
        <span className="flex items-center gap-1.5 text-sm font-semibold">
          {title}
          {highlight ? <ShieldCheck className="size-3.5 text-success-text" aria-hidden="true" /> : null}
        </span>
        <span className="block text-[12px] text-muted-foreground">{sub}</span>
      </span>
    </div>
  )
}
