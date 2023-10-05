import { useState } from "react";
import { twJoin } from "tailwind-merge";
import truncateEthAddress from "truncate-eth-address";
import { useAccount, useEnsName } from "wagmi";
import { Button } from "../common/Button";
import { UserAccountDetail } from "./UserAccountDetail";
import WalletConnectionModal from "./WalletConnectionModal";

const WalletConnection = () => {
  const [showConnectionModal, setShowConnectionModal] =
    useState<boolean>(false);
  const [showUserAccountDetail, setShowUserAccountDetail] = useState(false);

  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });

  const handleShowConnectionModal = () => {
    !isConnected
      ? setShowConnectionModal(true)
      : setShowUserAccountDetail(!showUserAccountDetail);
  };

  const displayAddress = ensName || truncateEthAddress(address || "");

  return (
    <>
      <Button
        className={twJoin(
          "flex flex-row items-center gap-2",
          isConnected && "cursor-default hover:bg-gray-900",
          showUserAccountDetail && "bg-gray-900",
        )}
        rounded={true}
        onClick={handleShowConnectionModal}
        color={isConnected ? "transparent" : "primary"}
      >
        {isConnected && (
          <div className="h-3 w-3 rounded-full bg-[#60FF66]"></div>
        )}
        <span
          className={twJoin(
            isConnected ? "font-medium normal-case" : "font-bold px-1",
            "whitespace-nowrap",
          )}
        >
          {isConnected ? displayAddress : "Connect"}
        </span>
      </Button>
      {showConnectionModal && (
        <WalletConnectionModal
          setShowConnectionModal={setShowConnectionModal}
        />
      )}
      {isConnected && (
        <UserAccountDetail
          setShowUserAccountDetail={setShowUserAccountDetail}
          showUserAccountDetail={showUserAccountDetail}
        />
      )}
    </>
  );
};

export default WalletConnection;
