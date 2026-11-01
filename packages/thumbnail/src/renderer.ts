import { writeFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'
import { Resvg } from '@resvg/resvg-js'
import { CARD_WIDTH } from './generator'

export async function renderThumbnail(svg: string): Promise<Buffer> {
  const resvg = new Resvg(svg, {
    background: 'transparent',
    fitTo: { mode: 'width', value: CARD_WIDTH },
  })
  const png = resvg.render()
  return png.asPng() as Buffer
}

export async function renderThumbnailToFile(svg: string, outputPath: string): Promise<void> {
  const png = await renderThumbnail(svg)
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, png)
}
