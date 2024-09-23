import { createStars, updateStar, updateStars } from '@/utils/star'
import { useMeasure } from '@uidotdev/usehooks'
import { useCallback, useEffect, useMemo, useRef } from 'react'

/**
 * @see https://github.com/nikpundik/react-astrum/blob/master/src/index.js
 */
export default function ParallaxStars(props: {
  stars: number
  speed: number
  down?: boolean
  color: string
  sparkle?: boolean
  className?: string
}) {
  const [ref, { width, height }] = useMeasure<HTMLCanvasElement>()
  const requestRef = useRef<number>()
  const stars = useMemo(
    () => (width && height ? createStars(props.stars, width, height, props.speed, props.down) : []),
    [props.down, props.speed, props.stars, height, width],
  )
  const tick = useCallback(() => {
    const ctx = ref.current?.getContext('2d')
    if (!ctx || !width || !height) {
      return
    }
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = props.color
    for (const star of stars) {
      if (props.sparkle) {
        ctx.globalAlpha = Math.random()
      }
      ctx.fillRect(star.x, star.y, star.w, star.w)
      updateStar(star, height)
    }
    requestRef.current = requestAnimationFrame(tick)
  }, [height, props.color, props.sparkle, ref, stars, width])
  useEffect(() => {
    requestRef.current = requestAnimationFrame(tick)
    return () => {
      if (requestRef.current !== undefined) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [tick])
  useEffect(() => {
    const ctx = ref.current?.getContext('2d')
    if (ctx && !props.sparkle) {
      ctx.globalAlpha = 1
    }
  }, [props.sparkle, ref])
  useEffect(() => {
    if (width && height) {
      updateStars(stars, width, height, props.speed, props.down)
    }
  }, [height, props.down, props.speed, stars, width])

  return <canvas ref={ref} className={props.className} />
}
