import useSWR from 'swr'
import { pipe, sortBy, values, map, sumBy } from 'remeda'
import { fetchJSON } from '@/utils/fetch'

export type Collection = {
  collection: {
    id: string
    name: string
    image?: string
    volume: { allTime: number }
  }
  ownership: { tokenCount: string }
}

export function useCollections(addresses: string[]) {
  return useSWR<Collection[]>(
    addresses.length ? ['collections', addresses] : null,
    async () => {
      const collections = await Promise.all(
        addresses.map(async (address) => {
          const json = await fetchJSON<{ collections: Collection[] }>(
            `https://api.reservoir.tools/users/${address}/collections/v3?limit=100`,
          )
          return json.collections.filter(({ collection }) => collection.image)
        }),
      )

      return pipe(
        values(
          collections.flat().reduce(
            (obj, collection) => {
              if (!obj[collection.collection.id]) {
                obj[collection.collection.id] = []
              }
              obj[collection.collection.id]!.push(collection)
              return obj
            },
            {} as Record<string, Collection[]>,
          ),
        ),
        map((collections) => ({
          collection: collections[0]!.collection,
          ownership: {
            tokenCount: sumBy(collections, (collection) =>
              parseInt(collection.ownership.tokenCount),
            ).toString(),
          },
        })),
        sortBy([(collection) => collection.collection.volume.allTime, 'desc']),
      )
    },
    { revalidateOnFocus: false },
  )
}

export type Token = {
  contract: string
  token: string
}

export function useTokens(addresses: string[], collection?: string) {
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
            `https://api.reservoir.tools/users/${address}/tokens/v7?sortBy=lastAppraisalValue&limit=200${
              collection ? `&collection=${collection}` : ''
            }`,
          )
          return json.tokens
            .filter(({ token }) => collection || token.image)
            .map(({ token }) => ({
              contract: token.contract,
              token: token.tokenId,
            }))
        }),
      )
      return nfts.flatMap((tokens) => tokens)
    },
    { revalidateOnFocus: false },
  )
}
