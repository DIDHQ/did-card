import clsx from 'clsx'
import { Collection, useTokens } from '@/hooks/use-nfts'

export default function NftTokens(props: {
  addresses: string[]
  collection: Collection
  className?: string
}) {
  const { data: tokens = [] } = useTokens(
    props.addresses,
    props.collection.collection.id,
  )

  return (
    <li className={clsx(props.className)}>
      <div className="flex h-12 items-center justify-between">
        <span className="text-gray-800">
          {props.collection.collection.name}
        </span>
        <span className="text-gray-500">
          {props.collection.ownership.tokenCount}
        </span>
      </div>
      <div className="grid grid-rows-3">
        {tokens.map((token) => (
          <img
            key={token.token}
            src={token.image}
            alt="nft"
            loading="lazy"
            className="h-24 w-24 object-cover"
          />
        ))}
      </div>
    </li>
  )
}
