import { GroupedVirtuoso } from 'react-virtuoso'
import NftTokens from './nft-tokens'
import { Token, useCollections } from '@/hooks/use-nfts'

export default function NftCollections(props: {
  addresses: string[]
  onSelect(token: Token): void
  className?: string
}) {
  const { data: collections = [] } = useCollections(props.addresses)

  return (
    <GroupedVirtuoso
      groupCounts={collections.map(() => 1)}
      groupContent={(index) => (
        <div className="flex h-16 items-center justify-between bg-slate-900 px-6 font-semibold">
          <span className="text-gray-200">{collections[index]!.name}</span>
          <span className="text-gray-500">
            {collections[index]!.tokenCount}
          </span>
        </div>
      )}
      itemContent={(index) => (
        <NftTokens
          addresses={props.addresses}
          collection={collections[index]!}
          onSelect={props.onSelect}
          className="p-6"
        />
      )}
      className={props.className}
    />
  )
}
