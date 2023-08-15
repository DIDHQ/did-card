import { useState } from 'react'
import clsx from 'clsx'
import NftCollections from './nft-collections'
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-8 w-8 shrink-0 text-gray-400"
          >
            <path
              fill="currentColor"
              d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
              opacity=".25"
            />
            <path
              fill="currentColor"
              d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
            >
              <animateTransform
                attributeName="transform"
                dur="0.75s"
                repeatCount="indefinite"
                type="rotate"
                values="0 12 12;360 12 12"
              />
            </path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            className="h-8 w-8 shrink-0 text-gray-400"
          >
            <path
              fill="currentColor"
              d="M232.49 215.51L185 168a92.12 92.12 0 1 0-17 17l47.53 47.54a12 12 0 0 0 17-17ZM44 112a68 68 0 1 1 68 68a68.07 68.07 0 0 1-68-68Z"
            />
          </svg>
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
