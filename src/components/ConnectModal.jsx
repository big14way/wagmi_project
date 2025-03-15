// Placeholder icons; replace with actual SVG imports if available
const wallets = [
  {
    id: 'walletConnect',
    name: 'WalletConnect',
    icon: <span>WC</span>, // Replace with <img src={WalletConnectIcon} alt="WalletConnect" />
  },
  // Add more wallets (e.g., MetaMask) here later if needed
];

export default function ConnectModal({ connectors, connect, onClose, error, isPending }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Choose a Wallet</h2>
        <div className="wallet-grid">
          {connectors.map((connector) => {
            const wallet = wallets.find((w) => w.id === connector.id);
            if (!wallet) return null;
            return (
              <button
                key={connector.id}
                onClick={() => connect({ connector })}
                disabled={isPending}
              >
                {wallet.icon}
                <span>{wallet.name}</span>
              </button>
            );
          })}
        </div>
        <button onClick={onClose}>Cancel</button>
        {error && <p className="error-message">{error.message}</p>}
      </div>
    </div>
  );
}