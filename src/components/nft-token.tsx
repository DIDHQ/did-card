import {
  LazyLoadImage,
  ScrollPosition,
  trackWindowScroll,
} from 'react-lazy-load-image-component'
import { useCallback, useState } from 'react'
import { reservoirs } from '@/utils/chain'

function nftId2Image(nftId: string): string | undefined {
  const [chain, contract, token] = nftId.split('.')
  if (!chain || !reservoirs[chain]) {
    return
  }
  return `https://${reservoirs[chain]}/redirect/tokens/${contract}:${token}/image/v1`
}

export default trackWindowScroll(function NftToken(props: {
  nftId: string
  onSelect(image: string): void
  scrollPosition: ScrollPosition
  className?: string
}) {
  const [image, setImage] = useState(nftId2Image(props.nftId))
  const handleError = useCallback(() => {
    const fallback = `/api/nft/get?id=${props.nftId}`
    setImage((old) => (old === fallback ? undefined : fallback))
  }, [props.nftId])
  const handleClick = useCallback(() => {
    if (image) {
      props.onSelect(image)
    }
  }, [image, props])

  return image ? (
    <LazyLoadImage
      src={image}
      alt={props.nftId}
      scrollPosition={props.scrollPosition}
      onError={handleError}
      onClick={handleClick}
      wrapperClassName="block h-32 w-32"
      className="h-32 w-32 cursor-pointer rounded-xl bg-gray-50 object-cover ring-gray-200 transition-shadow hover:ring"
    />
  ) : (
    <div className="h-32 w-32 cursor-not-allowed rounded-xl bg-gray-50" />
  )
})
