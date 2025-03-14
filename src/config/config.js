import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, base, polygon, arbitrum, optimism } from 'wagmi/chains'
import { walletConnect } from 'wagmi/connectors'
import { createStorage } from 'wagmi'

// Create persistent storage
const storage = createStorage({ storage: window.localStorage })

export const config = createConfig({
  // Define supported chains
  chains: [mainnet, sepolia, base, polygon, arbitrum, optimism],
  
  // Configure connectors
  connectors: [
    walletConnect({
      projectId: import.meta.env.VITE_WC_PROJECT_ID,
      metadata: {
        name: 'Your App Name',
        description: 'Your App Description',
        url: window.location.origin,
        icons: ['https://yourapp.com/icon.png']
      }
    })
  ],
  
  // Enable auto-discovery of browser wallet extensions
  multiInjectedProviderDiscovery: true,
  
  // Configure transports for each chain
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [base.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http()
  },
  
  // Use storage to persist connection state
  storage
})