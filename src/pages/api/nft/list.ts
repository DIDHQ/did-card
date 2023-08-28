import { NextRequest, NextResponse } from 'next/server'
import { sortBy } from 'remeda'
import { chains } from '@/utils/constant'
import { Collection } from '@/utils/type'

export const runtime = 'edge'

export default async function handler(req: NextRequest) {
  const addresses = req.nextUrl.searchParams.get('addresses')
  if (typeof addresses !== 'string' || !addresses) {
    return new Response(null, { status: 400 })
  }

  const json = await simpleHash(addresses)

  return NextResponse.json(json)
}

async function simpleHash(addresses: string): Promise<Collection[]> {
  const response = await fetch(
    `https://api.simplehash.com/api/v0/nfts/collections_by_wallets?chains=${Object.keys(
      chains,
    ).join(',')}&wallet_addresses=${addresses}&nft_ids=1`,
    {
      headers: {
        authority: 'api.simplehash.com',
        accept: 'application/json',
        origin: 'https://docs.simplehash.com',
        referer: 'https://docs.simplehash.com/',
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
        'x-api-key': 'sh_sk1_Z4jhWXXBE09em',
      },
    },
  )

  const json = (await response.json()) as {
    collections: {
      name: string | null
      image_url: string | null
      distinct_nfts_owned: number
      nft_ids?: string[]
      top_contracts?: string[]
      top_bids?: { value: number; payment_token: { symbol: string } }[]
    }[]
  }

  return sortBy(
    json.collections.filter(
      (collection) =>
        collection.name && collection.image_url && collection.nft_ids,
    ),
    [
      (collection) =>
        collection.top_contracts?.[0] ===
        'ethereum.0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb'
          ? Infinity
          : (collection.top_bids?.[0]?.value ?? 0) *
            (collection.top_bids?.[0]?.payment_token.symbol.endsWith('ETH')
              ? 1000
              : collection.top_bids?.[0]?.payment_token.symbol.endsWith('BNB')
              ? 100
              : 1),
      'desc',
    ],
  ) as Collection[]
}
