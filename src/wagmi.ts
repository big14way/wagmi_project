import { configureChains, createConfig } from 'wagmi'
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { publicProvider } from 'wagmi/providers/public'

if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  console.error('Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID')
}

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base],
  [publicProvider()],
  {
    batch: { multicall: true },
    retryCount: 5,
    stallTimeout: 10000,
    pollingInterval: 5000,
  }
)

const walletConnectConfig = {
  projectId: projectId as string,
  showQrModal: true,
  relayUrl: 'wss://relay.walletconnect.com',
  metadata: {
    name: 'Wagmi Wallet UI',
    description: 'Web3 Wallet Connection Interface',
    url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
  },
}

// Get all available injected providers
const getInjectedConnectors = () => {
  if (typeof window === 'undefined') return []
  
  const providers = Object.entries(window?.ethereum?.providers || {})
    .filter(([_, provider]) => !(provider as { isMetaMask?: boolean })?.isMetaMask)
    .map(([name]) => name)

  return providers.map(
    (name) =>
      new InjectedConnector({
        chains,
        options: {
          name,
          shimDisconnect: true,
        },
      })
  )
}

export const config = createConfig({
  autoConnect: false,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: true,
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        ...walletConnectConfig,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'Wagmi Wallet UI',
        headlessMode: false,
        reloadOnDisconnect: true,
      },
    }),
    // Add a generic injected connector for other wallets
    new InjectedConnector({
      chains,
      options: {
        name: 'Browser Wallet',
        shimDisconnect: true,
      },
    }),
    ...getInjectedConnectors(),
  ],
  publicClient,
  webSocketPublicClient,
})

export { chains } 