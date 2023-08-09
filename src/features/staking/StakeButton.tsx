import { Button } from "../common/Button";
import { useAccount, useNetwork } from "wagmi";
import { useRef } from "react";
import StakingModal from "./StakingModal";
import { twJoin } from "tailwind-merge";

export const StakeButton = ({ }: {}) => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork()

  const stakingModalRef = useRef<HTMLDialogElement | null>(null)

  const handleOpenStakingModal = () => {
    if (isConnected) {
      stakingModalRef.current && stakingModalRef.current.showModal()
    }
  }

  return (
    <>
      <div className={twJoin("flex flex-row items-center gap-4 py-3")}>
        <Button
          className="-my-3 -mr-5 bg-accent-blue font-bold uppercase"
          onClick={handleOpenStakingModal}
        >
          Stake
        </Button>
      </div>

      {isConnected && address &&
        <StakingModal
          stakingModalRef={stakingModalRef}
          address={address}
          chainId={chain?.id || 1} />}
    </>
  );
};
