import { expose } from 'comlink'
import { Resvg, initWasm } from '@resvg/resvg-wasm'

let initialized = false

export async function convertToPng(svg: string) {
  if (!initialized) {
    await initWasm(
      fetch(new URL('@resvg/resvg-wasm/index_bg.wasm', import.meta.url)),
    )
    initialized = true
  }

  const image = new Resvg(svg).render()
  const blob = new Blob([image.asPng()], { type: 'image/png' })
  image.free()
  return URL.createObjectURL(blob)
}

expose(convertToPng)
