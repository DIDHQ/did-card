import clsx from 'clsx'
import dynamic from 'next/dynamic'
import useSWRMutation from 'swr/mutation'
import { wrap } from 'comlink'
import useSWR from 'swr'
import DidCard from './did-card'
import { DownloadIcon, LoadingIcon } from './icon'

const ParallaxStars = dynamic(() => import('./parallax-stars'), { ssr: false })

/**
 * @see https://fjolt.com/article/css-3d-interactive-flippable-cards
 */
export default function CardPreview(props: {
  did: string
  image: string
  className?: string
}) {
  const { data: svg } = useSWR(
    ['svg', props.did, props.image],
    () => {
      const generate = wrap<Function>(
        new Worker(new URL('../workers/svg.tsx', import.meta.url)),
      )
      return generate.call(generate, props.did, props.image) as string
    },
    { revalidateOnFocus: false },
  )
  const { trigger, isMutating } = useSWRMutation('download', async () => {
    if (!svg) {
      return
    }

    const convert = wrap<Function>(
      new Worker(new URL('../workers/png.ts', import.meta.url)),
    )
    const href = await convert.call(convert, svg)

    const anchor = document.createElement('a')
    anchor.setAttribute('download', `${props.did}.png`)
    anchor.href = href
    anchor.setAttribute('target', '_blank')
    anchor.click()

    URL.revokeObjectURL(href)
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
          className="mt-16 rounded-full bg-white p-2 font-semibold leading-4 shadow-2xl transition-colors hover:bg-gray-200 disabled:cursor-wait"
        >
          {isMutating ? (
            <LoadingIcon className="h-8 w-8 text-gray-400" />
          ) : (
            <DownloadIcon className="h-8 w-8 text-gray-800" />
          )}
        </button>
      </div>
    </div>
  )
}
