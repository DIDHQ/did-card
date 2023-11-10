import { expose } from 'comlink'
import satori, { init } from 'satori/wasm'
import initYoga from 'yoga-wasm-web'
import { svgToDataURI } from '@/utils/svg'

let initialized = false

export const logo = svgToDataURI(
  `<svg width="752" height="527" viewBox="0 0 752 527" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M287.378 0H198.711V88.6666H287.378V0Z" fill="white"/>
  <path d="M465 0.356445H199V88.3564H465V0.356445Z" fill="white"/>
  <path d="M375.987 88.6953H287.32V177.362H375.987V88.6953Z" fill="#EAAF0A"/>
  <path d="M417 88.3564H287V177.356H417V88.3564Z" fill="#EAAF0A"/>
  <path d="M375.987 0H287.32V88.6666H375.987V0Z" fill="white"/>
  <path d="M464.768 88.6953H376.102V177.362H464.768V88.6953Z" fill="#EAAF0A"/>
  <path d="M464.768 177.305H376.102V265.971H464.768V177.305Z" fill="#EAAF0A"/>
  <path d="M553 88.3564H376V266.356H553V88.3564Z" fill="#EAAF0A"/>
  <path d="M375.987 266H287.32V354.667H375.987V266Z" fill="#EAAF0A"/>
  <path d="M287.378 177.305H198.711V265.971H287.378V177.305Z" fill="white"/>
  <path d="M553.378 88.6953H464.711V177.362H553.378V88.6953Z" fill="#EAAF0A"/>
  <path d="M553.378 177.305H464.711V265.971H553.378V177.305Z" fill="#EAAF0A"/>
  <path d="M464.768 0H376.102V88.6666H464.768V0Z" fill="white"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M0 443.355H27.8519V471.207H0V443.355ZM27.8519 499.059H0V526.911H27.8519V499.059ZM27.8519 443.355H55.7037H83.5556V471.207V499.059H55.7037H27.8519V471.207V443.355ZM445.63 443.355H473.482H501.334H529.186V471.207V499.059H501.334H473.482V471.207H445.63V443.355ZM473.482 499.059V526.911H445.63V499.059H473.482ZM557.037 471.207H584.889V443.355H612.741V471.207H640.593V499.059V526.911H612.741V499.059H584.889V526.911H557.037V499.059V471.207ZM111.407 443.355H139.258H167.11V471.207V499.059H139.258V526.911H111.407V499.059V471.207V443.355ZM167.11 499.059H194.962V526.911H167.11V499.059ZM222.815 443.355H250.667H278.519H306.371V471.207H278.519V499.059H306.371V526.911H278.519H250.667H222.815V499.059H250.667V471.207H222.815V443.355ZM696.295 443.355H668.444V471.207V499.059V526.911H696.295H724.147H751.999V499.059H724.147H696.295V471.207V443.355ZM334.222 443.355H362.074V471.207H334.222V443.355ZM389.926 471.207H362.074V499.059H334.222V526.911H362.074V499.059H389.926V526.911H417.777V499.059H389.926V471.207ZM389.926 471.207H417.777V443.355H389.926V471.207Z" fill="#EAAF0A"/>
  </svg>`,
)

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
    ['/Poppins-Bold.ttf'].map(async (url) => {
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
      <img src={logo} alt="logo" style={{ width: '45%', objectFit: 'cover' }} />
    </div>,
    {
      width: 1960,
      height: 3108,
      fonts: fonts!.map((data) => ({ name: 'Poppins', data })),
    },
  )
  return svg
}

expose(generateBack)
