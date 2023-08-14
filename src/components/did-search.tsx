import { useState } from 'react'

export default function DIDSearch(props: {
  setDid: (did: string) => void
  setImage: (image: string) => void
  className?: string
}) {
  const [did, setDid] = useState('')

  return (
    <div className={props.className}>
      <input
        placeholder="vitalik.bit"
        value={did}
        onChange={(e) => setDid(e.target.value)}
      />
    </div>
  )
}
