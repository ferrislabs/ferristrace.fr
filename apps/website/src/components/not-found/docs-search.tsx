import { useEffect, useRef, useState } from 'react'
import { Input } from '@cometrace/ui'
import { Search } from 'lucide-react'

/**
 * A plain GET form, so pressing Enter reaches the docs search whether or not
 * the island has hydrated. The prefill is the only part that needs the
 * browser, since it comes from the requested path, and it arrives one render
 * after mount: the field is controlled so it can take that late value, and it
 * stops accepting it the moment the reader types.
 */
export function DocsSearch({ term }: { term: string }) {
  const [value, setValue] = useState(term)
  const edited = useRef(false)

  useEffect(() => {
    if (!edited.current) setValue(term)
  }, [term])

  return (
    <form method="get" action="/docs/search" role="search" className="w-full">
      <label htmlFor="docs-search" className="sr-only">
        Search the docs
      </label>
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint-foreground"
        />
        <Input
          id="docs-search"
          name="q"
          type="search"
          placeholder="Search the docs"
          value={value}
          onChange={(event) => {
            edited.current = true
            setValue(event.target.value)
          }}
          autoComplete="off"
          className="pl-9 pr-11"
        />
        <kbd
          aria-hidden="true"
          className="pointer-events-none absolute right-2.5 top-1/2 inline-flex h-6 min-w-6 -translate-y-1/2 items-center justify-center rounded-sm border border-border bg-muted px-1.5 font-mono text-[11px] font-medium text-muted-foreground"
        >
          ↵
        </kbd>
      </div>
    </form>
  )
}
