import { useMemo, useState } from 'react'
import clsx from 'clsx'
import { useCollections } from '@/hooks/use-nfts'
import useRelatedAddresses from '@/hooks/use-related-addresses'

export default function DIDSearch(props: {
  setDid: (did: string) => void
  setImage: (image: string) => void
  className?: string
}) {
  const [did, setDid] = useState('')
  const [query, setQuery] = useState('')
  const { data: addresses = [] } = useRelatedAddresses(did)
  const { data } = useCollections(addresses)
  const collections = useMemo(
    () =>
      data?.filter(({ collection }) =>
        collection.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [data, query],
  )

  return (
    <div className={clsx('w-96', props.className)}>
      <input
        placeholder="vitalik.bit"
        value={did}
        onChange={(e) => setDid(e.target.value)}
      />
      {collections?.length ? (
        <>
          <input
            placeholder="filter collections"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {collections.map((collection) => (
            <div key={collection.collection.id}>
              {collection.collection.name}
            </div>
          ))}
        </>
      ) : null}
    </div>
  )
}
