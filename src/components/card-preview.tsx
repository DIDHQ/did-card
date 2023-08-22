import clsx from 'clsx'
import useSWRMutation from 'swr/mutation'
import { useCallback, useRef } from 'react'
import DidCard from './did-card'
import { DownloadIcon, LoadingIcon, PrintIcon, UploadIcon } from './icon'
import ParallaxStars from './parallax-stars'

/**
 * @see https://fjolt.com/article/css-3d-interactive-flippable-cards
 */
export default function CardPreview(props: {
  did: string
  image: string
  svg?: string
  png?: string
  onDidChange(did: string): void
  onImageChange(did: string): void
  className?: string
}) {
  const { svg, png, onDidChange, onImageChange } = props

  const inputRef = useRef<HTMLInputElement>(null)
  const { trigger: download, isMutating: isDownloading } = useSWRMutation(
    'download',
    async () => {
      if (!png) {
        return
      }

      const anchor = document.createElement('a')
      anchor.setAttribute('download', `${props.did}.png`)
      anchor.href = png
      anchor.setAttribute('target', '_blank')
      anchor.click()

      URL.revokeObjectURL(png)
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

  return (
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
      className={clsx('relative print:hidden', props.className)}
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
            disabled={!png || isDownloading}
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
            disabled={!png}
            onClick={() => window.print()}
            className="mt-16 rounded-full bg-white p-2 font-semibold leading-4 shadow-2xl transition-colors hover:bg-gray-300 disabled:cursor-wait"
          >
            <PrintIcon className="h-8 w-8 text-gray-800" />
          </button>
        </div>
      </div>
    </div>
  )
}
