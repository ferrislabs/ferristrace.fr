import { useEffect, useState } from 'react'
import { cn } from '@cometrace/ui'
import { ArrowRight, Check, X, type LucideIcon } from 'lucide-react'
import { Frame, SectionTitle } from '../landing/shared'

/** One step of a workflow: the tool it happens in, and what you do there. */
export type Step = [tool: string, action: string]

/**
 * A situation told as two workflows: the steps it takes today, across the
 * tools it takes them in, and the steps it takes with FerrisTrace. The
 * difference is the pitch, so no screenshot is needed.
 */
export interface Problem {
  id: string
  Icon: LucideIcon
  title: string
  before: Step[]
  after: Step[]
  /** What the customer gets, in one sentence. */
  result: string
}

function summary(steps: Step[]) {
  const tools = new Set(steps.map(([tool]) => tool)).size
  return `${steps.length} step${steps.length > 1 ? 's' : ''} · ${tools} tool${tools > 1 ? 's' : ''}`
}

const ROTATE_MS = 9000

export interface ProblemTabsProps {
  /** Prefix for the section, tab and panel ids; unique per page. */
  id: string
  title: string
  description?: string
  problems: Problem[]
  /** Alternate background, for pages where the previous section is plain. */
  alt?: boolean
}

/**
 * Problem -> solution, one at a time. The tabs rotate on their own until the
 * visitor picks one; reduced motion keeps them still.
 */
export function ProblemTabs({ id, title, description, problems, alt = true }: ProblemTabsProps) {
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)

  useEffect(() => {
    if (!auto) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setAuto(false)
      return
    }
    const id = window.setTimeout(() => setActive((i) => (i + 1) % problems.length), ROTATE_MS)
    return () => window.clearTimeout(id)
  }, [active, auto])

  const select = (i: number) => {
    setAuto(false)
    setActive(i)
  }

  const current = problems[active]

  return (
    <Frame id={id} labelledBy={`${id}-title`} className={cn(alt && 'bg-surface-tint')}>
      <div className="border-b border-border px-5 py-20 sm:px-8 sm:py-28">
        <SectionTitle id={`${id}-title`} title={title} description={description} />
      </div>

      <div className="grid lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <div
          role="tablist"
          aria-label="Problems"
          aria-orientation="vertical"
          className="flex flex-col border-b border-border lg:border-b-0 lg:border-r"
        >
          {problems.map((problem, i) => {
            const selected = i === active
            return (
              <button
                key={problem.id}
                id={`${id}-tab-${problem.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${id}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(i)}
                onKeyDown={(e) => {
                  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
                  e.preventDefault()
                  const next =
                    (i + (e.key === 'ArrowDown' ? 1 : -1) + problems.length) % problems.length
                  select(next)
                  document.getElementById(`${id}-tab-${problems[next].id}`)?.focus()
                }}
                className={cn(
                  'relative flex items-center gap-3 overflow-hidden px-5 py-5 text-left transition-colors sm:px-8',
                  i < problems.length - 1 && 'border-b border-border',
                  selected
                    ? 'bg-card'
                    : 'text-muted-foreground hover:bg-foreground/[0.03] hover:text-foreground',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute inset-y-0 left-0 w-0.5 bg-primary transition-opacity',
                    selected ? 'opacity-100' : 'opacity-0',
                  )}
                />
                <span
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center border border-border',
                    selected ? 'bg-primary/10' : 'bg-transparent',
                  )}
                >
                  <problem.Icon
                    className={cn(
                      'size-4',
                      selected ? 'text-accent-text' : 'text-faint-foreground',
                    )}
                    aria-hidden="true"
                  />
                </span>
                <span className="text-[15px] font-medium">{problem.title}</span>
                {selected && auto ? (
                  <span
                    key={active}
                    aria-hidden="true"
                    className="problem-progress absolute bottom-0 left-0 h-0.5 bg-primary"
                    style={{ animationDuration: `${ROTATE_MS}ms` }}
                  />
                ) : null}
              </button>
            )
          })}
        </div>

        <div
          id={`${id}-panel`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${current.id}`}
          className="bg-card"
        >
          <div key={current.id} className="problem-panel flex h-full flex-col">
            <div className="grid flex-1 sm:grid-cols-2">
              <Workflow label="Today" steps={current.before} tone="before" />
              <Workflow label="With FerrisTrace" steps={current.after} tone="after" />
            </div>
            <p className="flex items-start gap-2 border-t border-border bg-primary/5 px-6 py-5 text-[15px] font-medium leading-6 sm:px-8">
              <ArrowRight className="mt-1 size-4 shrink-0 text-accent-text" aria-hidden="true" />
              {current.result}
            </p>
          </div>
        </div>
      </div>
    </Frame>
  )
}

function Workflow({
  label,
  steps,
  tone,
}: {
  label: string
  steps: Step[]
  tone: 'before' | 'after'
}) {
  const after = tone === 'after'
  return (
    <div
      className={cn(
        'p-6 sm:p-8',
        after ? 'border-t border-border sm:border-l sm:border-t-0' : 'bg-surface-tint',
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p
          className={cn(
            'flex items-center gap-2 font-pixel text-[11px] uppercase tracking-[0.08em]',
            after ? 'text-success-text' : 'text-destructive',
          )}
        >
          {after ? (
            <Check className="size-3.5" aria-hidden="true" />
          ) : (
            <X className="size-3.5" aria-hidden="true" />
          )}
          {label}
        </p>
        <span className="font-pixel text-[10px] uppercase tracking-[0.08em] text-faint-foreground">
          {summary(steps)}
        </span>
      </div>
      <ol className="mt-4 space-y-2.5">
        {steps.map(([tool, action], i) => (
          <li
            key={`${tool}-${action}`}
            className={cn('flex items-start gap-3', after && 'problem-step')}
            style={after ? { animationDelay: `${150 + i * 120}ms` } : undefined}
          >
            <span
              className={cn(
                'mt-0.5 flex size-5 shrink-0 items-center justify-center border font-pixel text-[10px]',
                after
                  ? 'border-success-text/40 bg-success-text/15 text-success-text'
                  : 'border-border bg-muted text-muted-foreground',
              )}
            >
              {i + 1}
            </span>
            <span className="min-w-0 text-sm leading-6">
              <span
                className={cn(
                  'mr-1.5 px-1.5 py-0.5 font-mono text-[11px]',
                  after ? 'bg-primary/10 text-accent-text' : 'bg-muted text-muted-foreground',
                )}
              >
                {tool}
              </span>
              <span className={after ? 'text-foreground' : 'text-muted-foreground'}>{action}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
