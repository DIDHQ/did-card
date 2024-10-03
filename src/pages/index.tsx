import DIDSearch from '@/components/did-search'
import {
  didAtom,
  didColorAtom,
  flippedAtom,
  imageAtom,
  roleAtom,
  roleColorAtom,
  tagAtom,
  tagColorAtom,
} from '@/utils/atom'
import type { generateBack } from '@/workers/back'
import type { generateFront } from '@/workers/front'
import type { convertToPng } from '@/workers/png'
import { Allotment } from 'allotment'
import { wrap } from 'comlink'
import { useAtom, useAtomValue } from 'jotai'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import useSWR from 'swr'

const CardPreview = dynamic(() => import('@/components/card-preview'), {
  ssr: false,
  loading: () => <div className='size-full bg-gradient' />,
})

export default function IndexPage() {
  const flipped = useAtomValue(flippedAtom)
  const [image, setImage] = useAtom(imageAtom)
  const did = useAtomValue(didAtom)
  const [tag, setTag] = useAtom(tagAtom)
  const [role, setRole] = useAtom(roleAtom)
  const didColor = useAtomValue(didColorAtom)
  const tagColor = useAtomValue(tagColorAtom)
  const roleColor = useAtomValue(roleColorAtom)
  useEffect(() => {
    if (!did) {
      setImage('')
      setTag('')
      setRole('')
    }
  }, [did, setImage, setTag, setRole])

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
    ['front', image, did, tag, role, didColor, tagColor, roleColor],
    () => {
      if (!frontRef.current) {
        throw new Error()
      }
      return frontRef.current.call(
        frontRef.current,
        image,
        did,
        tag,
        role,
        didColor,
        tagColor,
        roleColor,
      )
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
        <DIDSearch className='size-full' />
        <CardPreview front={front} back={back} png={png} className='size-full' />
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
