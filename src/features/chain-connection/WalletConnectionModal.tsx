import { FC, MouseEvent, RefObject, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { twJoin } from "tailwind-merge";
import { Connector, useAccount, useConnect } from "wagmi";
import { LineBreak } from "../common/LineBreak";
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

  // TODO: use modal component instead.
  return (
    <dialog
      className="rounded-md border-0 p-0 text-white"
      ref={modalRef}
      onClick={handleCloseOnOutsideClick}
    >
      <div className="color-white flex w-[360px] flex-col border border-gray-800 bg-gray-900 p-6 font-bold">
        <div
          className={twJoin(
            "flex flex-row justify-between mb-6 items-center",
            "hover:cursor-pointer",
          )}
        >
          <h2 className="font-bold text-[20px]">Select Wallet</h2>
          <button onClick={() => handleCloseModalButton()}>
            <MdClose size={24} className="text-gray-500" />
          </button>
        </div>
        <LineBreak className="-mx-6 mb-6" />
        <div className="flex flex-col gap-2">
          {connectors
            .filter((connector) => connector.ready)
            // .sort((c) => (c.ready ? -1 : 1))
            .map((connector: Connector) => {
              return (
                <button
                  className={twJoin(
                    "flex flex-row items-center rounded border border-gray-800 bg-gray-900 p-4",
                    "hover:bg-gray-800 disabled:cursor-not-allowed font-medium",
                  )}
                  disabled={!connector.ready}
                  onClick={() => connect({ connector })}
                  key={connector.id}
                >
                  <img
                    src={walletLogos[connector.name.toLowerCase()]}
                    alt={`${connector.name} logo`}
                    className="mr-5 h-10 w-10"
                  />
                  <span className={twJoin(!connector.ready && "opacity-50")}>
                    {connector.name}
                    {/* {!connector.ready && " (unsupported)"} */}
                    {isLoading &&
                      connector.id === pendingConnector?.id &&
                      " (connecting)"}
                  </span>
                </button>
              );
            })}
        </div>
      </div>
    </dialog>
  );
};

export default WalletConnectionModal;
