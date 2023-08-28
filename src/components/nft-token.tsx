import {
  LazyLoadImage,
  ScrollPosition,
  trackWindowScroll,
} from 'react-lazy-load-image-component'
import { chains } from '@/utils/constant'

function nftId2Image(nftId: string): string | undefined {
  const [chain, contract, token] = nftId.split('.')
  if (!chain || !chains[chain]) {
    return
  }
  return `https://${chains[chain]}/redirect/tokens/${contract}:${token}/image/v1`
}

export default trackWindowScroll(function NftToken(props: {
  nftId: string
  onSelect(image: string): void
  scrollPosition: ScrollPosition
  className?: string
}) {
  const image = nftId2Image(props.nftId)

  return image ? (
    <LazyLoadImage
      src={image}
      alt={props.nftId}
      scrollPosition={props.scrollPosition}
      onClick={() => props.onSelect(image)}
      wrapperClassName="block h-32 w-32"
      className="h-32 w-32 cursor-pointer rounded-xl bg-gray-50 object-cover ring-gray-200 transition-shadow hover:ring"
    />
  ) : (
    <div className="h-32 w-32 cursor-not-allowed rounded-xl bg-gray-50" />
  )
})
