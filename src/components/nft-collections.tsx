import clsx from 'clsx'
import NftTokens from './nft-tokens'
import { useCollections } from '@/hooks/use-nfts'

export default function NftCollections(props: {
  addresses: string[]
  className?: string
}) {
  const { data: collections } = useCollections(props.addresses)

  return (
    <ul className={clsx('overflow-y-auto', props.className)}>
      {collections?.map((collection) => (
        <NftTokens
          key={collection.collection.id}
          addresses={props.addresses}
          collection={collection}
        />
      ))}
    </ul>
  )
}
