import clsx from 'clsx'
import ParallaxStars from './parallax-stars'

export default function CardPreview(props: {
  did: string
  image: string
  className?: string
}) {
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
          'absolute inset-0 flex h-full w-full items-center justify-center',
          props.className,
        )}
      >
        <div className="flex h-[337pt] w-[212.5pt] flex-col overflow-hidden rounded-[12.5pt] shadow-2xl">
          {props.image ? (
            <img
              src={props.image}
              alt="card"
              className="aspect-square shrink-0 bg-white object-cover"
            />
          ) : (
            <div className="flex aspect-square shrink-0 items-center justify-center bg-gray-400 p-[32pt] text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M11.07 12.85c.77-1.39 2.25-2.21 3.11-3.44c.91-1.29.4-3.7-2.18-3.7c-1.69 0-2.52 1.28-2.87 2.34L6.54 6.96C7.25 4.83 9.18 3 11.99 3c2.35 0 3.96 1.07 4.78 2.41c.7 1.15 1.11 3.3.03 4.9c-1.2 1.77-2.35 2.31-2.97 3.45c-.25.46-.35.76-.35 2.24h-2.89c-.01-.78-.13-2.05.48-3.15zM14 20c0 1.1-.9 2-2 2s-2-.9-2-2s.9-2 2-2s2 .9 2 2z"
                />
              </svg>
            </div>
          )}
          <div className="flex h-0 flex-1 items-end justify-between bg-black">
            <div className="flex h-full w-0 flex-1 flex-col items-center justify-center pl-[20pt]">
              <div className="text-[12pt] font-semibold text-gray-500">
                I AM
              </div>
              <div className="mb-[12pt] text-[32pt] font-bold text-white">
                {props.did || '???'}
              </div>
            </div>
            <NfcIcon className="mb-[10pt] ml-[-10pt] mr-[10pt] h-[20pt] w-[20pt] shrink-0 text-white" />
          </div>
        </div>
      </div>
    </div>
  )
}

function NfcIcon(props: { className?: string }) {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      className={props.className}
    >
      <path
        fill="currentColor"
        d="M37,42c-0.3,0-0.7-0.1-1-0.3c-1-0.5-1.3-1.8-0.8-2.7c0-0.1,3.7-6.8,3.7-15S35.3,9,35.3,9
c-0.5-1-0.2-2.2,0.8-2.7c1-0.5,2.2-0.2,2.7,0.8c0.2,0.3,4.3,7.6,4.3,17s-4.1,16.7-4.3,17C38.4,41.6,37.7,42,37,42z M32.8,35.8
c0.1-0.2,2.2-5,2.2-11.8c0-6.8-2.1-11.6-2.2-11.8c-0.4-1-1.6-1.5-2.6-1c-1,0.4-1.5,1.6-1,2.6c0,0,1.8,4.3,1.8,10.2
c0,5.9-1.8,10.2-1.8,10.2c-0.4,1,0,2.2,1,2.6c0.3,0.1,0.5,0.2,0.8,0.2C31.8,37,32.5,36.6,32.8,35.8z M23.3,33c0.6-0.1,1.1-0.5,1.4-1
c0.1-0.2,2.3-3.9,2.3-8c0-4.1-2.2-7.9-2.3-8c-0.6-1-1.8-1.3-2.7-0.7c-1,0.6-1.3,1.8-0.7,2.7c0,0,1.7,3,1.7,6c0,1.3-0.3,2.7-0.7,3.7
l-13-11.2c-0.5-0.4-1.2-0.6-1.8-0.4c-0.6,0.2-1.2,0.6-1.4,1.3C6.1,17.5,5,20.5,5,24c0,3.5,1.1,6.5,1.1,6.7c0.4,1,1.5,1.6,2.6,1.2
c1-0.4,1.6-1.5,1.2-2.6c0,0-0.9-2.6-0.9-5.3c0-0.8,0.1-1.6,0.2-2.3l12.5,10.8c0.4,0.3,0.8,0.5,1.3,0.5C23.1,33,23.2,33,23.3,33z"
      />
    </svg>
  )
}
