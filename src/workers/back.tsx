import { expose } from 'comlink'
import satori, { init } from 'satori/wasm'
import initYoga from 'yoga-wasm-web'

let initialized = false

export async function generateBack() {
  if (!initialized) {
    const wasm = await fetch(
      new URL('yoga-wasm-web/dist/yoga.wasm', import.meta.url),
    ).then((res) => res.arrayBuffer())
    const yoga = await initYoga(wasm)
    init(yoga)
    initialized = true
  }

  const fonts = await Promise.all(
    ['/Inter-SemiBold.woff'].map(async (url) => {
      const response = await fetch(url)
      return response.arrayBuffer()
    }),
  )
  const svg = await satori(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
      }}
    >
      <div style={{ color: 'white', fontSize: 128, marginTop: 1900 }}>d.id</div>
    </div>,
    {
      width: 1988,
      height: 3108,
      fonts: fonts!.map((data) => ({ name: 'Inter', data })),
    },
  )
  return svg
}

expose(generateBack)
