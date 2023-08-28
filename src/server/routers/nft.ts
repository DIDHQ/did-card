import { z } from 'zod'
import { procedure, router } from '../trpc'

export const nftRouter = router({
  list: procedure
    .input(z.object({ addresses: z.array(z.string()) }))
    .query(async () => {}),
})
