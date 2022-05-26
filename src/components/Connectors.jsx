import { Provider, chain, createClient } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import {WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import { Profile  } from './Profile.jsx';

const alchemyId = process.env.ALCHEMY_ID
console.log("alchemyId:", alchemyId);
const chains = [chain.mainnet, chain.ropsten, chain.polygon, chain.polygonMumbai, chain.arbitrum]
const defaultChain = chain.mainnet

// Set up connectors
const client = createClient({
    autoConnect: true,
    connectors({ chainId }) {
        const chain = chains.find((x) => x.id === chainId) ?? defaultChain
        const rpcUrl = chain.rpcUrls.alchemy 
            ? `${chain.rpcUrls.alchemy}/${alchemyId}` 
            : chain.rpcUrls.mainnet
        return [
            new MetaMaskConnector({ chains }),
            new CoinbaseWalletConnector({ 
                chains,
                options: {
                    appName: 'wagmi',
                    chainId: chain.id,
                    jsonRpcUrl: rpcUrl,
                }
            }),
            new WalletConnectConnector({
                chains,
                options: {
                    qrcode: true,
                    rpc: { [chain.id]: rpcUrl },
                }
            }),
            new InjectedConnector({ 
                chains,
                options: { name: 'Injected' },
             }),
        ]
    }
})

function App() {
    return (
        <Provider client={client}>
            <Profile />
        </Provider>
    )
}

export default App;