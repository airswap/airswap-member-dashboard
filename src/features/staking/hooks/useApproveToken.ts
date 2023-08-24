import { Dispatch } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ContractTypes } from "../../../config/ContractAddresses";
import { useContractAddresses } from "../../../config/hooks/useContractAddress";
import { astAbi } from "../../../contracts/astAbi";
import { StakingStatus } from "../types/StakingTypes";

export const useApproveToken = ({
  stakingAmount,
  needsApproval,
  setStatusStaking,
}: {
  stakingAmount: number;
  needsApproval: boolean;
  setStatusStaking: Dispatch<StakingStatus>;
}) => {
  const [AirSwapToken] = useContractAddresses([ContractTypes.AirSwapToken], {
    defaultChainId: 1,
    useDefaultAsFallback: true,
  });

  const [AirSwapStaking] = useContractAddresses(
    [ContractTypes.AirSwapStaking],
    {
      defaultChainId: 1,
      useDefaultAsFallback: true,
    },
  );

  const { config: configApprove } = usePrepareContractWrite({
    address: AirSwapToken.address,
    abi: astAbi,
    functionName: "approve",
    staleTime: 300_000, // 5 minutes,
    cacheTime: Infinity,
    args: [
      AirSwapStaking.address as `0x${string}`,
      BigInt(+stakingAmount * Math.pow(10, 4)),
    ],
    enabled: needsApproval,
  });

  const { writeAsync: approve, data: dataApprove } =
    useContractWrite(configApprove);

  const { data: hashApprove, status: statusApprove } = useWaitForTransaction({
    hash: dataApprove?.hash,
    cacheTime: 60_000, // 1 minute
    onSettled(data) {
      if (data?.transactionHash) {
        setStatusStaking("readyToStake");
      }
    },
  });

  return { approve, hashApprove, statusApprove };
};
