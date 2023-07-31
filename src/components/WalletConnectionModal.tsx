import { Dispatch, FC, useEffect } from "react";
import { useAccount, useConnect, Connector } from "wagmi";
import { VscChromeClose } from "react-icons/vsc";

interface WalletConnectionModalProps {
  isOpen: boolean;
  setIsModalOpen: Dispatch<boolean>
}

const WalletConnectionModal: FC<WalletConnectionModalProps> = ({ isOpen, setIsModalOpen }) => {
  const { isConnected, isConnecting } = useAccount();
  const { connect, connectors, isLoading, pendingConnector } = useConnect()

  const dialog = document.querySelector('dialog')

  const connectorButtons = () => {
    return connectors.map((connector: Connector) => {
      return (
        <button
          className="flex flex-row items-center p-2 border-2 border-border-dark rounded"
          disabled={!connector.ready}
          onClick={() => connect({ connector })}
          key={connector.name}
        >
          <img
            src={`src/assets/${connector.id}-logo.svg`}
            alt='MetaMask logo'
            className="mr-4 w-8 h-8"
          />
          <span>
            {connector.name}
            {!connector.ready && ' (unsupported)'}
            {isLoading &&
              connector.id === pendingConnector?.id &&
              ' (connecting)'}
          </span>
        </button>)
    })
  }

  useEffect(() => {
    if (isOpen) {
      dialog?.showModal()
    }
  }, [isOpen, dialog])

  useEffect(() => {
    if (isConnected || isConnecting) {
      dialog?.close()
    }
  }, [isConnected, isConnecting, dialog])

  useEffect(() => {
    dialog && dialog.addEventListener("click", e => {
      const dialogDimensions = dialog.getBoundingClientRect()
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        dialog.close()
        setIsModalOpen(false)
      }
    })
  }, [dialog, setIsModalOpen]);

  return (
    <dialog className="rounded-md text-white">
      <div className="flex flex-col space-y-3 px-6 pt-4 pb-6 bg-bg-dark font-bold w-[360px] color-white">
        <div className="flex flex-row pb-1 justify-between">
          <span>Select Wallet</span>
          <button onClick={() => dialog?.close()}>
            <VscChromeClose size={20} />
          </button>
        </div>
        {connectorButtons()}
      </div>
    </dialog>
  )
}

export default WalletConnectionModal
