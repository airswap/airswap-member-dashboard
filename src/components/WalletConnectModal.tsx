import { FC, MouseEvent } from "react";
import { AiOutlineClose } from 'react-icons/ai';
import { useAccount, useConnect } from "wagmi";

interface WalletConnectModalProps {
  isDisplayModal: boolean
  onClose: () => void
}

const WalletConnectModal: FC<WalletConnectModalProps> = ({ isDisplayModal, onClose }) => {
  const { connect, connectors, isLoading, pendingConnector } = useConnect()
  const { isConnected } = useAccount()
  const metamaskConnector = connectors[0]
  const walletConnectConnector = connectors[1]

  const handleOnClose = (e: MouseEvent<HTMLInputElement>) => {
    const target = e.target as HTMLElement
    if (target.id === 'container') {
      onClose()
    }
  }

  if (!isDisplayModal || isConnected) return null;

  return (
    <div
      className="fixed inset-0 bg-black/1 backdrop-blur-sm flex justify-center items-center"
      id="container"
      onClick={handleOnClose}
    >
      <div className="flex flex-col space-y-3 bg-bg-dark px-6 pt-4 pb-6 rounded-lg font-bold w-[360px] border-2 border-border-dark">
        <div className="flex flex-row px-2 pb-1  justify-between">
          <span>Select Wallet</span>
          <button onClick={onClose}>
            <AiOutlineClose />
          </button>
        </div>
        <button
          className="flex flex-row items-center p-2 border-2 border-border-dark rounded"
          disabled={!connectors[0].ready}
          onClick={() => connect({ connector: metamaskConnector })}
        >
          <img
            src="src/assets/MetaMask-logo.svg"
            alt='MetaMask logo'
            className="mr-4 w-8 h-8"
          />
          <span>
            {connectors[0].name}
            {!connectors[0].ready && ' (unsupported)'}
            {isLoading &&
              connectors[0].id === pendingConnector?.id &&
              ' (connecting)'}
          </span>
        </button>
        <button
          className="flex flex-row items-center p-2  border-2 border-border-dark rounded"
          onClick={() => connect({ connector: walletConnectConnector })}
        >
          <img
            src="src/assets/walletconnect-logo.svg"
            alt='WalletConnect logo'
            className="mr-4 w-8 h-8"
          />
          <span>
            {connectors[1].name}
            {!connectors[1].ready && ' (unsupported)'}
            {isLoading &&
              connectors[1].id === pendingConnector?.id &&
              ' (connecting)'}
          </span>
        </button>
      </div>
    </div >
  )
}

export default WalletConnectModal
