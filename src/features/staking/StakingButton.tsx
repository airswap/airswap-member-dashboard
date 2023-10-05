import { twJoin } from "tailwind-merge";
import { useAccount } from "wagmi";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import { Button } from "../common/Button";
import { formatNumber } from "../common/utils/formatNumber";
import { StakingModal } from "./StakingModal";
import { useStakingModalStore } from "./store/useStakingModalStore";

export const StakingButton = () => {
  const { showStakingModal, setShowStakingModal } = useStakingModalStore();
  const { isConnected } = useAccount();
  const { sAstBalanceRaw } = useTokenBalances();

  const sAstBalance = formatNumber(sAstBalanceRaw, 4);

  return (
    <>
      <div
        className={twJoin(
          "flex flex-row items-center gap-4 ring-1 ring-gray-800 rounded-full sm:pl-5",
        )}
      >
        <span className="hidden sm:flex font-medium ">{`${
          sAstBalance || 0
        } sAST`}</span>
        <Button
          className="-mr-5 -my-px"
          rounded={true}
          color="primary"
          onClick={() => setShowStakingModal(true)}
        >
          Staking
        </Button>
      </div>
      {isConnected && showStakingModal && <StakingModal />}
    </>
  );
};
