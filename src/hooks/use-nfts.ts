import useSWR from 'swr'
import { pipe, sortBy, values, map, sumBy } from 'remeda'
import { fetchJSON } from '@/utils/fetch'

export type Collection = {
  id: string
  name: string
  image?: string
  volume: number
  tokenCount: number
}

export function useCollections(addresses: string[]) {
  return useSWR<Collection[]>(
    addresses.length ? ['collections', addresses] : null,
    async () => {
      const collections = await Promise.all(
        addresses.map(async (address) => {
          const json = await fetchJSON<{
            collections: {
              collection: {
                id: string
                name: string
                image?: string
                volume: { allTime: number }
              }
              ownership: { tokenCount: string }
            }[]
          }>(
            `https://api.reservoir.tools/users/${address}/collections/v3?limit=100`,
          )
          return json.collections.filter(({ collection }) => collection.image)
        }),
      )

      return pipe(
        values(
          collections.flat().reduce(
            (obj, { collection, ownership }) => {
              if (!obj[collection.id]) {
                obj[collection.id] = []
              }
              obj[collection.id]!.push({
                id: collection.id,
                name: collection.name,
                image: collection.name,
                volume: collection.volume.allTime,
                tokenCount: parseInt(ownership.tokenCount, 10),
              })
              return obj
            },
            {} as Record<string, Collection[]>,
          ),
        ),
        map((collections) => ({
          ...collections[0]!,
          tokenCount: sumBy(collections, ({ tokenCount }) => tokenCount),
        })),
        sortBy([({ volume }) => volume, 'desc']),
      )
    },
    { revalidateOnFocus: false },
  )
}

export type Token = {
  contract: string
  token: string
  image?: string
}

export function useTokens(addresses: string[], collection: string) {
  return useSWR<Token[]>(
    addresses.length ? ['tokens', addresses, collection] : null,
    async () => {
      const nfts = await Promise.all(
        addresses.map(async (address) => {
          const json = await fetchJSON<{
            tokens: {
              token: { contract: string; tokenId: string; image?: string }
            }[]
          }>(
            `https://api.reservoir.tools/users/${address}/tokens/v7?sortBy=lastAppraisalValue&limit=200&collection=${collection}`,
          )
          return json.tokens.map(({ token }) => ({
            contract: token.contract,
            token: token.tokenId,
            image: token.image,
          }))
        }),
      )
      return nfts.flatMap((tokens) => tokens)
    },
    { revalidateOnFocus: false },
  )
}
