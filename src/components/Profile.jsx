import {
    useAccount,
    useConnect,
    useDisconnect,
    useEnsAvatar,
    useEnsName,
    useNetwork,
    useBalance,
    useSignMessage
} from 'wagmi';
import { Card, Button, Divider } from "antd";

import { verifyMessage } from 'ethers/lib/utils'

function GetUseBalance(addressOrName, chainId) {
    const { data, isError, isLoading } = useBalance({
        addressOrName: addressOrName,
        chainId: chainId,
        wathch: true,
        enabled: true,
    })
    if (isLoading) return <div>Fetching balance…</div>
    if (isError) return <div>Error fetching balance</div>
    return (
        <div>
            Balance: {data?.formatted} {data?.symbol}
        </div>
    )
}

export function Profile() {
    const {
        activeChain,
        chains,
        _error,
        isLoading,
        pendingChainId,
        switchNetwork,
      } = useNetwork()  
    
    const { data: account } = useAccount()
    const { data: ensAvatar } = useEnsAvatar({ addressOrName: account?.address })
    const { data: ensName } = useEnsName({ address: account?.address })
    const { connect, connectors, error, isConnecting, pendingConnector } = 
        useConnect()
    const { disconnect } = useDisconnect()

    if (account) {
        return (
            <Card>
                <div>
                    {chains.map((connector) => (
                        <button
                            disabled={!switchNetwork || connector.id === activeChain?.id}
                            key={connector.id}
                            onClick={() => switchNetwork?.(connector.id)}
                            >
                            {connector.name}
                            {isLoading && pendingChainId === connector.id && ' (switching)'}
                        </button>
                    ))}
                    <div>
                        {activeChain && <div>Connected to {activeChain.name}</div>}
                        {ensName ? `${ensName} (${account.address})` : account.address}
                    </div>
                    {GetUseBalance(account.address, activeChain?.id)}
                    {/* <div>Connected to {account.connector.name}</div> */}
                    <Divider/>
                    <Button type="primary" onClick={disconnect}>Disconnect</Button>
                </div>
            </Card>
        )
    }

    return (
        <div>
            {activeChain && <div>Connected to {activeChain.name}</div>}
            {connectors.map((connector) => (
                <button
                    disabled={!connector.ready}
                    key={connector.id}
                    onClick={() => connect(connector)}
                >
                    {connector.name}
                    {!connector.ready && ' (unsupported)'}
                    {isConnecting && pendingConnector?.id === connector.id && ' (connecting)'}
                </button>
            ))}
            {error && <div>{error.message}</div>}
        </div>
    )
}