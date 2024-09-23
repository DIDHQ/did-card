import useRelatedAddresses from '@/hooks/use-related-addresses'
import { fetchJSON } from '@/utils/fetch'
import type { Collection } from '@/utils/type'
import clsx from 'clsx'
import { useState } from 'react'
import useSWR from 'swr'
import { LoadingIcon, SearchIcon } from './icon'
import NftCollections from './nft-collections'

export default function DIDSearch(props: {
  setDid: (did: string) => void
  setTag: (tag: string) => void
  setTitle: (title: string) => void
  setImage: (image: string) => void
  className?: string
}) {
  const [did, setDid] = useState('')
  const [tag, setTag] = useState('')
  const [title, setTitle] = useState('')
  const { data: addresses, isLoading: isAddressesLoading } = useRelatedAddresses(did)
  const { data: collections, isLoading: isCollectionsLoading } = useSWR(
    addresses?.length ? ['nft', addresses] : null,
    () => fetchJSON<Collection[]>(`/api/nft/list?addresses=${addresses?.join(',')}`),
    { revalidateOnFocus: false },
  )

  return (
    <div className={clsx('flex h-full flex-col', props.className)}>
      <div className='flex shrink-0 items-center px-6'>
        {isAddressesLoading || isCollectionsLoading ? (
          <LoadingIcon className='h-8 w-8 shrink-0 text-gray-400' />
        ) : (
          <SearchIcon className='h-8 w-8 shrink-0 text-gray-400' />
        )}
        <input
          placeholder='DID or Name'
          value={did}
          onChange={(e) => setDid(e.target.value)}
          onBlur={() => props.setDid(did)}
          className='flex-1 bg-transparent p-6 text-4xl font-bold leading-normal text-gray-800 outline-none placeholder:text-gray-400'
        />
      </div>
      <div className='flex shrink-0 items-center bg-slate-100 px-6'>
        <div className='w-8 shrink-0 text-5xl leading-none text-gray-400'>#</div>
        <input
          placeholder='Community Tag'
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          onBlur={() => props.setTag(tag)}
          className='flex-1 bg-transparent p-6 text-4xl font-bold leading-normal text-gray-800 outline-none placeholder:text-gray-400'
        />
      </div>
      <div className='flex shrink-0 items-center bg-slate-200 px-6'>
        <div className='w-8 shrink-0 text-5xl leading-none text-gray-400'>T</div>
        <input
          placeholder='Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => props.setTitle(title)}
          className='flex-1 bg-transparent p-6 text-4xl font-bold leading-normal text-gray-800 outline-none placeholder:text-gray-400'
        />
      </div>
      {did ? (
        <NftCollections
          collections={collections}
          onSelect={(image) => {
            props.setImage(image)
          }}
          className='h-0 flex-1'
        />
      ) : null}
    </div>
  )
}
