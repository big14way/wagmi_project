import { useNetwork, useSwitchNetwork } from 'wagmi'
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  HStack,
  Text,
  Box,
  Image,
  useToast,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'

interface NetworkMetadata {
  icon: string
  name: string
  gradient: string
  textColor: string
  hoverBg: string
}

// Chain IDs:
// Mainnet: 1
// Sepolia: 11155111
// Base: 8453
// Polygon: 137
const NETWORK_METADATA: Record<number, NetworkMetadata> = {
  1: {
    icon: '/ethereum.svg',
    name: 'Ethereum',
    gradient: 'linear-gradient(135deg, #6B8CEF 0%, #6F5AE7 100%)',
    textColor: '#E2E8F0',
    hoverBg: 'rgba(107, 140, 239, 0.2)',
  },
  11155111: {
    icon: '/ethereum.svg',
    name: 'Sepolia',
    gradient: 'linear-gradient(135deg, #FF9776 0%, #FF5733 100%)',
    textColor: '#FFF5F0',
    hoverBg: 'rgba(255, 151, 118, 0.2)',
  },
  8453: {
    icon: '/base.svg',
    name: 'Base',
    gradient: 'linear-gradient(135deg, #0052FF 0%, #0033CC 100%)',
    textColor: '#E6F0FF',
    hoverBg: 'rgba(0, 82, 255, 0.2)',
  },
  137: {
    icon: '/polygon.svg',
    name: 'Polygon',
    gradient: 'linear-gradient(135deg, #8247E5 0%, #6234B3 100%)',
    textColor: '#F2E6FF',
    hoverBg: 'rgba(130, 71, 229, 0.2)',
  },
}

export function NetworkSelector() {
  const { chain } = useNetwork()
  const { switchNetwork, isLoading, pendingChainId } = useSwitchNetwork()
  const toast = useToast()

  const currentNetwork = chain ? NETWORK_METADATA[chain.id] : null

  const handleNetworkSwitch = async (chainId: number) => {
    try {
      if (!switchNetwork) {
        throw new Error('Network switching not supported')
      }
      
      // Don't switch if we're already on this network
      if (chain?.id === chainId) return

      await switchNetwork(chainId)
    } catch (err: any) {
      console.error('Network switch error:', err)
      toast({
        title: 'Network Switch Failed',
        description: err.message || 'Failed to switch networks. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  return (
    <Menu placement="bottom-end">
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        bg={currentNetwork?.gradient || 'whiteAlpha.200'}
        color={currentNetwork?.textColor || 'white'}
        _hover={{
          bg: currentNetwork?.gradient || 'whiteAlpha.300',
          opacity: 0.9,
        }}
        _active={{
          bg: currentNetwork?.gradient || 'whiteAlpha.400',
          opacity: 0.8,
        }}
        borderRadius="xl"
        px={4}
        h="40px"
        shadow="lg"
        border="1px solid"
        borderColor="whiteAlpha.200"
        backdropFilter="blur(10px)"
        isDisabled={!switchNetwork}
      >
        <HStack spacing={2}>
          {currentNetwork && (
            <Image
              src={currentNetwork.icon}
              alt={currentNetwork.name}
              boxSize="20px"
              fallback={<Box w="20px" h="20px" bg="whiteAlpha.300" borderRadius="full" />}
            />
          )}
          <Text>{currentNetwork?.name || 'Select Network'}</Text>
        </HStack>
      </MenuButton>
      <MenuList
        bg="rgba(23, 25, 35, 0.9)"
        backdropFilter="blur(12px)"
        border="1px solid"
        borderColor="whiteAlpha.200"
        shadow="2xl"
        p={2}
        minW="200px"
      >
        {Object.entries(NETWORK_METADATA).map(([chainId, metadata]) => (
          <MenuItem
            key={chainId}
            onClick={() => handleNetworkSwitch(parseInt(chainId))}
            bg={chain?.id === parseInt(chainId) ? metadata.gradient : 'transparent'}
            _hover={{
              bg: metadata.hoverBg,
            }}
            borderRadius="lg"
            mb={1}
            position="relative"
            overflow="hidden"
            h="44px"
            isDisabled={isLoading || chain?.id === parseInt(chainId)}
          >
            <HStack spacing={3} opacity={isLoading && pendingChainId === parseInt(chainId) ? 0.5 : 1}>
              <Image
                src={metadata.icon}
                alt={metadata.name}
                boxSize="24px"
                fallback={<Box w="24px" h="24px" bg="whiteAlpha.300" borderRadius="full" />}
              />
              <Text color={metadata.textColor} fontWeight="medium">
                {metadata.name}
              </Text>
              {isLoading && pendingChainId === parseInt(chainId) && (
                <Text fontSize="xs" color="whiteAlpha.700">
                  Switching...
                </Text>
              )}
            </HStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
} 