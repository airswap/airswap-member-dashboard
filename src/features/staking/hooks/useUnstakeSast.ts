import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ContractTypes } from "../../../config/ContractAddresses";
import { useContractAddresses } from "../../../config/hooks/useContractAddress";
import { stakingAbi } from "../../../contracts/stakingAbi";

/**
 *
 * @param unstakingAmount - takes in stakingAmount from react-hook-form-register
 * @param canUnstake - boolean value, true if unstakingAmount (stakingAmount) > 0 and if unstakigAmount (stakingAmount) <= sAST balance
 */
export const useUnstakeSast = ({
  unstakingAmount,
  canUnstake,
}: {
  unstakingAmount: number;
  canUnstake: boolean;
}) => {
  const [AirSwapStaking] = useContractAddresses(
    [ContractTypes.AirSwapStaking],
    {
      defaultChainId: 1,
      useDefaultAsFallback: true,
    },
  );

  const { config: configUnstake } = usePrepareContractWrite({
    address: AirSwapStaking.address,
    abi: stakingAbi,
    functionName: "unstake",
    args: [BigInt(+unstakingAmount * Math.pow(10, 4))],
    staleTime: 300_000, // 5 minutes,
    cacheTime: Infinity,
    enabled: canUnstake,
  });

  const {
    write: unstake,
    data,
    reset: writeResetUnstake,
  } = useContractWrite(configUnstake);

  const { status: statusUnstake } = useWaitForTransaction({
    hash: data?.hash,
    staleTime: 60_000, // 1 minute
  });

  return { unstake, writeResetUnstake, statusUnstake };
};
