import useBeep from '@/hooks/use-beep'
import { didAtom, flippedAtom, imageAtom } from '@/utils/atom'
import { fetchJSON } from '@/utils/fetch'
import { useWindowSize } from '@uidotdev/usehooks'
import clsx from 'clsx'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useRouter } from 'next/router'
import { useCallback, useRef, useState } from 'react'
import Confetti from 'react-confetti'
import { createPortal } from 'react-dom'
import useSWRMutation from 'swr/mutation'
import DidCard from './did-card'
import { DownloadIcon, LoadingIcon, NfcIcon, PrintIcon, UploadIcon } from './icon'
import ParallaxStars from './parallax-stars'

/**
 * @see https://fjolt.com/article/css-3d-interactive-flippable-cards
 */
export default function CardPreview(props: {
  front?: string
  back?: string
  png?: string
  className?: string
}) {
  const { front, back, png } = props

  const router = useRouter()
  const nfc = router.query.nfc as string | undefined
  const beep = useBeep()
  const flipped = useAtomValue(flippedAtom)
  const setImage = useSetAtom(imageAtom)
  const [did, setDid] = useAtom(didAtom)
  const inputRef = useRef<HTMLInputElement>(null)
  const { trigger: download, isMutating: isDownloading } = useSWRMutation('download', async () => {
    if (!png) {
      return
    }

    const anchor = document.createElement('a')
    anchor.setAttribute('download', flipped ? 'back.png' : `${did}.png`)
    anchor.href = png
    anchor.setAttribute('target', '_blank')
    anchor.click()
  })
  const [success, setSuccess] = useState(false)
  const { trigger: write, isMutating: isWriting } = useSWRMutation(
    'write',
    async () => {
      setSuccess(false)
      if (!nfc || !did) {
        return
      }

      const json = await fetchJSON<{ code: number }>(nfc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: `https://d.id/${did}` }),
      })
      if (json.code !== 0) {
        throw new Error('write error')
      }
      return
    },
    {
      onSuccess() {
        setSuccess(true)
        beep()
      },
      onError(err) {
        setSuccess(false)
        if (err instanceof Error) {
          alert(err.message)
        }
      },
    },
  )
  const handleFile = useCallback(
    (file?: File) => {
      if (!file) {
        return
      }

      setDid(file.name.replace(/\.[^\.]+$/, ''))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    },
    [setDid, setImage],
  )
  const { width, height } = useWindowSize()

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
      <ParallaxStars stars={100} speed={0.3} color='#ffffff' className='size-full bg-gradient' />
      <div
        className={clsx(
          'absolute inset-0 flex size-full flex-col items-center justify-center',
          props.className,
        )}
      >
        <DidCard front={front} back={back} />
        <div className='flex gap-8'>
          {router.query.upload ? (
            <button
              type='button'
              onClick={() => inputRef.current?.click()}
              className='mt-16 rounded-full bg-white p-3 font-semibold leading-4 shadow-2xl transition-colors hover:bg-gray-300 disabled:cursor-not-allowed'
            >
              <input
                ref={inputRef}
                type='file'
                accept='image/png,image/jpg,image/jpeg,image/gif'
                onChange={(e) => handleFile(e.target.files?.[0])}
                className='hidden'
              />
              <UploadIcon className='size-7 text-gray-800' />
            </button>
          ) : null}
          {router.query.download ? (
            <button
              type='button'
              disabled={!png || isDownloading}
              onClick={() => download()}
              className='mt-16 rounded-full bg-white p-3 font-semibold leading-4 shadow-2xl transition-colors hover:bg-gray-300 disabled:cursor-not-allowed'
            >
              {isDownloading ? (
                <LoadingIcon className='size-7 text-gray-400' />
              ) : (
                <DownloadIcon className='size-7 text-gray-800' />
              )}
            </button>
          ) : null}
          <button
            type='button'
            disabled={!png}
            onClick={() => window.print()}
            className='mt-16 rounded-full bg-white p-3 font-semibold leading-4 shadow-2xl transition-colors hover:bg-gray-300 disabled:cursor-not-allowed'
          >
            <PrintIcon className='size-7 text-gray-800' />
          </button>
          {nfc ? (
            <button
              type='button'
              disabled={!did || isWriting}
              onClick={() => write()}
              className='mt-16 rounded-full bg-white p-3 font-semibold leading-4 shadow-2xl transition-colors hover:bg-gray-300 disabled:cursor-not-allowed'
            >
              {isWriting ? (
                <LoadingIcon className='size-7 text-gray-400' />
              ) : (
                <NfcIcon className='size-7 text-gray-800' />
              )}
            </button>
          ) : null}
        </div>
      </div>
      {width && height && success
        ? createPortal(
            <Confetti width={width} height={height} recycle={false} className='print:hidden' />,
            document.body,
          )
        : null}
    </div>
  )
}
