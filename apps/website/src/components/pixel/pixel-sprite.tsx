import type { Sprite } from './sprites'

/**
 * Draws a sprite as a crisp SVG. The size comes from the class: the viewBox
 * follows the grid, so one sprite pixel stays a perfect square.
 */
export function PixelSprite({
  sprite,
  className,
  title,
  x,
  y,
  width: w,
  height: h,
}: {
  sprite: Sprite
  className?: string
  /** Placement when the sprite is nested in another SVG. */
  x?: number
  y?: number
  width?: number
  height?: number
  /** Without a title the sprite is decorative and hidden from screen readers. */
  title?: string
}) {
  const width = Math.max(...sprite.rows.map((r) => r.length))
  const height = sprite.rows.length

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      x={x}
      y={y}
      width={w}
      height={h}
      shapeRendering="crispEdges"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {sprite.rows.flatMap((row, y) =>
        [...row].map((char, x) =>
          char === '.' ? null : (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1.02}
              height={1.02}
              fill={sprite.palette[char]}
            />
          ),
        ),
      )}
    </svg>
  )
}
