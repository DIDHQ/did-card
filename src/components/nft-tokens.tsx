import clsx from 'clsx'
import {
  LazyLoadImage,
  ScrollPosition,
  trackWindowScroll,
} from 'react-lazy-load-image-component'
import { Collection, Token, useTokens } from '@/hooks/use-nfts'

export default trackWindowScroll(function NftTokens(props: {
  addresses: string[]
  collection: Collection
  onSelect(token: Token): void
  scrollPosition: ScrollPosition
  className?: string
}) {
  const { data: tokens } = useTokens(props.addresses, props.collection.id)

  return (
    <div className={clsx('flex flex-wrap gap-6', props.className)}>
      {tokens
        ? tokens.map((token) =>
            token.image ? (
              <LazyLoadImage
                key={token.token}
                src={token.image}
                effect="opacity"
                alt="nft"
                scrollPosition={props.scrollPosition}
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
