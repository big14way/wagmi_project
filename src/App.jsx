import { useEffect, useState } from 'react'
import './App.css'
import { useAccount, useConnectors, useConnect, useDisconnect, useSwitchChain } from "wagmi"
import { mainnet, sepolia, lisk, liskSepolia, base, polygon } from 'wagmi/chains'
import { reconnect } from '@wagmi/core'
import { config } from './config/config.js'



const WalletConnect = () => {
  const accounts = useAccount()
  const connectors = useConnectors()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain() 
  const [connectClick, setConnectClick] = useState(false)
  const [connector, setConnector] = useState(null)

  const supportedChains = [mainnet, sepolia, lisk, liskSepolia, base, polygon]

  


  useEffect(() => {
    

    if(!connectors) return

    if(accounts.address === undefined) return
    setConnector(accounts.connector)
    setConnectClick(false)


    
    

  }, [accounts.connector])

  const handleConnectWallet = () => {
    setConnectClick(true)

  }

  const handleConnector = (_connector) => {
      connect({connector:_connector})
    //  setConnector(_connector)
    //  setConnectClick(false)

  }

  const handleDisconnect = () => {
    if(connector){
    disconnect()
    setConnector(null)
    setConnectClick(false)
    }
    
  }

  const handleSwitchChain = async (id) => {
    console.log("chainID",id)
    await switchChain({chainId:Number(id)})
  }

  console.log("ACCOUNTS: ", accounts);
  console.log("CONNECTORS", connectors);
  
  return (
    <>
    {!connector?
    <div>
    {!connectClick?
      <button onClick={handleConnectWallet}>Connect Wallet</button>
      :
      <div>
      {
        connectors.map((connector) => (
          <button key={connector.id} onClick={() => handleConnector(connector)}>{connector.name}</button>
        ))
      }
      <button onClick={()=>setConnectClick(false)}>Cancel Connect</button>
      </div>
    }
    </div>
    :<div>
      <p>
        Address: {accounts.address}
      </p>
      <p>Connected: {accounts.isConnected && "Wallet Connected"}</p>
      <p>Chain: {accounts.chain.name}</p>
      <button onClick={handleDisconnect}>Disconnect Wallet</button>
      <select value={accounts.chain.id} onChange={(e) => handleSwitchChain(e.target.value)}>
        {
          supportedChains ? 
          supportedChains.map((chain) => (
            <option key={chain.id} value={chain.id}>
              {chain.name}
            </option>
          )):
          <option>No Chains</option>
        }
      </select>
      {/* <button onClick={handleSwitchChain}>Switch Chain</button> */}
    </div>
    }
    </>
  )
  
}

function App() {

  return (
    <>
    <WalletConnect/>
      
    </>
  )
}

export default App