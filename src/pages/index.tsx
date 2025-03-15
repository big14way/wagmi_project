import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react'
import { WalletConnect } from '../components/WalletConnect'

export default function Home() {
  return (
    <Container maxW="container.md" py={20}>
      <VStack spacing={8} align="center">
        <Heading as="h1" size="2xl">
        Gwill ChainSafe
        </Heading>
        <Text fontSize="xl" textAlign="center" color="gray.600">
          Connect your wallet to get started with Web3
        </Text>
        <Box w="full" maxW="md">
          <WalletConnect />
        </Box>
      </VStack>
    </Container>
  )
} 