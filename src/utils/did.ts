import { createPublicClient, http, labelhash, namehash, parseAbi } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'
import { compact, uniq } from 'remeda'

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http('https://rpc.ankr.com/eth'),
  batch: { multicall: true },
})

export enum DidSystem {
  BIT = 'BIT',
  ENS = 'ENS',
  LENS = 'LENS',
}

function normalizeAddress(address: string): string {
  return address.toLowerCase()
}

const ensNameWrapper = normalizeAddress(
  '0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401',
)

function guessDidSystem(didOrAddress: string): DidSystem | null {
  if (didOrAddress.endsWith('.eth')) {
    return DidSystem.ENS
  }
  if (didOrAddress.endsWith('.lens')) {
    return DidSystem.LENS
  }
  if (
    didOrAddress.endsWith('.bit') ||
    /^[^\s\.]+\.[^\s\.]+$/.test(didOrAddress)
  ) {
    return DidSystem.BIT
  }
  return null
}

const abi = parseAbi([
  'function owner(bytes32 node) public view returns (address)',
  'function ownerOf(uint256 tokenId) external view returns (address)',
])

async function getEnsManager(did: string): Promise<string | null> {
  try {
    const node = namehash(normalize(did))
    const address = await publicClient.readContract({
      abi,
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
      functionName: 'owner',
      args: [node],
    })
    return normalizeAddress(address)
  } catch (err) {
    console.error('getEnsManager', did, err)
    return null
  }
}

async function getEnsOwner(did: string): Promise<string | null> {
  try {
    const label = labelhash(normalize(did.replace(/\.eth$/, '')))
    const address = await publicClient.readContract({
      abi,
      address: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
      functionName: 'ownerOf',
      args: [BigInt(label)],
    })
    return normalizeAddress(address)
  } catch (err) {
    console.error('getEnsOwner', did, err)
    return null
  }
}

async function getEnsAddress(did: string): Promise<string | null> {
  try {
    const address = await publicClient.getEnsAddress({ name: normalize(did) })
    return address ? normalizeAddress(address) : null
  } catch (err) {
    console.error('getEnsAddress', did, err)
    return null
  }
}

async function getBitAccountInfo(
  did: string,
): Promise<{ manager: string | null; owner: string | null }> {
  try {
    const response = await fetch('https://indexer-v1.did.id/', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 0,
        method: 'das_accountInfo',
        params: [{ account: did.endsWith('.bit') ? did : `${did}.bit` }],
      }),
    })
    const json = (await response.json()) as {
      result: {
        data: {
          account_info: { manager_key: string; owner_key: string }
        } | null
      }
    }
    if (!json.result.data) {
      return { manager: null, owner: null }
    }
    return {
      manager: normalizeAddress(json.result.data.account_info.manager_key),
      owner: normalizeAddress(json.result.data.account_info.owner_key),
    }
  } catch (err) {
    console.error('getBitAccountInfo', did, err)
    return { manager: null, owner: null }
  }
}

async function getBitAccountReverseAddresses(did: string): Promise<string[]> {
  try {
    const response = await fetch(
      'https://indexer-v1.did.id/v1/account/reverse/address',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ account: did }),
      },
    )
    const json = (await response.json()) as {
      data: { list: { key_info: { key: string } }[] } | null
    }
    return (
      json.data?.list.map(({ key_info: { key } }) => normalizeAddress(key)) ??
      []
    )
  } catch (err) {
    console.error('getBitAccountReverseAddresses', did, err)
    return []
  }
}

export async function getRelatedAddresses(did: string): Promise<string[]> {
  const didSystem = guessDidSystem(did)
  if (didSystem === DidSystem.ENS) {
    const [manager, owner, address] = await Promise.all([
      getEnsManager(did),
      getEnsOwner(did),
      getEnsAddress(did),
    ])
    return uniq(compact([manager, owner, address])).filter(
      (address) => address !== ensNameWrapper,
    )
  }
  if (didSystem === DidSystem.LENS) {
    const address = await getEnsAddress(`${did}.xyz`)
    return compact([address])
  }
  if (didSystem === DidSystem.BIT) {
    const { manager, owner } = await getBitAccountInfo(did)
    const reverses = await getBitAccountReverseAddresses(did)
    return uniq(compact([manager, owner, ...reverses]))
  }
  return []
}
