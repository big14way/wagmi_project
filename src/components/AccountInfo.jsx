import { useAccount, useDisconnect, useSwitchChain } from 'wagmi';

export default function AccountInfo() {
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
      <p>
        <strong>Address:</strong> {address?.slice(0, 6)}...{address?.slice(-4)}
      </p>
      <p>
        <strong>Status:</strong> {isConnected ? 'Connected' : 'Disconnected'}
      </p>
      <p>
        <strong>Chain:</strong> {chain?.name || 'Unknown'}
      </p>
      <button onClick={disconnect}>Disconnect Wallet</button>
      <div>
        <label>Switch Chain: </label>
        <select value={chain?.id || ''} onChange={handleSwitchChain} disabled={isSwitching}>
          <option value="" disabled>
            Select a chain
          </option>
          <option value={1}>Ethereum Mainnet</option>
          <option value={137}>Polygon</option>
        </select>
        {isSwitching && <p>Switching chain...</p>}
        {switchError && <p>{switchError.message}</p>}
      </div>
    </div>
  );
}