import { ArrowRight } from 'lucide-react'
import type { Suggestion } from '../../lib/suggest'

/** Renders nothing at all when no route scored well enough. */
export function Suggestions({ suggestions }: { suggestions: Suggestion[] }) {
  if (suggestions.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-muted-foreground">Did you mean</p>
      <ul className="flex flex-col gap-1.5">
        {suggestions.map((suggestion) => (
          <li key={suggestion.path}>
            <a
              href={suggestion.path}
              className="-mx-2 flex items-baseline gap-2 rounded-md px-2 py-1 text-sm transition-colors hover:bg-accent"
            >
              <ArrowRight
                aria-hidden="true"
                className="size-4 shrink-0 translate-y-0.5 text-faint-foreground"
              />
              <span className="text-accent-text">{suggestion.title}</span>
              <span className="truncate font-mono text-xs text-faint-foreground">
                {suggestion.path}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
