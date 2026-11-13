import type { Suggestion } from '../../lib/suggest'
import { products, solutions } from '../landing/catalog'
import { Frame } from '../landing/shared'
import { PixelSprite } from '../pixel/pixel-sprite'
import { cometCrab, key } from '../pixel/sprites'

const entries = [...products, ...solutions]

/** Product and solution pages carry their own sprite; the docs get the key. */
function spriteFor(suggestion: Suggestion) {
  return (
    entries.find((entry) => entry.href === suggestion.href)?.sprite ??
    (suggestion.local ? cometCrab : key)
  )
}

/** Renders nothing at all when no route scored well enough. */
export function Suggestions({ suggestions }: { suggestions: Suggestion[] }) {
  if (suggestions.length === 0) return null

  return (
    <Frame labelledBy="suggestions-title" innerClassName="overflow-hidden">
      <div className="border-b border-border px-5 py-8 sm:px-8">
        <h2
          id="suggestions-title"
          className="font-pixel text-[11px] font-normal uppercase tracking-[0.08em] text-accent-text"
        >
          Did you mean
        </h2>
      </div>
      <ul className="-mr-px grid sm:grid-cols-2 lg:grid-cols-3">
        {suggestions.map((suggestion) => (
          <li key={suggestion.path} className="border-b border-r border-border">
            <a
              href={suggestion.href}
              className="group relative flex h-full items-center gap-4 px-6 py-6 transition-colors hover:bg-foreground/[0.03]"
            >
              <PixelSprite sprite={spriteFor(suggestion)} className="block size-8 shrink-0" />
              <span className="min-w-0">
                <span className="block text-[15px] font-medium tracking-[-0.01em]">
                  {suggestion.title}
                </span>
                <span className="mt-1 block truncate font-pixel text-[10px] uppercase tracking-[0.08em] text-faint-foreground">
                  {suggestion.path}
                </span>
              </span>
              <span
                className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
                aria-hidden="true"
              />
            </a>
          </li>
        ))}
      </ul>
    </Frame>
  )
}
