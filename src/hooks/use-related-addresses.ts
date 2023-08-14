import useSWR from 'swr'
import { getRelatedAddresses } from '@/utils/did'

export default function useRelatedAddresses(did: string) {
  return useSWR(did ? ['related', did] : null, () => getRelatedAddresses(did), {
    revalidateOnFocus: false,
  })
}
