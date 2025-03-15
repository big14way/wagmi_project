import { WagmiConfig } from 'wagmi'
import { ChakraProvider } from '@chakra-ui/react'
import { config } from '../wagmi'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </WagmiConfig>
  )
}

export default MyApp 