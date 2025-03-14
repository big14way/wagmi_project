import { useState, useEffect } from 'react'
import { useAccount, useChainId } from 'wagmi'
import WalletModal from './components/WalletModal'
import './App.css'
import './components/WalletModal.css'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  
  // Get chain name based on chainId
  const getChainName = () => {
    const chains = {
      1: 'Ethereum',
      11155111: 'Sepolia',
      137: 'Polygon',
      8453: 'Base',
      42161: 'Arbitrum',
      10: 'Optimism'
    }
    return chains[chainId] || 'Unknown Network'
  }
  
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Web3 Wallet Connection</h1>
      </header>
      
      <main className="app-main">
        <div className="wallet-card">
          <div className="wallet-status">
            <div className="status-icon">
              <div className={`connection-dot ${isConnected ? 'connected' : 'disconnected'}`}></div>
            </div>
            <div className="status-text">
              {isConnected ? 'Connected' : 'Not Connected'}
            </div>
          </div>
          
          {isConnected && (
            <div className="wallet-details">
              <div className="detail-row">
                <span>Network:</span>
                <span className="network-badge">{getChainName()}</span>
              </div>
              <div className="detail-row">
                <span>Address:</span>
                <span className="address-text">{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
              </div>
            </div>
          )}
          
          <button 
            className={`connect-button ${isConnected ? 'manage' : 'connect'}`}
            onClick={() => setIsModalOpen(true)}
          >
            {isConnected ? 'Manage Wallet' : 'Connect Wallet'}
          </button>
        </div>
      </main>
      
      <WalletModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}

export default App