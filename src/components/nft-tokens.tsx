import clsx from 'clsx'
import {
  LazyLoadImage,
  ScrollPosition,
  trackWindowScroll,
} from 'react-lazy-load-image-component'
import { Collection } from '@/server/routers/nft'
import { chains } from '@/utils/constant'

function nftId2Image(nftId: string): string | undefined {
  const [chain, contract, token] = nftId.split('.')
  if (!chain || !chains[chain]) {
    return
  }
  return `https://${chains[chain]}/redirect/tokens/${contract}:${token}/image/v1`
}

export default trackWindowScroll(function NftTokens(props: {
  addresses?: string[]
  collection?: Collection
  onSelect(image: string): void
  scrollPosition: ScrollPosition
  className?: string
}) {
  return (
    <div className={clsx('flex flex-wrap gap-6', props.className)}>
      {props.collection?.nft_ids.map((nftId) => {
        const image = nftId2Image(nftId)
        return image ? (
          <LazyLoadImage
            key={nftId}
            src={image}
            alt="nft"
            scrollPosition={props.scrollPosition}
            onClick={() => props.onSelect(image)}
            wrapperClassName="block h-32 w-32"
            className="h-32 w-32 cursor-pointer rounded-xl bg-gray-50 object-cover ring-gray-200 transition-shadow hover:ring"
          />
        ) : null
      })}
    </div>
  )
})
