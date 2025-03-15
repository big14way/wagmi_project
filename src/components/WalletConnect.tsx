import { useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect, useEnsName, useNetwork } from 'wagmi'
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  Text,
  HStack,
  Image,
  useToast,
  Divider,
  Badge,
  Link,
} from '@chakra-ui/react'
import { NetworkSelector } from './NetworkSelector'
import { Background } from './Background'

const WALLET_ICONS = {
  metaMask: '/metamask.svg',
  coinbaseWallet: '/coinbase.svg',
  walletConnect: '/walletconnect.svg',
  'injected': '/wallet.svg',
  'Browser Wallet': '/wallet.svg',
  brave: '/brave.svg',
  trust: '/trust.svg',
  exodus: '/wallet.svg',
  status: '/wallet.svg',
  rainbow: '/wallet.svg',
  zerion: '/wallet.svg',
  // Add more wallet icons as needed
}

const SUGGESTED_WALLETS = [
  {
    name: 'MetaMask',
    id: 'metaMask',
    url: 'https://metamask.io/download/',
  },
  {
    name: 'Coinbase Wallet',
    id: 'coinbaseWallet',
    url: 'https://www.coinbase.com/wallet/downloads',
  },
  {
    name: 'Trust Wallet',
    id: 'trust',
    url: 'https://trustwallet.com/download',
  },
  {
    name: 'Rainbow',
    id: 'rainbow',
    url: 'https://rainbow.me',
  },
  {
    name: 'Zerion',
    id: 'zerion',
    url: 'https://zerion.io/wallet',
  },
  {
    name: 'Exodus',
    id: 'exodus',
    url: 'https://www.exodus.com/download',
  },
]

export function WalletConnect() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { address, isConnected, connector: activeConnector } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
  const { disconnect } = useDisconnect()
  const { chain } = useNetwork()
  const toast = useToast()
  const [mounted, setMounted] = useState(false)
  const [availableWallets, setAvailableWallets] = useState<any[]>([])
  const [unavailableWallets, setUnavailableWallets] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)
    
    // Detect available and unavailable wallets
    const detected = connectors.filter(connector => {
      // Check if the connector is ready or if it's an injected connector that's available
      return connector.ready || (connector.id === 'injected' && window?.ethereum)
    })

    // Get unique connector IDs to avoid duplicates
    const detectedIds = new Set(detected.map(c => c.id))

    // Filter out wallets that are already detected
    const undetected = SUGGESTED_WALLETS.filter(
      wallet => !detectedIds.has(wallet.id)
    )

    setAvailableWallets(detected)
    setUnavailableWallets(undetected)
  }, [connectors])

  useEffect(() => {
    if (error) {
      toast({
        title: 'Connection Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }, [error, toast])

  const handleConnect = async (connector: any) => {
    try {
      await connect({ connector })
      onClose() // Close the modal after successful connection
    } catch (err: any) {
      console.error('Connection error:', err)
      toast({
        title: 'Connection Failed',
        description: err?.message || 'Failed to connect wallet. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  if (!mounted) return null

  if (isConnected) {
    return (
      <>
        <Background />
        <VStack spacing={6} maxW="xl" mx="auto" p={4}>
          <Box
            p={6}
            borderRadius="2xl"
            border="1px"
            borderColor="blue.200"
            shadow="xl"
            bg="linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)"
            backdropFilter="blur(12px)"
            color="white"
            position="relative"
            overflow="visible"
            w="full"
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))',
              transform: 'translateY(-50%)',
              filter: 'blur(32px)',
              zIndex: -1,
            }}
          >
            <VStack align="stretch" spacing={4}>
              <HStack justify="space-between" align="start" flexWrap="wrap" gap={4}>
                <VStack align="start" spacing={2} flex="1" minW="200px">
                  <HStack spacing={3}>
                    <Image
                      src={WALLET_ICONS[activeConnector?.id as keyof typeof WALLET_ICONS] || '/wallet.svg'}
                      alt={activeConnector?.name || ''}
                      boxSize="28px"
                      fallback={<Box w="28px" h="28px" bg="whiteAlpha.200" borderRadius="lg" />}
                    />
                    <Text fontWeight="bold" fontSize="lg" textShadow="0 2px 4px rgba(0,0,0,0.2)">
                      {ensName || `${address?.slice(0, 6)}...${address?.slice(-4)}`}
                    </Text>
                  </HStack>
                  <Badge 
                    colorScheme="blue" 
                    variant="solid" 
                    px={3} 
                    py={1} 
                    borderRadius="md"
                    bg="linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)"
                    boxShadow="0 2px 4px rgba(37, 99, 235, 0.2)"
                  >
                    Connected to {activeConnector?.name}
                  </Badge>
                </VStack>
                <Box flex="0 1 auto">
                  <NetworkSelector />
                </Box>
              </HStack>
              <Divider borderColor="whiteAlpha.300" />
              <HStack justify="space-between" align="center" flexWrap="wrap" gap={2}>
                <Text fontSize="sm" color="blue.100" fontWeight="medium">
                  Network: {chain?.name}
                </Text>
                <Button
                  colorScheme="red"
                  variant="ghost"
                  size="sm"
                  onClick={() => disconnect()}
                  _hover={{ bg: 'whiteAlpha.200' }}
                  _active={{ bg: 'whiteAlpha.300' }}
                  fontWeight="medium"
                >
                  Disconnect
                </Button>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </>
    )
  }

  return (
    <>
      <Background />
      <VStack spacing={6} maxW="xl" mx="auto" p={4}>
        <VStack spacing={3}>
          <Text
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="bold"
            textAlign="center"
            bgGradient="linear(to-r, blue.200, purple.200)"
            bgClip="text"
            textShadow="0 2px 4px rgba(0,0,0,0.1)"
          >
            Your Secure Wallet for the Decentralized World
          </Text>
          <Text
            fontSize={{ base: "lg", md: "xl" }}
            textAlign="center"
            color="whiteAlpha.900"
            fontWeight="medium"
            maxW="md"
            textShadow="0 2px 4px rgba(0,0,0,0.2)"
          >
            Connect your wallet to get started with Web3
          </Text>
        </VStack>

        <Box
          p={4}
          borderRadius="2xl"
          border="1px"
          borderColor="blue.200"
          shadow="xl"
          bg="linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)"
          backdropFilter="blur(12px)"
          w="full"
          position="relative"
          overflow="hidden"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))',
            transform: 'translateY(-50%)',
            filter: 'blur(32px)',
            zIndex: -1,
          }}
        >
          <Button
            onClick={onOpen}
            size="lg"
            borderRadius="xl"
            shadow="xl"
            w="full"
            bg="linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)"
            color="white"
            _hover={{
              bg: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              transform: 'translateY(-1px)',
              shadow: '2xl',
            }}
            _active={{
              transform: 'translateY(0)',
              shadow: 'lg',
            }}
            transition="all 0.2s"
            fontWeight="semibold"
            fontSize="lg"
            height="56px"
            leftIcon={
              <Box
                as="span"
                w="24px"
                h="24px"
                bg="whiteAlpha.300"
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Image src="/wallet.svg" alt="wallet" w="16px" h="16px" />
              </Box>
            }
          >
            Connect Wallet
          </Button>
        </Box>

        <HStack spacing={4} justify="center">
          <Badge
            px={3}
            py={1}
            borderRadius="full"
            bg="linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))"
            backdropFilter="blur(8px)"
            border="1px"
            borderColor="blue.200"
            color="blue.100"
          >
            100% Secure
          </Badge>
          <Badge
            px={3}
            py={1}
            borderRadius="full"
            bg="linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(109, 40, 217, 0.1))"
            backdropFilter="blur(8px)"
            border="1px"
            borderColor="purple.200"
            color="purple.100"
          >
            Web3 Ready
          </Badge>
        </HStack>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay backdropFilter="blur(8px)" bg="rgba(17, 24, 39, 0.6)" />
        <ModalContent
          borderRadius="2xl"
          bg="linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)"
          backdropFilter="blur(12px)"
          border="1px"
          borderColor="blue.200"
          color="white"
          overflow="hidden"
          shadow="2xl"
        >
          <ModalHeader fontSize="2xl" fontWeight="bold" textShadow="0 2px 4px rgba(0,0,0,0.2)">
            Connect your wallet
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={8}>
            <VStack spacing={4}>
              {availableWallets.map((connector) => (
                <Button
                  key={connector.id}
                  w="full"
                  h="64px"
                  variant="outline"
                  onClick={() => handleConnect(connector)}
                  isLoading={isLoading && pendingConnector?.id === connector.id}
                  disabled={isLoading && pendingConnector?.id !== connector.id}
                  _hover={{ bg: 'whiteAlpha.100', borderColor: 'blue.300', transform: 'translateY(-1px)' }}
                  _active={{ transform: 'translateY(0)' }}
                  borderColor="blue.200"
                  transition="all 0.2s"
                  bg="linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)"
                >
                  <HStack w="full" justify="space-between">
                    <HStack spacing={3}>
                      <Image
                        src={WALLET_ICONS[connector.id as keyof typeof WALLET_ICONS] || '/wallet.svg'}
                        alt={connector.name}
                        boxSize="36px"
                        fallback={<Box w="36px" h="36px" bg="whiteAlpha.200" borderRadius="lg" />}
                      />
                      <VStack align="start" spacing={0}>
                        <Text fontSize="lg" fontWeight="semibold">{connector.name}</Text>
                        <Text fontSize="xs" color="blue.200">
                          {connector.ready ? 'Detected' : 'Available'}
                        </Text>
                      </VStack>
                    </HStack>
                    <Badge 
                      colorScheme={connector.ready ? "blue" : "purple"} 
                      variant="solid"
                      px={3}
                      py={1}
                      borderRadius="md"
                      bg={connector.ready ? 
                        "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)" : 
                        "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)"
                      }
                    >
                      {connector.ready ? 'Ready' : 'Connect'}
                    </Badge>
                  </HStack>
                </Button>
              ))}

              {unavailableWallets.length > 0 && (
                <>
                  <Divider borderColor="whiteAlpha.300" />
                  <Text color="blue.100" fontSize="sm" fontWeight="medium">
                    Suggested Wallets
                  </Text>
                  {unavailableWallets.map((wallet) => (
                    <Link
                      key={wallet.id}
                      href={wallet.url}
                      isExternal
                      w="full"
                      _hover={{ textDecoration: 'none' }}
                    >
                      <Button
                        w="full"
                        h="64px"
                        variant="outline"
                        opacity={0.8}
                        _hover={{ 
                          opacity: 1, 
                          bg: 'whiteAlpha.100', 
                          borderColor: 'purple.300',
                          transform: 'translateY(-1px)'
                        }}
                        _active={{ transform: 'translateY(0)' }}
                        borderColor="purple.200"
                        transition="all 0.2s"
                        bg="linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)"
                      >
                        <HStack w="full" justify="space-between">
                          <HStack spacing={3}>
                            <Image
                              src={WALLET_ICONS[wallet.id as keyof typeof WALLET_ICONS] || '/wallet.svg'}
                              alt={wallet.name}
                              boxSize="36px"
                              fallback={<Box w="36px" h="36px" bg="whiteAlpha.200" borderRadius="lg" />}
                            />
                            <VStack align="start" spacing={0}>
                              <Text fontSize="lg" fontWeight="semibold">{wallet.name}</Text>
                              <Text fontSize="xs" color="purple.200">
                                Not Installed
                              </Text>
                            </VStack>
                          </HStack>
                          <Badge 
                            variant="solid" 
                            px={3} 
                            py={1} 
                            borderRadius="md"
                            bg="linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)"
                          >
                            Install
                          </Badge>
                        </HStack>
                      </Button>
                    </Link>
                  ))}
                </>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
} 