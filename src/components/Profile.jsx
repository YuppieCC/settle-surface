import {
    useAccount,
    useConnect,
    useDisconnect,
    useEnsAvatar,
    useEnsName,
    useNetwork
} from 'wagmi'

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
                    {ensName ? `${ensName} (${account.address})` : account.address}
                </div>
                {/* <div>Connected to {account.connector.name}</div> */}
                <button onClick={disconnect}>Disconnect</button>
            </div>
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