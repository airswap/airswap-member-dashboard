import { useAccount, useEnsName, useDisconnect, useConnect, Connector } from "wagmi";
import { Button } from "../common/Button";
import { twJoin } from "tailwind-merge";
import truncateEthAddress from "truncate-eth-address";
import { AiOutlineClose } from "react-icons/ai";
import { useEffect } from "react";

const WalletConnection = () => {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { connect, connectors, isLoading, pendingConnector } = useConnect()
  const { disconnect } = useDisconnect()

  const dialog = document.querySelector('dialog')

  useEffect(() => {
    if (isConnected) {
      dialog?.close()
    }
  }, [isConnected, dialog])

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
          <span className="color-white">
            {connector.name}
            {!connector.ready && ' (unsupported)'}
            {isLoading &&
              connector.id === pendingConnector?.id &&
              ' (connecting)'}
          </span>
        </button>)
    })
  }

  return (
    <>
      <Button
        className={twJoin([
          "flex flex-row items-center gap-2",
          isConnected && "cursor-default",
        ])}
        onClick={() => !isConnected ? dialog?.showModal() : disconnect()}
      >
        <div className="h-3 w-3 rounded-full bg-accent-green"></div>
        <span className="font-medium">
          {isConnected ? ensName || truncateEthAddress(address || "") : "Connect"}
        </span>
      </Button>

      <dialog className="rounded-md backdrop:bg-color-black color-white">
        <div
          className="flex flex-col space-y-3 bg-bg-dark px-6 pt-4 pb-6 font-bold w-[360px] color-white"
        >
          <div className="flex flex-row px-2 pb-1  justify-between">
            <span>Select Wallet</span>
            <button
              onClick={() => dialog?.close()}
            >
              <AiOutlineClose />
            </button>
          </div>
          {connectorButtons()}
        </div>
      </dialog>
    </>
  );
};

export default WalletConnection
