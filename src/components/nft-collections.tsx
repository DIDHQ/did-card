import { GroupedVirtuoso } from 'react-virtuoso'
import NftToken from './nft-token'
import { Collection } from '@/utils/type'

export default function NftCollections(props: {
  collections?: Collection[]
  onSelect(image: string): void
  className?: string
}) {
  return (
    <GroupedVirtuoso
      components={{
        Header: () => (
          <div>
            <div className="flex h-16 items-center justify-between bg-gray-100 px-6 font-semibold">
              <span className="text-gray-800">Default</span>
              <span className="text-gray-400">1</span>
            </div>
            <div className="p-6">
              <img
                src="/favicon.png"
                alt="favicon"
                onClick={() =>
                  props.onSelect(`${window.location.href}/favicon.png`)
                }
                className="h-32 w-32 cursor-pointer rounded-xl object-cover ring-gray-200 transition-shadow hover:ring"
              />
            </div>
          </div>
        ),
      }}
      groupCounts={props.collections?.map(() => 1) ?? []}
      groupContent={(index) => (
        <div className="flex h-16 items-center justify-between bg-gray-100 px-6 font-semibold">
          <span className="text-gray-800">
            {props.collections?.[index]?.name}
          </span>
          <span className="text-gray-400">
            {props.collections?.[index]?.distinct_nfts_owned}
          </span>
        </div>
      )}
      itemContent={(index) => (
        <div className="flex flex-wrap gap-6 p-6">
          {props.collections?.[index]?.nft_ids.map((nftId) => (
            <NftToken
              key={nftId}
              nftId={nftId}
              onSelect={props.onSelect}
              className="p-6"
            />
          ))}
        </div>
      )}
      className={props.className}
    />
  )
}
