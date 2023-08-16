import useSWR from 'swr'
import { getRelatedAddresses } from '@/utils/did'

export default function useRelatedAddresses(did: string) {
  did = did.replace(/\s/g, '')
  return useSWR(did ? ['related', did] : null, () => getRelatedAddresses(did), {
    revalidateOnFocus: false,
  })
}
