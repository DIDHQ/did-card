import clsx from 'clsx'
import { forwardRef } from 'react'
import { Collection, useTokens } from '@/hooks/use-nfts'

export default forwardRef<
  HTMLDivElement,
  {
    addresses: string[]
    collection: Collection
    className?: string
  }
>(function NftTokens(props, ref) {
  const { data: tokens } = useTokens(props.addresses, props.collection.id)

  return (
    <div ref={ref} className={clsx('flex flex-wrap gap-4', props.className)}>
      {tokens
        ? tokens.map((token) => (
            <img
              key={token.token}
              src={token.image}
              alt="nft"
              loading="lazy"
              className="h-32 w-32 rounded-xl bg-gray-50 object-cover"
            />
          ))
        : Array.from({ length: props.collection.tokenCount }).map(
            (_, index) => (
              <div key={index} className="h-32 w-32 rounded-xl bg-gray-50" />
            ),
          )}
    </div>
  )
})
