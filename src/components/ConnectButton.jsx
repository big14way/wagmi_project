import { useAccount } from 'wagmi';
import ConnectButton from './components/ConnectButton';
import './App.css';

export default function App() {
  const { isConnected } = useAccount();

  return (
    <div className="app-container">
      <header>
        <h1>Wallet Connect</h1>
      </header>
      {isConnected ? <p>Connected! (Account info coming soon)</p> : <ConnectButton />}
    </div>
  );
}