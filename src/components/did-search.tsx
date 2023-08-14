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
    <div className={clsx('relative h-full w-96', props.className)}>
      <input
        placeholder="vitalik.bit"
        value={did}
        onChange={(e) => setDid(e.target.value)}
        className="absolute inset-x-0 top-0 bg-gray-300/50 px-8 py-6 text-2xl font-bold leading-normal text-gray-800 outline-none backdrop-blur-md"
      />
      <NftCollections addresses={addresses} className="h-full pt-[84px]" />
    </div>
  )
}
