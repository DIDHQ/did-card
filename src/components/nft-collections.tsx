import { GroupedVirtuoso } from 'react-virtuoso'
import NftTokens from './nft-tokens'
import { Collection, Token } from '@/hooks/use-nfts'

export default function NftCollections(props: {
  addresses: string[]
  collections: Collection[]
  onSelect(token: Token): void
  className?: string
}) {
  return (
    <GroupedVirtuoso
      groupCounts={props.collections.map(() => 1)}
      groupContent={(index) => (
        <div className="flex h-16 items-center justify-between bg-gray-50 px-6 font-semibold">
          <span className="text-gray-800">
            {props.collections[index]!.name}
          </span>
          <span className="text-gray-400">
            {props.collections[index]!.tokenCount}
          </span>
        </div>
      )}
      itemContent={(index) => (
        <NftTokens
          addresses={props.addresses}
          collection={props.collections[index]!}
          onSelect={props.onSelect}
          className="p-6"
        />
      )}
      className={props.className}
    />
  )
}
