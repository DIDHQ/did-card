import clsx from 'clsx'
import { forwardRef } from 'react'
import { Collection, Token, useTokens } from '@/hooks/use-nfts'

export default forwardRef<
  HTMLDivElement,
  {
    addresses: string[]
    collection: Collection
    onSelect(token: Token): void
    className?: string
  }
>(function NftTokens(props, ref) {
  const { data: tokens } = useTokens(props.addresses, props.collection.id)

  return (
    <div ref={ref} className={clsx('flex flex-wrap gap-6', props.className)}>
      {tokens
        ? tokens.map((token) =>
            token.image ? (
              <img
                key={token.token}
                src={token.image}
                alt="nft"
                loading="lazy"
                onClick={() => props.onSelect(token)}
                className="h-32 w-32 cursor-pointer rounded-xl bg-gray-50 object-cover"
              />
            ) : (
              <div
                key={token.token}
                className="h-32 w-32 cursor-wait rounded-xl bg-gray-50"
              />
            ),
          )
        : Array.from({ length: props.collection.tokenCount }).map(
            (_, index) => (
              <div
                key={index}
                className="h-32 w-32 cursor-wait rounded-xl bg-gray-50"
              />
            ),
          )}
    </div>
  )
})
