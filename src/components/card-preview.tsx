export default function CardPreview(props: {
  did: string
  image: string
  className?: string
}) {
  return (
    <div className={props.className}>
      <img src={props.image} alt="card" />
    </div>
  )
}
