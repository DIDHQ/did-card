/**
 * @see https://github.com/nikpundik/react-astrum/blob/master/src/utils.js
 */

const getSpeed = (w: number, s: number, d?: boolean) =>
  (0.5 + w) * s * (d ? -1 : 1)

export const createStar = (w: number, h: number, s: number, d?: boolean) => {
  const weight = 1 + Math.random()
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    s: getSpeed(weight, s, d),
    w: weight,
  }
}

export const createStars = (
  n: number,
  w: number,
  h: number,
  s: number,
  d?: boolean,
) => {
  const stars = []
  for (let i = 0; i < n; i += 1) {
    stars.push(createStar(w, h, s, d))
  }
  return stars
}

type Star = {
  x: number
  y: number
  s: number
  w: number
}

export const updateStar = (star: Star, h: number) => {
  star.y -= star.s
  if (star.y < 0) star.y = h
  else if (star.y > h) star.y = 0
}

export const updateStars = (
  stars: Star[],
  w: number,
  h: number,
  s: number,
  d?: boolean,
) => {
  for (let i = 0; i < stars.length; i += 1) {
    stars[i]!.x = Math.random() * w
    stars[i]!.y = Math.random() * h
    stars[i]!.s = getSpeed(stars[i]!.w, s, d)
  }
}
