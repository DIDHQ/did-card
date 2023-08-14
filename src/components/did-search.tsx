import { useState } from 'react'
import clsx from 'clsx'
import NftCollections from './nft-collections'
import useRelatedAddresses from '@/hooks/use-related-addresses'

export default function DIDSearch(props: {
  setDid: (did: string) => void
  setImage: (image: string) => void
  className?: string
}) {
  const [did, setDid] = useState('taoli.bit')
  const { data: addresses = [] } = useRelatedAddresses(did)

  return (
    <div className={clsx('flex h-full flex-col', props.className)}>
      <input
        autoFocus
        placeholder="vitalik.bit"
        value={did}
        onChange={(e) => setDid(e.target.value)}
        onBlur={() => props.setDid(did)}
        className="shrink-0 bg-transparent p-6 text-4xl font-bold leading-normal text-gray-800 outline-none"
      />
      <NftCollections
        addresses={addresses}
        onSelect={(token) => props.setImage(token.image!)}
        className="h-0 flex-1"
      />
    </div>
  )
}
