const textEncoder = new TextEncoder()

export function svgToDataURI(input: string | ArrayBuffer) {
  return `data:image/svg+xml;base64,${Buffer.from(
    typeof input === 'string' ? textEncoder.encode(input) : input,
  ).toString('base64')}`
}
