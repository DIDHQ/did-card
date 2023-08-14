import {
  createPublicClient,
  getAddress,
  http,
  labelhash,
  namehash,
  parseAbi,
} from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'
import { compact, uniq } from 'remeda'

export enum DidSystem {
  BIT = 'BIT',
  ENS = 'ENS',
  LENS = 'LENS',
}

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http('https://rpc.ankr.com/eth'),
  batch: { multicall: true },
})

function guessDidSystem(did: string): DidSystem | null {
  if (did.endsWith('.eth')) {
    return DidSystem.ENS
  }
  if (did.endsWith('.lens')) {
    return DidSystem.LENS
  }
  if (did.endsWith('.bit') || /^[^\s\.]+\.[^\s\.]+$/.test(did)) {
    return DidSystem.BIT
  }
  return null
}

const abi = parseAbi([
  'function owner(bytes32 node) public view returns (address)',
  'function ownerOf(uint256 tokenId) external view returns (address)',
])

async function getEnsManager(did: string): Promise<string | null> {
  const node = namehash(normalize(did))
  try {
    return await publicClient.readContract({
      abi,
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
      functionName: 'owner',
      args: [node],
    })
  } catch (err) {
    console.error('getEnsManager', err)
    return null
  }
}

async function getEnsOwner(did: string): Promise<string | null> {
  const label = labelhash(normalize(did.replace(/\.eth$/, '')))
  try {
    return await publicClient.readContract({
      abi,
      address: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
      functionName: 'ownerOf',
      args: [BigInt(label)],
    })
  } catch (err) {
    console.error('getEnsOwner', err)
    return null
  }
}

async function getEnsAddress(did: string): Promise<string | null> {
  return publicClient.getEnsAddress({ name: normalize(did) })
}

async function getBitAccountInfo(
  did: string,
): Promise<{ manager: string | null; owner: string | null }> {
  const response = await fetch('https://indexer-v1.did.id/', {
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 0,
      method: 'das_accountInfo',
      params: [{ account: did.endsWith('.bit') ? did : `${did}.bit` }],
    }),
    method: 'POST',
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
    manager: json.result.data.account_info.manager_key,
    owner: json.result.data.account_info.owner_key,
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
    return uniq(
      compact([manager, owner, address]).map((address) => getAddress(address)),
    )
  }
  if (didSystem === DidSystem.LENS) {
    const address = await getEnsAddress(`${did}.xyz`)
    return compact([address]).map((address) => getAddress(address))
  }
  if (didSystem === DidSystem.BIT) {
    const { manager, owner } = await getBitAccountInfo(did)
    return uniq(compact([manager, owner]).map((address) => getAddress(address)))
  }
  return []
}
