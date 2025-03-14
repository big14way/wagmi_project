// components/WalletModal.jsx
import { useState, useEffect } from 'react'
import { useAccount, useConnectors, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { mainnet, sepolia, base, polygon, arbitrum, optimism } from 'wagmi/chains'

const WalletModal = ({ isOpen, onClose }) => {
  const { address, isConnected, chain } = useAccount()
  const connectors = useConnectors()
  const { connect, isPending: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain()
  
  const [selectedWallet, setSelectedWallet] = useState(null)
  const supportedChains = [mainnet, sepolia, base, polygon, arbitrum, optimism]
  
  // Get available (installed) connectors that are ready to use
  const availableConnectors = connectors.filter(connector => connector.ready)

  // Get wallet icon based on connector ID
  const getWalletIcon = (id) => {
    const icons = {
      'metaMask': '🦊',
      'coinbaseWallet': '📱',
      'walletConnect': '🔗',
      'brave': '🦁',
      'injected': '🔌',
      'trust': '🛡️',
      'ledger': '🔒',
      'safe': '🔐'
    }
    return icons[id] || '👛'
  }
  
  // Handler for connecting to a wallet
  const handleConnect = async (connector) => {
    setSelectedWallet(connector.id)
    try {
      await connect({ connector })
      // Close modal only after successful connection
      if (isConnected) onClose()
    } catch (error) {
      console.error("Connection error:", error)
      setSelectedWallet(null)
    }
  }
  
  // Reset selected wallet when modal closes
  useEffect(() => {
    if (!isOpen) setSelectedWallet(null)
  }, [isOpen])
  
  if (!isOpen) return null
  
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{address ? 'Manage Wallet' : 'Connect Wallet'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          {!address ? (
            <div className="wallet-selection">
              <h3>Available Wallets</h3>
              
              {availableConnectors.length > 0 ? (
                <div className="wallets-grid">
                  {availableConnectors.map((connector) => (
                    <button
                      key={connector.id}
                      className={`wallet-button ${selectedWallet === connector.id ? 'selected' : ''} ${isConnecting && selectedWallet === connector.id ? 'connecting' : ''}`}
                      onClick={() => handleConnect(connector)}
                      disabled={isConnecting}
                    >
                      <div className="wallet-icon">
                        {getWalletIcon(connector.id)}
                      </div>
                      <div className="wallet-info">
                        <span className="wallet-name">{connector.name}</span>
                        {isConnecting && selectedWallet === connector.id && (
                          <span className="connecting-indicator">Connecting...</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="no-wallets-message">
                  <p>No wallet extensions detected in your browser. Please install a Web3 wallet.</p>
                  <div className="wallet-links">
                    <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="wallet-link">
                      Get MetaMask
                    </a>
                    <a href="https://www.coinbase.com/wallet" target="_blank" rel="noopener noreferrer" className="wallet-link">
                      Get Coinbase Wallet
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="wallet-info-panel">
              <div className="address-display">
                <span>Connected Address</span>
                <div className="address-box">
                  {`${address.slice(0, 6)}...${address.slice(-4)}`}
                  <button 
                    className="copy-button" 
                    onClick={() => {
                      navigator.clipboard.writeText(address)
                      // You could add a toast notification here
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>
              
              <div className="network-selector">
                <span>Network</span>
                <div className="select-wrapper">
                  <select
                    value={chain?.id}
                    onChange={(e) => switchChain({ chainId: Number(e.target.value) })}
                    disabled={isSwitchingChain}
                    className="chain-select"
                  >
                    {supportedChains.map((supportedChain) => (
                      <option key={supportedChain.id} value={supportedChain.id}>
                        {supportedChain.name}
                      </option>
                    ))}
                  </select>
                  {isSwitchingChain && <span className="loading-indicator">Switching...</span>}
                </div>
              </div>
              
              <div className="connection-status">
                <span>Status</span>
                <div className="status-indicator">
                  <div className="status-dot connected"></div>
                  <span>Connected to {chain?.name || 'Unknown Network'}</span>
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