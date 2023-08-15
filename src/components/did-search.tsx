import { useState } from 'react'
import clsx from 'clsx'
import NftCollections from './nft-collections'
import { LoadingIcon, SearchIcon } from './icon'
import useRelatedAddresses from '@/hooks/use-related-addresses'
import { useCollections } from '@/hooks/use-nfts'

export default function DIDSearch(props: {
  setDid: (did: string) => void
  setImage: (image: string) => void
  className?: string
}) {
  const [did, setDid] = useState('')
  const { data: addresses, isLoading: isAddressesLoading } =
    useRelatedAddresses(did)
  const { data: collections, isLoading: isCollectionsLoading } =
    useCollections(addresses)

  return (
    <div className={clsx('flex h-full flex-col', props.className)}>
      <div className="flex shrink-0 items-center px-6">
        {isAddressesLoading || isCollectionsLoading ? (
          <LoadingIcon className="h-8 w-8 shrink-0 text-gray-400" />
        ) : (
          <SearchIcon className="h-8 w-8 shrink-0 text-gray-400" />
        )}
        <input
          autoFocus
          placeholder="My DID"
          value={did}
          onChange={(e) => setDid(e.target.value)}
          onBlur={() => props.setDid(did)}
          className="flex-1 bg-transparent p-6 text-4xl font-bold leading-normal text-gray-800 outline-none placeholder:text-gray-400"
        />
      </div>
      {addresses && collections ? (
        <NftCollections
          addresses={addresses}
          collections={collections}
          onSelect={(token) => props.setImage(token.image!)}
          className="h-0 flex-1"
        />
      ) : null}
    </div>
  )
}
