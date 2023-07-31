import { useAccount, useEnsName, useDisconnect } from "wagmi";
import { Button } from "../common/Button";
import { twJoin } from "tailwind-merge";
import truncateEthAddress from "truncate-eth-address";
import { useState } from "react";
import WalletConnectionModal from "../../components/WalletConnectionModal";

const WalletConnection = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { disconnect } = useDisconnect()

  const handleModalOpening = () => {
    if (!isConnected) {
      setIsModalOpen(true)
    } else {
      disconnect()
    }
  }

  return (
    <>
      <Button
        className={twJoin([
          "flex flex-row items-center gap-2",
          isConnected && "cursor-default",
        ])}
        onClick={() => handleModalOpening()}
      >
        <div className="h-3 w-3 rounded-full bg-accent-green"></div>
        <span className="font-medium">
          {isConnected ? ensName || truncateEthAddress(address || "") : "Connect"}
        </span>
      </Button>
      <WalletConnectionModal isOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  );
};

export default WalletConnection
