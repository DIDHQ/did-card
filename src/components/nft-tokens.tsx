import clsx from 'clsx'
import {
  LazyLoadImage,
  ScrollPosition,
  trackWindowScroll,
} from 'react-lazy-load-image-component'
import { Collection, useTokens } from '@/hooks/use-nfts'

export default trackWindowScroll(function NftTokens(props: {
  addresses?: string[]
  collection?: Collection
  onSelect(image: string): void
  scrollPosition: ScrollPosition
  className?: string
}) {
  const { data: tokens } = useTokens(props.addresses, props.collection?.id)

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
                onClick={() =>
                  token.image ? props.onSelect(token.image) : null
                }
                wrapperClassName="block h-32 w-32"
                className="h-32 w-32 cursor-pointer rounded-xl bg-gray-50 object-cover ring-gray-200 transition-shadow hover:ring"
              />
            ) : (
              <div
                key={token.token}
                className="h-32 w-32 cursor-wait rounded-xl bg-gray-50"
              />
            ),
          )
        : Array.from({ length: props.collection?.tokenCount ?? 0 }).map(
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
