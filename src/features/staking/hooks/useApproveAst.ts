import BigNumber from "bignumber.js";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { ContractTypes } from "../../../config/ContractAddresses";
import { useContractAddresses } from "../../../config/hooks/useContractAddress";
import { astAbi } from "../../../contracts/astAbi";

export const useApproveAst = ({
  stakingAmountFormatted,
  enabled = true,
}: {
  stakingAmountFormatted: number;
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

  const stakingAmountConversion = new BigNumber(stakingAmountFormatted)
    .multipliedBy(10 ** 4)
    .integerValue()
    .toString();

  const { config: configApprove } = usePrepareContractWrite({
    address: airSwapToken.address,
    abi: astAbi,
    functionName: "approve",
    args: [airSwapStaking.address!, BigInt(stakingAmountConversion || 0)],
    enabled: enabled && !!airSwapStaking.address,
  });

  return useContractWrite(configApprove);
};
