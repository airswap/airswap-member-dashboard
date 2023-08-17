import { format } from "@greypixel_/nicenumbers";
import { useRef } from "react";
import { twJoin } from "tailwind-merge";
import { useAccount, useBalance, useNetwork } from "wagmi";
import { ContractTypes } from "../../config/ContractAddresses";
import { useContractAddresses } from "../../config/hooks/useContractAddress";
import { Button } from "../common/Button";
import StakingModal from "./StakingModal";

export const StakeButton = ({}: {}) => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const [stakedAst] = useContractAddresses([ContractTypes.AirSwapStaking], {
    defaultChainId: 1,
    useDefaultAsFallback: true,
  });

  const stakingModalRef = useRef<HTMLDialogElement | null>(null);

  const handleOpenStakingModal = () => {
    if (isConnected) {
      stakingModalRef.current && stakingModalRef.current.showModal();
    }
  };

  const { data: sAstBalance } = useBalance({
    token: stakedAst.address,
    address,
    staleTime: 300_000, // 5 minutes,
    cacheTime: Infinity,
    chainId: stakedAst.chainId,
  });

  const formattedBalance =
    format(sAstBalance?.value, { tokenDecimals: 4 }) + " sAST";

  return (
    <>
      <div className={twJoin("flex flex-row items-center gap-4 py-3")}>
        <span className="hidden xs:flex font-medium">{formattedBalance}</span>
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
