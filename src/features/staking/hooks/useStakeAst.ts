import { Dispatch } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ContractTypes } from "../../../config/ContractAddresses";
import { useContractAddresses } from "../../../config/hooks/useContractAddress";
import { stakingAbi } from "../../../contracts/stakingAbi";
import { StakingStatus } from "../types/StakingTypes";

export const useStakeAst = ({
  stakingAmount,
  needsApproval,
  setStatusStaking,
}: {
  stakingAmount: number;
  needsApproval: boolean;
  setStatusStaking: Dispatch<StakingStatus>;
}) => {
  const [AirSwapStaking] = useContractAddresses(
    [ContractTypes.AirSwapStaking],
    {
      defaultChainId: 1,
      useDefaultAsFallback: true,
    },
  );

  const { config: configStake } = usePrepareContractWrite({
    address: AirSwapStaking.address,
    abi: stakingAbi,
    functionName: "stake",
    args: [BigInt(+stakingAmount * Math.pow(10, 4))],
    staleTime: 300_000, // 5 minutes,
    cacheTime: Infinity,
    enabled: !needsApproval && +stakingAmount > 0,
  });

  const { writeAsync: stake, data } = useContractWrite(configStake);

  const { data: hashStake, status: statusStake } = useWaitForTransaction({
    hash: data?.hash,
    staleTime: 60_000, // 1 minute
    onSettled(data) {
      if (data?.transactionHash) {
        setStatusStaking("success");
      }
    },
  });

  return { stake, hashStake, statusStake };
};
