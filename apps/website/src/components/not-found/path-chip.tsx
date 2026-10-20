import { truncateMiddle } from '../../lib/suggest'

/**
 * The site is statically built, so the requested path is only knowable in the
 * browser. Until it is, the chip shows the status on its own rather than an
 * empty "GET".
 */
export function PathChip({ path }: { path: string | null }) {
  return (
    <p className="inline-flex max-w-full items-center gap-2 self-start rounded-md border border-border bg-muted px-2.5 py-1 font-mono text-xs">
      <span className="font-semibold text-muted-foreground">HTTP 404</span>
      {path ? (
        <>
          <span aria-hidden="true" className="text-faint-foreground">
            ·
          </span>
          <span className="truncate text-muted-foreground" title={path}>
            GET {truncateMiddle(path)}
          </span>
        </>
      ) : null}
    </p>
  )
}
