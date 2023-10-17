import { expose } from 'comlink'
import satori, { init } from 'satori/wasm'
import twemoji from 'twemoji'
import initYoga from 'yoga-wasm-web'
import { svgToDataURI } from '@/utils/svg'

const nfc = svgToDataURI(
  `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.1113 16.0059C13.1113 14.7559 12.9043 13.5488 12.4902 12.3848C12.0839 11.2207 11.498 10.1582 10.7324 9.19727C10.4511 8.8457 10.1425 8.62695 9.8066 8.54102C9.47847 8.44727 9.16207 8.45117 8.85738 8.55273C8.55269 8.6543 8.29878 8.82617 8.09566 9.06836C7.89253 9.31055 7.77925 9.5957 7.75581 9.92383C7.74019 10.2441 7.85347 10.5723 8.09566 10.9082C8.78316 11.8223 9.26363 12.6699 9.53707 13.4512C9.81832 14.2324 9.95894 15.084 9.95894 16.0059C9.95894 16.9199 9.81832 17.7676 9.53707 18.5488C9.26363 19.3301 8.78316 20.1816 8.09566 21.1035C7.85347 21.4395 7.7441 21.7676 7.76753 22.0879C7.79097 22.4082 7.90035 22.6895 8.09566 22.9316C8.29878 23.1738 8.55269 23.3457 8.85738 23.4473C9.16207 23.5488 9.47847 23.5566 9.8066 23.4707C10.1425 23.377 10.4511 23.1543 10.7324 22.8027C11.498 21.8418 12.0839 20.7793 12.4902 19.6152C12.9043 18.4512 13.1113 17.248 13.1113 16.0059ZM19.9902 16.0059C19.9902 14.0449 19.6894 12.166 19.0878 10.3691C18.4863 8.57227 17.623 6.93555 16.498 5.45898C16.1933 5.06055 15.8613 4.81055 15.5019 4.70898C15.1503 4.59961 14.8144 4.59961 14.4941 4.70898C14.1816 4.81836 13.9238 5.00195 13.7207 5.25977C13.5175 5.51758 13.4121 5.81836 13.4043 6.16211C13.4043 6.49805 13.5449 6.83789 13.8261 7.18164C14.8105 8.4082 15.5605 9.77148 16.0761 11.2715C16.5918 12.7715 16.8496 14.3496 16.8496 16.0059C16.8496 17.6621 16.5918 19.2402 16.0761 20.7402C15.5605 22.2324 14.8105 23.5918 13.8261 24.8184C13.5449 25.1621 13.4043 25.502 13.4043 25.8379C13.4121 26.1816 13.5175 26.4824 13.7207 26.7402C13.9238 26.998 14.1816 27.1816 14.4941 27.291C14.8144 27.4004 15.1503 27.4004 15.5019 27.291C15.8613 27.1895 16.1933 26.9434 16.498 26.5527C17.623 25.0684 18.4863 23.4277 19.0878 21.6309C19.6894 19.834 19.9902 17.959 19.9902 16.0059ZM26.8808 16.0059C26.8808 13.373 26.4746 10.8496 25.6621 8.43555C24.8574 6.02148 23.6894 3.79883 22.1582 1.76758C21.8847 1.40039 21.5761 1.16992 21.2324 1.07617C20.8886 0.974609 20.5566 0.974609 20.2363 1.07617C19.916 1.17773 19.6543 1.35352 19.4511 1.60352C19.248 1.8457 19.1386 2.13477 19.123 2.4707C19.1152 2.80664 19.2558 3.15039 19.5449 3.50195C20.9277 5.29102 21.9707 7.24023 22.6738 9.34961C23.3769 11.4512 23.7285 13.6699 23.7285 16.0059C23.7285 18.334 23.3769 20.5488 22.6738 22.6504C21.9707 24.752 20.9394 26.6855 19.58 28.4512C19.2988 28.8027 19.1621 29.1465 19.1699 29.4824C19.1777 29.8184 19.2832 30.1113 19.4863 30.3613C19.6894 30.6191 19.9472 30.7988 20.2597 30.9004C20.58 31.0098 20.9121 31.0098 21.2558 30.9004C21.6074 30.7988 21.9277 30.5605 22.2168 30.1855C23.7168 28.1855 24.8691 25.9785 25.6738 23.5645C26.4785 21.1504 26.8808 18.6309 26.8808 16.0059Z" fill="white"></path></svg>`,
)

export const logo = svgToDataURI(
  `<svg viewBox="0 0 110 39" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_200_98022)"><path d="M63.4476 4.97266H59.2465C58.701 4.97266 58.2608 5.41287 58.2608 5.95835V10.6858C57.0454 10.1691 55.7152 9.88198 54.3085 9.88198C48.7293 9.88198 44.1836 14.4181 44.1836 20.0068V21.404C44.1836 26.9833 48.7197 31.5289 54.3085 31.5289C55.7152 31.5289 57.055 31.2418 58.2799 30.7155C58.3661 31.1748 58.768 31.5289 59.2465 31.5289H63.4476C63.9931 31.5289 64.4333 31.0887 64.4333 30.5432V21.404V20.0068V5.96792C64.4333 5.42244 63.9931 4.97266 63.4476 4.97266ZM54.3085 25.3564C52.1265 25.3564 50.3561 23.586 50.3561 21.404V20.0068C50.3561 17.8249 52.1265 16.0545 54.3085 16.0545C56.4904 16.0545 58.2608 17.8249 58.2608 20.0068V21.404C58.2608 23.586 56.4904 25.3564 54.3085 25.3564Z" fill="white"/><path d="M73.5638 31.5195H69.3626C68.8172 31.5195 68.377 31.0792 68.377 30.5338V26.3326C68.377 25.7871 68.8172 25.3469 69.3626 25.3469H73.5638C74.1093 25.3469 74.5495 25.7871 74.5495 26.3326V30.5338C74.5495 31.0792 74.1093 31.5195 73.5638 31.5195Z" fill="white"/><path d="M107.84 4.97266H103.639C103.093 4.97266 102.653 5.41287 102.653 5.95835V10.6858C101.438 10.1691 100.108 9.88198 98.7008 9.88198C93.1216 9.88198 88.5759 14.4181 88.5759 20.0068V21.404C88.5759 26.9833 93.112 31.5289 98.7008 31.5289C100.108 31.5289 101.447 31.2418 102.672 30.7155C102.758 31.1748 103.16 31.5289 103.639 31.5289H107.84C108.385 31.5289 108.826 31.0887 108.826 30.5432V5.96792C108.826 5.42244 108.385 4.97266 107.84 4.97266ZM98.7008 25.3564C96.5188 25.3564 94.7484 23.586 94.7484 21.404V20.0068C94.7484 17.8249 96.5188 16.0545 98.7008 16.0545C100.883 16.0545 102.653 17.8249 102.653 20.0068V21.404C102.653 23.586 100.883 25.3564 98.7008 25.3564Z" fill="white"/><path d="M83.6673 31.5206H79.4662C78.9207 31.5206 78.4805 31.0804 78.4805 30.5349V14.3619C78.4805 13.8164 78.9207 13.3762 79.4662 13.3762H83.6673C84.2128 13.3762 84.653 13.8164 84.653 14.3619V30.5445C84.653 31.0804 84.2128 31.5206 83.6673 31.5206Z" fill="white"/><path d="M83.6678 11.146H79.4667C78.9212 11.146 78.481 10.7058 78.481 10.1603V5.9687C78.481 5.42322 78.9212 4.98301 79.4667 4.98301H83.6678C84.2133 4.98301 84.6535 5.42322 84.6535 5.9687V10.1699C84.6535 10.7058 84.2133 11.146 83.6678 11.146Z" fill="white"/><path d="M17.4581 27.471C24.9895 27.471 31.1525 21.308 31.1525 13.767C31.1525 10.6185 30.1955 7.87196 28.4155 5.5465C30.0615 4.31199 31.1525 2.25448 31.1525 0.0629883H17.4581C9.92663 0.0629883 3.76367 6.22595 3.76367 13.767C3.76367 21.308 9.92663 27.471 17.4581 27.471ZM17.4581 6.3695C21.5635 6.3695 24.8555 9.66152 24.8555 13.767C24.8555 17.882 21.5731 21.1644 17.4581 21.1644C13.3431 21.1644 10.0606 17.882 10.0606 13.767C10.0606 9.65195 13.3526 6.3695 17.4581 6.3695Z" fill="#00DF9B"/><path d="M34.9894 31.1738C34.1664 29.1163 32.5204 27.6138 30.3289 26.9248C26.7689 30.3508 22.118 32.1308 17.601 32.1308C12.9405 32.1308 8.4236 30.3508 4.86362 26.9248C2.67214 27.6138 1.02613 29.1163 0.203125 31.1738C4.86362 35.9683 11.1606 38.4373 17.4575 38.4373C23.764 38.4373 30.0609 35.9683 34.9894 31.1738Z" fill="#2471FE"/></g><defs><clipPath id="clip0_200_98022"><rect width="109.032" height="38.5" fill="white"/></clipPath></defs></svg>`,
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
          return svgToDataURI(arrayBuffer)
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
          src={await trySvgToDataURI(image)}
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
          paddingTop: 140,
          paddingBottom: 140,
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
          src={svgToDataURI(text)}
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
            style={{ height: 156, width: 440, objectFit: 'cover' }}
          />
          <img src={nfc} alt="nfc" style={{ height: 156, width: 156 }} />
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

async function trySvgToDataURI(image: string) {
  const response = await fetch(image)
  if (response.headers.get('content-type')?.includes('svg')) {
    return svgToDataURI(await response.arrayBuffer())
  }
  return image
}

expose(generateFront)
