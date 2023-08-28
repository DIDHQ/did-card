import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { sortBy } from 'remeda'
import { procedure, router } from '../trpc'
import { chains } from '@/utils/constant'

const collectionSchema = z.object({
  name: z.string(),
  image_url: z.string(),
  distinct_nfts_owned: z.number(),
  nft_ids: z.array(z.string()),
})

export type Collection = z.TypeOf<typeof collectionSchema>

export const nftRouter = router({
  list: procedure
    .input(z.object({ addresses: z.array(z.string()).optional() }))
    .output(z.array(collectionSchema))
    .query(async ({ input }) => {
      if (!input.addresses) {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }

      const response = await fetch(
        `https://api.simplehash.com/api/v0/nfts/collections_by_wallets?chains=${Object.keys(
          chains,
        ).join(',')}&wallet_addresses=${input.addresses.join(',')}&nft_ids=1`,
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
                (collection.top_bids?.[0]?.payment_token.symbol === 'ETH' ||
                collection.top_bids?.[0]?.payment_token.symbol === 'WETH'
                  ? 1000
                  : 1),
          'desc',
        ],
      ) as Collection[]
    }),
})
