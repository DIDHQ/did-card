import clsx from 'clsx'
import { toPng } from 'html-to-image'
import { useCallback, useEffect, useRef, useState } from 'react'
import download from 'downloadjs'
import dynamic from 'next/dynamic'
import useSWRMutation from 'swr/mutation'
import DidCard from './did-card'
import { DownloadIcon, LoadingIcon } from './icon'

const ParallaxStars = dynamic(() => import('./parallax-stars'), { ssr: false })

/**
 * @see https://fjolt.com/article/css-3d-interactive-flippable-cards
 */
export default function CardPreview(props: {
  did: string
  image: string
  className?: string
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const cardBackFaceRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const cardFrontFaceRef = useRef<HTMLDivElement>(null)
  const [animated, setAnimated] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const calculateAngle = useCallback((e: MouseEvent, flipped: boolean) => {
    const front = cardFrontFaceRef.current
    const back = cardBackFaceRef.current
    const parent = cardRef.current
    const glare = glareRef.current
    if (!front || !back || !parent || !glare) {
      return
    }

    const dropShadowColor = `rgba(0, 0, 0, 0.3)`

    setAnimated(true)
    // Get the x position of the users mouse, relative to the button itself
    const x = Math.abs(front.getBoundingClientRect().x - e.clientX)
    // Get the y position relative to the button
    const y = Math.abs(front.getBoundingClientRect().y - e.clientY)

    // Calculate half the width and height
    const halfWidth = front.getBoundingClientRect().width / 2
    const halfHeight = front.getBoundingClientRect().height / 2

    // Use this to create an angle. I have divided by 6 and 4 respectively so the effect looks good.
    // Changing these numbers will change the depth of the effect.
    const calcAngleX = (x - halfWidth) / 6
    const calcAngleY = (y - halfHeight) / 14

    const gX = (1 - x / (halfWidth * 2)) * 100
    const gY = (1 - y / (halfHeight * 2)) * 100

    // Add the glare at the reflection of where the user's mouse is hovering
    glare.style.background = `radial-gradient(circle at ${gX}% ${gY}%, rgb(199 198 243), transparent)`
    // And set its container's perspective.
    parent.style.perspective = `${halfWidth * 6}px`
    front.style.perspective = `${halfWidth * 6}px`

    // Set the items transform CSS property
    front.style.transform = `rotateY(${calcAngleX}deg) rotateX(${-calcAngleY}deg) scale(1.04)`
    back.style.transform = flipped
      ? `rotateY(${calcAngleX}deg) rotateX(${-calcAngleY}deg) scale(1.06) translateZ(-4px)`
      : `rotateY(${calcAngleX}deg) rotateX(${-calcAngleY}deg) scale(1.04) translateZ(-4px)`

    // Reapply this to the shadow, with different dividers
    const calcShadowX = (x - halfWidth) / 3
    const calcShadowY = (y - halfHeight) / 6

    // Add a filter shadow - this is more performant to animate than a regular box shadow.
    front.style.filter = `drop-shadow(${-calcShadowX}px ${-calcShadowY}px 15px ${dropShadowColor})`
  }, [])
  const resetAngel = useCallback(() => {
    const front = cardFrontFaceRef.current
    const back = cardBackFaceRef.current
    if (!front || !back) {
      return
    }

    const dropShadowColor = `rgba(0, 0, 0, 0.3)`
    setAnimated(false)
    front.style.transform = `rotateY(0deg) rotateX(0deg) scale(1)`
    back.style.transform = flipped
      ? `rotateY(0deg) rotateX(0deg) scale(1.01) translateZ(-4px)`
      : `rotateY(0deg) rotateX(0deg) scale(1) translateZ(-4px)`
    front.style.filter = `drop-shadow(0 10px 15px ${dropShadowColor})`
  }, [flipped])
  useEffect(() => {
    const parent = cardRef.current

    function handler(e: MouseEvent) {
      calculateAngle(e, flipped)
    }
    parent?.addEventListener('mouseenter', handler)
    parent?.addEventListener('mousemove', handler)
    parent?.addEventListener('mouseleave', resetAngel)

    return () => {
      parent?.removeEventListener('mouseenter', handler)
      parent?.removeEventListener('mousemove', handler)
      parent?.removeEventListener('mouseleave', resetAngel)
    }
  }, [calculateAngle, flipped, resetAngel])
  useEffect(() => {
    setFlipped(false)
  }, [props.did, props.image])
  const { trigger, isMutating } = useSWRMutation(
    'download',
    () =>
      cardFrontFaceRef.current
        ? toPng(cardFrontFaceRef.current, {
            quality: 1,
            width: 1988,
            height: 3108,
          })
        : undefined,
    {
      onSuccess(png) {
        if (png) {
          download(png, `${props.did}.png`, 'image/png')
        }
      },
    },
  )

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
        <div
          ref={cardRef}
          onClick={(e) => {
            setFlipped((old) => {
              calculateAngle(e.nativeEvent, !old)
              return !old
            })
          }}
          className="relative float-left h-[337pt] w-[212.5pt] cursor-pointer bg-transparent transition-all duration-200 ease-out"
          style={{
            backfaceVisibility: 'visible',
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : undefined,
          }}
        >
          <div
            ref={cardBackFaceRef}
            style={{
              willChange: 'transform, filter',
              transform: 'rotateX(0) rotateY(0deg) scale(1) translateZ(-4px)',
              background: 'black',
            }}
            className="absolute inset-0 h-full w-full overflow-hidden rounded-[12.5pt] transition-all duration-150 ease-out"
          >
            <div
              style={{ transform: 'rotateY(180deg)' }}
              className="absolute bottom-10 mx-auto w-full select-none text-center text-white"
            >
              d.id
            </div>
          </div>
          <DidCard
            ref={cardFrontFaceRef}
            did={props.did}
            image={props.image}
            style={{
              perspectiveOrigin: '0 0',
              transform: 'rotateX(0deg) rotateY(0deg) scale(1)',
              filter: 'drop-shadow(0 15px 15px rgba(0,0,0,0.3))',
              willChange: 'transform, filter',
            }}
            className="h-full w-full overflow-hidden rounded-[12.5pt] bg-black bg-cover object-cover transition-all duration-150 ease-out"
          >
            <div
              ref={glareRef}
              style={{
                opacity: animated ? 0.3 : 0,
                background:
                  'radial-gradient(circle at 50% 50%, rgb(199 198 243), transparent)',
              }}
              className="pointer-events-none absolute inset-0 z-50 h-full w-full rounded-[12.5pt] mix-blend-hard-light transition-all duration-100 ease-out"
            />
          </DidCard>
        </div>
        <button
          disabled={isMutating}
          onClick={() => trigger()}
          className="mt-16 rounded-full bg-white p-2 font-semibold leading-4 shadow-2xl transition-colors hover:bg-gray-200"
        >
          {isMutating ? (
            <LoadingIcon className="h-8 w-8 text-gray-400" />
          ) : (
            <DownloadIcon className="h-8 w-8 text-gray-800" />
          )}
        </button>
      </div>
    </div>
  )
}
