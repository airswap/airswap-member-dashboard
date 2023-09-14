import { useRef } from "react";
import { twJoin } from "tailwind-merge";
import truncateEthAddress from "truncate-eth-address";
import { useAccount, useDisconnect, useEnsName } from "wagmi";
import { Button } from "../common/Button";
import WalletConnectionModal from "./WalletConnectionModal";

const WalletConnection = ({}: {}) => {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { disconnect } = useDisconnect();

  const modalRef = useRef<HTMLDialogElement>(null);

  const handleModalOpening = () => {
    if (!isConnected) {
      modalRef.current?.showModal();
    } else {
      disconnect();
    }
  };

  return (
    <>
      <Button
        className={twJoin(
          "flex flex-row items-center gap-2",
          isConnected && "cursor-default",
        )}
        rounded={true}
        onClick={handleModalOpening}
        color={isConnected ? "transparent" : "primary"}
      >
        <div className="h-3 w-3 rounded-full bg-[#60FF66]"></div>
        <span className="font-medium whitespace-nowrap">
          {isConnected
            ? ensName || truncateEthAddress(address || "")
            : "Connect"}
        </span>
      </Button>
      <WalletConnectionModal modalRef={modalRef} />
    </>
  );
};

export default WalletConnection;
