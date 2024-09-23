import { getRelatedAddresses } from '@/utils/did'
import useSWR from 'swr'

export default function useRelatedAddresses(did: string) {
  const d = did.replace(/\s/g, '')
  return useSWR(d ? ['related', d] : null, () => getRelatedAddresses(d), {
    revalidateOnFocus: false,
  })
}
