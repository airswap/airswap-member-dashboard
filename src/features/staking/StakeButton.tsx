import { format } from "@greypixel_/nicenumbers";
import { Button } from "../common/Button";
import { useAccount, useBalance, useNetwork } from "wagmi";
import { useRef } from "react";
import StakingModal from "./StakingModal";
import { twJoin } from "tailwind-merge";
import { contractAddresses } from "../../utils/constants";

export const StakeButton = ({ }: {}) => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork()
  const { data: astBalance } = useBalance({
    address,
    token: contractAddresses[chain?.id || 1].AST as `0x${string}` || "",
    chainId: chain?.id,
    staleTime: 300_000, // 5 minutes,
    cacheTime: Infinity,
  });

  const { data: sAstBalance } = useBalance({
    address,
    token: contractAddresses[chain?.id || 1].sAST as `0x${string}` || "",
    chainId: chain?.id,
    staleTime: 300_000, // 5 minutes,
    cacheTime: Infinity,
  });

  const stakingModalRef = useRef<HTMLDialogElement | null>(null)

  const formattedAstBalance =
    format(astBalance?.value, { tokenDecimals: 4 });

  const formattedAastBalance =
    format(sAstBalance?.value, { tokenDecimals: 4 });

  const handleOpenStakingModal = () => {
    if (isConnected) {
      stakingModalRef.current && stakingModalRef.current.showModal()
    }
  }

  return (
    <>
      <div className={twJoin("flex flex-row items-center gap-4 py-3",
        // "border border-border-dark px-5"
      )}>
        {/* <span className="hidden xs:flex font-medium">{formattedAastBalance}</span> */}
        <Button
          className="-my-3 -mr-5 bg-accent-blue font-bold uppercase"
          onClick={handleOpenStakingModal}
        >
          Stake
        </Button>
      </div>

      {isConnected &&
        <StakingModal
          stakingModalRef={stakingModalRef}
          astBalance={formattedAstBalance}
          sAstBalance={formattedAastBalance}
          chainId={chain?.id || 1} />}
    </>
  );
};
