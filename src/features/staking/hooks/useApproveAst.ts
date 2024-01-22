import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { ContractTypes } from "../../../config/ContractAddresses";
import { useContractAddresses } from "../../../config/hooks/useContractAddress";
import { astAbi } from "../../../contracts/astAbi";

export const useApproveAst = ({
  stakingAmount,
  enabled = true,
}: {
  stakingAmount: bigint;
  enabled?: boolean;
}) => {
  const [airSwapToken] = useContractAddresses([ContractTypes.AirSwapToken], {
    defaultChainId: 1,
    useDefaultAsFallback: false,
  });

  const [airSwapStaking] = useContractAddresses(
    [ContractTypes.AirSwapStaking_latest],
    {
      defaultChainId: 1,
      useDefaultAsFallback: false,
    },
  );

  // const stakingAmountConversion = new BigNumber(stakingAmount)
  //   .multipliedBy(10 ** 4)
  //   .integerValue()
  //   .toString();

  const { config: configApprove } = usePrepareContractWrite({
    address: airSwapToken.address,
    abi: astAbi,
    functionName: "approve",
    args: [airSwapStaking.address!, stakingAmount || BigInt(0)],
    enabled: enabled && !!airSwapStaking.address,
  });

  return useContractWrite(configApprove);
};
