import CardPreview from '@/components/card-preview'
import DIDSearch from '@/components/did-search'
import { useState } from 'react'

export default function IndexPage() {
  const [did, setDid] = useState('')
  const [image, setImage] = useState('')

  return (
    <div className="flex">
      <DIDSearch setDid={setDid} setImage={setImage} className="flex-1 w-0" />
      <CardPreview did={did} image={image} className="flex-1 w-0" />
    </div>
  )
}
