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
        placeholder="vitalik.bit"
        value={did}
        onChange={(e) => setDid(e.target.value)}
        className="shrink-0 bg-gray-100 px-8 py-6 text-2xl font-bold leading-normal text-gray-800 outline-none"
      />
      <NftCollections addresses={addresses} className="h-0 flex-1" />
    </div>
  )
}
