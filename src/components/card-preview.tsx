import clsx from 'clsx'

export default function CardPreview(props: {
  did: string
  image: string
  className?: string
}) {
  return (
    <div className={clsx('flex items-center justify-center', props.className)}>
      <div className="flex h-[337pt] w-[212.5pt] flex-col overflow-hidden rounded-[12.5pt]">
        <img src={props.image} alt="card" className="shrink-0" />
        <div className="flex h-0 flex-1 items-center justify-center bg-black text-[32pt] font-bold text-white">
          {props.did}
        </div>
      </div>
    </div>
  )
}
