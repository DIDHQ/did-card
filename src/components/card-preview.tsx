import clsx from 'clsx'
import useSWRMutation from 'swr/mutation'
import { wrap } from 'comlink'
import useSWR from 'swr'
import { useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
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
  const { onDidChange, onImageChange } = props
  const { data: svg } = useSWR(
    ['svg', props.did, props.image],
    () => generate.call(generate, props.did, props.image) as string,
    { revalidateOnFocus: false },
  )
  const inputRef = useRef<HTMLInputElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { trigger: download, isMutating: isDownloading } = useSWRMutation(
    'download',
    async () => {
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
    },
  )
  const handleFile = useCallback(
    (file?: File) => {
      if (!file) {
        return
      }
      onDidChange(file.name.replace(/\.[^\.]+$/, ''))
      const reader = new FileReader()
      reader.onloadend = () => {
        onImageChange(reader.result as string)
      }
      reader.readAsDataURL(file)
    },
    [onDidChange, onImageChange],
  )
  const { trigger: print, isMutating: isPrinting } = useSWRMutation(
    'print',
    async () => {
      const iframe = iframeRef.current
      if (!svg || !iframe) {
        return
      }

      const href = await convert.call(convert, svg)
      iframe.onload = () => {
        const image = document.createElement('img')
        image.onload = () => {
          iframe.contentWindow?.print()
          URL.revokeObjectURL(href)
        }
        image.src = href
        image.style.width = '221pt'
        image.style.height = '345pt'
        image.style.objectFit = 'cover'
        image.style.transform =
          'rotate(90deg) translateX(-62pt) translateY(-62pt)'
        iframe.contentDocument?.body.appendChild(image)
      }
      iframe.setAttribute(
        'srcdoc',
        `<html><body style="margin: 0;"></body></html>`,
      )
    },
  )

  return (
    <>
      <div
        onDragOver={(e) => {
          e.preventDefault()
        }}
        onDragEnd={(e) => {
          e.preventDefault()
        }}
        onDrop={(e) => {
          e.preventDefault()
          handleFile(e.nativeEvent.dataTransfer?.files[0])
        }}
        className={clsx('relative', props.className)}
      >
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
                onChange={(e) => handleFile(e.target.files?.[0])}
                className="hidden"
              />
              <UploadIcon className="h-8 w-8 text-gray-800" />
            </button>
            <button
              disabled={isDownloading}
              onClick={() => download()}
              className="mt-16 rounded-full bg-white p-2 font-semibold leading-4 shadow-2xl transition-colors hover:bg-gray-300 disabled:cursor-wait"
            >
              {isDownloading ? (
                <LoadingIcon className="h-8 w-8 text-gray-400" />
              ) : (
                <DownloadIcon className="h-8 w-8 text-gray-800" />
              )}
            </button>
            <button
              disabled={isPrinting}
              onClick={() => print()}
              className="mt-16 rounded-full bg-white p-2 font-semibold leading-4 shadow-2xl transition-colors hover:bg-gray-300 disabled:cursor-wait"
            >
              {isPrinting ? (
                <LoadingIcon className="h-8 w-8 text-gray-400" />
              ) : (
                <PrintIcon className="h-8 w-8 text-gray-800" />
              )}
            </button>
          </div>
        </div>
      </div>
      {createPortal(
        <iframe ref={iframeRef} className="hidden h-[221pt] w-[345pt]" />,
        document.body,
      )}
    </>
  )
}
