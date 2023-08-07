import { format } from "@greypixel_/nicenumbers";
import { Button } from "../common/Button";
import { useAccount, useBalance } from "wagmi";
import { useRef } from "react";
import StakingModal from "./StakingModal";

export const StakeButton = ({ }: {}) => {
  const { address, isConnected } = useAccount();
  const { data: sAstBalance } = useBalance({
    token: "0x579120871266ccd8De6c85EF59E2fF6743E7CD15",
    address,
    staleTime: 300_000, // 5 minutes,
    cacheTime: Infinity,
  });

  const stakingModalRef = useRef<HTMLDialogElement | null>(null)

  const formattedBalance =
    format(sAstBalance?.value, { tokenDecimals: 4 }) + " sAST";

  const handleOpenStakingModal = () => {
    if (isConnected) {
      console.log('open staking modal')
      stakingModalRef.current && stakingModalRef.current.showModal()
    }
  }

  return (
    <>
      <div className="flex flex-row items-center gap-4 border border-border-dark px-5 py-3">
        <span className="hidden xs:flex font-medium">{formattedBalance}</span>
        <Button
          className="-my-3 -mr-5 bg-accent-blue font-bold uppercase"
          onClick={handleOpenStakingModal}
        >
          Stake
        </Button>
      </div>

      <StakingModal stakingModalRef={stakingModalRef} />
    </>
  );
};
