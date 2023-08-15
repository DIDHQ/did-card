import { CSSProperties, ReactNode, forwardRef, useEffect } from 'react'
import satori from 'satori'
import useSWR from 'swr'
import svgToMiniDataURI from 'mini-svg-data-uri'
import { LoadingIcon } from './icon'

export default forwardRef<
  HTMLDivElement,
  {
    did?: string
    image?: string
    children?: ReactNode
    style?: CSSProperties
    className?: string
  }
>(function DidCard(props, ref) {
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
  const { data: svg, error } = useSWR(
    fonts ? ['satori', props.did, props.image, fonts] : null,
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
          {props.image ? (
            <img
              src={props.image}
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
            <div
              style={{
                flexShrink: 0,
                fontSize: 256,
                lineHeight: 1,
                fontWeight: 600,
                color: 'white',
              }}
            >
              {props.did || '???'}
            </div>
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
      return svgToMiniDataURI(svg)
    },
    { revalidateOnFocus: false },
  )
  useEffect(() => {
    if (error) {
      console.error(error)
    }
  }, [error])

  return (
    <div
      ref={ref}
      style={{
        ...props.style,
        backgroundImage: svg ? `url("${svg}")` : undefined,
      }}
      className={props.className}
    >
      {svg ? (
        props.children
      ) : (
        <div className="flex h-[215.5pt] w-full items-center justify-center bg-gray-400">
          <LoadingIcon className="h-24 w-24 text-white" />
        </div>
      )}
    </div>
  )
})
