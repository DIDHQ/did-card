import useRelatedAddresses from '@/hooks/use-related-addresses'
import {
  didAtom,
  didColorAtom,
  imageAtom,
  roleAtom,
  roleColorAtom,
  tagAtom,
  tagColorAtom,
} from '@/utils/atom'
import { fetchJSON } from '@/utils/fetch'
import type { Collection } from '@/utils/type'
import clsx from 'clsx'
import { useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { LoadingIcon, SearchIcon } from './icon'
import NftCollections from './nft-collections'

export default function DIDSearch(props: {
  className?: string
}) {
  const [did, setDid] = useState('')
  const [tag, setTag] = useState('')
  const [role, setRole] = useState('')
  const [didColor, setDidColor] = useState('#ffffff')
  const [tagColor, setTagColor] = useState('#7ff845')
  const [roleColor, setRoleColor] = useState('#999999')
  const setImage = useSetAtom(imageAtom)
  const setDidAtom = useSetAtom(didAtom)
  const setTagAtom = useSetAtom(tagAtom)
  const setRoleAtom = useSetAtom(roleAtom)
  const setDidColorAtom = useSetAtom(didColorAtom)
  const setTagColorAtom = useSetAtom(tagColorAtom)
  const setRoleColorAtom = useSetAtom(roleColorAtom)
  const { data: addresses, isLoading: isAddressesLoading } = useRelatedAddresses(did)
  const { data: collections, isLoading: isCollectionsLoading } = useSWR(
    addresses?.length ? ['nft', addresses] : null,
    () => fetchJSON<Collection[]>(`/api/nft/list?addresses=${addresses?.join(',')}`),
    { revalidateOnFocus: false },
  )
  useEffect(() => {
    if (!did) {
      setImage('')
      setTag('')
      setRole('')
    }
  }, [did, setImage])

  return (
    <div className={clsx('flex h-full flex-col', props.className)}>
      <div className='flex shrink-0 items-center px-6'>
        {isAddressesLoading || isCollectionsLoading ? (
          <LoadingIcon className='size-8 shrink-0 text-gray-400' />
        ) : (
          <SearchIcon className='size-8 shrink-0 text-gray-400' />
        )}
        <input
          placeholder='DID or Name'
          value={did}
          onChange={(e) => setDid(e.target.value)}
          onBlur={() => setDidAtom(did)}
          className='flex-1 bg-transparent p-6 text-4xl font-bold leading-normal text-gray-800 outline-none placeholder:text-gray-400'
        />
        <input
          type='color'
          value={didColor}
          onChange={(e) => setDidColor(e.target.value)}
          onBlur={() => setDidColorAtom(didColor)}
          className='shrink-0'
        />
      </div>
      <div className='flex shrink-0 items-center bg-slate-100 px-6'>
        <div className='w-8 shrink-0 text-5xl leading-none text-gray-400'>#</div>
        <input
          placeholder='Community Tag'
          value={tag}
          onChange={(e) =>
            setTag(
              e.target.value === '1'
                ? 'shanhaiwoo'
                : e.target.value === '2'
                  ? 'invisiblegarden'
                  : e.target.value,
            )
          }
          onBlur={() => setTagAtom(tag)}
          className='flex-1 bg-transparent p-6 text-4xl font-bold leading-normal text-gray-800 outline-none placeholder:text-gray-400'
        />
        <input
          type='color'
          value={tagColor}
          onChange={(e) => setTagColor(e.target.value)}
          onBlur={() => setTagColorAtom(tagColor)}
          className='shrink-0'
        />
      </div>
      <div className='flex shrink-0 items-center bg-slate-200 px-6'>
        <div className='w-8 shrink-0 text-5xl leading-none text-gray-400'>R</div>
        <input
          placeholder='Role'
          value={role}
          onChange={(e) => setRole(e.target.value)}
          onBlur={() => setRoleAtom(role)}
          className='flex-1 bg-transparent p-6 text-4xl font-bold leading-normal text-gray-800 outline-none placeholder:text-gray-400'
        />
        <input
          type='color'
          value={roleColor}
          onChange={(e) => setRoleColor(e.target.value)}
          onBlur={() => setRoleColorAtom(roleColor)}
          className='shrink-0'
        />
      </div>
      <NftCollections
        collections={collections}
        onSelect={(image) => {
          setImage(image)
        }}
        className='h-0 flex-1'
      />
    </div>
  )
}
