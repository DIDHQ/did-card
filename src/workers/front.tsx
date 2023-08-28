import { expose } from 'comlink'
import satori, { init } from 'satori/wasm'
import twemoji from 'twemoji'
import svgToMiniDataURI from 'mini-svg-data-uri'
import initYoga from 'yoga-wasm-web'

const nfc = svgToMiniDataURI(
  `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.1113 16.0059C13.1113 14.7559 12.9043 13.5488 12.4902 12.3848C12.0839 11.2207 11.498 10.1582 10.7324 9.19727C10.4511 8.8457 10.1425 8.62695 9.8066 8.54102C9.47847 8.44727 9.16207 8.45117 8.85738 8.55273C8.55269 8.6543 8.29878 8.82617 8.09566 9.06836C7.89253 9.31055 7.77925 9.5957 7.75581 9.92383C7.74019 10.2441 7.85347 10.5723 8.09566 10.9082C8.78316 11.8223 9.26363 12.6699 9.53707 13.4512C9.81832 14.2324 9.95894 15.084 9.95894 16.0059C9.95894 16.9199 9.81832 17.7676 9.53707 18.5488C9.26363 19.3301 8.78316 20.1816 8.09566 21.1035C7.85347 21.4395 7.7441 21.7676 7.76753 22.0879C7.79097 22.4082 7.90035 22.6895 8.09566 22.9316C8.29878 23.1738 8.55269 23.3457 8.85738 23.4473C9.16207 23.5488 9.47847 23.5566 9.8066 23.4707C10.1425 23.377 10.4511 23.1543 10.7324 22.8027C11.498 21.8418 12.0839 20.7793 12.4902 19.6152C12.9043 18.4512 13.1113 17.248 13.1113 16.0059ZM19.9902 16.0059C19.9902 14.0449 19.6894 12.166 19.0878 10.3691C18.4863 8.57227 17.623 6.93555 16.498 5.45898C16.1933 5.06055 15.8613 4.81055 15.5019 4.70898C15.1503 4.59961 14.8144 4.59961 14.4941 4.70898C14.1816 4.81836 13.9238 5.00195 13.7207 5.25977C13.5175 5.51758 13.4121 5.81836 13.4043 6.16211C13.4043 6.49805 13.5449 6.83789 13.8261 7.18164C14.8105 8.4082 15.5605 9.77148 16.0761 11.2715C16.5918 12.7715 16.8496 14.3496 16.8496 16.0059C16.8496 17.6621 16.5918 19.2402 16.0761 20.7402C15.5605 22.2324 14.8105 23.5918 13.8261 24.8184C13.5449 25.1621 13.4043 25.502 13.4043 25.8379C13.4121 26.1816 13.5175 26.4824 13.7207 26.7402C13.9238 26.998 14.1816 27.1816 14.4941 27.291C14.8144 27.4004 15.1503 27.4004 15.5019 27.291C15.8613 27.1895 16.1933 26.9434 16.498 26.5527C17.623 25.0684 18.4863 23.4277 19.0878 21.6309C19.6894 19.834 19.9902 17.959 19.9902 16.0059ZM26.8808 16.0059C26.8808 13.373 26.4746 10.8496 25.6621 8.43555C24.8574 6.02148 23.6894 3.79883 22.1582 1.76758C21.8847 1.40039 21.5761 1.16992 21.2324 1.07617C20.8886 0.974609 20.5566 0.974609 20.2363 1.07617C19.916 1.17773 19.6543 1.35352 19.4511 1.60352C19.248 1.8457 19.1386 2.13477 19.123 2.4707C19.1152 2.80664 19.2558 3.15039 19.5449 3.50195C20.9277 5.29102 21.9707 7.24023 22.6738 9.34961C23.3769 11.4512 23.7285 13.6699 23.7285 16.0059C23.7285 18.334 23.3769 20.5488 22.6738 22.6504C21.9707 24.752 20.9394 26.6855 19.58 28.4512C19.2988 28.8027 19.1621 29.1465 19.1699 29.4824C19.1777 29.8184 19.2832 30.1113 19.4863 30.3613C19.6894 30.6191 19.9472 30.7988 20.2597 30.9004C20.58 31.0098 20.9121 31.0098 21.2558 30.9004C21.6074 30.7988 21.9277 30.5605 22.2168 30.1855C23.7168 28.1855 24.8691 25.9785 25.6738 23.5645C26.4785 21.1504 26.8808 18.6309 26.8808 16.0059Z" fill="white"></path></svg>`,
)

const logo = svgToMiniDataURI(
  `<svg viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M649.99 300.33C649.99 438.36 537.67 550.66 399.67 550.66C261.67 550.66 149.33 438.36 149.33 300.33C149.33 162.3 261.67 50 399.67 50H649.99C650.002 69.4504 645.475 88.6353 636.769 106.028C628.063 123.422 615.418 138.543 599.84 150.19C632.439 193.451 650.045 246.161 649.99 300.33ZM535.41 300.33C535.41 225.48 474.52 164.58 399.67 164.58C324.82 164.58 263.92 225.48 263.92 300.32C263.92 375.16 324.82 436.06 399.67 436.06C474.52 436.06 535.41 375.18 535.41 300.33ZM82 618C169.6 705.57 284.67 749.36 399.67 749.36C514.72 749.36 629.74 705.57 717.37 618C710.268 599.384 698.918 582.683 684.224 569.227C669.53 555.771 651.897 545.931 632.73 540.49C570.238 600.98 486.673 634.8 399.7 634.8C312.727 634.8 229.162 600.98 166.67 540.49C147.497 545.927 129.859 555.765 115.159 569.221C100.46 582.678 89.1051 599.381 82 618Z" fill="white"/></svg>`,
)

let initialized = false

export async function generateFront(did?: string, image?: string) {
  if (!initialized) {
    const wasm = await fetch(
      new URL('yoga-wasm-web/dist/yoga.wasm', import.meta.url),
    ).then((res) => res.arrayBuffer())
    const yoga = await initYoga(wasm)
    init(yoga)
    initialized = true
  }

  const fonts = await Promise.all(
    ['/Inter-SemiBold.woff', '/Inter-Medium.woff'].map(async (url) => {
      const response = await fetch(url)
      return response.arrayBuffer()
    }),
  )
  const text = await satori(
    <div
      style={{
        flexShrink: 0,
        fontSize: 256,
        lineHeight: 1.5,
        fontWeight: 600,
        color: 'white',
      }}
    >
      {did || '???'}
    </div>,
    {
      height: 384,
      fonts: fonts!.map((data) => ({ name: 'Inter', data })),
      loadAdditionalAsset: async (code: string, segment: string) => {
        if (code === 'emoji') {
          const url = await new Promise<string>((resolve) =>
            twemoji.parse(segment, {
              callback(icon) {
                resolve(
                  `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${icon}.svg`,
                )
                return false
              },
            }),
          )
          const response = await fetch(url)
          const arrayBuffer = await response.arrayBuffer()
          return `data:image/svg+xml;base64,${Buffer.from(arrayBuffer).toString(
            'base64',
          )}`
        }
        return []
      },
    },
  )
  const svg = await satori(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {image ? (
        <img
          src={image}
          alt="nft"
          style={{
            height: 1960,
            width: 1960,
            flexShrink: 0,
            objectFit: 'cover',
          }}
        />
      ) : (
        <div
          style={{
            height: 1960,
            width: 1960,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 1024,
            backgroundColor: '#9ca3af',
          }}
        >
          ?
        </div>
      )}
      <div
        style={{
          height: 0,
          flex: 1,
          backgroundColor: 'black',
          paddingTop: 135,
          paddingBottom: 165,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            flexShrink: 0,
            fontSize: 120,
            lineHeight: 1,
            fontWeight: 500,
            color: '#58595b',
            marginBottom: 71,
          }}
        >
          I AM
        </div>
        <img
          src={svgToMiniDataURI(text)}
          alt="did"
          style={{ height: 384, maxWidth: 1688, objectFit: 'contain' }}
        />
        <div style={{ flex: 1, height: 0 }} />
        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            paddingLeft: 128,
            paddingRight: 128,
          }}
        >
          <img
            src={logo}
            alt="logo"
            style={{ height: 120, width: 120, objectFit: 'cover' }}
          />
          <img src={nfc} alt="nfc" style={{ height: 120, width: 120 }} />
        </div>
      </div>
    </div>,
    {
      width: 1960,
      height: 3108,
      fonts: fonts!.map((data) => ({ name: 'Inter', data })),
    },
  )
  return svg
}

expose(generateFront)
