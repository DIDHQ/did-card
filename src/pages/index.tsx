import { useEffect, useRef, useState } from 'react'
import { Allotment } from 'allotment'
import dynamic from 'next/dynamic'
import useSWR from 'swr'
import { wrap } from 'comlink'
import DIDSearch from '@/components/did-search'
import type { generate } from '@/workers/svg'
import type { convert } from '@/workers/png'

const CardPreview = dynamic(() => import('@/components/card-preview'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gradient" />,
})

export default function IndexPage() {
  const [did, setDid] = useState('')
  const [image, setImage] = useState('')
  useEffect(() => {
    if (!did) {
      setImage('')
    }
  }, [did])

  const generateRef = useRef<typeof generate>()
  const convertRef = useRef<typeof convert>()
  useEffect(() => {
    generateRef.current = wrap<typeof generate>(
      new Worker(new URL('../workers/svg.tsx', import.meta.url)),
    )
    convertRef.current = wrap<typeof convert>(
      new Worker(new URL('../workers/png.ts', import.meta.url)),
    )
  }, [])

  const { data: svg } = useSWR(
    ['svg', did, image],
    () => {
      if (!generateRef.current) {
        throw new Error()
      }
      return generateRef.current.call(generateRef.current, did, image)
    },
    { revalidateOnFocus: false, errorRetryInterval: 1000 },
  )
  const { data: png } = useSWR(
    svg ? ['png', svg] : null,
    () => {
      if (!convertRef.current) {
        throw new Error()
      }
      return convertRef.current.call(convertRef.current, svg!)
    },
    { revalidateOnFocus: false, errorRetryInterval: 1000 },
  )

  return (
    <>
      <Allotment minSize={320} className="h-screen w-screen print:hidden">
        <DIDSearch
          setDid={setDid}
          setImage={setImage}
          className="h-full w-full"
        />
        <CardPreview
          did={did}
          image={image}
          svg={svg}
          png={png}
          onDidChange={setDid}
          onImageChange={setImage}
          className="h-full w-full"
        />
      </Allotment>
      <div className="hidden h-[100vh] w-[100vw] overflow-hidden print:block">
        <img
          src={png}
          alt="print"
          style={{
            transform: 'rotate(90deg) translateY(-100%)',
          }}
          className="h-[100vw] w-[100vh] origin-top-left object-cover"
        />
      </div>
    </>
  )
}
