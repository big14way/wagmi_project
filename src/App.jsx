import { useAccount } from 'wagmi';
import AccountInfo from './components/AccountInfo';
import ConnectButton from './components/connectbutton';
import './App.css';

export default function App() {
  const { isConnected } = useAccount();

  return (
    <div className="app-container">
      <header>
        <h1>Wallet Connect</h1>
      </header>
      {isConnected ? <AccountInfo /> : <ConnectButton />}
    </div>
  );
}