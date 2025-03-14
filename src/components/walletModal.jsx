// components/WalletModal.jsx
import { useState, useEffect } from 'react'
import { useAccount, useConnectors, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { mainnet, sepolia, base, polygon, arbitrum, optimism } from 'wagmi/chains'

const WalletModal = ({ isOpen, onClose }) => {
  const { address, isConnected, chain } = useAccount()
  const { connectors } = useConnectors()
  const { connect, isPending: isConnecting, error: connectError } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain()
  
  const [selectedWallet, setSelectedWallet] = useState(null)
  const [connectingWallet, setConnectingWallet] = useState(null)
  const supportedChains = [mainnet, sepolia, base, polygon, arbitrum, optimism]

  // Filter for browser extension wallets only
  const browserExtensionWallets = connectors.filter(
    connector => connector.type === 'injected' && connector.ready
  )

  // Get wallet icon based on connector ID or name
  const getWalletIcon = (connector) => {
    const id = connector.id.toLowerCase()
    const name = connector.name.toLowerCase()
    
    if (id.includes('metamask') || name.includes('metamask')) return '🦊'
    if (id.includes('coinbase') || name.includes('coinbase')) return '📱'
    if (id.includes('brave') || name.includes('brave')) return '🦁'
    if (id.includes('trust') || name.includes('trust')) return '🛡️'
    if (id.includes('phantom') || name.includes('phantom')) return '👻'
    if (id.includes('binance') || name.includes('binance')) return '💰'
    if (id.includes('wallet connect') || name.includes('walletconnect')) return '🔗'
    
    // Default icon for unknown wallets
    return '👛'
  }
  
  // Handler for connecting to a wallet
  const handleConnect = async (connector) => {
    setSelectedWallet(connector.id)
    setConnectingWallet(connector.id)
    
    try {
      await connect({ connector })
    } catch (error) {
      console.error("Connection error:", error)
    } finally {
      setConnectingWallet(null)
    }
  }
  
  // Close modal when successfully connected
  useEffect(() => {
    if (isConnected && isOpen) {
      onClose()
    }
  }, [isConnected, isOpen, onClose])
  
  // Reset selected wallet when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedWallet(null)
      setConnectingWallet(null)
    }
  }, [isOpen])
  
  if (!isOpen) return null
  
  return (
    <div className="wallet-modal-overlay" onClick={onClose}>
      <div className="wallet-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="wallet-modal-header">
          <h2>{address ? 'Manage Wallet' : 'Connect Wallet'}</h2>
          <button className="wallet-modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="wallet-modal-content">
          {!address ? (
            <div className="wallet-selection">
              <h3>Browser Extension Wallets</h3>
              
              {browserExtensionWallets.length > 0 ? (
                <div className="wallet-list">
                  {browserExtensionWallets.map((connector) => (
                    <button
                      key={connector.id}
                      className={`wallet-option ${selectedWallet === connector.id ? 'selected' : ''}`}
                      onClick={() => handleConnect(connector)}
                      disabled={connectingWallet === connector.id}
                    >
                      <div className="wallet-option-icon">
                        {getWalletIcon(connector)}
                      </div>
                      <div className="wallet-option-details">
                        <span className="wallet-option-name">{connector.name}</span>
                        {connectingWallet === connector.id && (
                          <span className="wallet-connecting">Connecting...</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="no-wallets-message">
                  <p>No wallet extensions detected in your browser.</p>
                  <p>Please install one of the following wallets:</p>
                  <div className="wallet-recommendations">
                    <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="wallet-recommendation">
                      <span className="wallet-rec-icon">🦊</span>
                      <span className="wallet-rec-name">MetaMask</span>
                    </a>
                    <a href="https://www.coinbase.com/wallet" target="_blank" rel="noopener noreferrer" className="wallet-recommendation">
                      <span className="wallet-rec-icon">📱</span>
                      <span className="wallet-rec-name">Coinbase Wallet</span>
                    </a>
                  </div>
                </div>
              )}
              
              {connectError && (
                <div className="wallet-error">
                  {connectError.message || 'Failed to connect. Please try again.'}
                </div>
              )}
              
              {/* Optional: Add WalletConnect as a fallback option */}
              <div className="wallet-connect-option">
                <p>Don't see your wallet?</p>
                <button 
                  className="wallet-connect-button"
                  onClick={() => {
                    const walletConnector = connectors.find(c => c.id.toLowerCase().includes('walletconnect'))
                    if (walletConnector) handleConnect(walletConnector)
                  }}
                >
                  Connect with WalletConnect
                </button>
              </div>
            </div>
          ) : (
            <div className="wallet-management">
              <div className="wallet-info-section">
                <div className="wallet-address">
                  <span className="info-label">Connected Address</span>
                  <div className="address-display">
                    <span className="address-text">{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
                    <button 
                      className="copy-address"
                      onClick={() => {
                        navigator.clipboard.writeText(address)
                        alert('Address copied to clipboard!')
                      }}
                    >
                      Copy
                    </button>
                  </div>
                </div>
                
                <div className="wallet-network">
                  <span className="info-label">Network</span>
                  <div className="network-selector">
                    <select
                      value={chain?.id}
                      onChange={(e) => switchChain({ chainId: Number(e.target.value) })}
                      disabled={isSwitchingChain}
                    >
                      {supportedChains.map((supportedChain) => (
                        <option key={supportedChain.id} value={supportedChain.id}>
                          {supportedChain.name}
                        </option>
                      ))}
                    </select>
                    {isSwitchingChain && <span className="switching-indicator">Switching...</span>}
                  </div>
                </div>
                
                <div className="wallet-status">
                  <span className="info-label">Status</span>
                  <div className="status-display">
                    <div className="status-indicator connected"></div>
                    <span>Connected to {chain?.name || 'Unknown Network'}</span>
                  </div>
                </div>
              </div>
              
              <button 
                className="disconnect-button"
                onClick={() => {
                  disconnect()
                  onClose()
                }}
              >
                Disconnect Wallet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WalletModal