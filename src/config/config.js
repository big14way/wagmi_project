import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, lisk, liskSepolia, base, polygon } from 'wagmi/chains'
import { walletConnect  } from 'wagmi/connectors'


export const config = createConfig({
  chains: [mainnet, sepolia, lisk, liskSepolia, base, polygon],
  connectors: [walletConnect({
    projectId:import.meta.env.VITE_PROVIDER
  })],
  multiInjectedProviderDiscovery: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})