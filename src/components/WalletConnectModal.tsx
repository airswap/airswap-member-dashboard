import { FC, MouseEvent } from "react";
import { useAccount, useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { GrClose } from 'react-icons/gr'

interface WalletConnectModalProps {
  isDisplayModal: boolean
  onClose: () => void
}

const WalletConnectModal: FC<WalletConnectModalProps> = ({ isDisplayModal, onClose }) => {
  const { isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  if (!isDisplayModal) return null;

  const handleOnClose = (e: MouseEvent<HTMLInputElement>) => {
    const target = e.target as HTMLElement
    if (target.id === 'container') {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/1 backdrop-blur-sm flex justify-center items-center"
      id="container"
      onClick={handleOnClose}
    >
      <div className="bg-darkShaded p-2 rounded-sm">
        <div className="flex flex-row">
          <span>Select Wallet</span>
          <button
            className="text-white bg-white"
            onClick={onClose}>
            <GrClose style={{ color: 'white' }}
            />
          </button>
        </div>
      </div>
    </div >
  )
}

export default WalletConnectModal
