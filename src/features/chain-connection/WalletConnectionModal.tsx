import { FC, MouseEvent, RefObject, useEffect } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { twJoin } from "tailwind-merge";
import { Connector, useAccount, useConnect } from "wagmi";
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
      className="rounded-md border-0 p-0 text-white"
      ref={modalRef}
      onClick={handleCloseOnOutsideClick}
    >
      <div className="color-white flex w-[360px] flex-col space-y-3 bg-bg-dark px-6 pb-6 pt-4 font-bold">
        <div
          className={twJoin(
            "flex flex-row justify-between pb-1",
            "hover:cursor-pointer",
          )}
        >
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
                className="flex flex-row items-center rounded border-2 border-border-dark p-2 disabled:cursor-not-allowed"
                disabled={!connector.ready}
                onClick={() => connect({ connector })}
                key={connector.id}
              >
                <img
                  src={walletLogos[connector.name.toLowerCase()]}
                  alt={`${connector.name} logo`}
                  className="mr-4 h-8 w-8"
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
