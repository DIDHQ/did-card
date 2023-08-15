import clsx from 'clsx'
import { toPng } from 'html-to-image'
import { useRef } from 'react'
import download from 'downloadjs'
import ParallaxStars from './parallax-stars'
import DidCard from './did-card'

export default function CardPreview(props: {
  did: string
  image: string
  className?: string
}) {
  const ref = useRef(null)

  return (
    <div className={clsx('relative', props.className)}>
      <ParallaxStars
        stars={100}
        speed={0.3}
        color="#ffffff"
        className="h-full w-full bg-gradient"
      />
      <div
        className={clsx(
          'absolute inset-0 flex h-full w-full flex-col items-center justify-center',
          props.className,
        )}
      >
        <DidCard did={props.did} image={props.image} />
        <button
          onClick={() => {
            if (ref.current) {
              toPng(ref.current, {
                quality: 1,
                width: 1988,
                height: 3108,
              }).then((png) => download(png, `${props.did}.png`, 'image/png'))
            }
          }}
          className="mt-16 rounded-full bg-white px-4 py-3 font-semibold leading-4 text-gray-800 shadow-2xl transition-colors hover:bg-gray-200"
        >
          DOWNLOAD
        </button>
      </div>
    </div>
  )
}
