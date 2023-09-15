import { twJoin } from "tailwind-merge";
import { useAccount } from "wagmi";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import { Button } from "../common/Button";
import { StakingModal } from "./StakingModal";
import { useStakingModalStore } from "./store/useStakingModalStore";

export const StakeButton = ({}: {}) => {
  const [setShowStakingModal] = useStakingModalStore((state) => [
    state.setShowStakingModal,
  ]);
  const { address, isConnected } = useAccount();
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
          onClick={() => setShowStakingModal(true)}
        >
          Stake
        </Button>
      </div>

      {isConnected && address && <StakingModal />}
    </>
  );
};
