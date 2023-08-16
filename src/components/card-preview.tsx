import clsx from 'clsx'
import download from 'downloadjs'
import dynamic from 'next/dynamic'
import useSWRMutation from 'swr/mutation'
import { Resvg, initWasm } from '@resvg/resvg-wasm'
import useSWR from 'swr'
import DidCard from './did-card'
import { DownloadIcon, LoadingIcon } from './icon'
import useSVG from '@/hooks/use-svg'

const ParallaxStars = dynamic(() => import('./parallax-stars'), { ssr: false })

/**
 * @see https://fjolt.com/article/css-3d-interactive-flippable-cards
 */
export default function CardPreview(props: {
  did: string
  image: string
  className?: string
}) {
  const svg = useSVG(props.did, props.image)
  const { data: initialized } = useSWR(
    ['resvg'],
    async () => {
      await initWasm(fetch('https://unpkg.com/@resvg/resvg-wasm/index_bg.wasm'))
      return true
    },
    { revalidateOnFocus: false },
  )
  const { trigger, isMutating } = useSWRMutation('download', async () => {
    if (!svg || !initialized) {
      return
    }
    const png = new Resvg(svg).render().asPng()
    download(png, `${props.did}.png`, 'image/png')
  })

  return (
    <div className={clsx('relative', props.className)}>
      <ParallaxStars
        stars={100}
        speed={0.3}
        color="#ffffff"
        className="h-full w-full bg-gradient"
      />
      <div
        className={clsx(
          'absolute inset-0 flex h-full w-full flex-col items-center justify-center',
          props.className,
        )}
      >
        <DidCard svg={svg} />
        <button
          disabled={isMutating}
          onClick={() => trigger()}
          className="mt-16 rounded-full bg-white p-2 font-semibold leading-4 shadow-2xl transition-colors hover:bg-gray-200"
        >
          {isMutating || !initialized ? (
            <LoadingIcon className="h-8 w-8 text-gray-400" />
          ) : (
            <DownloadIcon className="h-8 w-8 text-gray-800" />
          )}
        </button>
      </div>
    </div>
  )
}
