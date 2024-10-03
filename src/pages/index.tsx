import DIDSearch from '@/components/did-search'
import { flippedAtom } from '@/utils/atom'
import type { generateBack } from '@/workers/back'
import type { generateFront } from '@/workers/front'
import type { convertToPng } from '@/workers/png'
import { Allotment } from 'allotment'
import { wrap } from 'comlink'
import { useAtomValue } from 'jotai'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'

const CardPreview = dynamic(() => import('@/components/card-preview'), {
  ssr: false,
  loading: () => <div className='size-full bg-gradient' />,
})

export default function IndexPage() {
  const [did, setDid] = useState('')
  const [tag, setTag] = useState('')
  const [role, setRole] = useState('')
  const [image, setImage] = useState('')
  useEffect(() => {
    if (!did) {
      setImage('')
    }
  }, [did])

  const frontRef = useRef<typeof generateFront>()
  const backRef = useRef<typeof generateBack>()
  const pngRef = useRef<typeof convertToPng>()
  useEffect(() => {
    frontRef.current = wrap<typeof generateFront>(
      new Worker(new URL('../workers/front.tsx', import.meta.url)),
    )
    backRef.current = wrap<typeof generateBack>(
      new Worker(new URL('../workers/back.tsx', import.meta.url)),
    )
    pngRef.current = wrap<typeof convertToPng>(
      new Worker(new URL('../workers/png.ts', import.meta.url)),
    )
  }, [])

  const router = useRouter()
  const offset = typeof router.query.offset === 'string' ? Number.parseInt(router.query.offset) : 0

  const { data: front } = useSWR(
    ['front', did, tag, role, image],
    () => {
      if (!frontRef.current) {
        throw new Error()
      }
      return frontRef.current.call(frontRef.current, image, did, tag, role)
    },
    { revalidateOnFocus: false, errorRetryInterval: 1000 },
  )
  const { data: back } = useSWR(
    ['back', offset],
    () => {
      if (!backRef.current) {
        throw new Error()
      }
      return backRef.current.call(backRef.current, offset)
    },
    { revalidateOnFocus: false, errorRetryInterval: 1000 },
  )
  const flipped = useAtomValue(flippedAtom)
  const svg = flipped ? back : front
  const { data: png } = useSWR(
    svg ? ['png', svg] : null,
    () => {
      if (!pngRef.current) {
        throw new Error()
      }
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      return pngRef.current.call(pngRef.current, svg!)
    },
    { revalidateOnFocus: false, errorRetryInterval: 1000 },
  )

  return (
    <>
      <Head>
        <title>{did ? `${did}'s DID Card` : 'DID Card'}</title>
        <link rel='icon' href={image || '/favicon.png'} />
      </Head>
      <Allotment minSize={320} className='h-screen w-screen print:hidden'>
        <DIDSearch
          setDid={setDid}
          setTag={setTag}
          setRole={setRole}
          setImage={setImage}
          className='size-full'
        />
        <CardPreview
          did={did}
          front={front}
          back={back}
          png={png}
          onDidChange={setDid}
          onImageChange={setImage}
          className='size-full'
        />
      </Allotment>
      <div className='hidden h-screen w-screen overflow-hidden print:block'>
        <img
          src={png}
          alt='print'
          style={{
            transform: 'rotate(90deg) translateY(-100%)',
          }}
          className='h-[100vw] w-[100vh] origin-top-left object-cover'
        />
      </div>
    </>
  )
}
