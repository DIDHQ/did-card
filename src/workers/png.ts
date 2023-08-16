import { expose } from 'comlink'
import { Resvg, initWasm } from '@resvg/resvg-wasm'

export async function convert(svg: string) {
  await initWasm(fetch('https://unpkg.com/@resvg/resvg-wasm/index_bg.wasm'))
  const image = new Resvg(svg).render()
  const blob = new Blob([image.asPng()], { type: 'image/png' })
  image.free()
  return URL.createObjectURL(blob)
}

expose(convert)
