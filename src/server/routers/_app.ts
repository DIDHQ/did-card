import { router } from '../trpc'
import { nftRouter } from './nft'

export const appRouter = router({
  nft: nftRouter,
})

export type AppRouter = typeof appRouter
