import { z } from 'zod'
import { TRPCError } from '@trpc/server'
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
  listCollections: procedure
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
        }[]
      }
      return json.collections.filter(
        (collection) =>
          collection.name && collection.image_url && collection.nft_ids,
      ) as Collection[]
    }),
})
