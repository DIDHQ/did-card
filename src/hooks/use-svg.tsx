import satori from 'satori'
import useSWR from 'swr'
import twemoji from 'twemoji'
import svgToMiniDataURI from 'mini-svg-data-uri'

export default function useSVG(did?: string, image?: string) {
  const { data: fonts } = useSWR(
    ['fonts'],
    async () => {
      return Promise.all(
        ['/Inter-SemiBold.woff', '/Inter-Medium.woff'].map(async (url) => {
          const response = await fetch(url)
          return response.arrayBuffer()
        }),
      )
    },
    { revalidateOnFocus: false },
  )
  const { data: text } = useSWR(
    fonts ? ['text', did] : null,
    async () => {
      const svg = await satori(
        <div
          style={{
            flexShrink: 0,
            fontSize: 256,
            lineHeight: 1,
            fontWeight: 600,
            color: 'white',
          }}
        >
          {did || '???'}
        </div>,
        {
          height: 256,
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
              return `data:image/svg+xml;base64,${Buffer.from(
                arrayBuffer,
              ).toString('base64')}`
            }
            return []
          },
        },
      )
      return svgToMiniDataURI(svg)
    },
    { revalidateOnFocus: false },
  )
  const { data: card } = useSWR(
    fonts && text ? ['card', text, image, fonts] : null,
    async () => {
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
              style={{ height: 1988, width: 1988, flexShrink: 0 }}
            />
          ) : (
            <div
              style={{
                height: 1988,
                width: 1988,
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
                marginBottom: 135,
              }}
            >
              I AM
            </div>
            <img
              src={text}
              alt="did"
              style={{ height: 256, maxWidth: 1688, objectFit: 'contain' }}
            />
            <div style={{ flex: 1, height: 0 }} />
            <div
              style={{
                flexShrink: 0,
                display: 'flex',
                width: '100%',
                justifyContent: 'flex-end',
              }}
            >
              <img
                src="/nfc.svg"
                alt="nfc"
                style={{
                  height: 120,
                  width: 120,
                  marginRight: 96,
                }}
              />
            </div>
          </div>
        </div>,
        {
          width: 1988,
          height: 3108,
          fonts: fonts!.map((data) => ({ name: 'Inter', data })),
        },
      )
      return svg
    },
    { revalidateOnFocus: false },
  )

  return card
}
