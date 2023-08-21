import clsx from 'clsx'
import useSWRMutation from 'swr/mutation'
import { wrap } from 'comlink'
import useSWR from 'swr'
import { useRef } from 'react'
import DidCard from './did-card'
import { DownloadIcon, LoadingIcon, PrintIcon, UploadIcon } from './icon'
import ParallaxStars from './parallax-stars'

const generate = wrap<Function>(
  new Worker(new URL('../workers/svg.tsx', import.meta.url)),
)

const convert = wrap<Function>(
  new Worker(new URL('../workers/png.ts', import.meta.url)),
)

/**
 * @see https://fjolt.com/article/css-3d-interactive-flippable-cards
 */
export default function CardPreview(props: {
  did: string
  image: string
  onDidChange(did: string): void
  onImageChange(did: string): void
  className?: string
}) {
  const { data: svg } = useSWR(
    ['svg', props.did, props.image],
    () => generate.call(generate, props.did, props.image) as string,
    { revalidateOnFocus: false },
  )
  const inputRef = useRef<HTMLInputElement>(null)
  const { trigger, isMutating } = useSWRMutation('download', async () => {
    if (!svg) {
      return
    }

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
        <div className="flex gap-8">
          <button
            onClick={() => inputRef.current?.click()}
            className="mt-16 rounded-full bg-white p-2 font-semibold leading-4 shadow-2xl transition-colors hover:bg-gray-300 disabled:cursor-wait"
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpg,image/jpeg,image/gif"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) {
                  return
                }
                props.onDidChange(file.name.replace(/\.[^\.]+$/, ''))
                const reader = new FileReader()
                reader.onloadend = () => {
                  props.onImageChange(reader.result as string)
                }
                reader.readAsDataURL(file)
              }}
              className="hidden"
            />
            <UploadIcon className="h-8 w-8 text-gray-800" />
          </button>
          <button
            disabled={isMutating}
            onClick={() => trigger()}
            className="mt-16 rounded-full bg-white p-2 font-semibold leading-4 shadow-2xl transition-colors hover:bg-gray-300 disabled:cursor-wait"
          >
            {isMutating ? (
              <LoadingIcon className="h-8 w-8 text-gray-400" />
            ) : (
              <DownloadIcon className="h-8 w-8 text-gray-800" />
            )}
          </button>
          {/* <button
            onClick={() => {}}
            className="mt-16 rounded-full bg-white p-2 font-semibold leading-4 shadow-2xl transition-colors hover:bg-gray-300 disabled:cursor-wait"
          >
            <PrintIcon className="h-8 w-8 text-gray-800" />
          </button> */}
        </div>
      </div>
    </div>
  )
}
