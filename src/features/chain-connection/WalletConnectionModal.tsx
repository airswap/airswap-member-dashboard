import { FC, MouseEvent, RefObject, useEffect } from "react";
import { useAccount, useConnect, Connector } from "wagmi";
import { VscChromeClose } from "react-icons/vsc";
import { twJoin } from "tailwind-merge";

interface WalletConnectionModalProps {
  modalRef: RefObject<HTMLDialogElement>;
}

const WalletConnectionModal: FC<WalletConnectionModalProps> = ({ modalRef }) => {
  const { isConnected, isConnecting } = useAccount();
  const { connect, connectors, isLoading, pendingConnector } = useConnect()

  const handleCloseOnOutsideClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      modalRef.current?.close()
    }
  }

  const handleCloseModalButton = () => {
    modalRef.current?.close()
  }

  useEffect(() => {
    if (isConnected || isConnecting) {
      modalRef.current?.close()
    }
  }, [isConnected, isConnecting, modalRef])

  return (
    <dialog className="rounded-md text-white border-0 p-0" ref={modalRef} onClick={handleCloseOnOutsideClick}>
      <div className="flex flex-col space-y-3 px-6 pt-4 pb-6 bg-bg-dark font-bold w-[360px] color-white">
        <div className={twJoin("flex flex-row pb-1 justify-between", "hover:cursor-pointer")}>
          <span>Select Wallet</span>
          <button onClick={() => handleCloseModalButton()}>
            <VscChromeClose size={20} />
          </button>
        </div>
        {connectors.map((connector: Connector) => {
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
        })}
      </div>
    </dialog>
  )
}

export default WalletConnectionModal
