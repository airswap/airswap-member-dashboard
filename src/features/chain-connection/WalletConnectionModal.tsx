import { FC, MouseEvent, RefObject, useEffect } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { Connector, useAccount, useConnect } from "wagmi";

import { twJoin } from "tailwind-merge";
import coinbaseWalletLogo from "./assets/wallet-logos/coinbase-wallet.svg";
import frameLogo from "./assets/wallet-logos/frame-logo.png";
import metamaskLogo from "./assets/wallet-logos/metamask-logo.svg";
import rabbyLogo from "./assets/wallet-logos/rabby-logo.svg";
import walletConnectLogo from "./assets/wallet-logos/walletconnect-logo.svg";

const walletLogos: Record<string, string> = {
  walletconnect: walletConnectLogo,
  metamask: metamaskLogo,
  "rabby wallet": rabbyLogo,
  "coinbase wallet": coinbaseWalletLogo,
  frame: frameLogo,
};

interface WalletConnectionModalProps {
  modalRef: RefObject<HTMLDialogElement>;
}

const WalletConnectionModal: FC<WalletConnectionModalProps> = ({
  modalRef,
}) => {
  const { isConnected, isConnecting } = useAccount();
  const { connect, connectors, isLoading, pendingConnector } = useConnect();

  const handleCloseOnOutsideClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      modalRef.current?.close();
    }
  };

  const handleCloseModalButton = () => {
    modalRef.current?.close();
  };

  useEffect(() => {
    if (isConnected || isConnecting) {
      modalRef.current?.close();
    }
  }, [isConnected, isConnecting, modalRef]);

  return (
    <dialog
      className="rounded-md text-white border-0 p-0"
      ref={modalRef}
      onClick={handleCloseOnOutsideClick}
    >
      <div className="flex flex-col space-y-3 px-6 pt-4 pb-6 bg-bg-dark font-bold w-[360px] color-white">
        <div className="flex flex-row pb-1 justify-between">
          <span>Select Wallet</span>
          <button onClick={() => handleCloseModalButton()}>
            <VscChromeClose size={20} />
          </button>
        </div>
        {connectors
          .sort((c) => (c.ready ? -1 : 1))
          .map((connector: Connector) => {
            return (
              <button
                className="flex flex-row items-center p-2 border-2 border-border-dark rounded disabled:cursor-not-allowed"
                disabled={!connector.ready}
                onClick={() => connect({ connector })}
                key={connector.name}
              >
                <img
                  src={walletLogos[connector.name.toLowerCase()]}
                  alt={`${connector.name} logo`}
                  className="mr-4 w-8 h-8"
                />
                <span className={twJoin(!connector.ready && "opacity-50")}>
                  {connector.name}
                  {!connector.ready && " (unsupported)"}
                  {isLoading &&
                    connector.id === pendingConnector?.id &&
                    " (connecting)"}
                </span>
              </button>
            );
          })}
      </div>
    </dialog>
  );
};

export default WalletConnectionModal;
