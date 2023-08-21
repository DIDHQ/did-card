import { useEffect, useState } from 'react'
import { Allotment } from 'allotment'
import dynamic from 'next/dynamic'
import DIDSearch from '@/components/did-search'

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

  return (
    <Allotment minSize={320} className="h-screen w-screen">
      <DIDSearch
        setDid={setDid}
        setImage={setImage}
        className="h-full w-full"
      />
      <CardPreview
        did={did}
        image={image}
        onDidChange={setDid}
        onImageChange={setImage}
        className="h-full w-full"
      />
    </Allotment>
  )
}
