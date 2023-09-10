import { useState } from 'react'
import clsx from 'clsx'
import useSWR from 'swr'
import NftCollections from './nft-collections'
import { LoadingIcon, SearchIcon } from './icon'
import useRelatedAddresses from '@/hooks/use-related-addresses'
import { Collection } from '@/utils/type'
import { fetchJSON } from '@/utils/fetch'

export default function DIDSearch(props: {
  setDid: (did: string) => void
  setImage: (image: string) => void
  className?: string
}) {
  const [did, setDid] = useState('')
  const { data: addresses, isLoading: isAddressesLoading } =
    useRelatedAddresses(did)
  const { data: collections, isLoading: isCollectionsLoading } = useSWR(
    addresses?.length ? ['nft', addresses] : null,
    () =>
      fetchJSON<Collection[]>(
        `/api/nft/list?addresses=${addresses?.join(',')}`,
      ),
    { revalidateOnFocus: false },
  )

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
          placeholder="Enter your DID"
          value={did}
          onChange={(e) => setDid(e.target.value)}
          className="flex-1 bg-transparent p-6 text-4xl font-bold leading-normal text-gray-800 outline-none placeholder:text-gray-400"
        />
      </div>
      {did ? (
        <NftCollections
          collections={collections}
          onSelect={(image) => {
            props.setImage(image)
            props.setDid(did)
          }}
          className="h-0 flex-1"
        />
      ) : null}
    </div>
  )
}
