import clsx from 'clsx'
import useSWRMutation from 'swr/mutation'
import { useCallback, useEffect, useRef } from 'react'
import { useAtomValue } from 'jotai'
import { useRouter } from 'next/router'
import DidCard from './did-card'
import {
  DownloadIcon,
  LoadingIcon,
  NfcIcon,
  PrintIcon,
  UploadIcon,
} from './icon'
import ParallaxStars from './parallax-stars'
import { flippedAtom } from '@/utils/atom'
import { fetchJSON } from '@/utils/fetch'

/**
 * @see https://fjolt.com/article/css-3d-interactive-flippable-cards
 */
export default function CardPreview(props: {
  did: string
  image: string
  front?: string
  back?: string
  png?: string
  onDidChange(did: string): void
  onImageChange(did: string): void
  className?: string
}) {
  const { front, back, png, onDidChange, onImageChange } = props

  const router = useRouter()
  const nfc = router.query.nfc as string | undefined
  const flipped = useAtomValue(flippedAtom)
  const inputRef = useRef<HTMLInputElement>(null)
  const { trigger: download, isMutating: isDownloading } = useSWRMutation(
    'download',
    async () => {
      if (!png) {
        return
      }

      const anchor = document.createElement('a')
      anchor.setAttribute('download', flipped ? 'back.png' : `${props.did}.png`)
      anchor.href = png
      anchor.setAttribute('target', '_blank')
      anchor.click()
    },
  )
  const {
    trigger: write,
    isMutating: isWriting,
    error,
  } = useSWRMutation('write', async () => {
    if (!nfc || !props.did) {
      return
    }

    const json = await fetchJSON<{ code: number }>(nfc, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: `https://d.id/${props.did}` }),
    })
    if (json.code !== 0) {
      throw new Error('write error')
    }
  })
  useEffect(() => {
    console.error(error)
    if (error && error instanceof Error) {
      alert(error.message)
    }
  }, [error])
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
        <DidCard front={front} back={back} />
        <div className="flex gap-8">
          <button
            onClick={() => inputRef.current?.click()}
            className="mt-16 rounded-full bg-white p-2 font-semibold leading-4 shadow-2xl transition-colors hover:bg-gray-300 disabled:cursor-not-allowed"
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
            className="mt-16 rounded-full bg-white p-2 font-semibold leading-4 shadow-2xl transition-colors hover:bg-gray-300 disabled:cursor-not-allowed"
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
            className="mt-16 rounded-full bg-white p-2 font-semibold leading-4 shadow-2xl transition-colors hover:bg-gray-300 disabled:cursor-not-allowed"
          >
            <PrintIcon className="h-8 w-8 text-gray-800" />
          </button>
          {nfc ? (
            <button
              disabled={!props.did || isWriting}
              onClick={() => write()}
              className="mt-16 rounded-full bg-white p-2 font-semibold leading-4 shadow-2xl transition-colors hover:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isWriting ? (
                <LoadingIcon className="h-8 w-8 text-gray-400" />
              ) : (
                <NfcIcon className="h-8 w-8 text-gray-800" />
              )}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
