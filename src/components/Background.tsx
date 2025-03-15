import { Box } from '@chakra-ui/react'

export function Background() {
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      zIndex="-1"
      bgImage="url('https://images.unsplash.com/photo-1536514072410-5019a3c69182?auto=format&fit=crop&q=80')"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.2) 100%)',
        backdropFilter: 'blur(1px)',
      }}
      _after={{
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        background: 'linear-gradient(15deg, rgba(17, 24, 39, 0.7) 0%, rgba(17, 24, 39, 0) 100%)',
      }}
    />
  )
} 