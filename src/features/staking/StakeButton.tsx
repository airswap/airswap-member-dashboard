import { useRef } from "react";
import { twJoin } from "tailwind-merge";
import { useAccount, useNetwork } from "wagmi";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import { Button } from "../common/Button";
import { StakingModal } from "./StakingModal";

export const StakeButton = ({}: {}) => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

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
          "flex flex-row items-center gap-4 ring-1 ring-gray-800 rounded-full pl-5",
        )}
      >
        <span className="hidden font-medium xs:flex">{`${sAstBalance} sAST`}</span>
        <Button
          className="-mr-5 bg-airswap-blue font-bold uppercase -my-px"
          onClick={handleOpenStakingModal}
        >
          Stake
        </Button>
      </div>

      {isConnected && address && (
        <StakingModal
          stakingModalRef={stakingModalRef}
          chainId={chain?.id || 1}
        />
      )}
    </>
  );
};
