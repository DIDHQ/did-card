// @see https://docs.simplehash.com/reference/chains
// @see https://docs.reservoir.tools/reference/supported-chains

export enum Chain {
  Arbitrum = 'arbitrum',
  ArbitrumNova = 'arbitrum-nova',
  Avalanche = 'avalanche',
  Base = 'base',
  BSC = 'bsc',
  Ethereum = 'ethereum',
  Optimism = 'optimism',
  Polygon = 'polygon',
  Zora = 'zora',
}

export const reservoirs: Record<string, string> = {
  [Chain.Arbitrum]: 'api-arbitrum.reservoir.tools',
  [Chain.ArbitrumNova]: 'api-arbitrum-nova.reservoir.tools',
  [Chain.Avalanche]: 'api-avalanche.reservoir.tools',
  [Chain.Base]: 'api-base.reservoir.tools',
  [Chain.BSC]: 'api-bsc.reservoir.tools',
  [Chain.Ethereum]: 'api.reservoir.tools',
  [Chain.Optimism]: 'api-optimism.reservoir.tools',
  [Chain.Polygon]: 'api-polygon.reservoir.tools',
  [Chain.Zora]: 'api-zora.reservoir.tools',
}

export const rpcUrls: Record<string, string> = {
  [Chain.Arbitrum]: 'arbitrum.public-rpc.com',
  [Chain.ArbitrumNova]: 'rpc.ankr.com/arbitrumnova',
  [Chain.Avalanche]: 'avalanche.public-rpc.com',
  [Chain.Base]: 'mainnet.base.org',
  [Chain.BSC]: 'bscrpc.com',
  [Chain.Ethereum]: 'eth.public-rpc.com',
  [Chain.Optimism]: 'rpc.ankr.com/optimism',
  [Chain.Polygon]: 'polygon-rpc.com',
  [Chain.Zora]: 'rpc.zora.energy',
}

export const supportedChains = [Chain.Ethereum, Chain.BSC, Chain.Polygon]
