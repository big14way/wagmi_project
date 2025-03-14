import { useEffect } from 'react';
import './App.css';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchChain,
  useReconnect,
} from 'wagmi';
import { mainnet, sepolia, lisk, liskSepolia, base, polygon } from 'wagmi/chains';
import { useState } from 'react';

// Supported blockchain networks
const supportedChains = [mainnet, sepolia, lisk, liskSepolia, base, polygon];

// Component for connecting wallets
function ConnectButton() {
  const [showOptions, setShowOptions] = useState(false);
  const { connectors, connect, error: connectError, isPending } = useConnect();

  // Show only the "Connect Wallet" button initially
  if (!showOptions) {
    return (
      <div className="connect-container">
        <button className="primary-btn" onClick={() => setShowOptions(true)}>
          Connect Wallet
        </button>
      </div>
    );
  }

  // Show wallet options after clicking "Connect Wallet"
  return (
    <div className="connect-container">
      <h2>Choose a Wallet</h2>
      <div className="button-group">
        {connectors.map((connector) => (
          <button
            key={connector.id}
            onClick={() => connect({ connector })}
            disabled={isPending}
          >
            {isPending ? 'Connecting...' : connector.name}
          </button>
        ))}
      </div>
      <button className="cancel-btn" onClick={() => setShowOptions(false)}>
        Cancel
      </button>
      {connectError && <p className="error-message">{connectError.message}</p>}
    </div>
  );
}

// Component for displaying account information
function AccountInfo() {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain, error: switchError, isPending: isSwitching } = useSwitchChain();

  const handleSwitchChain = (e) => {
    const chainId = Number(e.target.value);
    switchChain({ chainId });
  };

  return (
    <div className="account-info">
      <h2>Wallet Details</h2>
      <div className="info-grid">
        <p>
          <strong>Address:</strong> {address.slice(0, 6)}...{address.slice(-4)}
        </p>
        <p>
          <strong>Status:</strong> {isConnected ? 'Connected' : 'Disconnected'}
        </p>
        <p>
          <strong>Chain:</strong> {chain?.name || 'Unknown'}
        </p>
      </div>
      <button className="disconnect-btn" onClick={disconnect}>
        Disconnect Wallet
      </button>
      <div className="chain-switcher">
        <label htmlFor="chain-select">Switch Chain:</label>
        <select
          id="chain-select"
          value={chain?.id || ''}
          onChange={handleSwitchChain}
          disabled={isSwitching}
        >
          <option value="" disabled>
            Select a chain
          </option>
          {supportedChains.map((chain) => (
            <option key={chain.id} value={chain.id}>
              {chain.name}
            </option>
          ))}
        </select>
        {isSwitching && <p className="pending-message">Switching chain...</p>}
        {switchError && <p className="error-message">{switchError.message}</p>}
      </div>
    </div>
  );
}

// Main App component
function App() {
  const { isConnected } = useAccount();
  const { reconnect } = useReconnect();

  // Attempt to reconnect to a previously connected wallet on mount
  useEffect(() => {
    reconnect();
  }, [reconnect]);

  return (
    <div className="app-container">
      <header>
        <h1>Wallet Connect</h1>
      </header>
      <main>{isConnected ? <AccountInfo /> : <ConnectButton />}</main>
    </div>
  );
}

export default App;