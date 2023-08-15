import { useEffect, useState } from 'react'
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
    <div className="flex h-screen w-screen">
      <DIDSearch setDid={setDid} setImage={setImage} className="w-0 flex-1" />
      <CardPreview did={did} image={image} className="w-0 flex-1" />
    </div>
  )
}
