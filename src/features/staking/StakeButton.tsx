import { useRef } from "react";
import { twJoin } from "tailwind-merge";
import { useAccount } from "wagmi";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import { Button } from "../common/Button";
import { StakingModal } from "./StakingModal";

export const StakeButton = ({}: {}) => {
  const { address, isConnected } = useAccount();

  const stakingModalRef = useRef<HTMLDialogElement | null>(null);

  const handleOpenStakingModal = () => {
    if (isConnected) {
      stakingModalRef.current && stakingModalRef.current.showModal();
    }
  };

  const { sAstBalanceFormatted: sAstBalance } = useTokenBalances();

  return (
    <>
      <div
        className={twJoin(
          "flex flex-row items-center gap-4 ring-1 ring-gray-800 rounded-full sm:pl-5",
        )}
      >
        <span className="hidden sm:flex font-medium ">{`${sAstBalance} sAST`}</span>
        <Button
          className="-mr-5 -my-px"
          rounded={true}
          color="primary"
          onClick={handleOpenStakingModal}
        >
          Stake
        </Button>
      </div>

      {isConnected && address && (
        <StakingModal stakingModalRef={stakingModalRef} />
      )}
    </>
  );
};
