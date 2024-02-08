import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { ContractTypes } from "../../../config/ContractAddresses";
import { useContractAddresses } from "../../../config/hooks/useContractAddress";
import { stakingAbi } from "../../../contracts/stakingAbi";
import { ContractVersion } from "../types/StakingTypes";

/**
 *
 * @param unstakingAmount - if contract type is v4 (deprecated), pass in V4 sAST balance
 * @returns write functions returned from WAGMI useContractWrite hook
 */
export const useUnstakeSast = ({
  unstakingAmount,
  contractVersion = ContractVersion.LATEST,
  enabled,
}: {
  unstakingAmount: bigint | undefined;
  contractVersion?: ContractVersion;
  enabled: boolean;
}) => {
  const [airSwapStaking, airSwapStakingV4Deprecated] = useContractAddresses(
    [
      ContractTypes.AirSwapStaking_latest,
      ContractTypes.AirSwapV4Staking_deprecated,
    ],
    {
      defaultChainId: 1,
      useDefaultAsFallback: false,
    },
  );

  const contractAddress =
    contractVersion === ContractVersion.LATEST
      ? airSwapStaking.address
      : airSwapStakingV4Deprecated.address;

  const { config: configUnstake } = usePrepareContractWrite({
    address: contractAddress,
    abi: stakingAbi,
    functionName: "unstake",
    args: [BigInt(unstakingAmount || 0)],
    enabled,
  });

  return useContractWrite(configUnstake);
};
