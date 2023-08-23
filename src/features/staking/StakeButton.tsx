import { useRef } from "react";
import { twJoin } from "tailwind-merge";
import { useAccount, useNetwork } from "wagmi";
import { Button } from "../common/Button";
import StakingModal from "./StakingModal";
import { useTokenBalances } from "../../hooks/useTokenBalances";

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
      <div className={twJoin("flex flex-row items-center gap-4 py-3")}>
        <span className="hidden font-medium xs:flex">{`${sAstBalance} sAST`}</span>
        <Button
          className="-my-3 -mr-5 bg-accent-blue font-bold uppercase"
          onClick={handleOpenStakingModal}
        >
          Stake
        </Button>
      </div>

      {isConnected && address && (
        <StakingModal
          stakingModalRef={stakingModalRef}
          address={address}
          chainId={chain?.id || 1}
        />
      )}
    </>
  );
};
