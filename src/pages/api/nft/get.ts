import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http, isAddress, parseAbi } from 'viem'
import { fetchJSON } from '@/utils/fetch'
import { rpcUrls } from '@/utils/chain'

export const runtime = 'edge'

export default async function handler(req: NextRequest) {
  const nftId = req.nextUrl.searchParams.get('id')
  if (!nftId) {
    return new Response(null, { status: 400 })
  }

  const url = await metadataImage(nftId)
  return url ? NextResponse.redirect(url) : new Response(null, { status: 404 })
}

const abi = parseAbi([
  'function tokenURI(uint256) external view returns (string)',
  'function uri(uint256) external view returns (string)',
])

function wrapURL(url: string) {
  return url
    .replace('ipfs://', 'https://ipfs.io/ipfs/')
    .replace('https://gateway.pinata.cloud/ipfs/', 'https://ipfs.io/ipfs/')
    .replace('https://rarible.mypinata.cloud/ipfs/', 'https://ipfs.io/ipfs/')
    .replace('ar://', 'https://arweave.net/')
}

async function metadataImage(nftId: string): Promise<string | null> {
  const [chain, address, token] = nftId.split('.')
  if (!chain || !rpcUrls[chain] || !address || !isAddress(address) || !token) {
    return null
  }

  const client = createPublicClient({
    transport: http(`https://${rpcUrls[chain]}`),
    batch: { multicall: true },
  })
  const tokenURI = await Promise.any([
    client.readContract({
      address,
      abi,
      functionName: 'tokenURI',
      args: [BigInt(token)],
    }),
    client
      .readContract({
        address,
        abi,
        functionName: 'uri',
        args: [BigInt(token)],
      })
      .then((uri) => uri.replace('{id}', BigInt(token).toString(16))),
  ])

  const metadata = await fetchJSON<{
    image?: string
    image_data?: string
    image_url?: string
  }>(wrapURL(tokenURI))

  const image = metadata?.image || metadata?.image_data || metadata?.image_url

  return image ? wrapURL(image) : null
}
