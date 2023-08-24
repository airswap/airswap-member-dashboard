import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { ContractTypes } from "../../../config/ContractAddresses";
import { useContractAddresses } from "../../../config/hooks/useContractAddress";
import { astAbi } from "../../../contracts/astAbi";

export const useApproveToken = ({
  stakingAmount,
  needsApproval,
}: {
  stakingAmount: number;
  needsApproval: boolean;
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

  return { approve, dataApprove };
};
