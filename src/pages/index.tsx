import { useEffect, useState } from 'react'
import { Allotment } from 'allotment'
import CardPreview from '@/components/card-preview'
import DIDSearch from '@/components/did-search'

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
      <CardPreview did={did} image={image} className="h-full w-full" />
    </Allotment>
  )
}
